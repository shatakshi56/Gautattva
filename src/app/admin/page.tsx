'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Database,
  ExternalLink,
  ShoppingBag,
  Tag,
  Users,
  MessageCircle,
  BarChart3,
  Zap,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Send,
  Sparkles,
  Phone,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Product, Coupon, Customer, CartSession, CustomerMessage, Order } from '@/lib/types';
import { WhatsAppReorderSimulator } from '@/components/WhatsAppReorderSimulator';

type AdminTab = 'overview' | 'products' | 'coupons' | 'crm' | 'whatsapp' | 'simulator';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Live state
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<CartSession[]>([]);
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Modals & form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ price: 0, mrp: 0, stock_quantity: 0, is_in_stock: true });

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(15);
  const [couponType, setCouponType] = useState<'percentage' | 'flat_amount'>('percentage');
  const [couponMinOrder, setCouponMinOrder] = useState<number>(1000);
  const [couponLoyalOnly, setCouponLoyalOnly] = useState(false);

  // 1-on-1 WhatsApp Desk state
  const [waPhone, setWaPhone] = useState('+91 98765 43210');
  const [waName, setWaName] = useState('Priya Sharma');
  const [waText, setWaText] = useState(
    'Pranam Priya Ji 🙏\n\nWarm greetings from GauTattva™ Organics! We noticed you were exploring our Vedic A2 Gir Cow Bilona Ghee. Did you face any query or payment hurdle during checkout? We are right here to assist you!'
  );
  const [sendingWa, setSendingWa] = useState(false);
  const [waSuccessNotice, setWaSuccessNotice] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes, coupRes, abnRes, msgRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/coupons'),
        fetch('/api/cart/sync?action=abandoned&older_than_minutes=0'),
        fetch('/api/admin/messages'),
      ]);

      if (ordRes.ok) {
        const data = await ordRes.json();
        setOrders(data.orders || []);
        setCustomers(data.customers || []);
        setStats(data.stats || {});
      }
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (coupRes.ok) {
        const data = await coupRes.json();
        setCoupons(data.coupons || []);
      }
      if (abnRes.ok) {
        const data = await abnRes.json();
        setAbandonedCarts(data.carts || []);
      }
      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  // Product actions
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: editingProduct.id,
          price: productForm.price,
          mrp: productForm.mrp,
          stock_quantity: productForm.stock_quantity,
          is_in_stock: productForm.is_in_stock,
        }),
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: product.id,
          is_in_stock: !product.is_in_stock,
        }),
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Coupon actions
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          discount_type: couponType,
          discount_value: couponDiscount,
          min_order_value: couponMinOrder,
          for_loyal_customers_only: couponLoyalOnly,
        }),
      });
      if (res.ok) {
        setCouponCode('');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_active',
          id: coupon.id,
          is_active: !coupon.is_active,
        }),
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // WhatsApp send action
  const handleSendCustomWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waPhone || !waText) return;
    setSendingWa(true);
    setWaSuccessNotice(null);

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: waPhone,
          customer_name: waName,
          message_text: waText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWaSuccessNotice(`Message dispatched to ${waPhone} and logged in CRM!`);
        fetchAdminData();
        // Open direct WhatsApp chat in new window
        if (data.wa_direct_url) {
          window.open(data.wa_direct_url, '_blank');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingWa(false);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-[#1F3A22] text-[#FDFBF7] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-[#E7D0A8] hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Storefront</span>
            </Link>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C9882B]">
                <Image
                  src="/gautattva-logo.jpg"
                  alt="GauTattva Organics"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-[#FDFBF7] leading-none flex items-center gap-2">
                  <span>GauTattva Admin Console</span>
                  <span className="text-[10px] font-sans font-bold bg-[#C9882B] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Seller Pro
                  </span>
                </h1>
                <p className="text-[10px] text-[#C9882B] uppercase tracking-wider font-semibold">
                  A2 Gir Cow Vedic Bilona Ghee
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchAdminData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#E7D0A8] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="hidden lg:flex items-center gap-1.5 bg-[#2D5331] text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Database className="w-3.5 h-3.5" />
              <span>{stats?.storage === 'supabase_postgres' ? 'Supabase Postgres' : 'Live Dual DB'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="bg-[#142817] border-t border-white/10 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 text-xs">
            {[
              { id: 'overview', label: '📊 Overview & Live Metrics', badge: null },
              { id: 'products', label: '🛍️ Product Catalog (CRUD)', badge: products.length },
              { id: 'coupons', label: '🏷️ Discounts & Coupons', badge: coupons.length },
              { id: 'crm', label: '👥 Customers & Abandoned Carts', badge: abandonedCarts.length ? `${abandonedCarts.length} Drop-offs` : null },
              { id: 'whatsapp', label: '💬 1-on-1 WhatsApp Desk', badge: messages.length ? `${messages.length} Sent` : null },
              { id: 'simulator', label: '⚡ Reorder Automation Pipeline', badge: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`py-3 px-4 font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#C9882B] text-white bg-white/5 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] bg-[#C9882B] text-white px-1.5 py-0.2 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex-1 w-full">
        
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & PERFORMANCE METRICS                      */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-stone-500 block">Total Revenue</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1F3A22]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  ↑ 100% Prepaid (No COD Loss)
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-stone-500 block">Total Verified Orders</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1F3A22]">
                  {orders.length}
                </span>
                <span className="text-[11px] text-[#C9882B] font-semibold block">
                  {stats?.delivered_orders || 0} Delivered via Shiprocket
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-stone-500 block">Loyal Vedic Customers</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800">
                  {stats?.loyal_customers || customers.filter((c) => c.is_loyal_customer).length}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  Auto 20% Privilege Active
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-xs space-y-1">
                <span className="text-xs font-semibold text-amber-900 block">Active Cart Drop-offs</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-900">
                  {abandonedCarts.length}
                </span>
                <span className="text-[11px] text-amber-800 font-semibold block">
                  Ready for WhatsApp Nudge
                </span>
              </div>
            </div>

            {/* Live Traffic Telemetry & Orders Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Events breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-serif font-bold text-base text-[#1F3A22] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#C9882B]" />
                    <span>Live Traffic Telemetry</span>
                  </h3>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Real-Time
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-stone-50">
                    <span className="text-stone-600">Total Store Events Logged:</span>
                    <span className="font-bold text-stone-900">{stats?.traffic?.total_events || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-50">
                    <span className="text-stone-600">Unique Visitor Sessions:</span>
                    <span className="font-bold text-stone-900">{stats?.traffic?.unique_sessions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-50">
                    <span className="text-stone-600">Page Views:</span>
                    <span className="font-bold text-[#1F3A22]">{stats?.traffic?.page_views || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-50">
                    <span className="text-stone-600">Add to Cart Clicks:</span>
                    <span className="font-bold text-[#C9882B]">{stats?.traffic?.add_to_cart || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-600">Checkout Started:</span>
                    <span className="font-bold text-emerald-700">{stats?.traffic?.open_checkout || 0}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('whatsapp')}
                  className="w-full py-2.5 rounded-xl bg-[#1F3A22] hover:bg-[#142817] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Open 1-on-1 Customer WhatsApp Desk</span>
                </button>
              </div>

              {/* Recent Orders Table */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-serif font-bold text-base text-[#1F3A22]">
                    Recent Storefront Orders
                  </h3>
                  <span className="text-xs text-stone-500 font-medium">
                    Showing latest {orders.slice(0, 5).length} orders
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-stone-400 font-semibold border-b border-stone-100">
                        <th className="pb-2">Order #</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Pack</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 text-right">Delivery / Courier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-stone-50/80">
                          <td className="py-2.5 font-bold font-mono text-[#C9882B]">{o.order_number}</td>
                          <td className="py-2.5">
                            <span className="font-semibold text-stone-900 block">{o.customer_name}</span>
                            <span className="text-[10px] text-stone-500">{o.phone}</span>
                          </td>
                          <td className="py-2.5 font-medium">{o.quantity}x {o.jar_size}</td>
                          <td className="py-2.5 font-bold text-[#1F3A22]">₹{o.amount.toLocaleString('en-IN')}</td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                o.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-right text-stone-600 truncate max-w-[140px]">
                            {o.courier || 'Shiprocket'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCT CATALOG MANAGER (CRUD)                      */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-stone-200">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1F3A22]">
                  Product Catalog &amp; Pricing Manager
                </h2>
                <p className="text-xs text-stone-600">
                  Edit prices, MRPs, stock availability, and manage Vedic Ghee jar variants in real-time.
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-[#FEF5E7] text-[#C9882B] px-2 py-0.5 rounded-md border border-[#E7D0A8]">
                        {prod.jar_size}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleStock(prod)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          prod.is_in_stock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {prod.is_in_stock ? '● In Stock' : '✕ Out of Stock'}
                      </button>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#1F3A22]">
                      {prod.title}
                    </h4>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-bold text-[#1F3A22]">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-stone-400 line-through ml-2">
                          ₹{prod.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500">
                        {prod.stock_quantity} units
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setProductForm({
                        price: prod.price,
                        mrp: prod.mrp,
                        stock_quantity: prod.stock_quantity,
                        is_in_stock: prod.is_in_stock,
                      });
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-[#1F3A22] hover:text-white text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Price &amp; Stock</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Product Edit Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
                <div className="bg-[#FDFBF7] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#E7D0A8] space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <h3 className="font-serif font-bold text-lg text-[#1F3A22]">
                      Edit Product: {editingProduct.jar_size}
                    </h3>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="p-1 rounded-full text-stone-500 hover:bg-stone-200 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProduct} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Sale Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        MRP (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.mrp}
                        onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Stock Quantity Available
                      </label>
                      <input
                        type="number"
                        required
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({ ...productForm, stock_quantity: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="in_stock_chk"
                        checked={productForm.is_in_stock}
                        onChange={(e) => setProductForm({ ...productForm, is_in_stock: e.target.checked })}
                        className="w-4 h-4 text-[#C9882B] rounded"
                      />
                      <label htmlFor="in_stock_chk" className="font-semibold text-stone-800">
                        Mark Product as In-Stock on Storefront
                      </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-[#C9882B] hover:bg-[#B37521] text-white font-bold cursor-pointer"
                      >
                        Save Updates
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="py-3 px-4 rounded-xl bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DISCOUNTS & COUPON ENGINE                           */}
        {/* ========================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1F3A22]">
                  Discount Coupons &amp; Loyalty Rules
                </h2>
                <p className="text-xs text-stone-600">
                  Manage active coupon codes and customer privilege rules (including the 20% repeat buyer blessing).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Coupon Form */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#1F3A22] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C9882B]" />
                  <span>Create New Promo Coupon</span>
                </h3>

                <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. MAHASHIVRATRI"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-mono font-bold tracking-wider"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Type</label>
                      <select
                        value={couponType}
                        onChange={(e) => setCouponType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat_amount">Flat Amount (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Value</label>
                      <input
                        type="number"
                        required
                        value={couponDiscount}
                        onChange={(e) => setCouponDiscount(Number(e.target.value))}
                        placeholder="e.g. 15"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Minimum Order Value (₹)</label>
                    <input
                      type="number"
                      value={couponMinOrder}
                      onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                      placeholder="e.g. 1000"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="loyal_only"
                      checked={couponLoyalOnly}
                      onChange={(e) => setCouponLoyalOnly(e.target.checked)}
                      className="w-4 h-4 text-[#C9882B] rounded"
                    />
                    <label htmlFor="loyal_only" className="font-semibold text-stone-700">
                      Restricted to Loyal Customers Only
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#C9882B] hover:bg-[#B37521] text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Activate Coupon
                  </button>
                </form>
              </div>

              {/* Coupons List */}
              <div className="lg:col-span-2 space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-full bg-emerald-200 text-emerald-800">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="font-bold text-sm text-emerald-950 block">
                        Master Loyalty Rule Active: 20% Repeat Buyer Blessing
                      </span>
                      <span className="text-xs text-emerald-800">
                        Any customer with 1+ previous order receives 20% off automatically at checkout upon phone entry.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-900 bg-white px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                    Auto-Applied
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                  <h4 className="font-serif font-bold text-base text-[#1F3A22] mb-3">
                    Active Coupons in System
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-stone-400 font-semibold border-b border-stone-100">
                          <th className="pb-2">Code</th>
                          <th className="pb-2">Discount</th>
                          <th className="pb-2">Min Order</th>
                          <th className="pb-2">Target</th>
                          <th className="pb-2">Usage</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {coupons.map((c) => (
                          <tr key={c.id} className="hover:bg-stone-50/80">
                            <td className="py-3 font-mono font-bold text-[#C9882B] text-sm">{c.code}</td>
                            <td className="py-3 font-bold text-[#1F3A22]">
                              {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                            </td>
                            <td className="py-3 text-stone-600">₹{c.min_order_value || 0}</td>
                            <td className="py-3">
                              {c.for_loyal_customers_only ? (
                                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  Loyal Only
                                </span>
                              ) : (
                                <span className="text-stone-500">All Customers</span>
                              )}
                            </td>
                            <td className="py-3 font-medium text-stone-700">{c.usage_count} times</td>
                            <td className="py-3">
                              <button
                                onClick={() => handleToggleCoupon(c)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                                  c.is_active
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-200 text-stone-600'
                                }`}
                              >
                                {c.is_active ? 'Active' : 'Paused'}
                              </button>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteCoupon(c.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CUSTOMER CRM & ABANDONED CARTS                      */}
        {/* ========================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Abandoned Carts Section */}
            <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Real-Time Abandoned Carts (Phone Captured)</span>
                  </h3>
                  <p className="text-xs text-amber-900 mt-0.5">
                    Visitors who entered their phone number during checkout but dropped off before completing payment.
                  </p>
                </div>
                <span className="text-xs font-bold bg-amber-200/80 text-amber-950 px-3 py-1 rounded-full">
                  {abandonedCarts.length} Abandoned Sessions
                </span>
              </div>

              {abandonedCarts.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-xl border border-amber-200">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-stone-400 font-semibold border-b border-stone-100 bg-stone-50">
                        <th className="p-3">Customer Phone</th>
                        <th className="p-3">Item Dropped</th>
                        <th className="p-3">Cart Value</th>
                        <th className="p-3">Drop-off Time</th>
                        <th className="p-3 text-right">1-Tap Recovery</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {abandonedCarts.map((cart) => (
                        <tr key={cart.id} className="hover:bg-amber-50/40">
                          <td className="p-3 font-bold font-mono text-[#1F3A22]">
                            {cart.phone || 'Phone Pending'}
                          </td>
                          <td className="p-3 font-semibold text-stone-800">
                            {cart.quantity}x {cart.jar_size}
                          </td>
                          <td className="p-3 font-bold text-[#C9882B]">
                            ₹{cart.cart_amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-stone-500">
                            {new Date(cart.last_active_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setWaPhone(cart.phone || '');
                                setWaName(cart.customer_name || 'Customer');
                                setWaText(
                                  `Pranam ${cart.customer_name || 'Ji'} 🙏\n\nWarm greetings from GauTattva™ Organics! We noticed you left ${cart.quantity}x A2 Gir Cow Vedic Bilona Ghee (${cart.jar_size}) in your cart. Kya aapko checkout mein koi pareshani aayi? Agar koi doubt ya prashna ho toh yahan direct reply karein, ya 5% special Vedic blessing ke sath apna order complete karein!`
                                );
                                setActiveTab('whatsapp');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#C9882B] hover:bg-[#B37521] text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Nudge on WhatsApp</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl text-center text-xs text-stone-500">
                  No abandoned carts currently. All shopping sessions completed or converted!
                </div>
              )}
            </div>

            {/* All Customers CRM Table */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif font-bold text-base text-[#1F3A22] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C9882B]" />
                  <span>Customer Lifetime Directory ({customers.length})</span>
                </h3>
                <span className="text-xs text-emerald-800 font-semibold">
                  {customers.filter((c) => c.is_loyal_customer).length} Repeat Loyal Members
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-stone-400 font-semibold border-b border-stone-100">
                      <th className="pb-2.5">Customer Name</th>
                      <th className="pb-2.5">Phone Number</th>
                      <th className="pb-2.5">Total Orders</th>
                      <th className="pb-2.5">Lifetime Spent</th>
                      <th className="pb-2.5">Loyalty Privilege</th>
                      <th className="pb-2.5">Location</th>
                      <th className="pb-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-stone-50/80">
                        <td className="py-3 font-bold text-stone-900">{c.name || 'Vedic Customer'}</td>
                        <td className="py-3 font-mono text-stone-700">{c.phone}</td>
                        <td className="py-3 font-bold text-[#1F3A22]">{c.total_orders} Orders</td>
                        <td className="py-3 font-bold text-[#C9882B]">₹{c.total_spent.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          {c.is_loyal_customer ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              <span>20% Loyal Member</span>
                            </span>
                          ) : (
                            <span className="text-stone-400">First Time</span>
                          )}
                        </td>
                        <td className="py-3 text-stone-500">{c.city || 'Jaipur'}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setWaPhone(c.phone);
                              setWaName(c.name || 'Valued Customer');
                              setWaText(
                                `Pranam ${c.name || 'Ji'} 🙏\n\nWarm greetings from GauTattva™ Organics! We are following up regarding your daily wellness ritual with our pure A2 Gir Cow Vedic Bilona Ghee. Please let us know if you need fresh morning batch ghee dispatched to your doorstep!`
                              );
                              setActiveTab('whatsapp');
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: 1-ON-1 CUSTOM WHATSAPP DESK                         */}
        {/* ========================================================= */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1F3A22]">
                  1-on-1 Official WhatsApp Customer Desk
                </h2>
                <p className="text-xs text-stone-600">
                  Send personalized WhatsApp messages, follow up on abandoned carts, and track outbound conversations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message Composer */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                {waSuccessNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{waSuccessNotice}</span>
                  </div>
                )}

                {/* Quick Templates */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Quick Preset Templates:
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setWaText(
                          `Pranam ${waName || 'Ji'} 🙏\n\nWarm greetings from GauTattva™ Organics! We noticed you were looking at our A2 Gir Cow Vedic Bilona Ghee. Did you encounter any issue while checking out? Direct reply karein if you have any questions, or we can reserve your fresh jar with a 5% Vedic courtesy token!`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 cursor-pointer font-medium"
                    >
                      🛒 Abandoned Cart Nudge
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setWaText(
                          `Pranam ${waName || 'Ji'} 🙏\n\nThank you for being a cherished part of our GauTattva Vedic Family. As a token of our reverence, we have activated an exclusive 20% privilege code (LOYAL20) on your mobile number for your next replenishment jar!`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 cursor-pointer font-medium"
                    >
                      ✨ VIP Customer 20% Token
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setWaText(
                          `Pranam ${waName || 'Ji'} 🙏\n\nWe wanted to ensure your pure A2 Gir Cow Bilona Ghee jar reached you safely. How was the aroma and texture of your first morning ritual with it? We would love your feedback!`
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 cursor-pointer font-medium"
                    >
                      🌿 Delivery &amp; Aroma Feedback
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSendCustomWhatsApp} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        required
                        value={waName}
                        onChange={(e) => setWaName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        WhatsApp Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={waPhone}
                        onChange={(e) => setWaPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Message Content (Delivered to Customer WhatsApp)
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={waText}
                      onChange={(e) => setWaText(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-stone-200 bg-white leading-relaxed font-sans text-xs focus:outline-hidden focus:border-[#C9882B]"
                    />
                    <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1">
                      <span>Delivered via Gupshup WhatsApp Business API</span>
                      <span>{waText.length} characters</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingWa}
                    className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sendingWa ? 'Dispatched...' : 'Send WhatsApp Message & Open Chat'}</span>
                  </button>
                </form>
              </div>

              {/* Message Audit Log */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-base text-[#1F3A22] pb-2 border-b border-stone-100">
                  Recent Outbound WhatsApp Log
                </h4>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {messages.length > 0 ? (
                    messages.map((m) => (
                      <div key={m.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-[#1F3A22]">{m.customer_name || 'Customer'}</span>
                          <span className="text-stone-400">
                            {new Date(m.created_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-700 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                          {m.message_text}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-stone-500 pt-1 border-t border-stone-200/60">
                          <span className="font-mono">{m.phone}</span>
                          <span className="text-emerald-700 font-semibold capitalize">✓ {m.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-stone-400">
                      No custom messages sent yet. Use the composer on the left to send your first message.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: AUTOMATION PIPELINE (REORDER SIMULATOR)              */}
        {/* ========================================================= */}
        {activeTab === 'simulator' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-full bg-[#1F3A22] text-[#EAB308]">⚡</span>
                <div>
                  <h3 className="font-semibold text-xs text-[#1F3A22]">
                    Automated Reorder Pipeline &amp; Customer Lifetime Value (LTV) Engine
                  </h3>
                  <p className="text-[11px] text-[#57534E]">
                    Simulate Shiprocket delivery webhooks, Vercel cron reorder triggers (25/50/90 days), and 48-hour payment reminder discounts.
                  </p>
                </div>
              </div>
            </div>

            <WhatsAppReorderSimulator />
          </div>
        )}

      </main>
    </div>
  );
}
