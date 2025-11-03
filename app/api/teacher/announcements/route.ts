import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Announcement from '@/backend/models/Announcement';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';
import { publishAnnouncementAdded } from '@/backend/utils/socket-server';

export const dynamic = 'force-dynamic';

// GET - List announcements for a classroom (Teacher)
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
    const classroomId = searchParams.get('classroomId');

    if (!classroomId) {
      return NextResponse.json({ error: 'Classroom ID is required' }, { status: 400 });
    }

    // Verify teacher owns this classroom
    const classroom = await Classroom.findOne({ _id: classroomId, teacherId: decoded.userId });
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    const announcements = await Announcement.find({ classroomId })
      .populate('createdBy', 'name email')
      .sort({ pinned: -1, createdAt: -1 });

    return NextResponse.json({ announcements });
  } catch (error: any) {
    console.error('Get announcements error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch announcements' }, { status: 500 });
  }
}

// POST - Create new announcement
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

    const { title, content, classroomId, priority, pinned } = await request.json();

    if (!title || !content || !classroomId) {
      return NextResponse.json(
        { error: 'Title, content, and classroom ID are required' },
        { status: 400 }
      );
    }

    // Verify teacher owns this classroom
    const classroom = await Classroom.findOne({ _id: classroomId, teacherId: decoded.userId });
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    const announcement = await Announcement.create({
      title,
      content,
      classroomId,
      createdBy: decoded.userId,
      priority: priority || 'medium',
      pinned: pinned || false,
    });

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email');

    // Publish real-time event to all students in the classroom
    await publishAnnouncementAdded(classroomId, populatedAnnouncement);

    return NextResponse.json({ announcement: populatedAnnouncement }, { status: 201 });
  } catch (error: any) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create announcement' }, { status: 500 });
  }
}
