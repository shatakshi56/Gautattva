import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { JarSize } from '@/lib/types';

export async function GET() {
  try {
    const products = await db.getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'update') {
      const { id, ...updates } = body;
      if (!id) return NextResponse.json({ error: 'Product id required' }, { status: 400 });
      const updated = await db.updateProduct(id, updates);
      return NextResponse.json({ success: true, product: updated });
    }

    // Create new variant/product
    const { title, jar_size, price, mrp, stock_quantity = 50, is_in_stock = true, description } = body;
    if (!title || !jar_size || !price) {
      return NextResponse.json({ error: 'title, jar_size, and price are required' }, { status: 400 });
    }

    const created = await db.createProduct({
      title,
      jar_size: jar_size as JarSize,
      price: Number(price),
      mrp: Number(mrp) || Number(price),
      stock_quantity: Number(stock_quantity),
      is_in_stock: Boolean(is_in_stock),
      description,
    });

    return NextResponse.json({ success: true, product: created });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Failed to process product request' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Product id required' }, { status: 400 });

    const updated = await db.updateProduct(id, updates);
    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Products PUT error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
