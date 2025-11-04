import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import EmailLog from '@/backend/models/EmailLog';

export const dynamic = 'force-dynamic';

/**
 * Track email link clicks and redirect to original URL
 * GET /api/email/track/click/[trackingId]?url=<encoded-url>
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    await connectDB();
    const { trackingId } = await params;
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
    }

    const decodedUrl = decodeURIComponent(targetUrl);

    // Find and update email log
    const emailLog = await EmailLog.findOne({ trackingId });

    if (emailLog) {
      // Add clicked link if not already tracked
      if (!emailLog.clickedLinks.includes(decodedUrl)) {
        emailLog.clickedLinks.push(decodedUrl);
        emailLog.clickedAt = emailLog.clickedAt || [];
        emailLog.clickedAt.push(new Date());
        await emailLog.save();
        console.log(`Email link clicked: ${emailLog.to} -> ${decodedUrl}`);
      }
    }

    // Redirect to the original URL
    return NextResponse.redirect(decodedUrl, { status: 302 });
  } catch (error) {
    console.error('Email click tracking error:', error);
    
    // Try to redirect anyway
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    
    if (targetUrl) {
      try {
        return NextResponse.redirect(decodeURIComponent(targetUrl), { status: 302 });
      } catch {
        return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
