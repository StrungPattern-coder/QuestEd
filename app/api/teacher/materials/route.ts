import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Material from '@/backend/models/Material';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';
import { publishMaterialAdded } from '@/backend/utils/ably-server';

export const dynamic = 'force-dynamic';

// GET - List all materials for a classroom (Teacher)
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

    const materials = await Material.find({ classroomId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ materials });
  } catch (error: any) {
    console.error('Get materials error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST - Create/Upload new material
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

    const { title, description, type, fileUrl, fileName, fileSize, classroomId } = await request.json();

    if (!title || !type || !fileUrl || !classroomId) {
      return NextResponse.json(
        { error: 'Title, type, file URL, and classroom ID are required' },
        { status: 400 }
      );
    }

    // Verify teacher owns this classroom
    const classroom = await Classroom.findOne({ _id: classroomId, teacherId: decoded.userId });
    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }

    const material = await Material.create({
      title,
      description,
      type,
      fileUrl,
      fileName,
      fileSize,
      classroomId,
      uploadedBy: decoded.userId,
    });

    const populatedMaterial = await Material.findById(material._id).populate('uploadedBy', 'name email');

    // Publish real-time event to all students in the classroom
    await publishMaterialAdded(classroomId, populatedMaterial);

    return NextResponse.json({ material: populatedMaterial }, { status: 201 });
  } catch (error: any) {
    console.error('Create material error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create material' }, { status: 500 });
  }
}
