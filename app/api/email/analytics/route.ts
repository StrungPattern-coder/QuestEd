import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import EmailLog from '@/backend/models/EmailLog';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

/**
 * Get email analytics
 * GET /api/email/analytics?type=<email-type>&days=<number>
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Only teachers can view email analytics
    if (decoded.role !== 'teacher') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query: any = {
      sentAt: { $gte: startDate },
    };

    if (type) {
      query.type = type;
    }

    // Get all email logs
    const emailLogs = await EmailLog.find(query).sort({ sentAt: -1 });

    // Calculate statistics
    const totalSent = emailLogs.length;
    const totalOpened = emailLogs.filter((log) => log.opened).length;
    const totalClicked = emailLogs.filter((log) => log.clickedLinks.length > 0).length;
    const totalFailed = emailLogs.filter((log) => log.status === 'failed').length;

    const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(2) : '0.00';
    const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(2) : '0.00';
    const failureRate = totalSent > 0 ? ((totalFailed / totalSent) * 100).toFixed(2) : '0.00';

    // Group by type
    const byType: Record<string, any> = {};
    emailLogs.forEach((log) => {
      if (!byType[log.type]) {
        byType[log.type] = {
          sent: 0,
          opened: 0,
          clicked: 0,
          failed: 0,
        };
      }
      byType[log.type].sent++;
      if (log.opened) byType[log.type].opened++;
      if (log.clickedLinks.length > 0) byType[log.type].clicked++;
      if (log.status === 'failed') byType[log.type].failed++;
    });

    // Add rates to each type
    Object.keys(byType).forEach((key) => {
      const stats = byType[key];
      stats.openRate = stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(2) : '0.00';
      stats.clickRate = stats.sent > 0 ? ((stats.clicked / stats.sent) * 100).toFixed(2) : '0.00';
    });

    return NextResponse.json({
      summary: {
        totalSent,
        totalOpened,
        totalClicked,
        totalFailed,
        openRate: `${openRate}%`,
        clickRate: `${clickRate}%`,
        failureRate: `${failureRate}%`,
      },
      byType,
      recentEmails: emailLogs.slice(0, 20).map((log) => ({
        to: log.to,
        subject: log.subject,
        type: log.type,
        status: log.status,
        opened: log.opened,
        openedAt: log.openedAt,
        clickedLinks: log.clickedLinks.length,
        sentAt: log.sentAt,
      })),
    });
  } catch (error: any) {
    console.error('Email analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get email analytics' },
      { status: 500 }
    );
  }
}
