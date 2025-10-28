import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
// Import models in dependency order
import User from '@/backend/models/User';
import Classroom from '@/backend/models/Classroom';
import Question from '@/backend/models/Question';
import Test from '@/backend/models/Test';
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

    const test = await Test.findById(params.id)
      .populate('classroomId', 'name')
      .populate('questions');

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
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

    return NextResponse.json({ test: transformedTest });
  } catch (error: any) {
    console.error('Get test details error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get test details' }, { status: 500 });
  }
}
