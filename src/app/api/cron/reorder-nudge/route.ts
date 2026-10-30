import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createRazorpayPaymentLink } from '@/lib/razorpay';
import { sendGupshupWhatsApp } from '@/lib/gupshup';

const jarDaysMap = {
  '500ml': 25,
  '1000ml': 50,
  '2000ml': 90,
  '5000ml': 180,
};

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Optional verification for Vercel production cron header
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // In dev or manual demo, allow bypass
      const isManual = req.nextUrl.searchParams.get('manual') === 'true';
      if (!isManual) {
        return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
      }
    }

    const results = {
      timestamp: new Date().toISOString(),
      first_nudges_sent: [] as Array<Record<string, unknown>>,
      reminder_discounts_sent: [] as Array<Record<string, unknown>>,
    };

    // 1. Check Day 25 / 50 / 90 Nudges
    const dueReorders = await db.getDueReorders();

    for (const order of dueReorders) {
      const daysPassed = jarDaysMap[order.jar_size] || 25;

      // Generate pre-filled Razorpay Payment Link
      const razorpayRes = await createRazorpayPaymentLink({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        phone: order.phone,
        email: order.email,
        jarSize: order.jar_size,
        amount: order.amount,
      });

      // Dispatch WhatsApp message via Gupshup
      const waRes = await sendGupshupWhatsApp({
        customerName: order.customer_name,
        phone: order.phone,
        jarSize: order.jar_size,
        price: order.amount,
        razorpayUrl: razorpayRes.short_url,
        daysPassed,
        isReminder: false,
      });

      // Update order state
      await db.updateOrder(order.id, {
        wa_sent: true,
        wa_sent_at: new Date().toISOString(),
        wa_message_id: waRes.messageId,
        razorpay_link_id: razorpayRes.id,
        razorpay_link_url: razorpayRes.short_url,
      });

      // Audit log
      const triggerType =
        order.jar_size === '500ml'
          ? 'day_25_nudge'
          : order.jar_size === '1000ml'
          ? 'day_50_nudge'
          : order.jar_size === '5000ml'
          ? 'day_180_nudge'
          : 'day_90_nudge';

      await db.addReorderLog({
        order_id: order.id,
        phone: order.phone,
        trigger_type: triggerType,
        channel: 'gupshup_whatsapp',
        message_content: waRes.template.body,
        razorpay_link_url: razorpayRes.short_url,
        status: 'sent',
        gupshup_response: { messageId: waRes.messageId, simulated: waRes.simulated },
      });

      results.first_nudges_sent.push({
        order_id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        jar_size: order.jar_size,
        nudge_day: daysPassed,
        razorpay_link: razorpayRes.short_url,
        wa_message_id: waRes.messageId,
      });
    }

    // 2. Check 48-Hour Unopened/Unpaid Follow-up Reminders (with 5% discount)
    const dueReminders = await db.getDueReminders();

    for (const order of dueReminders) {
      const discountedAmount = Math.round(order.amount * 0.95);

      // Generate discounted Razorpay link
      const razorpayRes = await createRazorpayPaymentLink({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        phone: order.phone,
        email: order.email,
        jarSize: order.jar_size,
        amount: discountedAmount,
        discountApplied: 'PRANAM5',
      });

      // Send 48h discount follow-up WhatsApp
      const waRes = await sendGupshupWhatsApp({
        customerName: order.customer_name,
        phone: order.phone,
        jarSize: order.jar_size,
        price: order.amount,
        razorpayUrl: razorpayRes.short_url,
        discountCode: 'PRANAM5',
        daysPassed: 0,
        isReminder: true,
      });

      // Update order state
      await db.updateOrder(order.id, {
        reminder_sent: true,
        reminder_sent_at: new Date().toISOString(),
        discount_applied: 'PRANAM5',
        razorpay_link_url: razorpayRes.short_url,
      });

      // Audit log
      await db.addReorderLog({
        order_id: order.id,
        phone: order.phone,
        trigger_type: 'reminder_48hr_discount',
        channel: 'gupshup_whatsapp',
        message_content: waRes.template.body,
        razorpay_link_url: razorpayRes.short_url,
        status: 'sent',
        gupshup_response: { messageId: waRes.messageId, discount: '5%' },
      });

      results.reminder_discounts_sent.push({
        order_id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        jar_size: order.jar_size,
        discounted_amount: discountedAmount,
        razorpay_link: razorpayRes.short_url,
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        total_nudges: results.first_nudges_sent.length,
        total_reminders: results.reminder_discounts_sent.length,
      },
      results,
    });
  } catch (error) {
    console.error('Error running reorder nudge cron:', error);
    return NextResponse.json(
      { error: 'Failed to execute reorder nudge cron' },
      { status: 500 }
    );
  }
}
