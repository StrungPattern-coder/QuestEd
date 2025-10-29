import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import User from '@/backend/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/backend/middleware/auth';
import { validateEmail } from '@/backend/utils/helpers';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, role, enrollmentNumber, rollNumber } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'teacher' && role !== 'student') {
      return NextResponse.json(
        { error: 'Role must be either teacher or student' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      enrollmentNumber: role === 'student' ? enrollmentNumber : undefined,
      rollNumber: role === 'student' ? rollNumber : undefined,
    });

    // Generate token
    const userId = String(user._id);
    const token = generateToken({
      userId,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        enrollmentNumber: user.enrollmentNumber,
        rollNumber: user.rollNumber,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
