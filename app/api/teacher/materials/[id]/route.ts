import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import Material from '@/backend/models/Material';
import Classroom from '@/backend/models/Classroom';
import jwt from 'jsonwebtoken';
import { publishMaterialDeleted } from '@/backend/utils/socket-server';

export const dynamic = 'force-dynamic';

// DELETE - Delete a material
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

    const material = await Material.findById(params.id);
    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // Verify teacher owns the classroom
    const classroom = await Classroom.findOne({ _id: material.classroomId, teacherId: decoded.userId });
    if (!classroom) {
      return NextResponse.json({ error: 'Unauthorized to delete this material' }, { status: 403 });
    }

    const classroomId = material.classroomId.toString();
    const materialId = params.id;

    await Material.findByIdAndDelete(params.id);

    // Publish real-time event to all students in the classroom
    await publishMaterialDeleted(classroomId, materialId);

    return NextResponse.json({ message: 'Material deleted successfully' });
  } catch (error: any) {
    console.error('Delete material error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete material' }, { status: 500 });
  }
}
