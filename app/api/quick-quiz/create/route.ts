import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Question from '@/backend/models/Question';
import { generateJoinCode } from '@/backend/utils/helpers';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { title, hostName, timeLimitPerQuestion, questions } = await request.json();

    // Validate required fields
    if (!title || !hostName || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'Title, host name, and at least one question are required' },
        { status: 400 }
      );
    }

    // Validate each question has required fields
    for (const q of questions) {
      if (!q.questionText || !q.options || q.options.length !== 4 || q.correctAnswer === undefined) {
        return NextResponse.json(
          { error: 'Each question must have text, 4 options, and a correct answer' },
          { status: 400 }
        );
      }
    }

    // Create Question documents
    const questionDocs = await Question.insertMany(
      questions.map((q: any) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: 10, // Default points for quick quiz
      }))
    );

    const questionIds = questionDocs.map(doc => doc._id);

    // Create a "guest" test without teacher association
    const joinCode = generateJoinCode();
    
    const test = await Test.create({
      title,
      description: `Quick quiz hosted by ${hostName}`,
      mode: 'live',
      timeLimitPerQuestion: timeLimitPerQuestion || 30,
      questions: questionIds,
      isActive: true,
      joinCode,
      hostName, // Store host name for display
    });

    // Update questions with testId after test is created
    await Question.updateMany(
      { _id: { $in: questionIds } },
      { $set: { testId: test._id } }
    );

    return NextResponse.json({
      message: 'Quick quiz created successfully',
      test: {
        _id: test._id,
        title: test.title,
        joinCode: test.joinCode,
        hostName: test.hostName,
      },
      joinCode: test.joinCode,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Quick quiz creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create quick quiz' },
      { status: 500 }
    );
  }
}
