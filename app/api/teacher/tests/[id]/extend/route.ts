import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import User from '@/backend/models/User';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';

export async function PATCH(
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

    const body = await request.json();
    const { newEndTime } = body;

    if (!newEndTime) {
      return NextResponse.json({ error: 'New end time is required' }, { status: 400 });
    }

    // Validate that the new end time is a valid date
    const newEndDate = new Date(newEndTime);
    if (isNaN(newEndDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    // Find test and verify ownership
    const test = await Test.findOne({ _id: params.id, teacherId: decoded.userId });
    if (!test) {
      return NextResponse.json({ error: 'Test not found or unauthorized' }, { status: 404 });
    }

    // Validate that new end time is after start time
    if (newEndDate <= test.startTime) {
      return NextResponse.json({ 
        error: 'New end time must be after the start time' 
      }, { status: 400 });
    }

    // Update the end time
    test.endTime = newEndDate;
    await test.save();

    const populatedTest = await Test.findById(test._id)
      .populate('classroomId', 'name')
      .populate('questions');

    return NextResponse.json({
      message: 'Test deadline extended successfully',
      test: populatedTest,
    });
  } catch (error: any) {
    console.error('Extend test deadline error:', error);
    return NextResponse.json({ error: error.message || 'Failed to extend deadline' }, { status: 500 });
  }
}
