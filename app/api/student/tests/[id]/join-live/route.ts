import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Leaderboard from '@/backend/models/Leaderboard';
import User from '@/backend/models/User';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

/**
 * Join a live test
 * Adds the player to the leaderboard with 0 score immediately
 */
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

    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const test = await Test.findById(params.id);
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Check if test is active
    if (!test.isActive) {
      return NextResponse.json({ error: 'Test is not active' }, { status: 400 });
    }

    // Only allow for live tests
    if (test.mode !== 'live') {
      return NextResponse.json({ error: 'This endpoint is only for live tests' }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find or create leaderboard for this test
    let leaderboard = await Leaderboard.findOne({ testId: params.id });
    
    if (!leaderboard) {
      leaderboard = await Leaderboard.create({
        testId: params.id,
        classroomId: test.classroomId,
        rankings: [],
      });
    }

    // Check if student is already on the leaderboard
    const existingRanking = leaderboard.rankings.find(
      (r: any) => r.studentId.toString() === decoded.userId
    );

    if (!existingRanking) {
      // Add student to leaderboard with 0 score
      leaderboard.rankings.push({
        studentId: decoded.userId,
        score: 0,
        rank: leaderboard.rankings.length + 1, // Will be recalculated
      });

      // Sort and update ranks
      leaderboard.rankings.sort((a: any, b: any) => b.score - a.score);
      leaderboard.rankings.forEach((ranking: any, index: number) => {
        ranking.rank = index + 1;
      });

      await leaderboard.save();
    }

    // Populate student names for response
    await leaderboard.populate('rankings.studentId', 'name');

    // Format leaderboard for response
    const formattedLeaderboard = leaderboard.rankings.map((ranking: any) => ({
      studentId: ranking.studentId._id.toString(),
      studentName: ranking.studentId.name,
      score: ranking.score,
      position: ranking.rank,
      answeredQuestions: 0,
    }));

    return NextResponse.json({
      message: 'Successfully joined live test',
      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        mode: test.mode,
        timeLimitPerQuestion: test.timeLimitPerQuestion,
      },
      leaderboard: formattedLeaderboard,
      playerPosition: leaderboard.rankings.findIndex(
        (r: any) => r.studentId._id.toString() === decoded.userId
      ) + 1,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Join live test error:', error);
    return NextResponse.json({ error: error.message || 'Failed to join live test' }, { status: 500 });
  }
}
