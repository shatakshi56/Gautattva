import { WhatsAppTemplatePayload } from './types';

export function buildWhatsAppMessage(payload: WhatsAppTemplatePayload): {
  header: string;
  body: string;
  footer: string;
  buttonText: string;
  buttonUrl: string;
} {
  const { customerName, jarSize, price, razorpayUrl, discountCode, daysPassed, isReminder } = payload;

  if (isReminder) {
    const discountedPrice = Math.round(price * 0.95);
    return {
      header: '🪔 GauTattva Organics • Special Replenishment Courtesy',
      body: `Pranam ${customerName} Ji 🙏\n\nWe noticed your ${jarSize} jar of Vedic Gir Cow Bilona Ghee is almost finished. To ensure your sacred morning ritual remains uninterrupted, we have reserved a fresh small-batch jar for you with an extra 5% courtesy blessing:\n\n✨ Fresh Batch Churned: Early morning wooden bilona\n🌿 Lab Certified: 100% A2 Gir Cow Beta-Casein, 0% Carbs/Sugar\n💰 Privilege Price: ₹${discountedPrice} (Was ₹${price})\n🎟️ Code Applied: ${discountCode || 'PRANAM5'}\n\nTap below to replenish instantly with 1-tap Razorpay (no login, no password):`,
      footer: 'GauTattva Organics • Rooted in tradition, inspired by purity',
      buttonText: `Reorder Now (₹${discountedPrice})`,
      buttonUrl: razorpayUrl,
    };
  }

  return {
    header: '🪔 GauTattva Organics • Vedic Ghee Replenishment',
    body: `Pranam ${customerName} Ji 🙏\n\nIt has been ${daysPassed} days since your fresh jar of GauTattva A2 Gir Cow Vedic Bilona Ghee (${jarSize}) was delivered.\n\nBased on daily healthy ayurvedic usage, your golden jar is likely running low! Would you like your next jar dispatched from our latest fresh morning batch?\n\n✨ Hand-churned bi-directional wooden bilona\n🌿 Slow cooked on earthen clay chulha\n🧪 Tested by Jagdamba Laboratories (Report JLFD260702144)\n\nOne-tap replenishment link (pre-filled with your saved shipping address):`,
    footer: 'GauTattva Organics • DEALKARTS Jaipur',
    buttonText: `Pay & Reorder (₹${price})`,
    buttonUrl: razorpayUrl,
  };
}

export async function sendGupshupWhatsApp(payload: WhatsAppTemplatePayload) {
  const apiKey = process.env.GUPSHUP_API_KEY;
  const appName = process.env.GUPSHUP_APP_NAME || 'GautattvaOrganics';
  const cleanPhone = payload.phone.replace(/[^0-9]/g, '');

  const template = buildWhatsAppMessage(payload);

  if (apiKey) {
    try {
      const response = await fetch('https://api.gupshup.io/wa/api/v1/msg', {
        method: 'POST',
        headers: {
          apikey: apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          channel: 'whatsapp',
          source: process.env.GUPSHUP_SOURCE_PHONE || '919057000446',
          destination: cleanPhone,
          message: JSON.stringify({
            type: 'quick_reply',
            content: {
              type: 'text',
              header: template.header,
              text: template.body,
              caption: template.footer,
            },
            options: [
              {
                type: 'url',
                title: template.buttonText,
                url: template.buttonUrl,
              },
            ],
          }),
          'src.name': appName,
        }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        messageId: data.messageId || `gs-${Date.now()}`,
        simulated: false,
        raw: data,
        template,
      };
    } catch (err) {
      console.error('Gupshup WhatsApp API error, continuing in verified simulator mode', err);
    }
  }

  // Simulator mode
  return {
    success: true,
    messageId: `gs-mock-${Date.now()}`,
    simulated: true,
    template,
  };
}
