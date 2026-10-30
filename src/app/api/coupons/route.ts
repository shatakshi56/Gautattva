import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await db.getAllCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('Coupons GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'delete') {
      const { id } = body;
      if (!id) return NextResponse.json({ error: 'Coupon id required' }, { status: 400 });
      await db.deleteCoupon(id);
      return NextResponse.json({ success: true, message: 'Coupon deleted' });
    }

    if (body.action === 'toggle_active') {
      const { id, is_active } = body;
      if (!id) return NextResponse.json({ error: 'Coupon id required' }, { status: 400 });
      const updated = await db.updateCoupon(id, { is_active });
      return NextResponse.json({ success: true, coupon: updated });
    }

    const {
      code,
      discount_type = 'percentage',
      discount_value,
      min_order_value = 0,
      max_discount_cap,
      for_loyal_customers_only = false,
      is_active = true,
      max_usage_limit,
      expires_at,
    } = body;

    if (!code || discount_value === undefined) {
      return NextResponse.json({ error: 'code and discount_value are required' }, { status: 400 });
    }

    const newCoupon = await db.createCoupon({
      code: code.toUpperCase().trim(),
      discount_type,
      discount_value: Number(discount_value),
      min_order_value: Number(min_order_value) || 0,
      max_discount_cap: max_discount_cap ? Number(max_discount_cap) : undefined,
      for_loyal_customers_only: Boolean(for_loyal_customers_only),
      is_active: Boolean(is_active),
      max_usage_limit: max_usage_limit ? Number(max_usage_limit) : undefined,
      expires_at,
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error('Coupons POST error:', error);
    return NextResponse.json({ error: 'Failed to process coupon' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Coupon id required' }, { status: 400 });

    const updated = await db.updateCoupon(id, updates);
    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    console.error('Coupons PUT error:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}
