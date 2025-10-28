import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Submission from '@/backend/models/Submission';
import Question from '@/backend/models/Question';
import jwt from 'jsonwebtoken';

export async function GET(
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

    const submission = await Submission.findOne({
      testId: params.id,
      studentId: decoded.userId,
    }).populate({
      path: 'testId',
      populate: [
        { path: 'classroomId', select: 'name' },
        { path: 'questions' }
      ]
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const test = submission.testId as any;
    const questions = test.questions;
    const maxScore = questions.length;

    // Format answers with question details
    const formattedAnswers = submission.answers.map((answer: any) => {
      const question = questions.find((q: any) => q._id.toString() === answer.questionId);
      return {
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
      };
    });

    return NextResponse.json({
      score: submission.score,
      maxScore: maxScore,
      percentage: (submission.score / maxScore) * 100,
      test: {
        title: test.title,
        classroom: {
          name: test.classroomId.name,
        },
      },
      answers: formattedAnswers,
      submittedAt: submission.submittedAt,
    });
  } catch (error: any) {
    console.error('Get test result error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get test result' }, { status: 500 });
  }
}
