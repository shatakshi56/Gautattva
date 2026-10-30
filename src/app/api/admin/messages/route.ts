import { NextRequest, NextResponse } from 'next/server';
import { db, normalizePhone } from '@/lib/db';

export async function GET() {
  try {
    const messages = await db.getAllCustomerMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Messages GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, customer_name, message_text } = body;

    if (!phone || !message_text) {
      return NextResponse.json({ error: 'Phone and message_text are required' }, { status: 400 });
    }

    const clean = normalizePhone(phone);
    const dest = clean.length === 10 ? '91' + clean : clean;

    const apiKey = process.env.GUPSHUP_API_KEY;
    let gupshupMsgId = `sim-${Date.now()}`;

    if (apiKey) {
      try {
        const res = await fetch('https://api.gupshup.io/wa/api/v1/msg', {
          method: 'POST',
          headers: {
            apikey: apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            channel: 'whatsapp',
            source: process.env.GUPSHUP_SOURCE_PHONE || '919057000446',
            destination: dest,
            message: JSON.stringify({
              type: 'text',
              text: message_text,
            }),
          }),
        });
        const gData = await res.json();
        if (gData.messageId) gupshupMsgId = gData.messageId;
      } catch (err) {
        console.warn('Gupshup direct send error:', err);
      }
    }

    const logged = await db.logCustomerMessage({
      phone,
      customer_name: customer_name || 'Customer',
      sender_type: 'admin',
      message_text,
      status: 'sent',
      gupshup_message_id: gupshupMsgId,
    });

    const waDirectUrl = `https://wa.me/${dest}?text=${encodeURIComponent(message_text)}`;

    return NextResponse.json({
      success: true,
      message: logged,
      wa_direct_url: waDirectUrl,
    });
  } catch (error) {
    console.error('Messages POST error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
