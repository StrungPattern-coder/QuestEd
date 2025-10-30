import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Leaderboard from '@/backend/models/Leaderboard';
import Submission from '@/backend/models/Submission';

export const dynamic = 'force-dynamic';

/**
 * Get current leaderboard for a live test
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const testId = params.id;

    // Find leaderboard for this test
    const leaderboard = await Leaderboard.findOne({ testId }).populate('rankings.studentId', 'name');

    if (!leaderboard) {
      return NextResponse.json({
        leaderboard: [],
      }, { status: 200 });
    }

    // Get submission data for each student to get answered questions count
    const submissions = await Submission.find({ testId });
    const submissionMap = new Map();
    submissions.forEach(sub => {
      submissionMap.set(sub.studentId.toString(), sub.answers.length);
    });

    // Format leaderboard for response
    const formattedLeaderboard = leaderboard.rankings.map((ranking: any) => ({
      studentId: ranking.studentId._id.toString(),
      studentName: ranking.studentId.name,
      score: ranking.score,
      position: ranking.rank,
      answeredQuestions: submissionMap.get(ranking.studentId._id.toString()) || 0,
    }));

    return NextResponse.json({
      leaderboard: formattedLeaderboard,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get leaderboard' }, { status: 500 });
  }
}
