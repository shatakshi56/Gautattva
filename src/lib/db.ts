import {
  Order,
  ReorderLog,
  JarSize,
  CustomerReminder,
  Customer,
  CartSession,
  TrafficEvent,
  Product,
  Coupon,
  CustomerMessage,
} from './types';
import { getSupabase, isSupabaseConfigured } from './supabase';

export function normalizePhone(p: string): string {
  const digits = p.replace(/[^0-9]/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

const jarDaysMap: Record<JarSize, number> = {
  '500ml': 25,
  '1000ml': 50,
  '2000ml': 90,
  '5000ml': 180,
};

const initialProducts: Product[] = [
  {
    id: 'prod-500ml',
    title: 'A2 Gir Cow Vedic Bilona Ghee',
    jar_size: '500ml',
    price: 1699,
    mrp: 1999,
    stock_quantity: 100,
    is_in_stock: true,
    image_url: '/gautattva-hero-jar.png',
    description: 'Sacred Starter Jar • Hand-churned bi-directional wooden bilona from grass-fed Gir cows.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-1000ml',
    title: 'A2 Gir Cow Vedic Bilona Ghee',
    jar_size: '1000ml',
    price: 2999,
    mrp: 3499,
    stock_quantity: 85,
    is_in_stock: true,
    image_url: '/gautattva-hero-jar.png',
    description: 'Family Wellness Pack (Most Loved) • Tested by Jagdamba Labs, 100% pure A2 Beta-Casein.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-2000ml',
    title: 'A2 Gir Cow Vedic Bilona Ghee',
    jar_size: '2000ml',
    price: 5699,
    mrp: 6999,
    stock_quantity: 40,
    is_in_stock: true,
    image_url: '/gautattva-hero-jar.png',
    description: 'Bi-Monthly Abhyanga & Puja Jar • Slow-cooked on traditional earthen clay chulha.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-5000ml',
    title: 'A2 Gir Cow Vedic Bilona Ghee',
    jar_size: '5000ml',
    price: 13499,
    mrp: 16999,
    stock_quantity: 15,
    is_in_stock: true,
    image_url: '/gautattva-hero-jar.png',
    description: 'Family Tin (Pure Golden Nectar) • Bulk blessing pack for holy rituals & long-term health.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const initialCoupons: Coupon[] = [
  {
    id: 'coup-001',
    code: 'LOYAL20',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_value: 1500,
    max_discount_cap: 3000,
    for_loyal_customers_only: true,
    is_active: true,
    usage_count: 24,
    created_at: new Date().toISOString(),
  },
  {
    id: 'coup-002',
    code: 'BILONA10',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_value: 1000,
    max_discount_cap: 1000,
    for_loyal_customers_only: false,
    is_active: true,
    usage_count: 67,
    created_at: new Date().toISOString(),
  },
  {
    id: 'coup-003',
    code: 'PRANAM5',
    discount_type: 'percentage',
    discount_value: 5,
    min_order_value: 0,
    for_loyal_customers_only: false,
    is_active: true,
    usage_count: 142,
    created_at: new Date().toISOString(),
  },
];

const initialCustomers: Customer[] = [
  {
    id: 'cust-001',
    phone: '+91 98765 43210',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    total_orders: 2,
    total_spent: 3398,
    is_loyal_customer: true,
    loyalty_discount_percent: 20,
    city: 'Noida',
    pincode: '201301',
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    last_order_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cust-002',
    phone: '+91 98234 56789',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@example.com',
    total_orders: 3,
    total_spent: 8997,
    is_loyal_customer: true,
    loyalty_discount_percent: 20,
    city: 'Pune',
    pincode: '411006',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    last_order_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cust-003',
    phone: '+91 97112 34567',
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@example.com',
    total_orders: 1,
    total_spent: 5699,
    is_loyal_customer: true,
    loyalty_discount_percent: 20,
    city: 'Kolkata',
    pincode: '700027',
    created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    last_order_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cust-004',
    phone: '+91 98450 12345',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    total_orders: 4,
    total_spent: 12496,
    is_loyal_customer: true,
    loyalty_discount_percent: 20,
    city: 'Bengaluru',
    pincode: '560038',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    last_order_at: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cust-005',
    phone: '+91 91234 56780',
    name: 'Sunita Patel',
    email: 'sunita.patel@example.com',
    total_orders: 1,
    total_spent: 1699,
    is_loyal_customer: true,
    loyalty_discount_percent: 20,
    city: 'Ahmedabad',
    pincode: '380015',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    last_order_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialOrders: Order[] = [
  {
    id: 'ord-001',
    order_number: 'GAU-7821',
    customer_name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    address: 'Flat 402, Lotus Greens, Sector 78',
    city: 'Noida',
    pincode: '201301',
    jar_size: '500ml',
    quantity: 1,
    amount: 1699,
    status: 'delivered',
    shiprocket_order_id: 'SR-9921',
    shiprocket_shipment_id: 'SHP-8812',
    tracking_awb: 'DELH78129381',
    courier: 'Delhivery Surface',
    delivered_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    reorder_due_date: new Date(Date.now()).toISOString(),
    wa_sent: false,
    reminder_sent: false,
    payment_status: 'pending',
    created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-002',
    order_number: 'GAU-7822',
    customer_name: 'Rajesh Verma',
    phone: '+91 98234 56789',
    email: 'rajesh.verma@example.com',
    address: '14, Silver Oak Estate, Kalyani Nagar',
    city: 'Pune',
    pincode: '411006',
    jar_size: '1000ml',
    quantity: 1,
    amount: 2999,
    status: 'delivered',
    shiprocket_order_id: 'SR-9922',
    shiprocket_shipment_id: 'SHP-8813',
    tracking_awb: 'BLUD44192019',
    courier: 'Blue Dart Air',
    delivered_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    reorder_due_date: new Date(Date.now()).toISOString(),
    wa_sent: false,
    reminder_sent: false,
    payment_status: 'pending',
    created_at: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-003',
    order_number: 'GAU-7823',
    customer_name: 'Dr. Ananya Sen',
    phone: '+91 97112 34567',
    email: 'ananya.sen@example.com',
    address: 'B-12, Alipore Park Road',
    city: 'Kolkata',
    pincode: '700027',
    jar_size: '2000ml',
    quantity: 1,
    amount: 5699,
    status: 'delivered',
    shiprocket_order_id: 'SR-9923',
    shiprocket_shipment_id: 'SHP-8814',
    tracking_awb: 'DTDC99120481',
    courier: 'DTDC Express',
    delivered_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    reorder_due_date: new Date(Date.now()).toISOString(),
    wa_sent: false,
    reminder_sent: false,
    payment_status: 'pending',
    created_at: new Date(Date.now() - 93 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-004',
    order_number: 'GAU-7824',
    customer_name: 'Vikram Malhotra',
    phone: '+91 98450 12345',
    email: 'vikram.m@example.com',
    address: '77, Indiranagar 100 Feet Road',
    city: 'Bengaluru',
    pincode: '560038',
    jar_size: '1000ml',
    quantity: 2,
    amount: 5998,
    status: 'delivered',
    shiprocket_order_id: 'SR-9924',
    shiprocket_shipment_id: 'SHP-8815',
    tracking_awb: 'DELH33190284',
    courier: 'Delhivery Air',
    delivered_at: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
    reorder_due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    wa_sent: true,
    wa_sent_at: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    wa_message_id: 'wa-msg-88192',
    reminder_sent: false,
    payment_status: 'pending',
    created_at: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-005',
    order_number: 'GAU-7825',
    customer_name: 'Sunita Patel',
    phone: '+91 91234 56780',
    email: 'sunita.patel@example.com',
    address: 'B-301, Satellite Towers',
    city: 'Ahmedabad',
    pincode: '380015',
    jar_size: '500ml',
    quantity: 1,
    amount: 1699,
    status: 'shipped',
    shiprocket_order_id: 'SR-9925',
    shiprocket_shipment_id: 'SHP-8816',
    tracking_awb: 'DELH99218201',
    courier: 'Delhivery Surface',
    wa_sent: false,
    reminder_sent: false,
    payment_status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class Database {
  private static instance: Database;
  private inMemoryOrders: Order[] = [...initialOrders];
  private inMemoryCustomers: Customer[] = [...initialCustomers];
  private inMemoryProducts: Product[] = [...initialProducts];
  private inMemoryCoupons: Coupon[] = [...initialCoupons];
  private inMemoryMessages: CustomerMessage[] = [];
  private inMemoryCarts: CartSession[] = [];
  private inMemoryTraffic: TrafficEvent[] = [];
  private inMemoryLogs: ReorderLog[] = [];
  private hasSeededSupabase = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public isUsingSupabase(): boolean {
    return isSupabaseConfigured();
  }

  private async ensureSupabaseSeed(supabase: ReturnType<typeof getSupabase>): Promise<void> {
    if (!supabase || this.hasSeededSupabase) return;
    try {
      const { count, error } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      if (!error && count === 0) {
        // Seed initial orders into Supabase
        await supabase.from('orders').insert(initialOrders);
      }

      try {
        const { count: custCount, error: custErr } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true });
        if (!custErr && custCount === 0) {
          await supabase.from('customers').insert(initialCustomers);
        }
      } catch {
        // Table might not exist yet if user hasn't run schema.sql
      }

      this.hasSeededSupabase = true;
    } catch {
      // Continue without crashing
    }
  }

  public async getAllOrders(): Promise<Order[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await this.ensureSupabaseSeed(supabase);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Order[];
        }
      } catch (err) {
        console.warn('Supabase query failed, using in-memory store:', err);
      }
    }
    return [...this.inMemoryOrders];
  }

  public async getOrderById(id: string): Promise<Order | undefined> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
        if (!error && data) return data as Order;
      } catch (err) {
        console.warn('Supabase getOrderById error:', err);
      }
    }
    return this.inMemoryOrders.find((o) => o.id === id);
  }

  public async getOrderByAwb(awb: string): Promise<Order | undefined> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`tracking_awb.ilike.${awb},shiprocket_order_id.ilike.${awb}`)
          .maybeSingle();
        if (!error && data) return data as Order;
      } catch (err) {
        console.warn('Supabase getOrderByAwb error:', err);
      }
    }
    return this.inMemoryOrders.find(
      (o) =>
        o.tracking_awb?.toLowerCase() === awb.toLowerCase() ||
        o.shiprocket_order_id?.toLowerCase() === awb.toLowerCase()
    );
  }

  public async createOrder(data: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Promise<Order> {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      order_number: `GAU-${num}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: inserted, error } = await supabase.from('orders').insert(newOrder).select().single();
        if (!error && inserted) {
          await this.upsertCustomerOnOrder(inserted as Order);
          return inserted as Order;
        }
      } catch (err) {
        console.warn('Supabase insert failed, storing in-memory:', err);
      }
    }

    this.inMemoryOrders.unshift(newOrder);
    await this.upsertCustomerOnOrder(newOrder);
    return newOrder;
  }

  public async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload = {
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const { data: updated, error } = await supabase
          .from('orders')
          .update(payload)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (!error && updated) {
          return updated as Order;
        }
      } catch (err) {
        console.warn('Supabase update failed, updating in-memory:', err);
      }
    }

    const index = this.inMemoryOrders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;

    this.inMemoryOrders[index] = {
      ...this.inMemoryOrders[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.inMemoryOrders[index];
  }

  public async markDelivered(orderId: string, deliveryTimestamp?: string): Promise<Order | undefined> {
    const order = await this.getOrderById(orderId);
    if (!order) return undefined;

    const deliveredAt = deliveryTimestamp || new Date().toISOString();
    const daysToAdd = jarDaysMap[order.jar_size] || 25;
    const reorderDueDate = new Date(
      new Date(deliveredAt).getTime() + daysToAdd * 24 * 60 * 60 * 1000
    ).toISOString();

    return this.updateOrder(orderId, {
      status: 'delivered',
      delivered_at: deliveredAt,
      reorder_due_date: reorderDueDate,
      wa_sent: false,
    });
  }

  public async getDueReorders(): Promise<Order[]> {
    const orders = await this.getAllOrders();
    const now = Date.now();
    return orders.filter((order) => {
      if (order.status !== 'delivered') return false;
      if (order.wa_sent) return false;
      if (!order.reorder_due_date) return false;
      return new Date(order.reorder_due_date).getTime() <= now;
    });
  }

  public async getDueReminders(): Promise<Order[]> {
    const orders = await this.getAllOrders();
    const now = Date.now();
    const fortyEightHoursMs = 48 * 60 * 60 * 1000;
    return orders.filter((order) => {
      if (!order.wa_sent || !order.wa_sent_at) return false;
      if (order.reminder_sent) return false;
      if (order.payment_status === 'paid' || order.status === 'reordered') return false;
      const sentTime = new Date(order.wa_sent_at).getTime();
      return now - sentTime >= fortyEightHoursMs;
    });
  }

  public async addReorderLog(log: Omit<ReorderLog, 'id' | 'created_at'>): Promise<ReorderLog> {
    const newLog: ReorderLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: inserted, error } = await supabase.from('reorder_logs').insert(newLog).select().single();
        if (!error && inserted) {
          return inserted as ReorderLog;
        }
      } catch (err) {
        console.warn('Supabase addReorderLog failed, saving in-memory:', err);
      }
    }

    this.inMemoryLogs.unshift(newLog);
    return newLog;
  }

  public async getReorderLogs(): Promise<ReorderLog[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reorder_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as ReorderLog[];
        }
      } catch (err) {
        console.warn('Supabase getReorderLogs failed:', err);
      }
    }
    return [...this.inMemoryLogs];
  }

  public async resetDemoData(): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('reorder_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('orders').insert(initialOrders);
        try {
          await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          await supabase.from('customers').insert(initialCustomers);
        } catch {}
      } catch (err) {
        console.warn('Supabase reset failed:', err);
      }
    }
    this.inMemoryOrders = [...initialOrders];
    this.inMemoryCustomers = [...initialCustomers];
    this.inMemoryCarts = [];
    this.inMemoryTraffic = [];
    this.inMemoryLogs = [];
  }

  private inMemoryReminders: CustomerReminder[] = [];

  public async createCustomerReminder(
    reminder: Omit<CustomerReminder, 'id' | 'created_at'>
  ): Promise<CustomerReminder> {
    const newReminder: CustomerReminder = {
      ...reminder,
      id: `rem-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
    };
    this.inMemoryReminders.unshift(newReminder);
    return newReminder;
  }

  public async getCustomerReminders(): Promise<CustomerReminder[]> {
    return [...this.inMemoryReminders];
  }

  // ==========================================
  // CUSTOMER & LOYALTY PROFILE ENGINE
  // ==========================================
  public async getAllCustomers(): Promise<Customer[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await this.ensureSupabaseSeed(supabase);
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('total_orders', { ascending: false });
        if (!error && data) return data as Customer[];
      } catch (err) {
        console.warn('Supabase getAllCustomers error, using in-memory:', err);
      }
    }
    return [...this.inMemoryCustomers];
  }

  public async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    const clean = normalizePhone(phone);
    if (!clean) return undefined;

    const supabase = getSupabase();
    if (supabase) {
      try {
        await this.ensureSupabaseSeed(supabase);
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .ilike('phone', `%${clean}%`)
          .maybeSingle();
        if (!error && data) return data as Customer;
      } catch (err) {
        console.warn('Supabase getCustomerByPhone error, falling back to memory:', err);
      }
    }

    return this.inMemoryCustomers.find((c) => normalizePhone(c.phone) === clean);
  }

  public async upsertCustomerOnOrder(order: Order): Promise<Customer> {
    const clean = normalizePhone(order.phone);
    const existing = await this.getCustomerByPhone(order.phone);

    const now = new Date().toISOString();
    const totalOrders = (existing?.total_orders || 0) + 1;
    const totalSpent = Number(existing?.total_spent || 0) + Number(order.amount);
    const isLoyal = totalOrders >= 1; // Repeat/loyal customer
    const discountPercent = 20;

    const customerPayload: Customer = {
      id: existing?.id || `cust-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      phone: order.phone,
      name: order.customer_name || existing?.name,
      email: order.email || existing?.email,
      total_orders: totalOrders,
      total_spent: totalSpent,
      is_loyal_customer: isLoyal,
      loyalty_discount_percent: discountPercent,
      city: order.city || existing?.city,
      pincode: order.pincode || existing?.pincode,
      created_at: existing?.created_at || now,
      last_order_at: now,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: upserted, error } = await supabase
          .from('customers')
          .upsert(customerPayload, { onConflict: 'phone' })
          .select()
          .single();
        if (!error && upserted) return upserted as Customer;
      } catch (err) {
        console.warn('Supabase customer upsert failed:', err);
      }
    }

    const idx = this.inMemoryCustomers.findIndex((c) => normalizePhone(c.phone) === clean);
    if (idx !== -1) {
      this.inMemoryCustomers[idx] = customerPayload;
    } else {
      this.inMemoryCustomers.unshift(customerPayload);
    }
    return customerPayload;
  }

  // ==========================================
  // CART SESSIONS & ABANDONED CART ENGINE
  // ==========================================
  public async syncCartSession(data: {
    session_id: string;
    phone?: string;
    customer_name?: string;
    jar_size: JarSize;
    quantity: number;
    cart_amount: number;
    status?: 'active' | 'abandoned' | 'converted';
  }): Promise<CartSession> {
    const now = new Date().toISOString();
    const existing = await this.getCartSession(data.session_id);

    const sessionPayload: CartSession = {
      id: existing?.id || `cart-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      session_id: data.session_id,
      phone: data.phone || existing?.phone,
      customer_name: data.customer_name || existing?.customer_name,
      jar_size: data.jar_size,
      quantity: data.quantity,
      cart_amount: data.cart_amount,
      status: data.status || existing?.status || 'active',
      wa_followup_sent: existing?.wa_followup_sent || false,
      wa_followup_sent_at: existing?.wa_followup_sent_at,
      customer_feedback: existing?.customer_feedback,
      last_active_at: now,
      created_at: existing?.created_at || now,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: upserted, error } = await supabase
          .from('cart_sessions')
          .upsert(sessionPayload, { onConflict: 'session_id' })
          .select()
          .single();
        if (!error && upserted) return upserted as CartSession;
      } catch (err) {
        console.warn('Supabase cart_sessions upsert failed:', err);
      }
    }

    const idx = this.inMemoryCarts.findIndex((c) => c.session_id === data.session_id);
    if (idx !== -1) {
      this.inMemoryCarts[idx] = sessionPayload;
    } else {
      this.inMemoryCarts.unshift(sessionPayload);
    }
    return sessionPayload;
  }

  public async getCartSession(sessionId: string): Promise<CartSession | undefined> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('cart_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle();
        if (!error && data) return data as CartSession;
      } catch (err) {
        console.warn('Supabase getCartSession error:', err);
      }
    }
    return this.inMemoryCarts.find((c) => c.session_id === sessionId);
  }

  public async getAbandonedCarts(olderThanMinutes: number = 30): Promise<CartSession[]> {
    const now = Date.now();
    const thresholdMs = olderThanMinutes * 60 * 1000;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const thresholdDate = new Date(now - thresholdMs).toISOString();
        const { data, error } = await supabase
          .from('cart_sessions')
          .select('*')
          .in('status', ['active', 'abandoned'])
          .not('phone', 'is', null)
          .eq('wa_followup_sent', false)
          .lte('last_active_at', thresholdDate);
        if (!error && data) return data as CartSession[];
      } catch (err) {
        console.warn('Supabase getAbandonedCarts error:', err);
      }
    }

    return this.inMemoryCarts.filter((c) => {
      if (c.status === 'converted') return false;
      if (!c.phone) return false;
      if (c.wa_followup_sent) return false;
      const lastActive = new Date(c.last_active_at).getTime();
      return now - lastActive >= thresholdMs;
    });
  }

  public async markCartFollowupSent(id: string, feedback?: string): Promise<CartSession | undefined> {
    const updates = {
      wa_followup_sent: true,
      wa_followup_sent_at: new Date().toISOString(),
      ...(feedback ? { customer_feedback: feedback } : {}),
      status: 'abandoned' as const,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('cart_sessions')
          .update(updates)
          .eq('id', id)
          .select()
          .maybeSingle();
        if (!error && data) return data as CartSession;
      } catch (err) {
        console.warn('Supabase markCartFollowupSent error:', err);
      }
    }

    const idx = this.inMemoryCarts.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.inMemoryCarts[idx] = { ...this.inMemoryCarts[idx], ...updates };
      return this.inMemoryCarts[idx];
    }
    return undefined;
  }

  public async convertCartSession(sessionId: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('cart_sessions')
          .update({ status: 'converted' })
          .eq('session_id', sessionId);
      } catch {}
    }
    const idx = this.inMemoryCarts.findIndex((c) => c.session_id === sessionId);
    if (idx !== -1) {
      this.inMemoryCarts[idx].status = 'converted';
    }
  }

  // ==========================================
  // TRAFFIC & ANALYTICS TELEMETRY
  // ==========================================
  public async logTrafficEvent(
    event: Omit<TrafficEvent, 'id' | 'created_at'>
  ): Promise<TrafficEvent> {
    const newEvent: TrafficEvent = {
      ...event,
      id: `trf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('traffic_events').insert(newEvent);
      } catch (err) {
        console.warn('Supabase traffic insert error:', err);
      }
    }

    this.inMemoryTraffic.unshift(newEvent);
    if (this.inMemoryTraffic.length > 500) {
      this.inMemoryTraffic.length = 500;
    }
    return newEvent;
  }

  public async getTrafficStats(): Promise<{
    total_events: number;
    unique_sessions: number;
    page_views: number;
    add_to_cart: number;
    open_checkout: number;
    whatsapp_clicks: number;
  }> {
    const events = this.inMemoryTraffic;
    const unique = new Set(events.map((e) => e.session_id)).size;
    return {
      total_events: events.length,
      unique_sessions: unique,
      page_views: events.filter((e) => e.event_type === 'page_view').length,
      add_to_cart: events.filter((e) => e.event_type === 'add_to_cart').length,
      open_checkout: events.filter((e) => e.event_type === 'open_checkout').length,
      whatsapp_clicks: events.filter((e) => e.event_type === 'whatsapp_click').length,
    };
  }

  // ==========================================
  // PRODUCT CATALOG (DYNAMIC CRUD)
  // ==========================================
  public async getAllProducts(): Promise<Product[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('price', { ascending: true });
        if (!error && data && data.length > 0) return data as Product[];
      } catch (err) {
        console.warn('Supabase getAllProducts error, falling back to memory:', err);
      }
    }
    return [...this.inMemoryProducts];
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const now = new Date().toISOString();
    const payload = { ...updates, updated_at: now };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', id)
          .select()
          .maybeSingle();
        if (!error && data) return data as Product;
      } catch (err) {
        console.warn('Supabase updateProduct error:', err);
      }
    }

    const idx = this.inMemoryProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.inMemoryProducts[idx] = { ...this.inMemoryProducts[idx], ...payload };
      return this.inMemoryProducts[idx];
    }
    return undefined;
  }

  public async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const now = new Date().toISOString();
    const newProd: Product = {
      ...product,
      id: `prod-${product.jar_size}`,
      created_at: now,
      updated_at: now,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').insert(newProd).select().single();
        if (!error && data) return data as Product;
      } catch (err) {
        console.warn('Supabase createProduct error:', err);
      }
    }

    this.inMemoryProducts.push(newProd);
    return newProd;
  }

  // ==========================================
  // COUPONS & DISCOUNTS ENGINE
  // ==========================================
  public async getAllCoupons(): Promise<Coupon[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Coupon[];
      } catch (err) {
        console.warn('Supabase getAllCoupons error:', err);
      }
    }
    return [...this.inMemoryCoupons];
  }

  public async createCoupon(coupon: Omit<Coupon, 'id' | 'created_at' | 'usage_count'>): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      usage_count: 0,
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('coupons').insert(newCoupon).select().single();
        if (!error && data) return data as Coupon;
      } catch (err) {
        console.warn('Supabase createCoupon error:', err);
      }
    }

    this.inMemoryCoupons.unshift(newCoupon);
    return newCoupon;
  }

  public async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon | undefined> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('coupons').update(updates).eq('id', id).select().maybeSingle();
        if (!error && data) return data as Coupon;
      } catch (err) {
        console.warn('Supabase updateCoupon error:', err);
      }
    }

    const idx = this.inMemoryCoupons.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.inMemoryCoupons[idx] = { ...this.inMemoryCoupons[idx], ...updates };
      return this.inMemoryCoupons[idx];
    }
    return undefined;
  }

  public async deleteCoupon(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('coupons').delete().eq('id', id);
      } catch {}
    }
    const prevLen = this.inMemoryCoupons.length;
    this.inMemoryCoupons = this.inMemoryCoupons.filter((c) => c.id !== id);
    return this.inMemoryCoupons.length < prevLen;
  }

  // ==========================================
  // CUSTOMER MESSAGES (1-ON-1 WHATSAPP DESK)
  // ==========================================
  public async getAllCustomerMessages(): Promise<CustomerMessage[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('customer_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as CustomerMessage[];
      } catch (err) {
        console.warn('Supabase getAllCustomerMessages error:', err);
      }
    }
    return [...this.inMemoryMessages];
  }

  public async logCustomerMessage(
    msg: Omit<CustomerMessage, 'id' | 'created_at'>
  ): Promise<CustomerMessage> {
    const newMsg: CustomerMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('customer_messages').insert(newMsg).select().single();
        if (!error && data) return data as CustomerMessage;
      } catch (err) {
        console.warn('Supabase logCustomerMessage error:', err);
      }
    }

    this.inMemoryMessages.unshift(newMsg);
    return newMsg;
  }
}

export const db = Database.getInstance();
