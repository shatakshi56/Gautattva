import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const orders = await db.getAllOrders();
  const logs = await db.getReorderLogs();
  const dueReorders = await db.getDueReorders();
  const dueReminders = await db.getDueReminders();
  const customers = await db.getAllCustomers();
  const abandonedCarts = await db.getAbandonedCarts(1);
  const trafficStats = await db.getTrafficStats();

  const stats = {
    storage: db.isUsingSupabase() ? 'supabase_postgres' : 'in_memory',
    total_orders: orders.length,
    delivered_orders: orders.filter((o) => o.status === 'delivered').length,
    wa_nudges_sent: orders.filter((o) => o.wa_sent).length,
    reminders_sent: orders.filter((o) => o.reminder_sent).length,
    pending_due_nudges: dueReorders.length,
    pending_due_reminders: dueReminders.length,
    total_customers: customers.length,
    loyal_customers: customers.filter((c) => c.is_loyal_customer).length,
    abandoned_carts: abandonedCarts.length,
    traffic: trafficStats,
  };

  return NextResponse.json({ orders, logs, customers, stats });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'reset_demo') {
      await db.resetDemoData();
      return NextResponse.json({ success: true, message: 'Demo store reset to initial state' });
    }

    if (body.action === 'create_order') {
      const qty = Number(body.quantity) || 1;
      const jar = body.jar_size || '1000ml';
      const maxAllowed = jar === '5000ml' ? 2 : 5;

      if (qty > maxAllowed || qty > 5) {
        return NextResponse.json(
          {
            error:
              jar === '5000ml'
                ? 'Maximum 2 packs of 5L allowed per order. For bulk orders, please contact +91 9057000446.'
                : 'Maximum 5 packs allowed per order. For bulk orders, please contact +91 9057000446.',
          },
          { status: 400 }
        );
      }

      const newOrder = await db.createOrder({
        customer_name: body.customer_name || 'Vedic Customer',
        phone: body.phone || '+91 98765 00000',
        email: body.email,
        address: body.address || 'Civil Lines, Jaipur',
        city: body.city || 'Jaipur',
        pincode: body.pincode || '302006',
        jar_size: jar,
        quantity: qty,
        amount: body.amount || 2632,
        status: 'placed',
        tracking_awb: `DELH${Math.floor(10000000 + Math.random() * 90000000)}`,
        courier: 'Delhivery Surface',
        wa_sent: false,
        reminder_sent: false,
        payment_status: 'paid',
      });

      return NextResponse.json({ success: true, order: newOrder });
    }

    if (body.action === 'simulate_delivery') {
      const order = await db.markDelivered(body.order_id, body.delivered_at);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
