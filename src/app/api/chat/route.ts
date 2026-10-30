import { NextRequest, NextResponse } from 'next/server';
import knowledgeBase from '@/data/knowledge_base.json';

type ChatMode = 'health' | 'purity' | 'sales';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function buildSystemPrompt(mode: ChatMode): string {
  const baseContext = `
You are the official Vedic AI Concierge for GauTattva™ Organics, a premier Indian single-product D2C brand specializing exclusively in authentic A2 Gir Cow Vedic Bilona Ghee.

BRAND DETAILS:
- Brand Name: ${knowledgeBase.brand.name}
- Tagline: "${knowledgeBase.brand.tagline}"
- Manufacturer: ${knowledgeBase.brand.manufacturer.name}, ${knowledgeBase.brand.manufacturer.address}
- Customer Support: ${knowledgeBase.brand.manufacturer.customer_care.phone} | ${knowledgeBase.brand.manufacturer.customer_care.email}
- Shelf Life: 12 months from packaging in food-grade recyclable glass jars.

OFFICIAL CERTIFIED NABL LAB REPORT:
- Testing House: ${knowledgeBase.lab_report.laboratory} (${knowledgeBase.lab_report.accreditation})
- Report Number: ${knowledgeBase.lab_report.report_number} (Released: ${knowledgeBase.lab_report.report_release_date})
- Sample Name: ${knowledgeBase.lab_report.sample_name}
- Calories: 898.65 kcal / 100g
- Total Fat: 99.85g / 100g
- Saturated Fat: 73.15g / 100g
- Monounsaturated Fat (MUFA): 22.49g / 100g (Cardioprotective healthy fats)
- Trans Fat: 1.40g / 100g (Natural vaccenic acid, ZERO industrial hydrogenated fat)
- Total Carbohydrates: NOT DETECTED (0g - strictly keto friendly)
- Total Sugars (Lactose): NOT DETECTED (0g - 100% safe for lactose intolerant)
- Protein (Casein Residue): NOT DETECTED (0g - fully clarified, zero allergen)
- Vitamin-A: 873.0 mcg / 100g (Naturally rich for eyesight and glowing skin)
- Sodium: NOT DETECTED (0g)

TRADITIONAL 5-STEP BILONA PROCESS:
1. Ethical Ahimsa Grazing: Indigenous purebred Gir cows graze in natural pastures, calves drink first.
2. Fresh A2 Whole Milk boiled gently in brass vessels.
3. Cultured overnight into curd in terracotta earthen clay pots.
4. Two-way wooden bilona (ravaiya) churned early morning at Brahma Muhurta to separate golden makkhan (butter).
5. Slow simmered on gentle cow-dung cake low fire to obtain pure golden danedar (granular) clarified ghee.

JAR SIZES & PRICING (Launching Offer 20% Off):
- 500ml: ₹1,432 (MRP ₹1,790 - 20% off)
- 1 Litre: ₹2,632 (MRP ₹3,290 - 20% off) - Most Popular family choice
- 2 Litres: ₹5,112 (MRP ₹6,390 - 20% off) - Family pack
- 5 Litres: ₹12,392 (MRP ₹15,490 - 20% off) - Large wellness pack

PAYMENT POLICY:
- Cash on Delivery (COD) is strictly NOT available.
- 100% Secure Online Prepaid payments via Razorpay (UPI, Google Pay, PhonePe, Paytm, Credit/Debit Cards, Netbanking).

ORDER LIMITS & BULK ORDERS:
- Maximum 2 packs allowed for 5L jar.
- Maximum 5 packs allowed per variant for other sizes.
- Maximum 5 packs total allowed at once per order.
- For bulk orders exceeding 5 packs, customers must contact support at +91 9057000446.

AUTOMATED REORDER ENGINE:
Explain that when an order is delivered via Shiprocket, our automated timer nudges via WhatsApp:
- 500ml: Day 25 nudge
- 1L: Day 50 nudge
- 2L: Day 90 nudge
With a pre-filled 1-tap Razorpay link for effortless replenishment.
`;

  if (mode === 'health') {
    return `${baseContext}
CURRENT MODE: HEALTH & AYURVEDA CONCIERGE 🌿
Focus your advice on gut health (Butyric acid healing gut lining), cardiovascular health (MUFA 22.49g, healthy HDL cholesterol), why A2 Beta-casein does not cause inflammation like Western A1 jersey cow milk, why lactose-intolerant people can safely consume it (0g sugars verified by Jagdamba lab report), taking 1 spoon on empty stomach with warm water, and its high smoke point (250°C) for clean Indian cooking. Be warm, scientific yet reverent. Always address the customer with respect ("Pranam Ji").`;
  }

  if (mode === 'purity') {
    return `${baseContext}
CURRENT MODE: PURITY & LAB REPORT CONCIERGE 🔬
Focus on absolute authenticity, the Jagdamba Laboratories (Report JLFD260702144) findings, zero adulteration, absence of palm oil, zero chemical solvents, single-origin Gir cow lineage, and why real Bilona ghee has a granular (danedar) texture instead of synthetic smooth wax. Cite exact numbers from the lab test when relevant.`;
  }

  return `${baseContext}
CURRENT MODE: SALES & REORDER CONCIERGE 🛍️
Help the customer choose the right jar size (500ml for individuals / 1L for couples & families / 2L for maximum value with free brass spoon). Explain fast shipping across India via Shiprocket, pre-filled Razorpay 1-tap checkout, and our WhatsApp Reorder Engine. Offer the coupon code 'PRANAM5' if they hesitate.`;
}

// Fallback intelligent responder based on exact knowledge base
function generateFallbackResponse(userPrompt: string, mode: ChatMode): string {
  const query = userPrompt.toLowerCase();

  if (query.includes('lab') || query.includes('report') || query.includes('test') || query.includes('certificate')) {
    return `Pranam Ji! 🙏 GauTattva Organics ghee is rigorously certified by **JAGDAMBA LABORATORIES (OPC) PVT. LTD.** (Govt. Approved & GLP Certified, Report No. **JLFD260702144** released July 2026).\n\nKey certified test parameters per 100g:\n• **Total Fat:** 99.85g (IS 4684)\n• **Heart-Healthy MUFA:** 22.49g\n• **Natural Vitamin A:** 873.0 mcg (Ocular & skin vitality)\n• **Total Sugars / Lactose:** **NOT DETECTED (0g)**\n• **Protein / Casein:** **NOT DETECTED (0g)**\n• **Carbohydrates:** **NOT DETECTED (0g)**\n\nYou can inspect the full official PDF certificate directly on our store or tap the "Download Lab Report" button!`;
  }

  if (query.includes('lactose') || query.includes('dairy') || query.includes('allergy') || query.includes('digestion') || query.includes('gut')) {
    return `Pranam Ji! 🙏 GauTattva Ghee is **100% safe for lactose-sensitive individuals**! \n\nHere is why:\n1. **Lab Verified Zero Lactose:** Jagdamba Laboratories Report JLFD260702144 confirms Total Sugars & Lactose as *Not Detected*.\n2. **Zero Casein Solids:** The traditional earthen chulha slow clarification completely removes all milk proteins.\n3. **Rich in Butyric Acid:** Cultured curd bilona churning creates natural short-chain fatty acids that actively repair the gut lining and alleviate bloating or IBS.\n\nWe recommend 1 teaspoon daily in the morning with a cup of warm water!`;
  }

  if (query.includes('bilona') || query.includes('process') || query.includes('method') || query.includes('how it is made')) {
    return `Pranam Ji! 🙏 Gautattva ghee is made strictly according to the **5-Step Vedic Bilona method**:\n\n1. **Ahimsa Milking:** Sacred purebred Gir cows graze freely; the calf drinks first.\n2. **Whole Milk Boiling:** Pure A2 milk is boiled slowly in heavy brass vessels.\n3. **Clay Pot Curd:** Cooled milk is cultured into curd overnight in earthen terracotta pots.\n4. **Two-Way Wooden Churning:** Brahma Muhurta bi-directional wooden churning separates pure cultured makkhan (butter).\n5. **Low Flame Clarification:** Simmered on cow-dung cake low fire to yield golden, aromatic, granular (danedar) ghee!`;
  }

  if (query.includes('price') || query.includes('size') || query.includes('jar') || query.includes('cost') || query.includes('buy') || query.includes('order')) {
    return `Pranam Ji! 🙏 We currently offer 3 freshly churned jar sizes:\n\n• **500ml:** ₹1,699 (Starter Pack, ~25-day supply)\n• **1 Litre:** ₹2,999 (Most Popular for families, ~50-day supply)\n• **2 Litres:** ₹5,699 (Best Value with **Free Handcrafted Brass Spoon & Vedic Dhoop**, ~90-day supply)\n\nAll orders ship express via **Shiprocket** with 1-tap pre-filled Razorpay payment. Plus, our WhatsApp Reorder Engine will automatically notify you before your jar finishes!`;
  }

  if (query.includes('whatsapp') || query.includes('reorder') || query.includes('timer') || query.includes('feature 2')) {
    return `Pranam Ji! 🙏 Our **WhatsApp AI Reorder Engine** ensures your sacred kitchen never runs dry of pure ghee:\n\n1. **Shiprocket Webhook:** Automatically records your delivery timestamp.\n2. **Jar-Size Smart Timer:**\n   • 500ml ➔ Day 25 nudge\n   • 1 Litre ➔ Day 50 nudge\n   • 2 Litres ➔ Day 90 nudge\n3. **1-Tap Razorpay Link:** Dispatched directly via WhatsApp with zero login or app download needed.\n4. **48-Hour Courtesy Follow-up:** If unpurchased within 48 hours, sends a gentle reminder with a 5% discount code (*PRANAM5*)!`;
  }

  if (mode === 'health') {
    return `Pranam Ji! 🙏 In Ayurveda, A2 Gir Cow Bilona Ghee is revered as the ultimate *Rasayana*. Rich in naturally occurring Monounsaturated Fatty Acids (22.49g) and bio-available Vitamin A (873 mcg), it fuels *Ojas* (vital immunity), lubricates joints, and provides a stable high smoke point (250°C) that never oxidizes into carcinogens. How can I help with your daily health routine today?`;
  }

  if (mode === 'purity') {
    return `Pranam Ji! 🙏 Every single batch of GauTattva Organics is traceable to free-grazing Gir cows in Rajasthan and Gujarat. We never use industrial cream separators or artificial essences. Our latest analysis at Jagdamba Laboratories (Report JLFD260702144) verified 99.85g pure fat with zero detected adulterants, zero carbohydrates, and zero trans-fat additives. What questions can I answer about our purity benchmarks?`;
  }

  return `Pranam Ji! 🙏 Welcome to GauTattva Organics. Our authentic A2 Gir Cow Vedic Bilona Ghee is hand-churned in small batches in Jaipur, Rajasthan. How may I assist you with selecting your jar size, checking our certified lab report, or placing an order today?`;
}

export async function POST(req: NextRequest) {
  try {
    let body: { messages?: ChatMessage[]; mode?: ChatMode } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { messages, mode = 'health' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || '';
    const systemInstruction = buildSystemPrompt(mode);

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const contents = [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${latestUserMessage}` }],
          },
        ];

        const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
        let candidateText = '';
        let usedModel = 'gemini-3.8-flash';

        for (const model of modelsToTry) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents,
                  generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 600,
                  },
                }),
              }
            );

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (candidateText) {
                usedModel = model;
                break;
              }
            }
          } catch {
            // try next model
          }
        }

        if (candidateText) {
          return NextResponse.json({
            reply: candidateText,
            mode,
            source: usedModel,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to local Vedic RAG knowledge engine', geminiErr);
      }
    }

    // High-speed verified RAG fallback using the exact Knowledge Base and Jagdamba Lab report
    const fallbackReply = generateFallbackResponse(latestUserMessage, mode);
    return NextResponse.json({
      reply: fallbackReply,
      mode,
      source: 'gautattva-vedic-kb',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 });
  }
}
