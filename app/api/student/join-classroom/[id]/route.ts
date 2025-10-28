import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/backend/utils/db';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Only students can join classrooms' }, { status: 403 });
    }

    const classroomId = params.id;

    // Find classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    // Check if student is already in classroom
    const studentIdStr = decoded.userId;
    const isEnrolled = classroom.students.some((id: any) => id.toString() === studentIdStr);
    
    if (isEnrolled) {
      return NextResponse.json({ 
        error: 'You are already enrolled in this classroom',
        classroomName: classroom.name,
      }, { status: 400 });
    }

    // Add student to classroom
    classroom.students.push(decoded.userId as any);
    await classroom.save();

    return NextResponse.json({
      message: 'Successfully joined classroom',
      classroomName: classroom.name,
      classroomId: classroom._id,
    });
  } catch (error) {
    console.error('Error joining classroom:', error);
    return NextResponse.json(
      { error: 'Failed to join classroom' },
      { status: 500 }
    );
  }
}
