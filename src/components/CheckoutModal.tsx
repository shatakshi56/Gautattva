'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Zap, Truck, CheckCircle2, Lock, Minus, Plus, AlertCircle, Phone, MessageCircle, Bell, Sparkles } from 'lucide-react';
import { JarSize } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';
import { syncClientCart, trackClientEvent } from '@/lib/session';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJar: JarSize;
  quantity?: number;
  onOrderSuccess?: (orderNumber: string) => void;
  onOpenReminder?: (jar: JarSize, name: string, phone: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedJar,
  quantity = 1,
  onOrderSuccess,
  onOpenReminder,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [currentQty, setCurrentQty] = useState(quantity);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  // Loyal Customer & 20% Discount State
  const [isLoyal, setIsLoyal] = useState(false);
  const [loyaltyDiscountPercent, setLoyaltyDiscountPercent] = useState(20);
  const [lookingUpPhone, setLookingUpPhone] = useState(false);

  // Pincode City Auto-detection State
  const [detectingCity, setDetectingCity] = useState(false);
  const [cityAutoDetected, setCityAutoDetected] = useState(false);

  const maxAllowed = selectedJar === '5000ml' ? 2 : 5;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('91') && val.length > 10) {
      val = val.slice(2);
    } else if (val.startsWith('0') && val.length > 10) {
      val = val.slice(1);
    }
    val = val.slice(0, 10);
    setPhone(val);
  };

  const autoDetectCity = async (code: string) => {
    setDetectingCity(true);
    try {
      const res = await fetch(`/api/pincode?pincode=${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.city) {
          setCity(data.city);
          setCityAutoDetected(true);
        }
      }
    } catch (err) {
      console.error('Failed to auto-detect city:', err);
    } finally {
      setDetectingCity(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      autoDetectCity(val);
    } else {
      setCityAutoDetected(false);
    }
  };

  useEffect(() => {
    setCurrentQty(Math.min(quantity, maxAllowed));
    setFlashMessage(null);
  }, [quantity, selectedJar, isOpen, maxAllowed]);

  useEffect(() => {
    if (isOpen) {
      trackClientEvent('open_checkout');
    }
  }, [isOpen]);

  const variant =
    knowledgeBase.product.variants.find((v) => v.id === selectedJar) ||
    knowledgeBase.product.variants[1];

  const rawTotalAmount = variant.price * currentQty;
  const discountAmount = isLoyal ? Math.round((rawTotalAmount * loyaltyDiscountPercent) / 100) : 0;
  const totalAmount = rawTotalAmount - discountAmount;

  // Real-time phone lookup for Loyal Customer detection & Cart Drop-off capture
  useEffect(() => {
    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      // Sync cart session with captured phone so drop-offs are captured!
      syncClientCart({
        jar_size: selectedJar,
        quantity: currentQty,
        cart_amount: totalAmount,
        phone: `+91 ${phone}`,
        customer_name: name || undefined,
        status: 'active',
      });

      const timer = setTimeout(async () => {
        setLookingUpPhone(true);
        try {
          const res = await fetch(`/api/customers/lookup?phone=${encodeURIComponent(phone)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.isLoyal) {
              setIsLoyal(true);
              setLoyaltyDiscountPercent(data.discount_percent || 20);
              if (!name && data.customer?.name) {
                setName(data.customer.name);
              }
              if (!city && data.customer?.city) {
                setCity(data.customer.city);
              }
              if (!pincode && data.customer?.pincode) {
                const pin = (data.customer.pincode || '').replace(/\D/g, '').slice(0, 6);
                setPincode(pin);
              }
            } else {
              setIsLoyal(false);
            }
          }
        } catch {
        } finally {
          setLookingUpPhone(false);
        }
      }, 350);

      return () => clearTimeout(timer);
    } else {
      setIsLoyal(false);
    }
  }, [phone, selectedJar, currentQty, totalAmount, name, city, pincode]);

  if (!isOpen) return null;

  const handleIncrementQty = () => {
    if (currentQty >= maxAllowed) {
      setFlashMessage(
        selectedJar === '5000ml'
          ? 'Maximum allowed for 5L jar is 2 packs per order. For bulk orders, please contact +91 9057000446.'
          : 'Maximum allowed total quantity to buy at once is 5 packs. For bulk orders, please contact +91 9057000446.'
      );
      return;
    }
    setFlashMessage(null);
    setCurrentQty((q) => q + 1);
  };

  const handleDecrementQty = () => {
    setFlashMessage(null);
    setCurrentQty((q) => Math.max(1, q - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFlashMessage('Please enter your full name.');
      return;
    }
    if (phone.length !== 10) {
      setFlashMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!address.trim()) {
      setFlashMessage('Please enter your complete delivery address.');
      return;
    }
    if (pincode.length !== 6) {
      setFlashMessage('Please enter a valid 6-digit postal pincode.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_order',
          customer_name: name,
          phone: `+91 ${phone}`,
          address,
          city: city || 'Jaipur',
          pincode,
          jar_size: selectedJar,
          quantity: currentQty,
          amount: totalAmount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessOrder(data.order.order_number);
        // Mark cart session as converted
        syncClientCart({
          jar_size: selectedJar,
          quantity: currentQty,
          cart_amount: totalAmount,
          phone,
          customer_name: name,
          status: 'converted',
        });

        try {
          localStorage.setItem('gautattva_last_order', JSON.stringify(data.order));
        } catch {}
        if (onOrderSuccess) onOrderSuccess(data.order.order_number);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FDFBF7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border-2 border-[#E7D0A8] max-h-[92vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successOrder ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1F3A22]">
              Pranam! Order Confirmed 🙏
            </h3>
            <p className="text-sm text-stone-600">
              Your order <strong className="font-mono text-[#C9882B]">{successOrder}</strong> for{' '}
              <strong>GauTattva A2 Gir Cow Ghee ({variant.size})</strong> has been received!
            </p>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs text-left text-stone-700 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Truck className="w-4 h-4 text-[#C9882B]" />
                <span>Express Dispatch via Shiprocket</span>
              </div>
              <p>
                A delivery tracking link will be sent to <strong>{phone}</strong> on WhatsApp. Once delivered, your <strong>Day {variant.reorder_nudge_day}</strong> automated replenishment timer will activate.
              </p>
            </div>

            {onOpenReminder && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReminder(selectedJar, name, phone);
                }}
                className="w-full py-3.5 rounded-xl bg-[#FEF5E7] hover:bg-[#FCEFD8] text-[#996417] font-bold text-xs border border-[#E7D0A8] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Bell className="w-4 h-4 text-[#C9882B]" />
                <span>Set Custom Replenishment Reminder For This Order 🔔</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#1F3A22] hover:bg-[#142817] text-white font-bold text-sm cursor-pointer transition-colors"
            >
              Back to Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9882B]">
                Instant 1-Tap Checkout
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1F3A22]">
                Deliver GauTattva To Your Home
              </h3>
            </div>

            {/* Selected item summary */}
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-bold text-sm text-[#1C1917] block truncate">
                  A2 Gir Cow Bilona Ghee ({variant.size})
                </span>
                <span className="block text-xs text-stone-500">
                  {variant.tag} • Fresh Morning Batch
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Stepper (- 1 +) */}
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-full border border-stone-200 bg-stone-50 shadow-xs">
                  <button
                    type="button"
                    onClick={handleDecrementQty}
                    disabled={currentQty <= 1}
                    className="w-6 h-6 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-4 text-center font-bold text-xs sm:text-sm text-[#1F3A22]">
                    {currentQty}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrementQty}
                    className="w-6 h-6 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  {isLoyal ? (
                    <div>
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-xs text-stone-400 line-through">
                          ₹{rawTotalAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-emerald-800">
                          ₹{totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="block text-[10px] text-emerald-700 font-semibold">
                        20% Loyal Member Off
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-base sm:text-lg font-bold text-[#1F3A22]">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
                        Free Shipping
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Loyal Customer 20% Privilege Banner */}
            {isLoyal && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-fadeIn shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-full bg-emerald-200/80 text-emerald-800">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold block text-emerald-900 text-xs sm:text-sm">
                      Welcome Back! Loyal Vedic Family Member 🎉
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      20% privilege loyalty discount auto-applied. You saved ₹{discountAmount.toLocaleString('en-IN')}!
                    </span>
                  </div>
                </div>
                <span className="shrink-0 font-bold text-xs text-emerald-800 bg-white border border-emerald-200 px-2.5 py-1 rounded-xl shadow-2xs">
                  20% OFF
                </span>
              </div>
            )}

            {/* Bulk Order / Max Quantity Flash Alert */}
            {flashMessage && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 animate-fadeIn shadow-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="font-semibold leading-relaxed">{flashMessage}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href="tel:+919057000446"
                      className="inline-flex items-center gap-1.5 font-bold text-[#1F3A22] bg-white px-3 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-100/70 transition-colors shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C9882B]" />
                      <span>Call +91 9057000446</span>
                    </a>
                    <a
                      href="https://wa.me/919057000446?text=Pranam,%20I%20would%20like%20to%20place%20a%20bulk%20order%20for%20GauTattva%20A2%20Gir%20Cow%20Ghee."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-50 transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp for Bulk Order</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:border-[#C9882B]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-700 text-xs">
                    WhatsApp Mobile Number <span className="text-[#C9882B]">(10 Digits)</span>
                  </label>
                  {lookingUpPhone && (
                    <span className="text-[10px] text-stone-400 animate-pulse">Checking loyalty status...</span>
                  )}
                  {isLoyal && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Verified Loyal Member (20% Off)
                    </span>
                  )}
                </div>
                <div
                  className={`flex rounded-xl border bg-white overflow-hidden transition-all ${
                    isLoyal
                      ? 'border-emerald-400 ring-1 ring-emerald-300'
                      : phone.length === 10
                      ? 'border-emerald-500 ring-1 ring-emerald-200'
                      : 'border-stone-200 focus-within:border-[#C9882B]'
                  }`}
                >
                  <span className="inline-flex items-center px-3 text-xs font-bold text-stone-600 bg-stone-50 border-r border-stone-200 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-2.5 bg-transparent focus:outline-hidden text-sm font-medium text-stone-800 tracking-wide"
                  />
                  {phone.length === 10 && (
                    <span className="inline-flex items-center pr-3 text-emerald-600 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  {phone.length > 0 && phone.length < 10 ? (
                    <span className="text-amber-600 font-medium">
                      Enter 10-digit number ({10 - phone.length} digits left)
                    </span>
                  ) : phone.length === 10 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Valid 10-digit mobile number
                    </span>
                  ) : (
                    <span className="text-stone-400">Standard 10-digit Indian mobile number</span>
                  )}
                  <span className="text-stone-400 text-[10px] font-mono">{phone.length}/10</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 text-xs">Delivery Address</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No, Apartment/Street, Area"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:border-[#C9882B] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-stone-700 text-xs">City</label>
                    {cityAutoDetected && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Auto-detected
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setCityAutoDetected(false);
                    }}
                    placeholder="e.g. Jaipur"
                    className={`w-full px-3.5 py-2 rounded-xl border bg-white focus:outline-hidden text-sm transition-all ${
                      cityAutoDetected
                        ? 'border-emerald-400 bg-emerald-50/20 text-[#1F3A22] font-semibold'
                        : 'border-stone-200 focus:border-[#C9882B]'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-stone-700 text-xs">
                      Pincode <span className="text-stone-400 font-normal">(6 digits)</span>
                    </label>
                    {detectingCity && (
                      <span className="text-[10px] text-[#C9882B] font-bold animate-pulse">
                        Detecting...
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex rounded-xl border bg-white overflow-hidden transition-all ${
                      pincode.length === 6
                        ? 'border-emerald-500 ring-1 ring-emerald-200'
                        : 'border-stone-200 focus-within:border-[#C9882B]'
                    }`}
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={handlePincodeChange}
                      placeholder="302021"
                      className="w-full px-3.5 py-2 bg-transparent focus:outline-hidden text-sm font-medium tracking-wider"
                    />
                    {pincode.length === 6 && (
                      <span className="inline-flex items-center pr-3 text-emerald-600 text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    {pincode.length > 0 && pincode.length < 6 ? (
                      <span className="text-amber-600">{6 - pincode.length} digits left</span>
                    ) : cityAutoDetected && city ? (
                      <span className="text-emerald-700 font-medium truncate">✓ {city}</span>
                    ) : (
                      <span className="text-stone-400">Postal PIN</span>
                    )}
                    <span className="text-stone-400 text-[10px] font-mono">{pincode.length}/6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method & COD Notice */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E7D0A8] space-y-1.5 text-xs">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-1.5 font-bold text-[#1F3A22]">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Online Prepaid Only (Razorpay 256-Bit)</span>
                </div>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                  Cash on Delivery Not Available
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Accepted: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards &amp; Netbanking. Cash on Delivery (COD) is strictly unavailable.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#C9882B] hover:bg-[#B37521] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>
                {loading
                  ? 'Processing...'
                  : isLoyal
                  ? `Pay Online & Confirm • ₹${totalAmount.toLocaleString('en-IN')} (20% Loyal Family Off)`
                  : `Pay Online & Confirm • ₹${totalAmount.toLocaleString('en-IN')}`}
              </span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
