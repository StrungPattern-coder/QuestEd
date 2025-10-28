import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Classroom from '@/backend/models/Classroom';
import User from '@/backend/models/User';
import Question from '@/backend/models/Question';
import Submission from '@/backend/models/Submission';
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

    // Find all tests for these classrooms - show ALL tests
    const tests = await Test.find({
      classroomId: { $in: classroomIds }
    })
      .populate('classroomId', 'name')
      .populate('questions')
      .lean();

    // Get all submissions for this student
    const submissions = await Submission.find({
      studentId: decoded.userId,
      testId: { $in: tests.map(t => t._id) }
    }).lean();

    // Create a map of test submissions
    const submissionMap = new Map(
      submissions.map(sub => [sub.testId.toString(), sub])
    );

    // Add status and submission information to each test
    const now = new Date();
    const testsWithStatus = tests.map(test => {
      const submission = submissionMap.get(test._id.toString());
      const hasSubmitted = !!submission;
      
      let status = 'upcoming';
      let isAvailable = false;
      let isExpired = false;
      let timeRemaining = null;

      if (test.mode === 'live') {
        status = test.isActive ? 'active' : 'not-started';
        isAvailable = test.isActive === true && !hasSubmitted;
      } else if (test.mode === 'deadline') {
        const startTime = test.startTime ? new Date(test.startTime) : null;
        const endTime = test.endTime ? new Date(test.endTime) : null;
        
        if (startTime && endTime) {
          if (now < startTime) {
            status = 'upcoming';
            isAvailable = false;
          } else if (now >= startTime && now <= endTime) {
            status = hasSubmitted ? 'submitted' : 'active';
            isAvailable = !hasSubmitted;
            timeRemaining = endTime.getTime() - now.getTime();
          } else {
            status = hasSubmitted ? 'submitted' : 'missed';
            isAvailable = false;
            isExpired = true;
          }
        } else {
          // If no dates set, make it available
          status = hasSubmitted ? 'submitted' : 'active';
          isAvailable = !hasSubmitted;
        }
      }

      return {
        ...test,
        status,
        isAvailable,
        isExpired,
        hasSubmitted,
        timeRemaining,
        submission: submission ? {
          _id: submission._id,
          score: submission.score,
          submittedAt: submission.submittedAt,
          submittedLate: submission.submittedLate
        } : null
      };
    });

    // Sort tests by priority:
    // 1. Active tests (not submitted, deadline approaching)
    // 2. Upcoming tests
    // 3. Missed tests (expired, not submitted)
    // 4. Submitted tests
    const sortedTests = testsWithStatus.sort((a, b) => {
      // Active tests first (by time remaining)
      if (a.status === 'active' && b.status === 'active') {
        if (a.timeRemaining && b.timeRemaining) {
          return a.timeRemaining - b.timeRemaining;
        }
      }
      if (a.status === 'active') return -1;
      if (b.status === 'active') return 1;

      // Then upcoming tests
      if (a.status === 'upcoming' && b.status === 'upcoming') {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
      if (a.status === 'upcoming') return -1;
      if (b.status === 'upcoming') return 1;

      // Then missed tests
      if (a.status === 'missed' && b.status === 'missed') {
        return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
      }
      if (a.status === 'missed') return -1;
      if (b.status === 'missed') return 1;

      // Finally submitted tests (most recent first)
      if (a.status === 'submitted' && b.status === 'submitted') {
        const aTime = a.submission?.submittedAt || a.createdAt;
        const bTime = b.submission?.submittedAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      }

      return 0;
    });

    return NextResponse.json({ tests: sortedTests });
  } catch (error: any) {
    console.error('Get student tests error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get tests' }, { status: 500 });
  }
}
