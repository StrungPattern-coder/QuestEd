import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Announcement from '@/backend/models/Announcement';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - List announcements for a classroom (Student view)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const classroomId = searchParams.get('classroomId');

    if (!classroomId) {
      return NextResponse.json({ error: 'Classroom ID is required' }, { status: 400 });
    }

    // Verify student is enrolled in this classroom
    const classroom = await Classroom.findOne({
      _id: classroomId,
      students: decoded.userId,
    });

    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found or not enrolled' }, { status: 404 });
    }

    const announcements = await Announcement.find({ classroomId })
      .populate('createdBy', 'name')
      .sort({ pinned: -1, createdAt: -1 });

    return NextResponse.json({ announcements });
  } catch (error: any) {
    console.error('Get announcements error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch announcements' }, { status: 500 });
  }
}
