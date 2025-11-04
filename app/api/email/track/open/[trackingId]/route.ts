import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import EmailLog from '@/backend/models/EmailLog';

export const dynamic = 'force-dynamic';

/**
 * Track email open via tracking pixel
 * GET /api/email/track/open/[trackingId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    await connectDB();
    const { trackingId } = await params;

    // Find the email log by tracking ID
    const emailLog = await EmailLog.findOne({ trackingId });

    if (emailLog && !emailLog.opened) {
      emailLog.opened = true;
      emailLog.openedAt = new Date();
      await emailLog.save();
      console.log(`Email opened: ${emailLog.to}`);
    }

    // Return a 1x1 transparent GIF
    const transparentGif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return new NextResponse(transparentGif, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Email tracking error:', error);
    
    // Still return transparent GIF even on error (don't break email display)
    const transparentGif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return new NextResponse(transparentGif, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
      },
    });
  }
}
