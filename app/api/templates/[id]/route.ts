import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import QuizTemplate from '@/backend/models/QuizTemplate';

/**
 * GET /api/templates/[id]
 * 
 * Get full template details including all questions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '';

    const template = await QuizTemplate.findById(id).lean();

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    if (template.visibility === 'private') {
      if (!userId || template.authorId?.toString() !== userId) {
        return NextResponse.json(
          { error: 'This template is private' },
          { status: 403 }
        );
      }
    }

    // Calculate average rating
    const averageRating = template.ratingCount > 0 
      ? Math.round((template.rating / template.ratingCount) * 10) / 10 
      : 0;

    return NextResponse.json({
      ...template,
      averageRating,
      questionsCount: template.questions.length,
    });
  } catch (error: any) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/[id]
 * 
 * Delete a template (only by author)
 */
export async function DELETE(
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

    const jwt = require('jsonwebtoken');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const { id } = params;
    const template = await QuizTemplate.findById(id);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (template.authorId?.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own templates' },
        { status: 403 }
      );
    }

    await QuizTemplate.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Template deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
