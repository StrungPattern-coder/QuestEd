import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Announcement from '@/backend/models/Announcement';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';
import { publishAnnouncementUpdated, publishAnnouncementDeleted } from '@/backend/utils/ably-server';

export const dynamic = 'force-dynamic';

// PUT - Update announcement
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

    const announcement = await Announcement.findById(params.id);
    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Verify teacher owns the classroom
    const classroom = await Classroom.findOne({ 
      _id: announcement.classroomId, 
      teacherId: decoded.userId 
    });
    if (!classroom) {
      return NextResponse.json({ error: 'Unauthorized to update this announcement' }, { status: 403 });
    }

    const { title, content, priority, pinned } = await request.json();

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      params.id,
      { title, content, priority, pinned },
      { new: true }
    ).populate('createdBy', 'name email');

    // Publish real-time event to all students in the classroom
    await publishAnnouncementUpdated(announcement.classroomId.toString(), updatedAnnouncement);

    return NextResponse.json({ announcement: updatedAnnouncement });
  } catch (error: any) {
    console.error('Update announcement error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update announcement' }, { status: 500 });
  }
}

// DELETE - Delete announcement
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

    const announcement = await Announcement.findById(params.id);
    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Verify teacher owns the classroom
    const classroom = await Classroom.findOne({ 
      _id: announcement.classroomId, 
      teacherId: decoded.userId 
    });
    if (!classroom) {
      return NextResponse.json({ error: 'Unauthorized to delete this announcement' }, { status: 403 });
    }

    const classroomId = announcement.classroomId.toString();
    const announcementId = params.id;

    await Announcement.findByIdAndDelete(params.id);

    // Publish real-time event to all students in the classroom
    await publishAnnouncementDeleted(classroomId, announcementId);

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error: any) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete announcement' }, { status: 500 });
  }
}
