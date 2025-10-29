import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import User from '@/backend/models/User';
import { sendPasswordResetEmail } from '@/backend/utils/email';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success message (security best practice - don't reveal if email exists)
    const successResponse = {
      message: 'If an account with that email exists, we sent a password reset link.',
    };

    if (!user) {
      // Still return success to prevent email enumeration
      return NextResponse.json(successResponse);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before saving to database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token and expiry (10 minutes from now)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 600000); // 10 minutes
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail({
        userEmail: user.email,
        userName: user.name,
        resetLink: resetUrl,
        expiresIn: '10 minutes',
      });

      console.log('✅ Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Error sending password reset email:', emailError);
      
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(successResponse);
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
