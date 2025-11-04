import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import SiteStats from '@/backend/models/SiteStats';

export const dynamic = 'force-dynamic';

/**
 * Get and increment visitor count
 * GET /api/stats/visitors
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get or create the global stats document (use a standard query)
    let stats = await SiteStats.findOne({});
    
    if (!stats) {
      // Create initial stats document with default _id
      stats = await SiteStats.create({
        totalVisitors: 0,
        uniqueVisitors: [],
        lastVisitDate: new Date(),
      });
    }

    // Get visitor identifier (IP address or session)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const visitorIp = forwardedFor?.split(',')[0] || realIp || 'unknown';

    // Check if this is a unique visitor (not seen in last 24 hours)
    const isNewVisitor = !stats.uniqueVisitors.includes(visitorIp);

    if (isNewVisitor) {
      // Increment total visitors
      stats.totalVisitors += 1;
      
      // Add to unique visitors list (keep only last 10000 to prevent unlimited growth)
      stats.uniqueVisitors.push(visitorIp);
      if (stats.uniqueVisitors.length > 10000) {
        stats.uniqueVisitors = stats.uniqueVisitors.slice(-10000);
      }
      
      stats.lastVisitDate = new Date();
      await stats.save();
    }

    return NextResponse.json({
      totalVisitors: stats.totalVisitors,
      isNewVisitor,
    });
  } catch (error: any) {
    console.error('Visitor count error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to update visitor count',
        totalVisitors: 0,
      },
      { status: 500 }
    );
  }
}
