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

    // Ensure questions is an array and filter out null/undefined
    const questionsArray = Array.isArray(test.questions) ? test.questions : [];
    const validQuestions = questionsArray.filter((q: any) => {
      if (!q) {
        console.warn('Null/undefined question found in test:', test._id);
        return false;
      }
      if (!q._id || !q.questionText || !q.options) {
        console.warn('Invalid question structure:', q);
        return false;
      }
      return true;
    });

    if (validQuestions.length === 0) {
      return NextResponse.json({ 
        error: 'This test has no valid questions. Please contact the teacher.' 
      }, { status: 400 });
    }

    // Transform questions to convert correctAnswer from text to index
    const transformedTest = {
      ...test.toObject(),
      questions: validQuestions.map((q: any) => ({
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
