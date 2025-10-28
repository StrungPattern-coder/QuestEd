import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Classroom from '@/backend/models/Classroom';
import User from '@/backend/models/User';
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

    // Find all tests for these classrooms (no time filtering - show all tests)
    const tests = await Test.find({
      classroomId: { $in: classroomIds }
    })
      .populate('classroomId', 'name')
      .populate('questions')
      .sort({ createdAt: -1 });

    // Add status information to each test
    const now = new Date();
    const testsWithStatus = tests.map(test => {
      let status = 'upcoming';
      let isAvailable = false;

      if (test.mode === 'live') {
        status = test.isActive ? 'active' : 'not-started';
        isAvailable = test.isActive === true;
      } else if (test.mode === 'deadline') {
        const startTime = test.startTime ? new Date(test.startTime) : null;
        const endTime = test.endTime ? new Date(test.endTime) : null;
        
        if (startTime && endTime) {
          if (now < startTime) {
            status = 'upcoming';
            isAvailable = false;
          } else if (now >= startTime && now <= endTime) {
            status = 'active';
            isAvailable = true;
          } else {
            status = 'expired';
            isAvailable = false;
          }
        } else {
          // If no dates set, make it available
          status = 'active';
          isAvailable = true;
        }
      }

      return {
        ...test.toObject(),
        status,
        isAvailable
      };
    });

    return NextResponse.json({ tests: testsWithStatus });
  } catch (error: any) {
    console.error('Get student tests error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get tests' }, { status: 500 });
  }
}
