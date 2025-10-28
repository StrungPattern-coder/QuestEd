import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Question from '@/backend/models/Question';
import Submission from '@/backend/models/Submission';
import User from '@/backend/models/User';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';

export async function DELETE(
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

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Find test and verify ownership
    const test = await Test.findOne({ _id: params.id, teacherId: decoded.userId });
    if (!test) {
      return NextResponse.json({ error: 'Test not found or unauthorized' }, { status: 404 });
    }

    // Delete all related data
    // 1. Delete all submissions for this test
    await Submission.deleteMany({ testId: test._id });

    // 2. Delete all questions for this test
    await Question.deleteMany({ testId: test._id });

    // 3. Delete the test itself
    await Test.findByIdAndDelete(test._id);

    return NextResponse.json({
      message: 'Test and all related data deleted successfully',
      deletedTestId: test._id,
    });
  } catch (error: any) {
    console.error('Delete test error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete test' }, { status: 500 });
  }
}
