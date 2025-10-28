import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Question from '@/backend/models/Question';
import Submission from '@/backend/models/Submission';
import jwt from 'jsonwebtoken';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { answers } = body;

    const test = await Test.findById(params.id).populate('questions');
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      testId: params.id,
      studentId: decoded.userId,
    });

    if (existingSubmission) {
      return NextResponse.json({ error: 'Test already submitted' }, { status: 409 });
    }

    // Calculate score
    let score = 0;
    const questions = test.questions as any[];
    const processedAnswers = answers.map((answer: any) => {
      const question = questions.find((q: any) => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
        return { ...answer, isCorrect: true };
      }
      return { ...answer, isCorrect: false };
    });

    const maxScore = questions.length;

    // Check if submission is late
    const submittedAt = new Date();
    const submittedLate = test.mode === 'deadline' && test.endTime && submittedAt > new Date(test.endTime);

    // Create submission
    const submission = await Submission.create({
      testId: params.id,
      studentId: decoded.userId,
      answers: processedAnswers,
      score,
      maxScore,
      submittedAt,
      submittedLate,
    });

    return NextResponse.json({
      message: 'Test submitted successfully',
      submission: {
        _id: submission._id,
        score,
        maxScore,
        percentage: (score / maxScore) * 100,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Submit test error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit test' }, { status: 500 });
  }
}
