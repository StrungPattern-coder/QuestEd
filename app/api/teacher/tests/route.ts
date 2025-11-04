import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Question from '@/backend/models/Question';
import Classroom from '@/backend/models/Classroom';
import User from '@/backend/models/User';
import jwt from 'jsonwebtoken';
import { generateJoinCode } from '@/backend/utils/helpers';
import { sendTestNotification } from '@/backend/utils/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      classroomId,
      title,
      description,
      mode,
      startTime,
      endTime,
      timeLimitPerQuestion,
      questions,
    } = body;

    // Validate classroom ownership
    const classroom = await Classroom.findOne({ _id: classroomId, teacherId: decoded.userId });
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    // Create test
    const test = await Test.create({
      classroomId,
      teacherId: decoded.userId,
      title,
      description: description || '',
      mode,
      startTime,
      endTime,
      timeLimitPerQuestion,
      questions: [],
      joinCode: mode === 'live' ? generateJoinCode() : undefined,
    });

    // Create questions if provided
    if (questions && Array.isArray(questions)) {
      const createdQuestions = await Question.insertMany(
        questions.map((q: any) => ({
          testId: test._id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
        }))
      );

      test.questions = createdQuestions.map((q) => q._id) as any;
      await test.save();
    }

    const populatedTest = await Test.findById(test._id).populate('questions');

    // Send notification emails to all students in the classroom (async, don't block response)
    if (classroom.students && classroom.students.length > 0) {
      // Don't await - send emails in background
      (async () => {
        try {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quest-ed-phi.vercel.app';
          const testLink = `${appUrl}/dashboard`;
          
          // Fetch all student details
          const students = await User.find({ _id: { $in: classroom.students } });
          
          // Send email to each student
          for (const student of students) {
            await sendTestNotification({
              studentEmail: student.email,
              studentName: student.name,
              classroomName: classroom.name,
              testTitle: test.title,
              testDescription: test.description,
              testLink,
            });
          }
          console.log(`Sent test notification emails to ${students.length} students`);
        } catch (emailError) {
          console.error('Failed to send test notification emails:', emailError);
        }
      })();
    }

    return NextResponse.json({
      message: 'Test created successfully',
      test: populatedTest,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create test error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create test' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const classroomId = searchParams.get('classroomId');

    const query: any = { teacherId: decoded.userId };
    if (classroomId) {
      query.classroomId = classroomId;
    }

    const tests = await Test.find(query)
      .populate('classroomId', 'name')
      .populate('questions')
      .sort({ createdAt: -1 });

    return NextResponse.json({ tests });
  } catch (error: any) {
    console.error('Get tests error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get tests' }, { status: 500 });
  }
}
