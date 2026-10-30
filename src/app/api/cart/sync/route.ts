import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { JarSize } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      session_id,
      phone,
      customer_name,
      jar_size = '1000ml',
      quantity = 1,
      cart_amount = 2632,
      status = 'active',
    } = body;

    if (!session_id) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const session = await db.syncCartSession({
      session_id,
      phone,
      customer_name,
      jar_size: jar_size as JarSize,
      quantity: Number(quantity) || 1,
      cart_amount: Number(cart_amount) || 0,
      status,
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ error: 'Failed to sync cart session' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    const action = req.nextUrl.searchParams.get('action');

    if (action === 'abandoned') {
      const olderThan = Number(req.nextUrl.searchParams.get('older_than_minutes')) || 30;
      const abandoned = await db.getAbandonedCarts(olderThan);
      return NextResponse.json({ abandoned_count: abandoned.length, carts: abandoned });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id or action=abandoned is required' }, { status: 400 });
    }

    const session = await db.getCartSession(sessionId);
    return NextResponse.json({ session: session || null });
  } catch (error) {
    console.error('Cart get error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}
