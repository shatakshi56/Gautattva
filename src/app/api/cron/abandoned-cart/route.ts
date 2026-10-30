import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import knowledgeBase from '@/data/knowledge_base.json';

export async function GET(req: NextRequest) {
  try {
    const olderThan = Number(req.nextUrl.searchParams.get('older_than_minutes')) || 30;

    const abandonedCarts = await db.getAbandonedCarts(olderThan);
    const results = [];

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    for (const cart of abandonedCarts) {
      const variant =
        knowledgeBase.product.variants.find((v) => v.id === cart.jar_size) ||
        knowledgeBase.product.variants[1];

      const cleanPhone = cart.phone ? cart.phone.replace(/[^0-9]/g, '') : '';
      const destPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;

      const prefilledBuyUrl = `${baseUrl}/pay?jar=${cart.jar_size}&qty=${cart.quantity}&name=${encodeURIComponent(
        cart.customer_name || 'Vedic Customer'
      )}&phone=${encodeURIComponent(cart.phone || '')}&code=PRANAM5&ref=CART-RECOVER`;

      const message = `Pranam ${cart.customer_name || 'Ji'} 🙏

Warm greetings from GauTattva™ Organics!

We noticed you left ${cart.quantity}x GauTattva A2 Gir Cow Vedic Bilona Ghee (${variant.size}) in your cart.

Kya aapko checkout ya payment karne mein koi pareshani aayi?
Agar aapka koi bhi prashna ya query hai, toh aap direct isi WhatsApp number par reply kar sakte hain.

Special Vedic Courtesy: Aapke liye 5% extra blessing auto-applied hai!

👉 1-Tap Checkout Link (Pre-filled):
${prefilledBuyUrl}

Rooted in tradition, inspired by purity.
GauTattva Organics • +91 9057000446`;

      // Log followup sent in database
      await db.markCartFollowupSent(cart.id);

      results.push({
        cart_id: cart.id,
        phone: destPhone,
        customer_name: cart.customer_name,
        jar_size: cart.jar_size,
        wa_url: `https://wa.me/${destPhone}?text=${encodeURIComponent(message)}`,
        message_dispatched: message,
        status: 'sent',
      });
    }

    return NextResponse.json({
      success: true,
      processed_count: results.length,
      nudges: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Abandoned cart cron error:', error);
    return NextResponse.json({ error: 'Failed to process abandoned carts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'log_feedback') {
      const { cart_id, feedback } = body;
      if (!cart_id) {
        return NextResponse.json({ error: 'cart_id is required' }, { status: 400 });
      }
      const updated = await db.markCartFollowupSent(cart_id, feedback);
      return NextResponse.json({ success: true, cart: updated });
    }

    // Trigger on-demand abandoned cart check
    return GET(req);
  } catch (error) {
    console.error('Abandoned cart POST error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
