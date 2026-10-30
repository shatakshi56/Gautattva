'use client';

import React from 'react';
import Image from 'next/image';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Leaf,
  Sun,
  Award,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const AboutGauTattvaSection: React.FC = () => {
  return (
    <section id="about" className="scroll-mt-24 py-20 bg-gradient-to-b from-[#FDFBF7] via-[#FBF7EE] to-[#FDFBF7] relative overflow-hidden">
      {/* Decorative subtle patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5E6CC]/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8F0E9]/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF5E7] border border-[#E7D0A8] text-[#996417] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9882B]" />
            <span>The Soul of GauTattva</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3A22] leading-tight">
            Reviving Ancient Vedic Purity For The Modern Family
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
            GauTattva was born with a single sacred conviction: that true nourishment cannot come from industrial factories or automated machines. It originates from revered, happy indigenous Gir cows, pristine organic soils, and timeless Ayurvedic wisdom.
          </p>
        </div>

        {/* 2-Column Story + Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 group">
              <Image
                src="/gir-cows-pasture.jpg"
                alt="Sacred Gir Cows grazing at GauTattva Gaushala"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-[#C9882B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  Sacred Aravalli Pastures
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold">
                  Cruelty-Free Ahimsa Gaushala (Jaipur)
                </h3>
                <p className="text-xs text-stone-200 mt-1">
                  Our Gir cows roam freely in lush herbal pastures, grazing under the natural sun.
                </p>
              </div>
            </div>

            {/* Overlapping Floating Card */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-white p-5 rounded-2xl shadow-xl border border-[#E7D0A8] max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FEF5E7] flex items-center justify-center text-[#C9882B] shrink-0 font-bold text-xl">
                  🐄
                </div>
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block">
                    Calf-First Policy
                  </span>
                  <span className="font-bold text-sm text-[#1F3A22]">
                    100% Ahimsa Certified
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Milk is only harvested after the calf has drunk its full share.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Brand Manifesto & Core Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9882B]">
                Rooted in Charaka Samhita &amp; Rigveda
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3A22]">
                Not Just A Brand — A Vedic Awakening
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                In Sanskrit, <strong className="text-stone-900">“Gau”</strong> represents the sacred cow—the universal mother—and <strong className="text-stone-900">“Tattva”</strong> signifies the fundamental elemental truth. At GauTattva, every creation is an ode to purity, conscious living, and ancient wellness.
              </p>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#C9882B]">
                  <Sun className="w-5 h-5" />
                  <h4 className="font-bold text-xs text-[#1F3A22]">Surya Ketu Nadi Milk</h4>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Gir cows possess a distinct hump that absorbs solar energy, enriching milk with therapeutic gold salts and A2 beta-casein.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Leaf className="w-5 h-5" />
                  <h4 className="font-bold text-xs text-[#1F3A22]">Zero Chemical Adulteration</h4>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal">
                  No synthetic hormones (Oxytocin), zero chemical preservatives, no palm oil, and zero coloring agents.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#996417]">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="font-bold text-xs text-[#1F3A22]">Clay Earthen Pots &amp; Bilona</h4>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Milk is boiled in open earthenware and curd is churned with wooden bilona at Brahma Muhurta (before sunrise).
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-blue-700">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-bold text-xs text-[#1F3A22]">NABL Lab Tested Every Batch</h4>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Every single batch is tested by Jagdamba Labs (Report JLFD260702144) for complete purity and consumer trust.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/products/a2-gir-cow-bilona-ghee"
                className="bg-[#1F3A22] hover:bg-[#142817] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Experience Our Flagship A2 Ghee</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/gallery"
                className="text-stone-700 hover:text-[#C9882B] text-xs sm:text-sm font-semibold underline underline-offset-4 transition-colors"
              >
                View Full Gaushala Gallery &amp; Photos →
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
