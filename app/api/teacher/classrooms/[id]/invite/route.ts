import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/backend/utils/db';
import Classroom from '@/backend/models/Classroom';
import User from '@/backend/models/User';
import jwt from 'jsonwebtoken';
import { sendClassroomInvitation } from '@/backend/utils/email';
import { publishUserNotification } from '@/backend/utils/socket-server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id: classroomId } = await params;

    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can invite students' }, { status: 403 });
    }

    const { studentEmail } = await request.json();

    if (!studentEmail || !studentEmail.trim()) {
      return NextResponse.json({ error: 'Student email is required' }, { status: 400 });
    }

    // Find classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    // Check if teacher owns this classroom
    if (classroom.teacherId.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Find student by email
    const student = await User.findOne({ email: studentEmail.trim(), role: 'student' });
    if (!student) {
      return NextResponse.json({ 
        error: 'No student found with this email. Please ensure the student has registered.' 
      }, { status: 404 });
    }

    // Check if student is already in classroom
    const studentIdStr = (student as any)._id.toString();
    const isEnrolled = classroom.students.some((id: any) => id.toString() === studentIdStr);
    
    if (isEnrolled) {
      return NextResponse.json({ 
        error: 'Student is already enrolled in this classroom' 
      }, { status: 400 });
    }

    // Add student to classroom
    classroom.students.push((student as any)._id);
    await classroom.save();

    // Get teacher details for email
    const teacher = await User.findById(decoded.userId);
    const teacherName = teacher ? (teacher as any).name : 'Your teacher';

    // Generate invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/join-classroom/${classroomId}`;

    // Send email invitation
    let emailSent = false;
    try {
      emailSent = await sendClassroomInvitation({
        studentEmail: (student as any).email,
        studentName: (student as any).name,
        teacherName,
        classroomName: classroom.name,
        classroomDescription: classroom.description,
        inviteLink,
      });

      if (emailSent) {
        console.log(`✅ Invitation email sent to ${(student as any).email}`);
      } else {
        console.warn(`⚠️ Failed to send invitation email to ${(student as any).email}`);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails - student is already added
    }

    // Send real-time notification via Socket.IO
    try {
      await publishUserNotification(studentIdStr, {
        type: 'classroom_invitation',
        classroomId: classroom._id,
        classroomName: classroom.name,
        teacherName,
        teacherId: decoded.userId,
        inviteLink,
        timestamp: new Date(),
      });
      
      console.log(`✅ Real-time notification sent to student ${studentIdStr}`);
    } catch (notificationError) {
      console.error('Socket.IO notification error:', notificationError);
      // Don't fail the request if Socket.IO fails
    }

    return NextResponse.json({
      message: emailSent 
        ? 'Student added successfully and invitation email sent' 
        : 'Student added successfully (email sending failed)',
      student: {
        _id: (student as any)._id,
        name: (student as any).name,
        email: (student as any).email,
      },
      emailSent,
      inviteLink,
    });
  } catch (error) {
    console.error('Error inviting student:', error);
    return NextResponse.json(
      { error: 'Failed to invite student' },
      { status: 500 }
    );
  }
}
