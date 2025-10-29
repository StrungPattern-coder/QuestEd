import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import User from '@/backend/models/User';
import Classroom from '@/backend/models/Classroom';
import Question from '@/backend/models/Question';
import Test from '@/backend/models/Test';
import Submission from '@/backend/models/Submission';
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

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch test with all related data
    const test = await Test.findOne({ _id: params.id, teacherId: decoded.userId })
      .populate('classroomId', 'name students')
      .populate('questions');

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Fetch all submissions for this test
    const submissions = await Submission.find({ testId: params.id })
      .populate('studentId', 'name email enrollmentNumber rollNumber')
      .sort({ score: -1, submittedAt: 1 });

    // Calculate analytics
    const classroom = test.classroomId as any;
    const totalStudents = classroom.students?.length || 0;
    const submittedCount = submissions.length;
    const notSubmittedCount = totalStudents - submittedCount;

    let totalScore = 0;
    let highestScore = 0;
    let lowestScore = Infinity;

    submissions.forEach((sub: any) => {
      const percentage = sub.maxScore > 0 ? (sub.score / sub.maxScore) * 100 : 0;
      totalScore += percentage;
      if (percentage > highestScore) highestScore = percentage;
      if (percentage < lowestScore) lowestScore = percentage;
    });

    const averageScore = submittedCount > 0 ? Math.round(totalScore / submittedCount) : 0;
    const submissionRate = totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;

    // Find students who didn't submit
    const submittedStudentIds = submissions.map((sub: any) => sub.studentId._id.toString());
    const studentsWhoDidnt = await User.find({
      _id: { 
        $in: classroom.students,
        $nin: submittedStudentIds 
      },
    }).select('name email enrollmentNumber rollNumber');

    return NextResponse.json({
      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        mode: test.mode,
        questions: test.questions,
        startTime: test.startTime,
        endTime: test.endTime,
        classroomId: {
          _id: classroom._id,
          name: classroom.name,
        },
      },
      submissions: submissions.map((sub: any) => ({
        _id: sub._id,
        studentId: sub.studentId,
        score: sub.score,
        maxScore: sub.maxScore,
        percentage: sub.maxScore > 0 ? Math.round((sub.score / sub.maxScore) * 100) : 0,
        answers: sub.answers,
        submittedAt: sub.submittedAt,
        submittedLate: sub.submittedLate,
      })),
      analytics: {
        totalStudents,
        submitted: submittedCount,
        notSubmitted: notSubmittedCount,
        averageScore,
        highestScore: submittedCount > 0 ? Math.round(highestScore) : 0,
        lowestScore: submittedCount > 0 && lowestScore !== Infinity ? Math.round(lowestScore) : 0,
        submissionRate,
      },
      studentsWhoDidnt,
    });
  } catch (error: any) {
    console.error('Get test results error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get test results' }, { status: 500 });
  }
}
