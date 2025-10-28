import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/backend/utils/db';
import User from '@/backend/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/backend/middleware/auth';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const userId = String(user._id);
    const token = generateToken({
      userId,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        enrollmentNumber: user.enrollmentNumber,
        rollNumber: user.rollNumber,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}
