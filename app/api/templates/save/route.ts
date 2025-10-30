import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Question from '@/backend/models/Question';
import QuizTemplate from '@/backend/models/QuizTemplate';
import User from '@/backend/models/User';
import jwt from 'jsonwebtoken';

/**
 * POST /api/templates/save
 * 
 * Save an existing test as a reusable template
 * Strips classroom-specific data and sanitizes content
 */
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'Access denied: Teacher role required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      testId,
      title,
      description,
      category,
      tags = [],
      visibility = 'private',
      difficulty = 'medium',
    } = body;

    // Validation
    if (!testId) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      );
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Template title is required' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // Fetch the test
    const test = await Test.findById(testId);
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (test.teacherId && test.teacherId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only save your own tests as templates' },
        { status: 403 }
      );
    }

    // Get teacher info
    const teacher = await User.findById(decoded.userId);
    const teacherName = teacher ? teacher.name : 'Unknown Teacher';

    // Fetch all questions for this test
    const questions = await Question.find({ testId: test._id });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Cannot save template: Test has no questions' },
        { status: 400 }
      );
    }

    // Transform questions to template format (strip testId)
    const templateQuestions = questions.map(q => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));

    // Create the template
    const template = new QuizTemplate({
      title: title.trim(),
      description: description?.trim() || '',
      category,
      tags: tags.filter((tag: string) => tag.trim().length > 0),
      questions: templateQuestions,
      visibility,
      authorId: decoded.userId,
      authorName: teacherName,
      timeLimitPerQuestion: test.timeLimitPerQuestion,
      difficulty,
      estimatedTime: Math.ceil((templateQuestions.length * test.timeLimitPerQuestion) / 60),
      cloneCount: 0,
      rating: 0,
      ratingCount: 0,
      isOfficial: false,
    });

    await template.save();

    return NextResponse.json({
      message: 'Template saved successfully',
      template: {
        id: template._id,
        title: template.title,
        category: template.category,
        questionsCount: template.questions.length,
        visibility: template.visibility,
      },
    });
  } catch (error: any) {
    console.error('Error saving template:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
