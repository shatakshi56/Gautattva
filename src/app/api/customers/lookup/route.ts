import { NextRequest, NextResponse } from 'next/server';
import { db, normalizePhone } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const rawPhone = req.nextUrl.searchParams.get('phone');

    if (!rawPhone) {
      return NextResponse.json({ error: 'Phone parameter required' }, { status: 400 });
    }

    const clean = normalizePhone(rawPhone);
    if (clean.length < 10) {
      return NextResponse.json({ isLoyal: false, customer: null, discount_percent: 0 });
    }

    const customer = await db.getCustomerByPhone(rawPhone);

    if (customer && customer.total_orders >= 1) {
      return NextResponse.json({
        isLoyal: true,
        discount_percent: customer.loyalty_discount_percent || 20,
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          city: customer.city,
          pincode: customer.pincode,
          total_orders: customer.total_orders,
          total_spent: customer.total_spent,
          last_order_at: customer.last_order_at,
        },
        message: `Welcome back, ${customer.name || 'valued customer'}! As a loyal Vedic family member, your 20% privilege discount is auto-applied.`,
      });
    }

    return NextResponse.json({
      isLoyal: false,
      discount_percent: 0,
      customer: customer || null,
    });
  } catch (error: any) {
    if (error?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }
    console.error('Customer lookup error:', error);
    return NextResponse.json({ error: 'Failed to lookup customer' }, { status: 500 });
  }
}
