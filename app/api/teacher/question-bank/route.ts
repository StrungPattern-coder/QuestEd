import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import QuestionBank from '@/backend/models/QuestionBank';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - List questions with optional filters
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    // Build query
    const query: any = { createdBy: decoded.userId };
    
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    const questions = await QuestionBank.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    // Get unique subjects and tags for filters
    const subjects = await QuestionBank.distinct('subject', { createdBy: decoded.userId });
    const tags = await QuestionBank.distinct('tags', { createdBy: decoded.userId });

    return NextResponse.json({ 
      questions, 
      filters: { subjects, tags } 
    });
  } catch (error: any) {
    console.error('Get questions error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch questions' }, { status: 500 });
  }
}

// POST - Create new question
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await connectDB();

    const { question, options, correctAnswer, difficulty, subject, topic, tags, explanation } = await request.json();

    if (!question || !options || correctAnswer === undefined) {
      return NextResponse.json(
        { error: 'Question, options, and correct answer are required' },
        { status: 400 }
      );
    }

    if (options.length !== 4) {
      return NextResponse.json({ error: 'Must provide exactly 4 options' }, { status: 400 });
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      return NextResponse.json({ error: 'Correct answer must be between 0 and 3' }, { status: 400 });
    }

    const questionDoc = await QuestionBank.create({
      question,
      options,
      correctAnswer,
      difficulty: difficulty || 'medium',
      subject,
      topic,
      tags: tags || [],
      explanation,
      createdBy: decoded.userId,
    });

    return NextResponse.json({ question: questionDoc }, { status: 201 });
  } catch (error: any) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create question' }, { status: 500 });
  }
}
