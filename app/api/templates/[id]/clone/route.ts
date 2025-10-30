import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import Question from '@/backend/models/Question';
import QuizTemplate from '@/backend/models/QuizTemplate';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';

/**
 * POST /api/templates/[id]/clone
 * 
 * Clone a template into the user's test library
 * Increments clone count and preserves attribution
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

    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied: Teacher role required' }, { status: 403 });
    }

    const { id: templateId } = params;
    const body = await request.json();
    const {
      classroomId,
      title,
      mode = 'deadline',
      startTime,
      endTime,
    } = body;

    // Fetch the template
    const template = await QuizTemplate.findById(templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Check visibility (only public templates or own private templates)
    if (template.visibility === 'private' && 
        template.authorId?.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'This template is private' },
        { status: 403 }
      );
    }

    // Validate classroom ownership
    const classroom = await Classroom.findOne({ _id: classroomId, teacherId: decoded.userId });
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found or unauthorized' }, { status: 404 });
    }

    // Create the test from template
    const test = new Test({
      classroomId,
      teacherId: decoded.userId,
      title: title || template.title,
      description: `Cloned from template: ${template.title}`,
      mode,
      startTime: startTime || new Date(),
      endTime: endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
      timeLimitPerQuestion: template.timeLimitPerQuestion,
      questions: [],
      isActive: false,
      isCompleted: false,
    });

    await test.save();

    // Create questions from template
    const questionPromises = template.questions.map(tq => 
      new Question({
        testId: test._id,
        questionText: tq.questionText,
        options: tq.options,
        correctAnswer: tq.correctAnswer,
      }).save()
    );

    const createdQuestions = await Promise.all(questionPromises);

    // Update test with question IDs
    test.questions = createdQuestions.map(q => q._id) as any;
    await test.save();

    // Increment clone count
    template.cloneCount += 1;
    await template.save();

    return NextResponse.json({
      message: 'Template cloned successfully',
      test: {
        id: test._id,
        title: test.title,
        questionsCount: test.questions.length,
        originalTemplate: {
          id: template._id,
          title: template.title,
          author: template.authorName,
        },
      },
    });
  } catch (error: any) {
    console.error('Error cloning template:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
