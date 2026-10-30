'use client';

import React from 'react';
import Image from 'next/image';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  ShoppingBag,
  ExternalLink,
  X,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Order, JarSize } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';

interface FlipkartOrderTrackingModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onOpenInvoice: () => void;
  onBuyAgain: (jar: JarSize) => void;
}

export const FlipkartOrderTrackingModal: React.FC<FlipkartOrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenInvoice,
  onBuyAgain,
}) => {
  if (!isOpen) return null;

  const isDelivered = order.status === 'delivered';
  const isShipped = order.status === 'shipped';

  const orderDate = new Date(order.created_at);
  const formattedOrderDate = orderDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedOrderTime = orderDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-[#E7D0A8] overflow-hidden my-4 max-h-[90vh] flex flex-col cursor-default"
      >
        
        {/* GauTattva Branded Modal Header */}
        <div className="bg-[#1F3A22] text-white px-6 py-4 flex items-center justify-between shadow-xs shrink-0 border-b border-[#C9882B]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FFE500]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg leading-tight text-white flex items-center gap-2">
                <span>Order Details: {order.order_number}</span>
              </h2>
              <span className="text-[11px] text-[#E7D0A8] block mt-0.5">
                Ordered on {formattedOrderDate} at {formattedOrderTime}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#E7D0A8] hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer"
            aria-label="Close Tracking Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-stone-800 text-xs">
          
          {/* Delivery Address Card */}
          <div className="bg-[#FAF6EE] rounded-2xl p-4 sm:p-5 border border-[#E7D0A8]">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#996417] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9882B]" />
              <span>Delivery Address</span>
            </h3>
            <p className="font-serif font-bold text-base text-[#1F3A22]">{order.customer_name}</p>
            <p className="text-stone-600 mt-0.5">
              {order.address || 'Civil Lines'}, {order.city || 'Jaipur'} - {order.pincode || '302001'}
            </p>
            <p className="text-stone-700 mt-1.5 font-medium">
              <strong className="text-stone-900">Phone number:</strong> {order.phone}
            </p>
          </div>

          {/* Shipment Progress Tracker */}
          <div className="bg-white rounded-2xl p-5 border border-[#E7D0A8] shadow-2xs">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#996417] mb-4 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#C9882B]" />
              <span>Shipment Progress Tracker</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7D0A8]">
              
              {/* Step 1: Order Confirmed */}
              <div className="relative">
                <span className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  ✓
                </span>
                <div>
                  <h4 className="font-bold text-[#1F3A22] text-xs">Order Confirmed &bull; Payment Verified</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {formattedOrderDate}, {formattedOrderTime} &bull; Verified via Razorpay Online
                  </p>
                </div>
              </div>

              {/* Step 2: Shipped */}
              <div className="relative">
                <span className={`absolute -left-6 top-0 w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-xs ${
                  isShipped || isDelivered ? 'bg-emerald-600' : 'bg-stone-300'
                }`}>
                  {isShipped || isDelivered ? '✓' : '2'}
                </span>
                <div>
                  <h4 className="font-bold text-[#1F3A22] text-xs">
                    Shipped &bull; {order.courier || 'Delhivery Surface'}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Tracking AWB:{' '}
                    <strong className="text-[#1F3A22] font-mono font-bold">
                      {order.tracking_awb || 'DELH78129381'}
                    </strong>
                    {' '}&bull; Dispatched from Jaipur Fulfillment Hub
                  </p>
                </div>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className="relative">
                <span className={`absolute -left-6 top-0 w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-xs ${
                  isDelivered ? 'bg-emerald-600' : isShipped ? 'bg-[#C9882B] animate-pulse' : 'bg-stone-300'
                }`}>
                  {isDelivered ? '✓' : '3'}
                </span>
                <div>
                  <h4 className="font-bold text-[#1F3A22] text-xs">
                    {isDelivered
                      ? 'Out for Delivery Completed'
                      : isShipped
                      ? 'Expected Delivery: Tomorrow by 11:00 AM'
                      : 'Pending Dispatch'}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Triple-layer cushioned glass box packaging for 100% transit safety.
                  </p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative">
                <span className={`absolute -left-6 top-0 w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-xs ${
                  isDelivered ? 'bg-emerald-600' : 'bg-stone-300'
                }`}>
                  {isDelivered ? '✓' : '4'}
                </span>
                <div>
                  <h4 className={`font-bold text-xs ${isDelivered ? 'text-emerald-700' : 'text-stone-400'}`}>
                    {isDelivered
                      ? `Delivered on ${
                          order.delivered_at
                            ? new Date(order.delivered_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })
                            : 'Oct 2'
                        }`
                      : 'Delivered (Expected)'}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {isDelivered ? 'Package handed over safely with OTP.' : 'Waiting for courier delivery.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Product Item Card */}
          <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#E7D0A8] flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border border-[#E7D0A8] shrink-0">
              <Image
                src="/hero-ghee-jar.jpg"
                alt="GauTattva A2 Ghee"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-serif font-bold text-sm text-[#1F3A22] leading-tight">
                GauTattva Organics A2 Gir Cow Vedic Bilona Ghee - {order.jar_size}
              </h4>
              <p className="text-[11px] text-stone-500">
                Seller: <strong className="text-stone-800">{knowledgeBase.brand.manufacturer.name}</strong> &bull; Qty: {order.quantity}
              </p>
              <p className="font-serif font-bold text-sm text-[#1F3A22]">
                ₹{order.amount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenInvoice();
              }}
              className="bg-[#FEF5E7] hover:bg-[#FAF6EE] text-[#996417] hover:text-[#74490c] font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-[#E7D0A8] shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#C9882B]" />
              <span>Download Official GST Tax Invoice</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onBuyAgain(order.jar_size);
              }}
              className="bg-[#1F3A22] hover:bg-[#142817] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#FFE500]" />
              <span>Buy It Again (Reorder)</span>
            </button>
          </div>

          {/* Customer Care / WhatsApp */}
          <div className="pt-2 text-center text-[11px] text-stone-500">
            Need shipment assistance? WhatsApp Vedic Concierge directly at{' '}
            <a
              href="https://wa.me/919057000446"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9882B] font-bold hover:underline"
            >
              +91 9057000446
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
