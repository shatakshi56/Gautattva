'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import knowledgeBase from '@/data/knowledge_base.json';

export const VedicProcessSection: React.FC = () => {
  const steps = knowledgeBase.vedic_process;

  return (
    <section id="vedic-process" className="scroll-mt-24 py-16 bg-[#FAF6EE] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C9882B] bg-[#FEF5E7] px-3 py-1 rounded-full border border-[#E7D0A8]">
            Vedic Tradition Unbroken
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F3A22] mt-3">
            The Sacred 5-Step Bilona Method
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Commercial ghee uses mechanical centrifugal cream heating. GauTattva follows the strict Charaka Samhita guidelines: cultured curd churned with wooden bilona in terracotta clay pots.
          </p>
        </div>

        {/* Visual Storytelling Showcase (Two Featured Images) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border-2 border-[#E7D0A8] shadow-lg group">
            <Image
              src="/gir-cows-pasture.jpg"
              alt="Sacred Gir Cows grazing in pastures"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Ethical &amp; Reverent Dairy
              </span>
              <h3 className="text-xl font-serif font-bold">1. Free Pasture Ahimsa Grazing</h3>
              <p className="text-xs text-stone-200 mt-1">
                Bos Indicus Gir cows feeding on seasonal herbs (Neem, Tulsi, Shatavari). The calf drinks first with love.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border-2 border-[#E7D0A8] shadow-lg group">
            <Image
              src="/bilona-process.jpg"
              alt="Traditional Wooden Bilona Churning in clay pot"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Handcrafted Hand-Pulled Churner
              </span>
              <h3 className="text-xl font-serif font-bold">4. Two-Way Wooden Bilona Churning</h3>
              <p className="text-xs text-stone-200 mt-1">
                Cultured whole curd hand-churned in terracotta clay pots during Brahma Muhurta to yield pure cultured makkhan.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Interactive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative"
            >
              <div className="w-8 h-8 rounded-full bg-[#1F3A22] text-[#C9882B] font-bold text-xs flex items-center justify-center mb-3">
                0{st.step}
              </div>
              <h4 className="font-bold text-sm text-[#1F3A22] mb-1.5 leading-snug">
                {st.title}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {st.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
