export type JarSize = '500ml' | '1000ml' | '2000ml' | '5000ml';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  jar_size: JarSize;
  quantity: number;
  amount: number;
  status: 'placed' | 'shipped' | 'delivered' | 'reordered' | 'cancelled';
  shiprocket_order_id?: string;
  shiprocket_shipment_id?: string;
  tracking_awb?: string;
  courier?: string;
  delivered_at?: string; // ISO date
  reorder_due_date?: string; // ISO date
  wa_sent: boolean;
  wa_sent_at?: string;
  wa_message_id?: string;
  reminder_sent: boolean;
  reminder_sent_at?: string;
  discount_applied?: string;
  razorpay_link_id?: string;
  razorpay_link_url?: string;
  payment_status: 'pending' | 'paid' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface ReorderLog {
  id: string;
  order_id: string;
  phone: string;
  trigger_type: 'day_25_nudge' | 'day_50_nudge' | 'day_90_nudge' | 'day_180_nudge' | 'reminder_48hr_discount' | 'manual_simulator';
  channel: string;
  message_content: string;
  razorpay_link_url?: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  gupshup_response?: Record<string, unknown>;
  created_at: string;
}

export interface WhatsAppTemplatePayload {
  customerName: string;
  phone: string;
  jarSize: JarSize;
  price: number;
  razorpayUrl: string;
  discountCode?: string;
  daysPassed: number;
  isReminder?: boolean;
}

export interface CustomerReminder {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  channel: 'whatsapp' | 'email' | 'both';
  past_jar_size: JarSize;
  past_quantity: number;
  past_purchase_date?: string;
  next_jar_size: JarSize;
  next_quantity: number;
  remind_in_days: number;
  reminder_time_of_day: 'morning' | 'afternoon' | 'evening';
  scheduled_date: string;
  buy_link: string;
  message_preview: string;
  status: 'scheduled' | 'sent' | 'cancelled';
  created_at: string;
}

export interface Customer {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  total_orders: number;
  total_spent: number;
  is_loyal_customer: boolean;
  loyalty_discount_percent: number;
  city?: string;
  pincode?: string;
  created_at: string;
  last_order_at?: string;
}

export interface CartSession {
  id: string;
  session_id: string;
  phone?: string;
  customer_name?: string;
  jar_size: JarSize;
  quantity: number;
  cart_amount: number;
  status: 'active' | 'abandoned' | 'converted';
  wa_followup_sent: boolean;
  wa_followup_sent_at?: string;
  customer_feedback?: string;
  last_active_at: string;
  created_at: string;
}

export interface TrafficEvent {
  id: string;
  session_id: string;
  event_type: 'page_view' | 'add_to_cart' | 'open_checkout' | 'whatsapp_click' | string;
  page_url: string;
  referrer?: string;
  utm_source?: string;
  utm_campaign?: string;
  device?: 'mobile' | 'desktop' | string;
  city?: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  jar_size: JarSize;
  price: number;
  mrp: number;
  stock_quantity: number;
  is_in_stock: boolean;
  image_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'flat_amount';
  discount_value: number;
  min_order_value?: number;
  max_discount_cap?: number;
  for_loyal_customers_only: boolean;
  is_active: boolean;
  usage_count: number;
  max_usage_limit?: number;
  expires_at?: string;
  created_at: string;
}

export interface CustomerMessage {
  id: string;
  phone: string;
  customer_name?: string;
  sender_type: 'admin' | 'automated_bot' | 'customer';
  message_text: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  gupshup_message_id?: string;
  created_at: string;
}


