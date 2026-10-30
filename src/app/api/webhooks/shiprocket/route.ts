import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Shiprocket sends payload with awb, current_status, courier_name, delivered_date
    const awb = body.awb || body.awb_code || body.tracking_number;
    const orderId = body.order_id || body.channel_order_id;
    const currentStatus = (body.current_status || body.status || '').toUpperCase();

    if (!awb && !orderId) {
      return NextResponse.json(
        { error: 'Missing AWB or Order ID in webhook payload' },
        { status: 400 }
      );
    }

    // Match order in database
    let order = awb ? await db.getOrderByAwb(awb) : undefined;
    if (!order && orderId) {
      const allOrders = await db.getAllOrders();
      order = allOrders.find(
        (o) => o.order_number === orderId || o.shiprocket_order_id === orderId || o.id === orderId
      );
    }

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found, acknowledged for tracking log', received_awb: awb },
        { status: 200 }
      );
    }

    // Check if status is DELIVERED
    if (currentStatus === 'DELIVERED') {
      const deliveredDate = body.delivered_date || body.delivered_at || new Date().toISOString();
      const updatedOrder = await db.markDelivered(order.id, deliveredDate);

      // Audit log
      await db.addReorderLog({
        order_id: order.id,
        phone: order.phone,
        trigger_type: 'manual_simulator',
        channel: 'shiprocket_webhook',
        message_content: `Shiprocket confirmed delivery. Reorder countdown initiated for ${order.jar_size} jar (Due: ${updatedOrder?.reorder_due_date}).`,
        status: 'delivered',
      });

      return NextResponse.json({
        success: true,
        event: 'order_delivered',
        order_number: order.order_number,
        jar_size: order.jar_size,
        delivered_at: updatedOrder?.delivered_at,
        reorder_due_date: updatedOrder?.reorder_due_date,
      });
    }

    // Update tracking status
    await db.updateOrder(order.id, {
      status: currentStatus.toLowerCase().includes('ship') ? 'shipped' : order.status,
      courier: body.courier_name || order.courier,
    });

    return NextResponse.json({
      success: true,
      event: 'status_updated',
      current_status: currentStatus,
      order_number: order.order_number,
    });
  } catch (error) {
    console.error('Shiprocket webhook error:', error);
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: 'GauTattva Shiprocket Delivery Webhook',
    supported_events: ['DELIVERED', 'OUT FOR DELIVERY', 'IN TRANSIT'],
  });
}
