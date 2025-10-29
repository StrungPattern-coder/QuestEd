import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import QuestionBank from '@/backend/models/QuestionBank';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// POST - Import questions from CSV
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

    const { questions } = await request.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions array is required' },
        { status: 400 }
      );
    }

    // Validate and add createdBy to each question
    const questionsToImport = questions.map((q: any) => ({
      ...q,
      createdBy: decoded.userId,
      tags: q.tags || [],
      difficulty: q.difficulty || 'medium',
    }));

    // Bulk insert
    const imported = await QuestionBank.insertMany(questionsToImport);

    return NextResponse.json({ 
      message: `Successfully imported ${imported.length} questions`,
      count: imported.length 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Import questions error:', error);
    return NextResponse.json({ error: error.message || 'Failed to import questions' }, { status: 500 });
  }
}
