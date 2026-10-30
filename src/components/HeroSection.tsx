'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, Truck, Sparkles, Check, Zap, RefreshCw, Lock, Bell } from 'lucide-react';
import { JarSize } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';

interface HeroSectionProps {
  onInstantBuy: (variantId: JarSize, quantity?: number) => void;
  onAddToCart: (variantId: JarSize, quantity?: number) => void;
  onOpenLabReport?: () => void;
  onOpenReminder?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onInstantBuy,
  onAddToCart,
  onOpenReminder,
}) => {
  const [selectedJar, setSelectedJar] = useState<JarSize>('1000ml');
  const [activeImage, setActiveImage] = useState<string>('/hero-ghee-jar.jpg');

  const variants = knowledgeBase.product.variants;
  const currentVariant = variants.find((v) => v.id === selectedJar) || variants[1];

  const thumbnails = [
    { src: '/hero-ghee-jar.jpg', title: 'Golden Bilona Jar' },
    { src: '/gautattva-label.jpg', title: 'Packaging Label' },
    { src: '/bilona-process.jpg', title: 'Earthen Churning' },
    { src: '/gir-cows-pasture.jpg', title: 'Ahimsa Gir Cows' },
  ];

  return (
    <section id="product-hero" className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        
        {/* Left Column: Product Visuals Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full max-w-xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#F5EEDF] to-[#EAE0CD] border-2 border-[#E7D0A8] shadow-xl">
            <Image
              src={activeImage}
              alt="GauTattva Organics A2 Gir Cow Vedic Bilona Ghee"
              fill
              className="object-cover transition-all duration-500 hover:scale-105"
              priority
            />

            {/* Purity Badge overlay */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C9882B]/40 shadow-md flex items-center gap-1.5 text-xs font-bold text-[#1F3A22]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9882B]" />
              <span>100% AHIMSA BILONA</span>
            </div>

            {/* Tested lab pill */}
            <a
              href="#lab-report"
              className="absolute bottom-4 right-4 bg-[#1F3A22]/90 hover:bg-[#142817] text-white px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4 text-[#C9882B]" />
              <span>View Certified Lab Report</span>
            </a>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex justify-center gap-3 sm:gap-4 max-w-xl mx-auto overflow-x-auto pb-2">
            {thumbnails.map((t, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(t.src)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImage === t.src
                    ? 'border-[#C9882B] shadow-md scale-105'
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={t.src} alt={t.title} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Value Pillars Banner under gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-4 text-center">
            <div className="p-3 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
              <span className="block text-lg font-bold text-[#1F3A22]">100%</span>
              <span className="text-[11px] text-[#57534E] leading-tight">Bos Indicus Gir Cow</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
              <span className="block text-lg font-bold text-[#1F3A22]">0%</span>
              <span className="text-[11px] text-[#57534E] leading-tight">Lactose &amp; Casein</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
              <span className="block text-lg font-bold text-[#1F3A22]">250°C</span>
              <span className="text-[11px] text-[#57534E] leading-tight">High Smoke Point</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
              <span className="block text-lg font-bold text-[#1F3A22]">Wood</span>
              <span className="text-[11px] text-[#57534E] leading-tight">Bilona Churned</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Selector, Pricing & Reorder Engine Intro */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header & Title */}
          <div>
            <a
              href="#reviews"
              className="inline-flex items-center gap-2 mb-2 group cursor-pointer hover:opacity-90 transition-all"
            >
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1C1917] group-hover:text-[#C9882B] transition-colors">
                4.98 / 5.0
              </span>
              <span className="text-xs text-[#78716C] group-hover:text-[#1C1917] transition-colors underline decoration-dotted decoration-stone-400 underline-offset-2">
                • 3,840+ Happy Vedic Families
              </span>
            </a>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F3A22] leading-tight tracking-tight">
              A2 Gir Cow Vedic Bilona Ghee
            </h1>
            <p className="text-sm font-medium text-[#C9882B] italic mt-1">
              &quot;Rooted in tradition, inspired by purity&quot;
            </p>
            <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
              Crafted from the cultured curd of grass-fed native Gir cows using traditional two-way wooden bilona churning in earthen clay pots. Rich golden aroma and authentic granular <em>(danedar)</em> texture.
            </p>
          </div>

          {/* Variant Selector Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#1C1917] flex-wrap gap-2">
              <span>SELECT YOUR PACK SIZE</span>
              {onOpenReminder ? (
                <button
                  type="button"
                  onClick={onOpenReminder}
                  className="text-[#C9882B] hover:text-[#996417] flex items-center gap-1.5 transition-colors cursor-pointer group"
                >
                  <Bell className="w-3.5 h-3.5 text-[#C9882B] group-hover:scale-110 transition-transform" />
                  <span className="underline decoration-dotted decoration-[#C9882B] underline-offset-2">
                    Set Custom Reorder Reminder
                  </span>
                </button>
              ) : (
                <span className="text-[#C9882B] flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Auto WhatsApp Reorder Enabled
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {variants.map((v) => {
                const isSelected = selectedJar === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedJar(v.id as JarSize)}
                    className={`relative p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#C9882B] bg-[#FEFDF9] shadow-md ring-2 ring-[#C9882B]/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      {/* Left: Radio & Size & Tag */}
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#C9882B] bg-[#C9882B]' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className="font-bold text-base text-[#1C1917]">{v.size}</span>
                            <span className="text-[10px] sm:text-[11px] font-semibold bg-[#FEF5E7] text-[#996417] px-2 py-0.5 rounded-full border border-[#E7D0A8] truncate">
                              {v.tag}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing */}
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-lg sm:text-xl font-bold text-[#1F3A22]">₹{v.price}</span>
                          <span className="text-xs text-[#A8A29E] line-through">₹{v.mrp}</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 block">
                          Save {v.discount_percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-1">
            <button
              onClick={() => onInstantBuy(selectedJar)}
              className="w-full py-4 px-6 rounded-2xl bg-[#C9882B] hover:bg-[#B37521] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>
                BUY NOW • ₹{currentVariant.price.toLocaleString('en-IN')} (1-Tap Checkout)
              </span>
            </button>

            <button
              onClick={() => onAddToCart(selectedJar)}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1F3A22] hover:bg-[#142817] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Add to Sacred Basket</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="rounded-2xl bg-[#FAF6EE] p-4 border border-[#E7D0A8] space-y-2 text-xs text-[#57534E]">
            <div className="flex items-center gap-2 text-[#1F3A22] font-semibold">
              <Truck className="w-4 h-4 text-[#C9882B]" />
              <span>Dispatched via Shiprocket Express with Live WhatsApp Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Lab Verified: 0% Casein Solids, 0% Added Sugars</span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E7D0A8]/60 text-[11px]">
              <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                Online Prepaid (UPI / Cards / Netbanking)
              </span>
              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                COD Not Available
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
