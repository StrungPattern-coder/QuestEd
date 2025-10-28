import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

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
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Classroom name is required' }, { status: 400 });
    }

    const classroom = await Classroom.create({
      teacherId: decoded.userId,
      name,
      description: description || '',
      students: [],
    });

    return NextResponse.json({
      message: 'Classroom created successfully',
      classroom,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create classroom error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create classroom' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
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

    const classrooms = await Classroom.find({ teacherId: decoded.userId })
      .populate('students', 'name email enrollmentNumber')
      .sort({ createdAt: -1 });

    return NextResponse.json({ classrooms });
  } catch (error: any) {
    console.error('Get classrooms error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get classrooms' }, { status: 500 });
  }
}
