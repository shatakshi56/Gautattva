import { JarSize } from './types';

interface CreatePaymentLinkOptions {
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  jarSize: JarSize;
  amount: number;
  discountApplied?: string;
}

export async function createRazorpayPaymentLink({
  orderNumber,
  customerName,
  phone,
  email,
  jarSize,
  amount,
  discountApplied,
}: CreatePaymentLinkOptions) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const description = `GauTattva Organics A2 Gir Cow Vedic Bilona Ghee (${jarSize}) Replenishment${
    discountApplied ? ` [Code: ${discountApplied}]` : ''
  }`;

  // If Razorpay live/test credentials are set in environment
  if (keyId && keySecret) {
    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/payment_links', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // amount in paise
          currency: 'INR',
          accept_partial: false,
          description,
          customer: {
            name: customerName,
            contact: phone.replace(/[^0-9]/g, ''),
            email: email || `${phone.replace(/[^0-9]/g, '')}@gautattva-customer.in`,
          },
          notify: {
            sms: false,
            email: false,
            whatsapp: false, // Gupshup handles official WhatsApp
          },
          reminder_enable: false,
          notes: {
            brand: 'GauTattva Organics',
            previous_order: orderNumber,
            jar_size: jarSize,
            channel: 'whatsapp_ai_reorder',
          },
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay?ref=${orderNumber}&paid=true`,
          callback_method: 'get',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: data.id,
          short_url: data.short_url,
          live: true,
        };
      }
    } catch (err) {
      console.error('Razorpay API error, falling back to instant simulated link', err);
    }
  }

  // Deterministic 1-tap payment link for GauTattva reorder
  const cleanId = Math.random().toString(36).substring(2, 9);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const payloadObj = {
    ref: orderNumber,
    jar: jarSize,
    amt: amount,
    name: customerName,
    phone,
    code: discountApplied,
  };
  const b64 = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const payUrl = `${baseUrl}/pay?d=${b64}`;

  return {
    id: `plink_${cleanId}`,
    short_url: payUrl,
    live: false,
  };
}
