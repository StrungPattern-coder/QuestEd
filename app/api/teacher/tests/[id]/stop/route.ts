import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import Test from '@/backend/models/Test';
import jwt from 'jsonwebtoken';

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
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const test = await Test.findOne({ _id: params.id, teacherId: decoded.userId, mode: 'live' });
    if (!test) {
      return NextResponse.json({ error: 'Live test not found' }, { status: 404 });
    }

    test.isActive = false;
    await test.save();

    return NextResponse.json({ message: 'Live test stopped', test });
  } catch (error: any) {
    console.error('Stop live test error:', error);
    return NextResponse.json({ error: error.message || 'Failed to stop live test' }, { status: 500 });
  }
}
