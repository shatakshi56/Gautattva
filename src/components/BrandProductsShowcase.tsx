'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Star,
  ShieldCheck,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Heart,
  X,
  ExternalLink
} from 'lucide-react';

interface UpcomingProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  badge: string;
  expectedLaunch: string;
  highlights: string[];
}

const UPCOMING_PRODUCTS: UpcomingProduct[] = [
  {
    id: 'honey',
    name: 'GauTattva Raw Wild Forest Honey',
    category: 'Vedic Superfoods',
    description: 'Unprocessed, single-origin raw nectar harvested ethically from deep Aravalli forest flora. Never heated, zero sugar adulteration.',
    image: '/products/honey.jpg',
    badge: 'Coming Soon',
    expectedLaunch: 'Winter 2026',
    highlights: ['100% Unheated Raw', 'Wild Multifloral Nectar', 'Zero Added Sugars'],
  },
  {
    id: 'oils',
    name: 'GauTattva Wood-Pressed Mustard & Sesame Oil',
    category: 'Cold-Pressed Oils',
    description: 'Crushed on traditional wooden Kolhu (Ghani) below 38°C to retain vital antioxidants, pungent aroma, and omega fatty acids.',
    image: '/products/oils.jpg',
    badge: 'In Production',
    expectedLaunch: 'Coming Soon',
    highlights: ['Wooden Kolhu Pressed', 'Low Temperature Extraction', 'Zero Hexane/Chemicals'],
  },
  {
    id: 'chyawanprash',
    name: 'GauTattva Organic Vedic Chyawanprash',
    category: 'Ayurvedic Rasayana',
    description: 'Crafted strictly per Sharangadhara Samhita using wild amla, 40+ forest herbs, raw honey, and our pure A2 Bilona Ghee base.',
    image: '/products/chyawanprash.jpg',
    badge: 'Formulation Phase',
    expectedLaunch: 'Coming Soon',
    highlights: ['A2 Bilona Ghee Base', 'Wild Organic Amla', '40+ Himalayan Herbs'],
  },
  {
    id: 'dhoop',
    name: 'GauTattva Gaushala Vedic Dhoop Cups',
    category: 'Sacred Living',
    description: 'Hand-pressed with sacred Gir cow dung, camphor, guggul, loban, and havan herbs to purify indoor air and eliminate negative energy.',
    image: '/products/dhoop.jpg',
    badge: 'Coming Soon',
    expectedLaunch: 'Coming Soon',
    highlights: ['100% Gir Cow Dung', 'Pure Camphor & Guggul', 'Chemical-Free Aroma'],
  },
];

export const BrandProductsShowcase: React.FC = () => {
  const [notifyModalProduct, setNotifyModalProduct] = useState<UpcomingProduct | null>(null);
  const [notifyPhone, setNotifyPhone] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyPhone.trim()) return;
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifySuccess(false);
      setNotifyModalProduct(null);
      setNotifyPhone('');
    }, 2500);
  };

  return (
    <section id="products" className="py-20 bg-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF5E7] border border-[#E7D0A8] text-[#996417] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9882B]" />
            <span>The GauTattva Collection</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3A22] leading-tight">
            Pure Ayurvedic &amp; Vedic Essentials
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
            Every GauTattva creation adheres to ancient Vedic texts. While our brand is expanding its sacred organic pantry, our flagship <strong>A2 Gir Cow Vedic Bilona Ghee</strong> is available for immediate nationwide delivery.
          </p>
        </div>

        {/* 1. Flagship Live Product Feature Banner (The Ghee Product) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider text-stone-700">
                Active Flagship Product • Ready to Dispatch
              </h3>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline">
              Click below to view full details, lab reports &amp; jar options
            </span>
          </div>

          {/* Ghee Feature Card - Links directly to /products/a2-gir-cow-bilona-ghee */}
          <Link
            href="/products/a2-gir-cow-bilona-ghee"
            className="group block bg-gradient-to-br from-white to-[#FEFDF9] rounded-3xl border-2 border-[#E7D0A8] hover:border-[#C9882B] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              {/* Product Visual */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex items-center justify-center bg-gradient-to-br from-[#FAF6EE] to-[#F5E6CC]/40 relative">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-white">
                  <Image
                    src="/hero-ghee-jar.jpg"
                    alt="GauTattva Organics A2 Gir Cow Vedic Bilona Ghee"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1F3A22] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#FFE500]" />
                    <span>Flagship Masterpiece</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#1F3A22] text-xs font-bold px-3 py-1.5 rounded-xl shadow-md border border-stone-200">
                    A2 Cultured Curd Churned
                  </div>
                </div>
              </div>

              {/* Product Info & Action */}
              <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Stock &bull; Free Express Delivery</span>
                  </span>
                  <div className="flex items-center gap-1 text-[#C9882B] text-xs font-bold">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C9882B] text-[#C9882B]" />
                      ))}
                    </div>
                    <span>4.98</span>
                    <span className="text-stone-400 font-normal">(2,840+ reviews)</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F3A22] group-hover:text-[#C9882B] transition-colors leading-tight">
                    GauTattva Organics A2 Gir Cow Vedic Bilona Ghee
                  </h4>
                  <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                    Handcrafted in clay pots from curd of free-grazing indigenous Gir cows. Bi-directional wooden churning at Brahma Muhurta for golden Danedar texture, rich aroma, and verified A2 beta-casein purity.
                  </p>
                </div>

                {/* Highlights tags */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-stone-700 font-medium">
                  <div className="bg-[#FAF6EE] p-2 rounded-lg border border-[#E7D0A8]/60 text-center">
                    <span className="block font-bold text-[#1F3A22]">NABL Tested</span>
                    <span className="text-stone-500">Zero Adulteration</span>
                  </div>
                  <div className="bg-[#FAF6EE] p-2 rounded-lg border border-[#E7D0A8]/60 text-center">
                    <span className="block font-bold text-[#1F3A22]">A2 Beta-Casein</span>
                    <span className="text-stone-500">Pure Gir Cows</span>
                  </div>
                  <div className="bg-[#FAF6EE] p-2 rounded-lg border border-[#E7D0A8]/60 text-center">
                    <span className="block font-bold text-[#1F3A22]">Eco Glass Jar</span>
                    <span className="text-stone-500">100% Recyclable</span>
                  </div>
                  <div className="bg-[#FAF6EE] p-2 rounded-lg border border-[#E7D0A8]/60 text-center">
                    <span className="block font-bold text-[#1F3A22]">Vedic Churned</span>
                    <span className="text-stone-500">Brahma Muhurta</span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-200">
                  <div>
                    <span className="text-xs text-stone-400 uppercase tracking-wider block font-semibold">
                      Available in 350ml, 500ml, 1L &amp; 5L
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-bold text-2xl sm:text-3xl text-[#1F3A22]">
                        Starts ₹899
                      </span>
                      <span className="text-xs text-stone-400 line-through">₹1,199</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                        Save 25%
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#1F3A22] group-hover:bg-[#C9882B] text-white font-bold text-sm py-3.5 px-7 rounded-full inline-flex items-center justify-center gap-2 shadow-lg transition-all duration-300">
                    <span>View Product &amp; Order Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>

            </div>
          </Link>
        </div>

        {/* 2. Upcoming Brand Products (Coming Soon) */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9882B]" />
                <h3 className="font-bold text-lg sm:text-xl text-[#1F3A22]">
                  Expanding The GauTattva Organic Pantry
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                More traditional Vedic products currently being perfected under ethical standards.
              </p>
            </div>
            <span className="text-xs font-bold text-[#C9882B] bg-[#FEF5E7] px-3 py-1.5 rounded-full border border-[#E7D0A8] self-start sm:self-auto">
              Launching Soon • Pre-Register
            </span>
          </div>

          {/* Upcoming Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {UPCOMING_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {prod.badge}
                  </div>
                  <div className="absolute bottom-2 left-2.5 bg-white/90 backdrop-blur-xs text-[#1F3A22] text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {prod.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#1F3A22] group-hover:text-[#C9882B] transition-colors leading-snug">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1 pt-1 border-t border-stone-100">
                    {prod.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-stone-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Notify Action Button */}
                  <button
                    onClick={() => setNotifyModalProduct(prod)}
                    className="w-full bg-[#FAF6EE] hover:bg-[#FEF5E7] text-[#996417] hover:text-[#74490c] font-bold text-xs py-2 px-3 rounded-xl border border-[#E7D0A8] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#C9882B]" />
                    <span>Notify Me When Ready</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Notify Me Pre-Register Modal */}
      {notifyModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setNotifyModalProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {notifySuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-stone-900">You&apos;re On The VIP List!</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  We will send you early access discount codes on WhatsApp as soon as{' '}
                  <strong className="text-stone-800">{notifyModalProduct.name}</strong> launches!
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                    <Image
                      src={notifyModalProduct.image}
                      alt={notifyModalProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#C9882B]">
                      Early Bird Waitlist
                    </span>
                    <h3 className="font-bold text-sm text-[#1F3A22] leading-tight">
                      {notifyModalProduct.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-stone-600">
                  Be the first to know when the fresh harvest is bottled. Early subscribers receive an exclusive <strong>20% launch voucher</strong>!
                </p>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Mobile / WhatsApp Number:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98765 43210"
                    value={notifyPhone}
                    onChange={(e) => setNotifyPhone(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#C9882B] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1F3A22] hover:bg-[#142817] text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-amber-300" />
                  <span>Notify Me On WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
