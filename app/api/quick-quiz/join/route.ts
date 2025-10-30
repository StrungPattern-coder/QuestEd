import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Ably from 'ably';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { joinCode, participantName } = await request.json();

    if (!joinCode || !participantName) {
      return NextResponse.json(
        { error: 'Join code and participant name are required' },
        { status: 400 }
      );
    }

    // Find test by join code
    const test = await Test.findOne({ 
      joinCode: joinCode.toUpperCase(),
      isActive: true,
      isCompleted: false,
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Quiz not found or no longer active' },
        { status: 404 }
      );
    }

    // Publish participant join event via Ably
    const ablyKey = process.env.ABLY_API_KEY || process.env.NEXT_PUBLIC_ABLY_KEY;
    if (ablyKey) {
      const ably = new Ably.Rest({ key: ablyKey });
      const channel = ably.channels.get(`quick-quiz-${test._id}`);
      
      await channel.publish('participant-joined', {
        participantName,
        joinedAt: new Date(),
      });
    }

    // For quick quizzes, we don't create user accounts
    // Just verify the quiz exists and is joinable
    return NextResponse.json({
      message: 'Successfully joined quiz',
      test: {
        _id: test._id,
        title: test.title,
        hostName: test.hostName,
        timeLimitPerQuestion: test.timeLimitPerQuestion,
      },
      participantName,
    });
  } catch (error: any) {
    console.error('Join quiz error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to join quiz' },
      { status: 500 }
    );
  }
}
