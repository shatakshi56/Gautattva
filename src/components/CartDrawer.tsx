'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, Zap, ShoppingBag, AlertCircle, Phone, MessageCircle, Minus, Plus } from 'lucide-react';
import { JarSize } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';
import { syncClientCart, trackClientEvent } from '@/lib/session';

interface CartItem {
  jarSize: JarSize;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (jarSize: JarSize, delta: number) => void;
  onRemoveItem: (jarSize: JarSize) => void;
  onCheckout: () => void;
  flashMessage?: string | null;
  onClearFlash?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  flashMessage,
  onClearFlash,
}) => {
  const [localFlashMessage, setLocalFlashMessage] = useState<string | null>(flashMessage || null);

  useEffect(() => {
    if (flashMessage) {
      setLocalFlashMessage(flashMessage);
    }
  }, [flashMessage]);

  useEffect(() => {
    if (!isOpen) {
      setLocalFlashMessage(null);
      if (onClearFlash) onClearFlash();
    }
  }, [isOpen, onClearFlash]);

  const variants = knowledgeBase.product.variants;
  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const totalAmount = items.reduce((sum, item) => {
    const v = variants.find((varItem) => varItem.id === item.jarSize);
    return sum + (v ? v.price * item.quantity : 0);
  }, 0);

  // Sync cart session when items change
  useEffect(() => {
    if (items.length > 0) {
      syncClientCart({
        jar_size: items[0].jarSize,
        quantity: totalItemsCount,
        cart_amount: totalAmount,
        status: 'active',
      });
    }
  }, [items, totalItemsCount, totalAmount]);

  if (!isOpen) return null;

  const handleIncrement = (jarSize: JarSize) => {
    const currentItem = items.find((i) => i.jarSize === jarSize);
    const currentQty = currentItem ? currentItem.quantity : 0;

    // Rule 1: 5L pack capped at 2
    if (jarSize === '5000ml' && currentQty >= 2) {
      setLocalFlashMessage(
        'Maximum allowed for 5L jar is 2 packs per order. For bulk orders, please contact +91 9057000446.'
      );
      return;
    }

    // Rule 2: Other variants capped at 5
    if (currentQty >= 5) {
      setLocalFlashMessage(
        'Maximum allowed quantity for this variant is 5 packs. For bulk orders, please contact +91 9057000446.'
      );
      return;
    }

    // Rule 3: Total cart count capped at 5
    if (totalItemsCount >= 5) {
      setLocalFlashMessage(
        'Maximum allowed total quantity to buy at once is 5 packs. For bulk orders, please contact +91 9057000446.'
      );
      return;
    }

    setLocalFlashMessage(null);
    if (onClearFlash) onClearFlash();
    onUpdateQuantity(jarSize, 1);
  };

  const handleDecrement = (jarSize: JarSize) => {
    setLocalFlashMessage(null);
    if (onClearFlash) onClearFlash();
    onUpdateQuantity(jarSize, -1);
  };

  const handleRemove = (jarSize: JarSize) => {
    setLocalFlashMessage(null);
    if (onClearFlash) onClearFlash();
    onRemoveItem(jarSize);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between border-l border-[#E7D0A8]">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1F3A22]" />
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F3A22]">
                Sacred Basket ({totalItemsCount})
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Max 2 packs of 5L • Max 5 packs total per order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flash Alert Banner when limits are exceeded */}
        {localFlashMessage && (
          <div className="p-3.5 mx-5 mt-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 animate-fadeIn shadow-xs shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="font-semibold leading-relaxed">{localFlashMessage}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="tel:+919057000446"
                  className="inline-flex items-center gap-1.5 font-bold text-[#1F3A22] bg-white px-2.5 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-100/70 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9882B]" />
                  <span>Call: +91 9057000446</span>
                </a>
                <a
                  href="https://wa.me/919057000446?text=Pranam,%20I%20would%20like%20to%20place%20a%20bulk%20order%20for%20GauTattva%20A2%20Gir%20Cow%20Ghee."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-50 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Bulk</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-3" />
              <p className="text-sm font-semibold">Your sacred basket is empty</p>
              <p className="text-xs text-stone-500 mt-1">
                Select your preferred jar of Vedic Bilona Ghee to experience genuine purity.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const v = variants.find((varItem) => varItem.id === item.jarSize);
              if (!v) return null;
              const isMaxForThis =
                (item.jarSize === '5000ml' && item.quantity >= 2) ||
                item.quantity >= 5 ||
                totalItemsCount >= 5;

              return (
                <div
                  key={item.jarSize}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-[#1C1917]">{v.size}</h4>
                    <span className="text-xs text-stone-500">
                      {v.tag}
                      {item.jarSize === '5000ml' && ' • Max 2 packs'}
                    </span>
                    <div className="mt-2 text-sm font-bold text-[#1F3A22]">
                      ₹{(v.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                      <button
                        onClick={() => handleDecrement(item.jarSize)}
                        className="px-2.5 py-1.5 text-xs font-bold hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-[#1F3A22]">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrement(item.jarSize)}
                        className={`px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          isMaxForThis
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                            : 'hover:bg-stone-200 text-stone-700'
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.jarSize)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-white space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600">Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'pack' : 'packs'})</span>
              <span className="font-bold text-[#1F3A22] text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
              <span>Shiprocket Express Delivery</span>
              <span>FREE</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[#FAF6EE] border border-[#E7D0A8]/80 text-stone-700">
              <span className="font-semibold text-stone-600">Payment:</span>
              <span className="text-[11px] font-bold text-[#1F3A22] flex items-center gap-1.5">
                <span>Prepaid via Razorpay</span>
                <span className="text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 text-[10px] font-bold">
                  COD Not Available
                </span>
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-4 rounded-2xl bg-[#C9882B] hover:bg-[#B37521] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Proceed to 1-Tap Checkout • ₹{totalAmount.toLocaleString('en-IN')}</span>
            </button>

            <div className="text-center">
              <p className="text-[11px] text-stone-500">
                Need more than 5 packs?{' '}
                <a href="tel:+919057000446" className="text-[#C9882B] font-bold underline underline-offset-2">
                  Call for Bulk Order
                </a>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
