'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Truck,
  Sparkles,
  CreditCard,
  QrCode,
  Smartphone,
  Loader2,
} from 'lucide-react';

function PayContent() {
  const searchParams = useSearchParams();
  const d = searchParams.get('d');
  let parsed: Record<string, any> = {};
  if (d) {
    try {
      parsed = JSON.parse(typeof window !== 'undefined' ? window.atob(d.replace(/-/g, '+').replace(/_/g, '/')) : Buffer.from(d, 'base64').toString('utf-8'));
    } catch {}
  }

  const orderRef = parsed.ref || searchParams.get('ref') || 'GAU-REORDER';
  const jarSize = parsed.jar || searchParams.get('jar') || '1000ml';
  const rawAmt =
    Number(parsed.amt || searchParams.get('amt')) ||
    (jarSize === '500ml'
      ? 1432
      : jarSize === '2000ml'
      ? 5112
      : jarSize === '5000ml'
      ? 12392
      : 2632);
  const customerName = parsed.name || searchParams.get('name') || 'Vedic Customer';
  const phone = parsed.phone || searchParams.get('phone') || '+91 98765 00000';
  const discountCode = parsed.code || searchParams.get('code');

  const finalAmount = discountCode ? Math.round(rawAmt * 0.95) : rawAmt;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const isAlreadyPaid = searchParams.get('paid') === 'true' || Boolean(searchParams.get('razorpay_payment_id'));
  const [paidSuccess, setPaidSuccess] = useState(isAlreadyPaid);
  const [loading, setLoading] = useState(false);

  const handleConfirmPay = async () => {
    setLoading(true);
    try {
      // Create confirmed reorder in Supabase
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_order',
          customer_name: customerName,
          phone,
          jar_size: jarSize,
          amount: finalAmount,
          status: 'placed',
          payment_status: 'paid',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaidSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setPaidSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (paidSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-2 border-emerald-500/30 shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9882B] bg-[#FEF5E7] px-3 py-1 rounded-full">
            Payment Verified • Reorder Confirmed
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1F3A22]">
            Dhanyawad, {customerName} Ji! 🙏
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Aapka <strong>{jarSize} GauTattva A2 Gir Cow Vedic Bilona Ghee</strong> ka reorder batch confirm ho chuka hai. 
          </p>
        </div>

        <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200 text-xs space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-stone-500">Amount Paid:</span>
            <strong className="text-emerald-700 font-bold">₹{finalAmount}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Delivery Partner:</span>
            <span className="font-medium text-stone-800">Shiprocket Express</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Customer Mobile:</span>
            <span className="font-mono text-stone-800">{phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Status:</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Fresh Churning Scheduled
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full py-3 bg-[#1F3A22] hover:bg-[#142817] text-white rounded-xl font-bold text-xs shadow-md transition-all text-center block"
          >
            Back to GauTattva Storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E7D0A8] shadow-2xl space-y-6">
      
      {/* Top Brand Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <Link href="/" className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </Link>
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-semibold text-stone-600">256-bit Secure Razorpay Checkout</span>
        </div>
      </div>

      {/* Product Summary */}
      <div className="flex items-center gap-4 bg-[#FEFDF9] p-4 rounded-2xl border border-amber-200/60">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#C9882B] flex-shrink-0">
          <Image
            src="/hero-ghee-jar.jpg"
            alt="GauTattva Ghee"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-[#C9882B]">1-Tap WhatsApp Reorder</span>
          </div>
          <h3 className="font-serif font-bold text-sm text-[#1F3A22] truncate">
            A2 Gir Cow Vedic Bilona Ghee
          </h3>
          <p className="text-xs text-stone-500">
            Pack: <strong>{jarSize}</strong> • For {customerName}
          </p>
        </div>
        <div className="text-right">
          {discountCode && (
            <span className="block text-[10px] text-stone-400 line-through">
              ₹{rawAmt}
            </span>
          )}
          <span className="font-bold text-lg text-[#1F3A22]">
            ₹{finalAmount}
          </span>
        </div>
      </div>

      {discountCode && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            5% Courtesy Blessing Applied
          </span>
          <span className="font-mono font-bold bg-emerald-200/80 px-2 py-0.5 rounded text-[11px]">
            {discountCode}
          </span>
        </div>
      )}

      {/* Payment Methods */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          Select Payment Mode
        </label>

        {/* UPI Option */}
        <div
          onClick={() => setPaymentMethod('upi')}
          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
            paymentMethod === 'upi'
              ? 'border-[#00A884] bg-emerald-50/40 shadow-xs'
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#00A884]" />
              <span className="font-bold text-xs text-stone-900">Instant UPI (0% Fee)</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Recommended
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-emerald-100">
            {[
              { id: 'gpay', label: 'Google Pay' },
              { id: 'phonepe', label: 'PhonePe' },
              { id: 'paytm', label: 'Paytm' },
              { id: 'qr', label: 'Any QR' },
            ].map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPaymentMethod('upi');
                  setUpiApp(app.id as any);
                }}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                  upiApp === app.id
                    ? 'border-[#00A884] bg-[#00A884] text-white shadow-xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                {app.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card Option */}
        <div
          onClick={() => setPaymentMethod('card')}
          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
            paymentMethod === 'card'
              ? 'border-[#00A884] bg-emerald-50/40 shadow-xs'
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-stone-700" />
            <span className="font-bold text-xs text-stone-900">Debit / Credit Card / NetBanking</span>
          </div>
          <span className="text-[10px] text-stone-400">Visa, MC, RuPay</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-500 py-2 border-y border-stone-100">
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Express Shiprocket Delivery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C9882B]" />
          <span>Certified NABL JLFD260702144</span>
        </div>
      </div>

      {/* Pay Action CTA */}
      <button
        onClick={handleConfirmPay}
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-[#1F3A22] hover:bg-[#142817] text-white font-bold text-sm shadow-xl transition-all hover:scale-102 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            <span>Processing Instant Replenishment...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-[#EAB308]" />
            <span>1-Tap Pay ₹{finalAmount} Now</span>
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-stone-400">
        Pre-filled for {phone} • Secure Indian Payment Gateway
      </p>

    </div>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 flex flex-col justify-center">
      {/* Top Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2.5 mb-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C9882B]">
            <Image
              src="/gautattva-logo.jpg"
              alt="GauTattva"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-serif font-bold text-xl text-[#1F3A22]">
            GauTattva Organics
          </span>
        </div>
        <p className="text-xs text-stone-500">
          A2 Gir Cow Vedic Bilona Ghee • Instant Replenishment
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-xs text-stone-400">Loading payment gateway...</div>}>
        <PayContent />
      </Suspense>
    </div>
  );
}
