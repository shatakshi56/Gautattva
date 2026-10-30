import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { JarSize } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';

export async function GET() {
  try {
    const reminders = await db.getCustomerReminders();
    return NextResponse.json({ success: true, reminders });
  } catch (error) {
    console.error('Failed to get reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      phone,
      email,
      channel,
      past_jar_size,
      past_quantity,
      past_purchase_date,
      next_jar_size,
      next_quantity,
      remind_in_days,
      reminder_time_of_day,
      scheduled_date,
      buy_link,
      message_preview,
    } = body;

    if (!customer_name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    }

    const nextJar = (next_jar_size as JarSize) || '1000ml';
    const variant = knowledgeBase.product.variants.find((v) => v.id === nextJar) || knowledgeBase.product.variants[1];
    
    // Generate pre-filled buy link if not provided
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fallbackBuyLink = `${baseUrl}/pay?jar=${nextJar}&qty=${next_quantity || 1}&name=${encodeURIComponent(
      customer_name
    )}&phone=${cleanPhone}${email ? `&email=${encodeURIComponent(email)}` : ''}&code=PRANAM5&ref=REMIND-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const reminder = await db.createCustomerReminder({
      customer_name,
      phone: cleanPhone,
      email: email || undefined,
      channel: channel || 'whatsapp',
      past_jar_size: past_jar_size || '1000ml',
      past_quantity: Number(past_quantity) || 1,
      past_purchase_date: past_purchase_date || new Date().toISOString(),
      next_jar_size: nextJar,
      next_quantity: Number(next_quantity) || 1,
      remind_in_days: Number(remind_in_days) || 30,
      reminder_time_of_day: reminder_time_of_day || 'morning',
      scheduled_date: scheduled_date || new Date(Date.now() + (Number(remind_in_days) || 30) * 86400000).toISOString(),
      buy_link: buy_link || fallbackBuyLink,
      message_preview: message_preview || '',
      status: 'scheduled',
    });

    // Also log to Reorder logs audit trail
    await db.addReorderLog({
      order_id: `reminder-${reminder.id}`,
      phone: cleanPhone,
      trigger_type: 'manual_simulator',
      channel: channel === 'email' ? 'email' : 'whatsapp',
      message_content: message_preview || `Replenishment reminder scheduled for ${customer_name} (${nextJar}) in ${remind_in_days} days.`,
      razorpay_link_url: reminder.buy_link,
      status: 'queued',
    });

    return NextResponse.json({ success: true, reminder });
  } catch (error) {
    console.error('Failed to create reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}
