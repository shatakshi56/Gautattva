'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { PackagingLabelSection } from '@/components/PackagingLabelSection';
import { LabReportSection } from '@/components/LabReportSection';
import { VedicProcessSection } from '@/components/VedicProcessSection';
import { HealthBenefitsSection } from '@/components/HealthBenefitsSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { WhatsAppReorderSimulator } from '@/components/WhatsAppReorderSimulator';
import { ChatWidget } from '@/components/ChatWidget';
import { CheckoutModal } from '@/components/CheckoutModal';
import { SetReminderModal } from '@/components/SetReminderModal';
import { CartDrawer } from '@/components/CartDrawer';
import { StickyBottomBar } from '@/components/StickyBottomBar';
import { Footer } from '@/components/Footer';
import { JarSize } from '@/lib/types';
import { trackClientEvent } from '@/lib/session';
import { ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';

export default function GheeProductPage() {
  const [selectedJar, setSelectedJar] = useState<JarSize>('1000ml');
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderConfig, setReminderConfig] = useState<{
    jar?: JarSize;
    name?: string;
    phone?: string;
  }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{ jarSize: JarSize; quantity: number }>>([
    { jarSize: '1000ml', quantity: 1 },
  ]);
  const [cartFlashMessage, setCartFlashMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo(0, 0);
    }
    trackClientEvent('product_page_view');
  }, []);

  const handleInstantBuy = (jar: JarSize, qty: number = 1) => {
    setSelectedJar(jar);
    const maxAllowed = jar === '5000ml' ? 2 : 5;
    setCheckoutQuantity(Math.min(qty, maxAllowed));
    trackClientEvent('open_checkout');
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (jar: JarSize, qty: number = 1) => {
    setSelectedJar(jar);
    trackClientEvent('add_to_cart');
    const existing = cartItems.find((i) => i.jarSize === jar);
    const currentQty = existing ? existing.quantity : 0;
    const totalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

    // Rule 1: 5L pack capped at 2
    if (jar === '5000ml' && currentQty + qty > 2) {
      setCartFlashMessage(
        'Maximum allowed for 5L jar is 2 packs per order. For bulk orders, please contact +91 9057000446.'
      );
      setIsCartOpen(true);
      return;
    }

    // Rule 2: other variant capped at 5
    if (currentQty + qty > 5) {
      setCartFlashMessage(
        'Maximum allowed quantity for this variant is 5 packs. For bulk orders, please contact +91 9057000446.'
      );
      setIsCartOpen(true);
      return;
    }

    // Rule 3: total cart count capped at 5
    if (totalCount + qty > 5) {
      setCartFlashMessage(
        'Maximum allowed total quantity to buy at once is 5 packs. For bulk orders, please contact +91 9057000446.'
      );
      setIsCartOpen(true);
      return;
    }

    setCartFlashMessage(null);
    setCartItems((prev) => {
      const match = prev.find((i) => i.jarSize === jar);
      if (match) {
        return prev.map((i) => (i.jarSize === jar ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { jarSize: jar, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (jar: JarSize, delta: number) => {
    setCartItems((prev) => {
      const currentItem = prev.find((i) => i.jarSize === jar);
      if (!currentItem) return prev;
      const currentQty = currentItem.quantity;
      const totalCount = prev.reduce((acc, i) => acc + i.quantity, 0);

      if (delta > 0) {
        if (jar === '5000ml' && currentQty >= 2) {
          setCartFlashMessage(
            'Maximum allowed for 5L jar is 2 packs per order. For bulk orders, please contact +91 9057000446.'
          );
          return prev;
        }
        if (currentQty >= 5) {
          setCartFlashMessage(
            'Maximum allowed quantity for this variant is 5 packs. For bulk orders, please contact +91 9057000446.'
          );
          return prev;
        }
        if (totalCount >= 5) {
          setCartFlashMessage(
            'Maximum allowed total quantity to buy at once is 5 packs. For bulk orders, please contact +91 9057000446.'
          );
          return prev;
        }
      }

      setCartFlashMessage(null);
      return prev
        .map((i) => {
          if (i.jarSize === jar) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as Array<{ jarSize: JarSize; quantity: number }>;
    });
  };

  const handleRemoveItem = (jar: JarSize) => {
    setCartFlashMessage(null);
    setCartItems((prev) => prev.filter((i) => i.jarSize !== jar));
  };

  const handleOpenReminder = (jar?: JarSize, name?: string, phone?: string) => {
    setReminderConfig({
      jar: jar || selectedJar,
      name: name || '',
      phone: phone || '',
    });
    setIsReminderOpen(true);
  };

  const scrollToSimulator = () => {
    const el = document.getElementById('reorder-engine');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* Navigation Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenSimulator={scrollToSimulator}
        onOpenReminder={() => handleOpenReminder(selectedJar)}
      />

      {/* Brand Breadcrumb Strip */}
      <div className="bg-[#FAF6EE] border-b border-[#E7D0A8]/60 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Link href="/" className="hover:text-[#C9882B] flex items-center gap-1 font-medium transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>GauTattva Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <Link href="/#products" className="hover:text-[#C9882B] transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="font-bold text-[#1F3A22] truncate">
              A2 Gir Cow Vedic Bilona Ghee
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-semibold text-[#8B5A14]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9882B]" />
            <span>Pure Vedic Ahimsa Milk • Earthen Pot Churned</span>
          </div>
        </div>
      </div>

      {/* Main E-Commerce Product Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onInstantBuy={handleInstantBuy}
          onAddToCart={handleAddToCart}
          onOpenReminder={() => handleOpenReminder(selectedJar)}
        />

        {/* Authentic Product Label Showcase */}
        <PackagingLabelSection />

        {/* 5-Step Vedic Bilona Craft Journey */}
        <VedicProcessSection />

        {/* Certified Jagdamba Lab Report (JLFD260702144) */}
        <LabReportSection />

        {/* Health, Ayurveda & Comparative Matrix */}
        <HealthBenefitsSection />

        {/* Verified Customer Reviews */}
        <ReviewsSection />

        {/* WhatsApp AI Reorder Engine Simulator */}
        <WhatsAppReorderSimulator
          onOpenReminder={() => handleOpenReminder(selectedJar)}
        />
      </main>

      {/* Footer */}
      <Footer onOpenSimulator={scrollToSimulator} />

      {/* Mobile Sticky Buy Bar */}
      <StickyBottomBar selectedJar={selectedJar} onInstantBuy={handleInstantBuy} />

      {/* Floating Vedic AI Chat Concierge */}
      <ChatWidget />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          setCartFlashMessage(null);
        }}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        flashMessage={cartFlashMessage}
        onClearFlash={() => setCartFlashMessage(null)}
        onCheckout={() => {
          if (cartItems.length > 0) {
            setSelectedJar(cartItems[0].jarSize);
            setCheckoutQuantity(cartItems[0].quantity);
          }
          setIsCheckoutOpen(true);
        }}
      />

      {/* 1-Tap Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedJar={selectedJar}
        quantity={checkoutQuantity}
        onOpenReminder={(jar, name, phone) => handleOpenReminder(jar, name, phone)}
      />

      {/* Interactive Customer Replenishment Reminder Modal */}
      <SetReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        initialJar={reminderConfig.jar || selectedJar}
        initialCustomerName={reminderConfig.name}
        initialPhone={reminderConfig.phone}
      />
    </div>
  );
}
