import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Question from '@/backend/models/Question';
import Submission from '@/backend/models/Submission';
import Leaderboard from '@/backend/models/Leaderboard';
import User from '@/backend/models/User';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

/**
 * Submit answer for a single question in a live test
 * Updates leaderboard in real-time after each question
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

    const body = await request.json();
    const { questionId, selectedAnswer, questionIndex, timeSpent } = body;

    const test = await Test.findById(params.id).populate('questions');
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Only allow for live tests
    if (test.mode !== 'live') {
      return NextResponse.json({ error: 'This endpoint is only for live tests' }, { status: 400 });
    }

    // Find the question
    const questions = test.questions as any[];
    const question = questions.find((q: any) => q._id.toString() === questionId);
    
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Check if answer is correct
    const selectedAnswerText = question.options[selectedAnswer];
    const isCorrect = selectedAnswerText === question.correctAnswer;

    // Calculate points based on time (faster = more points)
    // Base points: 100 per correct answer
    // Time bonus: up to 50 points based on speed
    let points = 0;
    if (isCorrect) {
      const basePoints = 100;
      const timeLimit = test.timeLimitPerQuestion;
      const timeBonus = Math.max(0, Math.floor(((timeLimit - timeSpent) / timeLimit) * 50));
      points = basePoints + timeBonus;
    }

    // Find or create submission
    let submission = await Submission.findOne({
      testId: params.id,
      studentId: decoded.userId,
    });

    if (!submission) {
      // Create new submission
      submission = await Submission.create({
        testId: params.id,
        studentId: decoded.userId,
        answers: [],
        score: 0,
        maxScore: questions.length,
        submittedAt: new Date(),
        submittedLate: false,
      });
    }

    // Update the answer for this question
    const existingAnswerIndex = submission.answers.findIndex(
      (a: any) => a.questionId.toString() === questionId
    );

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      submission.answers[existingAnswerIndex] = {
        questionId,
        selectedAnswer,
        isCorrect,
        points,
        timeSpent,
      };
    } else {
      // Add new answer
      submission.answers.push({
        questionId,
        selectedAnswer,
        isCorrect,
        points,
        timeSpent,
      });
    }

    // Update total score (sum of all points)
    submission.score = submission.answers.reduce((total: number, answer: any) => {
      return total + (answer.points || 0);
    }, 0);

    await submission.save();

    // Update leaderboard
    const user = await User.findById(decoded.userId);
    
    // Find or create leaderboard entry for this test
    let leaderboard = await Leaderboard.findOne({ testId: params.id });
    
    if (!leaderboard) {
      leaderboard = await Leaderboard.create({
        testId: params.id,
        classroomId: test.classroomId,
        rankings: [],
      });
    }

    // Update this student's ranking
    const existingRankingIndex = leaderboard.rankings.findIndex(
      (r: any) => r.studentId.toString() === decoded.userId
    );

    if (existingRankingIndex >= 0) {
      leaderboard.rankings[existingRankingIndex].score = submission.score;
    } else {
      leaderboard.rankings.push({
        studentId: decoded.userId,
        score: submission.score,
        rank: 1, // Will be recalculated below
      });
    }

    // Sort and update ranks
    leaderboard.rankings.sort((a: any, b: any) => b.score - a.score);
    leaderboard.rankings.forEach((ranking: any, index: number) => {
      ranking.rank = index + 1;
    });

    await leaderboard.save();

    // Populate student names for response
    await leaderboard.populate('rankings.studentId', 'name');

    // Format leaderboard for response
    const formattedLeaderboard = leaderboard.rankings.map((ranking: any) => ({
      studentId: ranking.studentId._id.toString(),
      studentName: ranking.studentId.name,
      score: ranking.score,
      position: ranking.rank,
      answeredQuestions: submission.answers.length,
    }));

    return NextResponse.json({
      message: 'Answer submitted successfully',
      isCorrect,
      points,
      currentScore: submission.score,
      currentRank: leaderboard.rankings.findIndex(
        (r: any) => r.studentId._id.toString() === decoded.userId
      ) + 1,
      answeredQuestions: submission.answers.length,
      totalQuestions: questions.length,
      leaderboard: formattedLeaderboard,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Submit question error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit answer' }, { status: 500 });
  }
}
