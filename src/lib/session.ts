'use client';

import { JarSize } from './types';

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'srv-session';
  let sid = localStorage.getItem('gautattva_sid');
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('gautattva_sid', sid);
  }
  return sid;
}

export async function trackClientEvent(
  eventType: 'page_view' | 'add_to_cart' | 'open_checkout' | 'whatsapp_click' | string,
  extra?: { utm_source?: string; utm_campaign?: string }
) {
  if (typeof window === 'undefined') return;
  try {
    const sid = getSessionId();
    const isMobile = window.innerWidth < 768;
    const urlParams = new URLSearchParams(window.location.search);

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sid,
        event_type: eventType,
        page_url: window.location.pathname + window.location.search,
        referrer: document.referrer || undefined,
        utm_source: extra?.utm_source || urlParams.get('utm_source') || undefined,
        utm_campaign: extra?.utm_campaign || urlParams.get('utm_campaign') || undefined,
        device: isMobile ? 'mobile' : 'desktop',
      }),
    });
  } catch {
    // Non-blocking telemetry
  }
}

export async function syncClientCart(data: {
  jar_size: JarSize;
  quantity: number;
  cart_amount: number;
  phone?: string;
  customer_name?: string;
  status?: 'active' | 'abandoned' | 'converted';
}) {
  if (typeof window === 'undefined') return;
  try {
    const sid = getSessionId();
    await fetch('/api/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sid,
        ...data,
      }),
    });
  } catch {
    // Non-blocking cart sync
  }
}
