import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Classroom from '@/backend/models/Classroom';
import User from '@/backend/models/User';
import Question from '@/backend/models/Question';
import jwt from 'jsonwebtoken';

// Join live test with proper model imports for populate
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

    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { joinCode } = body;

    if (!joinCode) {
      return NextResponse.json({ error: 'Join code is required' }, { status: 400 });
    }

    const test = await Test.findOne({ 
      joinCode: joinCode.toUpperCase(), 
      mode: 'live',
      isActive: true,
      isCompleted: false
    })
      .populate('classroomId', 'name')
      .populate('questions');

    if (!test) {
      return NextResponse.json({ error: 'Invalid, inactive, or completed join code' }, { status: 404 });
    }

    // Transform questions to convert correctAnswer from text to index
    const transformedTest = {
      ...test.toObject(),
      questions: test.questions.map((q: any) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.options.indexOf(q.correctAnswer), // Convert text to index
      })),
    };

    return NextResponse.json({
      message: 'Joined live test successfully',
      test: transformedTest,
    });
  } catch (error: any) {
    console.error('Join live test error:', error);
    return NextResponse.json({ error: error.message || 'Failed to join live test' }, { status: 500 });
  }
}
