import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      session_id,
      event_type = 'page_view',
      page_url = '/',
      referrer,
      utm_source,
      utm_campaign,
      device = 'desktop',
      city,
    } = body;

    if (!session_id) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const event = await db.logTrafficEvent({
      session_id,
      event_type,
      page_url,
      referrer,
      utm_source,
      utm_campaign,
      device,
      city,
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ error: 'Failed to log traffic event' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = await db.getTrafficStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}
