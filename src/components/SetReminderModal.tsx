'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Calendar,
  Clock,
  Smartphone,
  Mail,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Zap,
  AlertCircle,
  Truck,
  RotateCcw,
  Database,
  Search,
  User,
  PackageCheck,
  RefreshCw,
} from 'lucide-react';
import { JarSize, Order, CustomerReminder } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';

interface SetReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialJar?: JarSize;
  initialCustomerName?: string;
  initialPhone?: string;
  initialEmail?: string;
}

const jarDaysDefault: Record<JarSize, number> = {
  '500ml': 25,
  '1000ml': 50,
  '2000ml': 90,
  '5000ml': 180,
};

export const SetReminderModal: React.FC<SetReminderModalProps> = ({
  isOpen,
  onClose,
  initialJar = '1000ml',
  initialCustomerName = '',
  initialPhone = '',
  initialEmail = '',
}) => {
  // Database orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Next recommendation state
  const [nextJar, setNextJar] = useState<JarSize>('2000ml');
  const [nextQty, setNextQty] = useState<number>(1);

  // Timer state
  const [remindInDays, setRemindInDays] = useState<number>(30);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  // Customer contact & channel
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');
  const [customerName, setCustomerName] = useState<string>(initialCustomerName);
  const [phone, setPhone] = useState<string>(initialPhone);
  const [email, setEmail] = useState<string>(initialEmail);

  // UI status
  const [loading, setLoading] = useState(false);
  const [scheduledReminder, setScheduledReminder] = useState<CustomerReminder | null>(null);

  // Fetch real orders from database when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchDbOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          const fetchedOrders: Order[] = data.orders || [];
          if (!isMounted) return;
          setOrders(fetchedOrders);

          // 1. Try matching by initialPhone if provided
          let matchedOrder = initialPhone
            ? fetchedOrders.find(
                (o) => o.phone.replace(/[^0-9]/g, '') === initialPhone.replace(/[^0-9]/g, '')
              )
            : null;

          // 2. Try matching from localStorage if user recently placed an order
          if (!matchedOrder) {
            try {
              const saved = localStorage.getItem('gautattva_last_order');
              if (saved) {
                const parsed = JSON.parse(saved);
                matchedOrder = fetchedOrders.find((o) => o.id === parsed.id || o.order_number === parsed.order_number);
              }
            } catch {}
          }

          // 3. Fallback to the first delivered order or first order in database
          if (!matchedOrder && fetchedOrders.length > 0) {
            matchedOrder = fetchedOrders.find((o) => o.status === 'delivered') || fetchedOrders[0];
          }

          if (matchedOrder) {
            applyOrderData(matchedOrder);
          }
        }
      } catch (err) {
        console.error('Failed to fetch database orders:', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    };

    fetchDbOrders();

    return () => {
      isMounted = false;
    };
  }, [isOpen, initialPhone]);

  // Apply real database order data to the form
  const applyOrderData = (order: Order) => {
    setSelectedOrder(order);
    setCustomerName(order.customer_name);
    setPhone(order.phone);
    if (order.email) setEmail(order.email);

    // Smart recommendation based on real DB jar size
    if (order.jar_size === '500ml') setNextJar('1000ml');
    else if (order.jar_size === '1000ml') setNextJar('2000ml');
    else if (order.jar_size === '2000ml') setNextJar('2000ml');
    else setNextJar('5000ml');

    // Auto-calculate smart timer based on days remaining from real DB delivery date
    const orderDate = new Date(order.delivered_at || order.created_at);
    const daysElapsed = Math.max(0, Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)));
    const totalDaysSupply = (jarDaysDefault[order.jar_size] || 50) * (order.quantity || 1);
    const remainingDays = Math.max(0, totalDaysSupply - daysElapsed);

    // If already empty or near empty, set reminder to 5 or 10 days, otherwise remaining buffer
    setRemindInDays(remainingDays > 5 ? remainingDays : 10);
  };

  if (!isOpen) return null;

  const variants = knowledgeBase.product.variants;

  // Real purchase data from Database record
  const pastJar: JarSize = selectedOrder ? selectedOrder.jar_size : initialJar;
  const pastQty = selectedOrder ? selectedOrder.quantity : 1;
  const currentPastVariant = variants.find((v) => v.id === pastJar) || variants[1];
  const currentNextVariant = variants.find((v) => v.id === nextJar) || variants[2];

  // Calculate actual elapsed days from database timestamp
  const orderTimestamp = selectedOrder
    ? new Date(selectedOrder.delivered_at || selectedOrder.created_at).getTime()
    : Date.now() - 25 * 86400000;

  const actualDaysElapsed = Math.max(0, Math.floor((Date.now() - orderTimestamp) / (1000 * 60 * 60 * 24)));
  const totalSupplyDays = (jarDaysDefault[pastJar] || 50) * pastQty;
  const estimatedDaysRemaining = Math.max(0, totalSupplyDays - actualDaysElapsed);
  const percentRemaining = Math.max(0, Math.min(100, Math.round((estimatedDaysRemaining / totalSupplyDays) * 100)));

  // Calculate scheduled date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + Number(remindInDays));
  const timeString = timeOfDay === 'morning' ? '9:00 AM' : timeOfDay === 'afternoon' ? '1:00 PM' : '7:00 PM';
  const formattedScheduledDate = `${targetDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} at ${timeString}`;

  // Generate Pre-filled Buy Link
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gautattvaorganics.com';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const buyLink = `${baseUrl}/pay?jar=${nextJar}&qty=${nextQty}&name=${encodeURIComponent(
    customerName || 'Vedic Customer'
  )}&phone=${cleanPhone || '9057000446'}${email ? `&email=${encodeURIComponent(email)}` : ''}&ref=REMIND-${selectedOrder?.order_number || pastJar}`;

  // Build the notification message
  const messagePreview = `Pranam ${customerName || 'Ji'} 🙏

Warm greetings from GauTattva™ Organics! We hope your daily rituals with pure A2 Gir Cow Vedic Bilona Ghee have brought vitality to your home.

📦 Verified Purchase Record (Order #${selectedOrder?.order_number || 'GAU-7822'}):
• ${pastQty}x A2 Gir Cow Bilona Ghee (${currentPastVariant.size})
• Delivered: ~${actualDaysElapsed} days ago via ${selectedOrder?.courier || 'Shiprocket Express'}

⏳ Jar Depletion Notice:
Based on your purchase date and standard household use, your ${currentPastVariant.size} jar is finishing in ~${estimatedDaysRemaining} days.

✨ Next Recommended Replenishment:
• ${nextQty}x ${currentNextVariant.size} (${currentNextVariant.tag})
• Price: ₹${(currentNextVariant.price * nextQty).toLocaleString('en-IN')} (Free Express Dispatch)

👉 1-Tap Replenish Link:
${buyLink}

Rooted in tradition, inspired by purity.
GauTattva Organics • +91 9057000446`;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          email: email || undefined,
          channel,
          past_jar_size: pastJar,
          past_quantity: pastQty,
          past_purchase_date: selectedOrder ? selectedOrder.delivered_at || selectedOrder.created_at : new Date().toISOString(),
          next_jar_size: nextJar,
          next_quantity: nextQty,
          remind_in_days: remindInDays,
          reminder_time_of_day: timeOfDay,
          scheduled_date: targetDate.toISOString(),
          buy_link: buyLink,
          message_preview: messagePreview,
        }),
      });

      const data = await res.json();
      if (data.success && data.reminder) {
        setScheduledReminder(data.reminder);
        try {
          localStorage.setItem('gautattva_saved_reminder', JSON.stringify(data.reminder));
        } catch {}
      }
    } catch (err) {
      console.error('Failed to schedule reminder', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectWhatsAppTest = () => {
    const waUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone || '919057000446'}?text=${encodeURIComponent(
      messagePreview
    )}`;
    window.open(waUrl, '_blank');
  };

  // Filter orders for quick lookup
  const filteredOrders = searchQuery
    ? orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.phone.includes(searchQuery)
      )
    : orders;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-[#FDFBF7] rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative border-2 border-[#E7D0A8] max-h-[94vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {scheduledReminder ? (
          /* Confirmation State */
          <div className="py-6 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9882B]">
                Replenishment Timer Active
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1F3A22]">
                Reminder Scheduled, {customerName} Ji! 🙏
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                We will send your personalized replenishment nudge on{' '}
                <strong>{formattedScheduledDate}</strong> via{' '}
                <strong className="capitalize">{channel}</strong>.
              </p>
            </div>

            {/* Scheduled Details Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7D0A8] text-xs text-left space-y-2.5 max-w-md mx-auto shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                <span className="text-stone-500">Scheduled Trigger:</span>
                <span className="font-bold text-[#1F3A22]">{formattedScheduledDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Contact Destination:</span>
                <span className="font-semibold text-stone-800">
                  {phone} {email && `• ${email}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Pre-filled Pack:</span>
                <span className="font-bold text-[#C9882B]">{nextQty}x {currentNextVariant.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Price:</span>
                <span className="font-bold text-[#1F3A22]">₹{(currentNextVariant.price * nextQty).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto pt-2">
              <button
                onClick={handleDirectWhatsAppTest}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Test Send on WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1F3A22] hover:bg-[#142817] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Reminder Setup Form */
          <form onSubmit={handleSchedule} className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-[#FEF5E7] text-[#C9882B] border border-[#E7D0A8]">
                  <Bell className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9882B]">
                  Smart Vedic Replenishment Assistant
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1F3A22]">
                Set Your Personal Ghee Reminder
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Synchronized with your real purchase order from the database to calculate exact consumption and pre-fill your next order.
              </p>
            </div>

            {/* SECTION 1: REAL DATABASE ORDER RECORD (Loaded from Database, not filled by customer) */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#E7D0A8] shadow-sm space-y-3.5">
              
              {/* Database Status Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#1F3A22] flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#C9882B]" />
                    <span>Real Purchase Record From Database</span>
                  </span>
                </div>

                {selectedOrder && (
                  <span className="text-[11px] font-bold font-mono bg-[#FEF5E7] text-[#996417] px-2.5 py-0.5 rounded-full border border-[#E7D0A8]">
                    Order #{selectedOrder.order_number}
                  </span>
                )}
              </div>

              {/* Order Switcher / Selector from Database */}
              {orders.length > 0 && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-stone-600">
                    Switch Verified Database Customer / Order:
                  </label>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {orders.slice(0, 5).map((o) => {
                      const isCur = selectedOrder?.id === o.id;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => applyOrderData(o)}
                          className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isCur
                              ? 'bg-[#1F3A22] text-white font-bold border-[#1F3A22] shadow-xs'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          <User className="w-3 h-3 text-[#C9882B]" />
                          <span>{o.customer_name}</span>
                          <span className="opacity-75">({o.jar_size})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Real Database Order Details Grid */}
              {selectedOrder ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                  <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#E7D0A8]/60 space-y-0.5">
                    <span className="text-[10px] text-stone-500 font-medium block">Pack Purchased</span>
                    <span className="font-bold text-[#1F3A22] block text-sm">
                      {selectedOrder.quantity}x {currentPastVariant.size}
                    </span>
                    <span className="text-[10px] text-[#C9882B] block">Pure A2 Gir Ghee</span>
                  </div>

                  <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#E7D0A8]/60 space-y-0.5">
                    <span className="text-[10px] text-stone-500 font-medium block">Order Date</span>
                    <span className="font-bold text-[#1F3A22] block">
                      {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium block">Verified Paid</span>
                  </div>

                  <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#E7D0A8]/60 space-y-0.5">
                    <span className="text-[10px] text-stone-500 font-medium block">Delivery Status</span>
                    <span className="font-bold text-[#1F3A22] block capitalize">
                      {selectedOrder.status}
                    </span>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {selectedOrder.courier || 'Shiprocket Express'}
                    </span>
                  </div>

                  <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#E7D0A8]/60 space-y-0.5">
                    <span className="text-[10px] text-stone-500 font-medium block">Days Elapsed</span>
                    <span className="font-bold text-[#C9882B] block text-sm">
                      {actualDaysElapsed} Days Ago
                    </span>
                    <span className="text-[10px] text-stone-500 block">From DB timestamp</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 text-center text-xs text-stone-500">
                  <p>Loading database purchase records...</p>
                </div>
              )}

              {/* Automatic Consumption & Jar Depletion Meter (Computed from DB data) */}
              <div className="bg-[#FEFDF9] p-3.5 rounded-xl border border-[#E7D0A8] space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px] flex-wrap gap-1">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Real-Time Jar Depletion Status:</span>
                  </span>
                  <span className="font-bold text-[#1F3A22]">
                    {estimatedDaysRemaining <= 0
                      ? '⚠️ Jar Finished / Empty'
                      : `~${estimatedDaysRemaining} Days Supply Remaining (${percentRemaining}%)`}
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#C9882B] to-[#1F3A22] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(2, percentRemaining))}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-stone-500">
                  <span>Delivered {actualDaysElapsed} days ago</span>
                  <span>{currentPastVariant.size} standard supply: ~{totalSupplyDays} days</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: Next Recommended Pack ("What he should buy next") */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F3A22] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9882B]" />
                  2. What You Should Buy Next (Recommended Replenishment)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {variants.map((v) => {
                  const isSelected = nextJar === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setNextJar(v.id as JarSize)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#C9882B] bg-[#FEF5E7] shadow-xs ring-1 ring-[#C9882B]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-stone-900">{v.size}</div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-bold text-[#1F3A22]">₹{v.price.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-stone-400 line-through">₹{v.mrp.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-[9px] text-[#C9882B] font-semibold block mt-0.5">{v.tag}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: Custom Timer Settings */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F3A22] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C9882B]" />
                  3. When Would You Like To Be Reminded?
                </span>
                <span className="text-xs font-bold text-[#C9882B]">
                  In {remindInDays} Days
                </span>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { days: 10, label: '10 Days', desc: 'Urgent' },
                  { days: 20, label: '20 Days', desc: 'Half-Jar' },
                  { days: 30, label: '30 Days', desc: 'Recommended' },
                  { days: 50, label: '50 Days', desc: 'Full Cycle' },
                ].map((preset) => (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => setRemindInDays(preset.days)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      remindInDays === preset.days
                        ? 'bg-[#1F3A22] text-white font-bold border-[#1F3A22]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="block font-semibold text-[11px]">{preset.label}</span>
                    <span className="text-[9px] opacity-75">{preset.desc}</span>
                  </button>
                ))}
              </div>

              {/* Custom Slider */}
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min="3"
                  max="90"
                  step="1"
                  value={remindInDays}
                  onChange={(e) => setRemindInDays(Number(e.target.value))}
                  className="w-full accent-[#C9882B] cursor-pointer"
                />
                <div className="flex justify-between items-center text-[11px] text-stone-500">
                  <span>3 Days</span>
                  <span className="font-semibold text-[#1F3A22]">
                    🗓️ Scheduled for: <strong>{formattedScheduledDate}</strong>
                  </span>
                  <span>90 Days</span>
                </div>
              </div>

              {/* Preferred Time of Day */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">Preferred Delivery Time:</span>
                <div className="flex gap-1.5 text-[11px]">
                  {[
                    { id: 'morning', label: '🌅 Morning (9 AM)' },
                    { id: 'afternoon', label: '☀️ Noon (1 PM)' },
                    { id: 'evening', label: '🌆 Evening (7 PM)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimeOfDay(t.id as any)}
                      className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        timeOfDay === t.id
                          ? 'bg-[#FEF5E7] text-[#996417] font-bold border-[#E7D0A8]'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 4: Channel & Customer Contact (Pre-filled from DB) */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F3A22] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#C9882B]" />
                  4. Where Should We Send Your Reminder?
                </span>
                
                {/* Channel Selector */}
                <div className="flex gap-1 text-[11px]">
                  {[
                    { id: 'whatsapp', label: '📱 WhatsApp' },
                    { id: 'email', label: '📧 Email' },
                    { id: 'both', label: '🔔 Both' },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannel(ch.id as any)}
                      className={`px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                        channel === ch.id
                          ? 'bg-[#1F3A22] text-white font-bold border-[#1F3A22]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs (Pre-filled from DB) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rajesh Verma"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FDFBF7] focus:outline-hidden focus:border-[#C9882B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    WhatsApp Mobile Number
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    value={phone.replace(/[^0-9]/g, '').slice(-10)}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.startsWith('91') && val.length > 10) val = val.slice(2);
                      else if (val.startsWith('0') && val.length > 10) val = val.slice(1);
                      setPhone(val.slice(0, 10));
                    }}
                    placeholder="98234 56789"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FDFBF7] focus:outline-hidden focus:border-[#C9882B]"
                  />
                </div>

                {(channel === 'email' || channel === 'both') && (
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh.verma@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-[#FDFBF7] focus:outline-hidden focus:border-[#C9882B]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#C9882B] hover:bg-[#B37521] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Bell className="w-4 h-4 fill-white" />
                <span>{loading ? 'Activating Timer...' : `Schedule My Reminder for ${targetDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsAppTest}
                className="py-4 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Test Send on WhatsApp</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
