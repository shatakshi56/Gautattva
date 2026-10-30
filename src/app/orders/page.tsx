'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Star,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Package,
  ShoppingBag,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Phone,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { FlipkartInvoiceModal } from '@/components/FlipkartInvoiceModal';
import { FlipkartOrderTrackingModal } from '@/components/FlipkartOrderTrackingModal';
import { Order, JarSize } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';

const FALLBACK_ORDERS: Order[] = [
  {
    id: 'fk-order-gau-7821',
    order_number: 'GAU-7821',
    customer_name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@gmail.com',
    address: 'Flat 402, Lotus Greens, Sector 78',
    city: 'Noida',
    pincode: '201301',
    jar_size: '500ml',
    quantity: 1,
    amount: 1699,
    status: 'delivered',
    delivered_at: '2026-10-02T16:30:00.000Z',
    tracking_awb: 'DELH78129381',
    courier: 'Delhivery Surface',
    payment_status: 'paid',
    wa_sent: true,
    reminder_sent: true,
    created_at: '2026-09-29T06:11:00.000Z',
    updated_at: '2026-10-02T16:30:00.000Z',
  },
  {
    id: 'fk-order-gau-7822',
    order_number: 'GAU-7822',
    customer_name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@gmail.com',
    address: 'Flat 402, Lotus Greens, Sector 78',
    city: 'Noida',
    pincode: '201301',
    jar_size: '1000ml',
    quantity: 1,
    amount: 2999,
    status: 'delivered',
    delivered_at: '2026-09-07T14:15:00.000Z',
    tracking_awb: 'DELH65431890',
    courier: 'Delhivery Surface',
    payment_status: 'paid',
    wa_sent: true,
    reminder_sent: true,
    created_at: '2026-09-03T08:30:00.000Z',
    updated_at: '2026-09-07T14:15:00.000Z',
  },
  {
    id: 'fk-order-gau-7823',
    order_number: 'GAU-7823',
    customer_name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@gmail.com',
    address: 'Flat 402, Lotus Greens, Sector 78',
    city: 'Noida',
    pincode: '201301',
    jar_size: '2000ml',
    quantity: 1,
    amount: 5699,
    status: 'delivered',
    delivered_at: '2026-07-29T18:00:00.000Z',
    tracking_awb: 'DELH43218765',
    courier: 'Delhivery Express',
    payment_status: 'paid',
    wa_sent: true,
    reminder_sent: true,
    created_at: '2026-07-25T10:15:00.000Z',
    updated_at: '2026-07-29T18:00:00.000Z',
  },
  {
    id: 'fk-order-1',
    order_number: 'GAU-9182',
    customer_name: 'Rajesh Meena',
    phone: '+91 90570 00446',
    email: 'rajesh.meena@gmail.com',
    address: 'Plot 12, Malviya Nagar',
    city: 'Jaipur',
    pincode: '302017',
    jar_size: '1000ml',
    quantity: 1,
    amount: 2632,
    status: 'shipped',
    tracking_awb: 'DELH90214829',
    courier: 'Delhivery Surface',
    payment_status: 'paid',
    wa_sent: true,
    reminder_sent: false,
    created_at: '2026-10-25T10:00:00.000Z',
    updated_at: '2026-10-26T14:00:00.000Z',
  },
  {
    id: 'fk-order-2',
    order_number: 'GAU-8451',
    customer_name: 'Anita Verma',
    phone: '+91 98290 12345',
    email: 'anita.verma@outlook.com',
    address: 'C-45, Ashok Nagar',
    city: 'Jaipur',
    pincode: '302001',
    jar_size: '500ml',
    quantity: 1,
    amount: 1432,
    status: 'delivered',
    delivered_at: '2026-10-23T11:00:00.000Z',
    tracking_awb: 'DELH65431890',
    courier: 'Delhivery Express Air',
    payment_status: 'paid',
    wa_sent: true,
    reminder_sent: true,
    created_at: '2026-10-20T09:00:00.000Z',
    updated_at: '2026-10-23T11:00:00.000Z',
  },
];

export default function GauTattvaOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(FALLBACK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('all');
  const [phoneLookup, setPhoneLookup] = useState('');

  // Selected modals
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Cart & checkout for Buy Again
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{ jarSize: JarSize; quantity: number }>>([
    { jarSize: '1000ml', quantity: 1 },
  ]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedJar, setSelectedJar] = useState<JarSize>('1000ml');
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);

  // Rating modal preview
  const [ratedOrderId, setRatedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          // Combine API orders with fallback orders (ensuring unique IDs)
          const apiOrderIds = new Set(data.orders.map((o: Order) => o.id));
          const merged = [...data.orders, ...FALLBACK_ORDERS.filter((o) => !apiOrderIds.has(o.id))];
          setOrders(merged);
        }
      }
    } catch {
      // fallback already initialized
    }
  };

  const handleToggleStatusFilter = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleBuyAgain = (jar: JarSize) => {
    setSelectedJar(jar);
    setCheckoutQuantity(1);
    setCartItems((prev) => {
      const match = prev.find((i) => i.jarSize === jar);
      if (match) {
        return prev.map((i) => (i.jarSize === jar ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { jarSize: jar, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNo = o.order_number?.toLowerCase().includes(q);
      const matchName = o.customer_name?.toLowerCase().includes(q);
      const matchJar = o.jar_size?.toLowerCase().includes(q);
      const matchPhone = o.phone?.toLowerCase().includes(q);
      if (!matchNo && !matchName && !matchJar && !matchPhone) return false;
    }

    if (selectedStatuses.length > 0) {
      if (selectedStatuses.includes('on_the_way') && (o.status === 'shipped' || o.status === 'placed')) {
        // match
      } else if (selectedStatuses.includes('delivered') && o.status === 'delivered') {
        // match
      } else if (selectedStatuses.includes('cancelled') && o.status === 'cancelled') {
        // match
      } else {
        return false;
      }
    }

    if (phoneLookup.trim()) {
      const cleanLookup = phoneLookup.replace(/\D/g, '');
      const cleanPhone = (o.phone || '').replace(/\D/g, '');
      if (!cleanPhone.includes(cleanLookup)) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-sans antialiased text-stone-900">
      
      {/* GauTattva Branded Top Header */}
      <header className="bg-[#1F3A22] text-white shadow-md sticky top-0 z-40 border-b border-[#C9882B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#C9882B] shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/gautattva-logo.jpg"
                alt="GauTattva Organics"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                GauTattva™
              </span>
              <span className="text-[10px] text-[#C9882B] font-bold uppercase tracking-widest flex items-center gap-1">
                <span>ORGANICS</span>
                <span className="text-[#FFE500]">&bull;</span>
                <span className="text-[#E7D0A8] font-medium lowercase">orders &amp; tracking</span>
              </span>
            </div>
          </Link>

          {/* Center Order Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders by Order ID, phone, or jar size..."
              className="w-full bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-xl border border-[#E7D0A8] focus:border-[#C9882B] focus:ring-2 focus:ring-[#C9882B]/30 focus:outline-hidden shadow-inner"
            />
            <button
              onClick={() => {}}
              className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-[#C9882B] hover:text-[#996417] cursor-pointer"
              aria-label="Search Orders"
            >
              <Search className="w-4 h-4 font-bold" />
            </button>
          </div>

          {/* Right Header Navigation Items */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-[#E7D0A8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-[#142817] hover:bg-[#0f1d11] text-white border border-[#C9882B]/40 px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#FFE500]" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-[#C9882B] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-stone-500 mb-4 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#C9882B] transition-colors">
            GauTattva Home
          </Link>
          <span>›</span>
          <span className="text-stone-600">My Account</span>
          <span>›</span>
          <span className="font-serif font-bold text-[#1F3A22]">Order History &amp; Live Tracking</span>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar: Filters */}
          <aside className="lg:col-span-3 bg-white rounded-2xl shadow-xs border border-[#E7D0A8] p-5 text-xs text-stone-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7D0A8]/60">
              <h2 className="font-serif font-bold text-base text-[#1F3A22] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#C9882B]" />
                <span>Filter Orders</span>
              </h2>
              {(selectedStatuses.length > 0 || phoneLookup.trim() || searchQuery.trim()) && (
                <button
                  onClick={() => {
                    setSelectedStatuses([]);
                    setPhoneLookup('');
                    setSearchQuery('');
                  }}
                  className="text-[#C9882B] hover:text-[#996417] font-bold text-[11px] uppercase cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* ORDER STATUS Filter Group */}
            <div>
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F3A22] mb-3">
                Order Status
              </h3>
              <div className="space-y-2.5">
                {[
                  { id: 'on_the_way', label: 'On the way (Dispatched)' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'cancelled', label: 'Cancelled' },
                  { id: 'returned', label: 'Returned' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-[#C9882B] select-none text-stone-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(item.id)}
                      onChange={() => handleToggleStatusFilter(item.id)}
                      className="w-4 h-4 rounded-md text-[#1F3A22] focus:ring-[#C9882B] accent-[#1F3A22]"
                    />
                    <span className="text-xs font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ORDER TIME Filter Group */}
            <div className="pt-4 border-t border-[#E7D0A8]/60">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F3A22] mb-3">
                Order Time
              </h3>
              <div className="space-y-2.5">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: '30days', label: 'Last 30 days' },
                  { id: '2026', label: 'Year 2026' },
                  { id: '2025', label: 'Year 2025' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-[#C9882B] select-none text-stone-700"
                  >
                    <input
                      type="radio"
                      name="orderTime"
                      checked={selectedTimeFilter === item.id}
                      onChange={() => setSelectedTimeFilter(item.id)}
                      className="w-4 h-4 text-[#1F3A22] focus:ring-[#C9882B] accent-[#1F3A22]"
                    />
                    <span className="text-xs font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Phone Lookup Filter */}
            <div className="pt-4 border-t border-[#E7D0A8]/60">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F3A22] mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C9882B]" />
                <span>Search by Mobile No.</span>
              </h3>
              <input
                type="text"
                value={phoneLookup}
                onChange={(e) => setPhoneLookup(e.target.value)}
                placeholder="e.g. 98765 43210"
                className="w-full p-2.5 border border-[#E7D0A8] rounded-xl text-xs focus:ring-2 focus:ring-[#C9882B]/40 focus:border-[#C9882B] focus:outline-hidden"
              />
            </div>

            {/* Verified Purity Badge */}
            <div className="pt-4 border-t border-[#E7D0A8]/60 bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E7D0A8] space-y-1 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5 font-bold text-[#1F3A22]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>NABL Lab Test Passed</span>
              </div>
              <p>Every delivered jar includes authentic batch test report JLFD260702144.</p>
            </div>

          </aside>

          {/* Right Column: Orders List */}
          <div className="lg:col-span-9 space-y-4">
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E7D0A8] shadow-xs">
                <RefreshCw className="w-8 h-8 text-[#C9882B] animate-spin mx-auto mb-3" />
                <p className="font-bold text-[#1F3A22] text-sm font-serif">Loading your GauTattva orders...</p>
                <p className="text-xs text-stone-400 mt-1">Fetching live shipment data from Jaipur gaushala hub</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E7D0A8] shadow-xs">
                <Package className="w-16 h-16 text-[#C9882B]/40 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#1F3A22]">No orders found</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Looks like you don&apos;t have any orders matching the selected filters.
                </p>
                <Link
                  href="/products/a2-gir-cow-bilona-ghee"
                  className="mt-5 inline-block bg-[#1F3A22] hover:bg-[#142817] text-white text-xs font-bold py-3 px-7 rounded-full transition-all shadow-md"
                >
                  Shop GauTattva Pure A2 Ghee
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isDelivered = order.status === 'delivered';
                const isShipped = order.status === 'shipped';

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedTrackingOrder(order)}
                    className="bg-white rounded-2xl border border-[#E7D0A8] shadow-xs hover:shadow-lg hover:border-[#C9882B] transition-all p-5 sm:p-6 cursor-pointer group"
                    title="Click anywhere to view order details & live tracking"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      
                      {/* Product Thumbnail & Details (Col 1-5) */}
                      <div className="md:col-span-5 flex items-start gap-4">
                        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-[#FAF6EE] border border-[#E7D0A8] shrink-0">
                          <Image
                            src="/hero-ghee-jar.jpg"
                            alt="GauTattva A2 Ghee"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="font-serif font-bold text-sm sm:text-base text-[#1F3A22] group-hover:text-[#C9882B] transition-colors leading-snug line-clamp-2 block">
                            GauTattva Organics A2 Gir Cow Vedic Bilona Ghee ({order.jar_size})
                          </span>
                          
                          <p className="text-[11px] text-stone-500">
                            Packaging: Eco-Friendly Recyclable Glass Jar
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Seller: <span className="font-semibold text-stone-800">DEALKARTS</span> (Jaipur)
                          </p>
                          <span className="text-[10px] text-[#8B5A14] font-mono bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#E7D0A8]/60 inline-block">
                            Order #{order.order_number}
                          </span>
                        </div>
                      </div>

                      {/* Price (Col 6-7) */}
                      <div className="md:col-span-2 text-left md:text-center">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#1F3A22] block">
                          ₹{order.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-stone-500 block font-medium">
                          Qty: {order.quantity}
                        </span>
                      </div>

                      {/* Delivery Status Indicator (Col 8-10) */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              isDelivered ? 'bg-emerald-600' : 'bg-[#C9882B] animate-pulse'
                            }`}
                          />
                          <span className="font-bold text-xs sm:text-sm text-[#1F3A22]">
                            {isDelivered
                              ? `Delivered on ${
                                  order.delivered_at
                                    ? new Date(order.delivered_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                      })
                                    : 'Oct 2'
                                }`
                              : isShipped
                              ? 'Arriving Tomorrow'
                              : 'Order Placed & Churning'}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-500 mt-1 ml-4.5">
                          {isDelivered
                            ? 'Your item has been delivered safely'
                            : isShipped
                            ? `Shipped via ${order.courier || 'Delhivery'}`
                            : 'Fresh batch churning in progress'}
                        </p>
                      </div>

                      {/* Actions: Rate & Review, Invoice, Track (Col 11-12) */}
                      <div className="md:col-span-2 flex flex-col items-start md:items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                        {/* Rate & Review link */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRatedOrderId(order.id);
                          }}
                          className="text-[#996417] hover:text-[#74490c] font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-[#C9882B] text-[#C9882B]" />
                          <span>Rate &amp; Review</span>
                        </button>

                        {/* Track Order Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrackingOrder(order);
                          }}
                          className="text-[#1F3A22] hover:text-[#C9882B] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#C9882B]" />
                          <span>Track Package</span>
                        </button>

                        {/* Download Official GST Tax Invoice Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoiceOrder(order);
                          }}
                          className="bg-[#FEF5E7] hover:bg-[#FAF6EE] text-[#996417] hover:text-[#74490c] text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7D0A8] shadow-2xs transition-colors cursor-pointer mt-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#C9882B]" />
                          <span>Tax Invoice</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </main>

      {/* Rating Preview Modal */}
      {ratedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-[#E7D0A8] animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#FEF5E7] text-[#C9882B] flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1F3A22]">Rate GauTattva Vedic Ghee</h3>
            <p className="text-xs text-stone-500 mt-1">
              How did you like the aroma, Danedar texture, and taste of your jar?
            </p>
            <div className="flex justify-center gap-2 my-4 text-[#C9882B]">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    alert(`Thank you for rating 5 stars! GauTattva reveres your feedback.`);
                    setRatedOrderId(null);
                  }}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star className="w-6 h-6 fill-[#C9882B]" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setRatedOrderId(null)}
              className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* GauTattva Order Tracking & Journey Modal */}
      {selectedTrackingOrder && (
        <FlipkartOrderTrackingModal
          order={selectedTrackingOrder}
          isOpen={Boolean(selectedTrackingOrder)}
          onClose={() => setSelectedTrackingOrder(null)}
          onOpenInvoice={() => {
            setSelectedInvoiceOrder(selectedTrackingOrder);
          }}
          onBuyAgain={(jar) => handleBuyAgain(jar)}
        />
      )}

      {/* Authentic Legit GST Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <FlipkartInvoiceModal
          order={selectedInvoiceOrder}
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Cart Drawer & Checkout Modal for Buy Again */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(jar, delta) => {
          setCartItems((prev) =>
            prev
              .map((i) => (i.jarSize === jar ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
              .filter(Boolean)
          );
        }}
        onRemoveItem={(jar) => setCartItems((prev) => prev.filter((i) => i.jarSize !== jar))}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedJar={selectedJar}
        quantity={checkoutQuantity}
      />

      {/* Footer */}
      <Footer onOpenSimulator={() => {}} />
    </div>
  );
}
