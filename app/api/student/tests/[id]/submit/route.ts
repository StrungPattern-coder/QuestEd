import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Question from '@/backend/models/Question';
import Submission from '@/backend/models/Submission';
import Classroom from '@/backend/models/Classroom';
import User from '@/backend/models/User';
import jwt from 'jsonwebtoken';
import { sendTestResultEmail } from '@/backend/utils/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

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

    const test = await Test.findById(id).populate('questions');
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      testId: id,
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
      if (question) {
        // correctAnswer is stored as the actual answer text (string)
        // selectedAnswer comes as an index (number)
        // So we need to compare: question.options[selectedAnswer] === question.correctAnswer
        const selectedAnswerText = question.options[answer.selectedAnswer];
        const isCorrect = selectedAnswerText === question.correctAnswer;
        if (isCorrect) {
          score++;
        }
        return { ...answer, isCorrect };
      }
      return { ...answer, isCorrect: false };
    });

    const maxScore = questions.length;

    // Check if submission is late
    const submittedAt = new Date();
    const submittedLate = test.mode === 'deadline' && test.endTime && submittedAt > new Date(test.endTime);

    // Create submission
    const submission = await Submission.create({
      testId: id,
      studentId: decoded.userId,
      answers: processedAnswers,
      score,
      maxScore,
      submittedAt,
      submittedLate,
    });

    // Send result email to student (async, don't block response)
    (async () => {
      try {
        const student = await User.findById(decoded.userId);
        const classroom = await Classroom.findById(test.classroomId);
        
        if (student && classroom) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quest-ed-phi.vercel.app';
          const resultLink = `${appUrl}/dashboard`;
          const percentage = ((score / maxScore) * 100).toFixed(1);

          await sendTestResultEmail({
            studentEmail: student.email,
            studentName: student.name,
            testTitle: test.title,
            classroomName: classroom.name,
            score: `${score}`,
            maxScore: `${maxScore}`,
            resultLink,
          });
          console.log(`Sent test result email to ${student.email}`);
        }
      } catch (emailError) {
        console.error('Failed to send test result email:', emailError);
      }
    })();

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
