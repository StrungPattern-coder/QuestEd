import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import jwt from 'jsonwebtoken';
import { generateJoinCode } from '@/backend/utils/helpers';

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

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const test = await Test.findOne({ _id: params.id, teacherId: decoded.userId, mode: 'live' });
    if (!test) {
      return NextResponse.json({ error: 'Live test not found' }, { status: 404 });
    }

    test.isActive = true;
    if (!test.joinCode) {
      test.joinCode = generateJoinCode();
    }
    await test.save();

    const populatedTest = await Test.findById(test._id)
      .populate('questions')
      .populate('classroomId', 'name');

    return NextResponse.json({
      message: 'Live test started',
      test: populatedTest,
      joinCode: test.joinCode,
    });
  } catch (error: any) {
    console.error('Start live test error:', error);
    return NextResponse.json({ error: error.message || 'Failed to start live test' }, { status: 500 });
  }
}
