import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import QuestionBank from '@/backend/models/QuestionBank';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// PUT - Update question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const question = await QuestionBank.findOne({ _id: params.id, createdBy: decoded.userId });
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const updateData = await request.json();

    // Handle incrementing timesUsed
    if (updateData.incrementTimesUsed) {
      await QuestionBank.findByIdAndUpdate(
        params.id,
        { $inc: { timesUsed: 1 } }
      );
      return NextResponse.json({ message: 'Usage count updated' });
    }

    const updatedQuestion = await QuestionBank.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ question: updatedQuestion });
  } catch (error: any) {
    console.error('Update question error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update question' }, { status: 500 });
  }
}

// DELETE - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const question = await QuestionBank.findOne({ _id: params.id, createdBy: decoded.userId });
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    await QuestionBank.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    console.error('Delete question error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete question' }, { status: 500 });
  }
}
