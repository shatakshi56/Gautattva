'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { AboutGauTattvaSection } from '@/components/AboutGauTattvaSection';
import { BrandProductsShowcase } from '@/components/BrandProductsShowcase';
import { VedicProcessSection } from '@/components/VedicProcessSection';
import { GaushalaGallerySection } from '@/components/GaushalaGallerySection';
import { LabReportSection } from '@/components/LabReportSection';
import { HealthBenefitsSection } from '@/components/HealthBenefitsSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { WhatsAppReorderSimulator } from '@/components/WhatsAppReorderSimulator';
import { ChatWidget } from '@/components/ChatWidget';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { SetReminderModal } from '@/components/SetReminderModal';
import { Footer } from '@/components/Footer';
import { JarSize } from '@/lib/types';
import { trackClientEvent } from '@/lib/session';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Star,
  CheckCircle2,
  Package,
  Sun,
  Truck
} from 'lucide-react';

export default function GauTattvaBrandHome() {
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
    trackClientEvent('homepage_view');

    const scrollToHash = () => {
      if (typeof window === 'undefined') return false;
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
      }
      return false;
    };

    if (typeof window !== 'undefined' && window.location.hash) {
      if (!scrollToHash()) {
        const t1 = setTimeout(scrollToHash, 100);
        const t2 = setTimeout(scrollToHash, 300);
        const t3 = setTimeout(scrollToHash, 600);
        const t4 = setTimeout(scrollToHash, 1000);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
          clearTimeout(t4);
        };
      }
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window === 'undefined') return;
      if (window.location.hash) {
        const targetId = window.location.hash.replace('#', '');
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleUpdateQuantity = (jar: JarSize, delta: number) => {
    setCartItems((prev) => {
      const currentItem = prev.find((i) => i.jarSize === jar);
      if (!currentItem) return prev;
      const currentQty = currentItem.quantity;

      if (delta > 0 && currentQty >= 5) {
        setCartFlashMessage('Maximum quantity per order reached.');
        return prev;
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

  const scrollToSimulator = () => {
    const el = document.getElementById('reorder-engine');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* Brand Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenSimulator={scrollToSimulator}
        onOpenReminder={() => setIsReminderOpen(true)}
      />

      {/* Main Brand Content */}
      <main className="flex-1">
        
        {/* 1. Brand Hero Banner */}
        <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 bg-gradient-to-b from-[#F5EEDD]/70 via-[#FAF6EE] to-[#FDFBF7] border-b border-[#E7D0A8]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Brand Statement & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF5E7] border border-[#E7D0A8] text-[#996417] text-xs font-bold uppercase tracking-widest shadow-2xs">
                  <Sun className="w-3.5 h-3.5 text-[#C9882B]" />
                  <span>Vedic Wisdom &bull; Sacred A2 Gaushala</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1F3A22] leading-[1.15] tracking-tight">
                  Pure Ayurvedic Living Rooted In Vedic Heritage
                </h1>

                <p className="text-stone-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Welcome to <strong className="text-stone-900">GauTattva Organics</strong> — reviving sacred Ayurvedic health traditions from free-grazing indigenous Gir cows in Rajasthan&apos;s pristine Aravalli pastures. 100% Ahimsa, zero chemicals, and lab-tested purity.
                </p>

                {/* Trust Metrics Pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs text-xs font-semibold text-stone-700">
                    <Star className="w-3.5 h-3.5 fill-[#C9882B] text-[#C9882B]" />
                    <span>4.98 / 5 (2,840+ Buyers)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs text-xs font-semibold text-stone-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NABL Lab Test Passed</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs text-xs font-semibold text-stone-700">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>100% Cruelty-Free Ahimsa</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/products/a2-gir-cow-bilona-ghee"
                    className="w-full sm:w-auto bg-[#1F3A22] hover:bg-[#142817] text-white text-sm sm:text-base font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Shop A2 Bilona Ghee (In Stock)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FFE500]" />
                  </Link>

                  <a
                    href="#products"
                    className="w-full sm:w-auto bg-white hover:bg-[#FAF6EE] text-stone-800 text-sm font-bold py-3.5 px-6 rounded-full border border-[#E7D0A8] transition-colors flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <span>View All Brand Products</span>
                  </a>

                  <Link
                    href="/orders"
                    className="w-full sm:w-auto bg-[#1F3A22] hover:bg-[#142817] text-white text-xs font-bold py-3 px-5 rounded-full border border-[#C9882B]/40 shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#FFE500]" />
                    <span>Track Orders</span>
                  </Link>
                </div>

              </div>

              {/* Right Column: Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-square group">
                  <Image
                    src="/hero-ghee-jar.jpg"
                    alt="GauTattva Organics Pure A2 Gir Cow Vedic Bilona Ghee"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs rounded-2xl p-3 shadow-lg border border-stone-200 flex items-center gap-3 max-w-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF5E7] flex items-center justify-center text-xl shrink-0">
                      🧈
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#C9882B] block">
                        Flagship Harvest
                      </span>
                      <span className="font-bold text-xs text-[#1F3A22] block leading-tight">
                        A2 Gir Cow Vedic Bilona Ghee
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Ready to Ship across India
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                    <Link
                      href="/products/a2-gir-cow-bilona-ghee"
                      className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-white transition-colors"
                    >
                      <span>Explore this product &bull; Jar sizes &amp; NABL Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. About GauTattva Section */}
        <AboutGauTattvaSection />

        {/* 3. Products Showcase (Flagship Ghee + Upcoming Range) */}
        <BrandProductsShowcase />

        {/* 4. The 5-Step Sacred Vedic Process */}
        <VedicProcessSection />

        {/* 5. Authentic Gaushala Life Gallery */}
        <GaushalaGallerySection />

        {/* 6. Certified Jagdamba Lab Report (NABL) */}
        <LabReportSection />

        {/* 7. Health & Ayurveda Benefits Matrix */}
        <HealthBenefitsSection />

        {/* 8. Customer Reviews */}
        <ReviewsSection />

        {/* 9. WhatsApp Reorder Engine Simulator */}
        <WhatsAppReorderSimulator onOpenReminder={() => setIsReminderOpen(true)} />

      </main>

      {/* Vedic AI Concierge Widget */}
      <ChatWidget />

      {/* Footer */}
      <Footer onOpenSimulator={scrollToSimulator} />

      {/* Cart Drawer */}
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
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedJar={selectedJar}
        quantity={checkoutQuantity}
      />

      {/* Set Reminder Modal */}
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
