import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

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

    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Find classrooms where student is enrolled
    const classrooms = await Classroom.find({ students: decoded.userId });
    const classroomIds = classrooms.map(c => c._id);

    // Find all tests for these classrooms
    const now = new Date();
    const tests = await Test.find({
      classroomId: { $in: classroomIds },
      $or: [
        { mode: 'live', isActive: true },
        { mode: 'deadline', startTime: { $lte: now }, endTime: { $gte: now } }
      ]
    })
      .populate('classroomId', 'name')
      .populate('questions')
      .sort({ createdAt: -1 });

    return NextResponse.json({ tests });
  } catch (error: any) {
    console.error('Get student tests error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get tests' }, { status: 500 });
  }
}
