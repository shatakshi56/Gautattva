import { NextRequest, NextResponse } from 'next/server';
import { buildWhatsAppMessage, sendGupshupWhatsApp } from '@/lib/gupshup';
import { createRazorpayPaymentLink } from '@/lib/razorpay';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body.phone || '919057000446';
    const customerName = body.customer_name || 'Vedic Customer';
    const jarSize = body.jar_size || '1000ml';
    const isReminder = Boolean(body.is_reminder);
    const price =
      jarSize === '500ml'
        ? 1432
        : jarSize === '2000ml'
        ? 5112
        : jarSize === '5000ml'
        ? 12392
        : 2632;
    const daysPassed =
      jarSize === '500ml'
        ? 25
        : jarSize === '2000ml'
        ? 90
        : jarSize === '5000ml'
        ? 180
        : 50;

    // 1. Generate Razorpay link
    const rzpRes = await createRazorpayPaymentLink({
      orderNumber: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      phone,
      jarSize,
      amount: price,
      discountApplied: isReminder ? 'PRANAM5' : undefined,
    });

    // 2. Build full template
    const template = buildWhatsAppMessage({
      customerName,
      phone,
      jarSize,
      price,
      razorpayUrl: rzpRes.short_url,
      daysPassed,
      isReminder,
      discountCode: isReminder ? 'PRANAM5' : undefined,
    });

    const fullText = `${template.header}\n\n${template.body}\n\n👉 *${template.buttonText}:*\n${template.buttonUrl}\n\n_${template.footer}_`;

    // Clean Indian 10 or 12 digit phone
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const waMeUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`;

    // 3. Try sending via Gupshup API if key configured
    const apiResult = await sendGupshupWhatsApp({
      customerName,
      phone: cleanPhone,
      jarSize,
      price,
      razorpayUrl: rzpRes.short_url,
      daysPassed,
      isReminder,
      discountCode: isReminder ? 'PRANAM5' : undefined,
    });

    // 4. Log to Supabase audit trail if possible
    try {
      await db.addReorderLog({
        order_id: `test-wa-${Date.now()}`,
        phone: cleanPhone,
        trigger_type: isReminder ? 'reminder_48hr_discount' : 'manual_simulator',
        channel: 'gupshup_whatsapp',
        message_content: fullText,
        razorpay_link_url: rzpRes.short_url,
        status: apiResult.simulated ? 'queued' : 'sent',
        gupshup_response: apiResult,
      });
    } catch {
      // Continue if db log optional
    }

    return NextResponse.json({
      success: true,
      cleanPhone,
      waMeUrl,
      fullText,
      apiResult,
    });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json({ error: 'Failed to process WhatsApp send' }, { status: 500 });
  }
}
