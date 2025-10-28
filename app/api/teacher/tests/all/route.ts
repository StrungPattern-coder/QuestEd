import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Classroom from '@/backend/models/Classroom';
import Question from '@/backend/models/Question';
import Submission from '@/backend/models/Submission';
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

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all tests created by this teacher with full details
    const tests = await Test.find({ teacherId: decoded.userId })
      .populate('classroomId', 'name students')
      .populate('questions')
      .sort({ createdAt: -1 });

    // For each test, get submission statistics
    const testsWithStats = await Promise.all(
      tests.map(async (test) => {
        const submissions = await Submission.find({ testId: test._id })
          .populate('studentId', 'name email enrollmentNumber');

        const totalStudents = (test.classroomId as any)?.students?.length || 0;
        const submittedCount = submissions.length;
        const totalQuestions = test.questions.length || 1; // Prevent division by zero
        
        // Calculate percentage scores (score out of total questions)
        const percentageScores = submissions.map(sub => 
          (sub.score / totalQuestions) * 100
        );
        
        const averageScore = percentageScores.length > 0
          ? percentageScores.reduce((sum, score) => sum + score, 0) / percentageScores.length
          : 0;
        
        const highestScore = percentageScores.length > 0
          ? Math.max(...percentageScores)
          : 0;

        const lowestScore = percentageScores.length > 0
          ? Math.min(...percentageScores)
          : 0;

        return {
          ...test.toObject(),
          stats: {
            totalStudents,
            submittedCount,
            notSubmittedCount: totalStudents - submittedCount,
            averageScore: Math.round(averageScore * 100) / 100,
            highestScore: Math.round(highestScore * 100) / 100,
            lowestScore: Math.round(lowestScore * 100) / 100,
            submissionRate: totalStudents > 0 
              ? Math.round((submittedCount / totalStudents) * 100) 
              : 0,
          },
          submissions: submissions.map(sub => ({
            _id: sub._id,
            student: sub.studentId,
            score: Math.round((sub.score / totalQuestions) * 100), // Convert to percentage
            rawScore: sub.score,
            maxScore: totalQuestions,
            submittedAt: sub.submittedAt,
            submittedLate: sub.submittedLate,
          })),
        };
      })
    );

    return NextResponse.json({ tests: testsWithStats });
  } catch (error: any) {
    console.error('Get all tests error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get tests' }, { status: 500 });
  }
}
