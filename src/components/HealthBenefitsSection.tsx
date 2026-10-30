'use client';

import React from 'react';
import { Heart, Brain, Flame, Sparkles, Check, X } from 'lucide-react';
import knowledgeBase from '@/data/knowledge_base.json';

export const HealthBenefitsSection: React.FC = () => {
  const benefits = knowledgeBase.health_benefits;

  return (
    <section id="benefits" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C9882B] bg-[#FEF5E7] px-3 py-1 rounded-full border border-[#E7D0A8]">
            Ayurvedic Superfood
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F3A22] mt-3">
            Why Vedic Bilona Ghee Heals From Within
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            In Ayurvedic Rasayana therapy, pure A2 Gir Cow Bilona Ghee is revered as the highest Sattvic food to balance Vata and Pitta doshas.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#FDFBF7] border border-stone-200 hover:border-[#C9882B]/60 transition-all shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FEF5E7] text-[#C9882B] flex items-center justify-center mb-4">
                {i === 0 && <Heart className="w-5 h-5 text-rose-600" />}
                {i === 1 && <Sparkles className="w-5 h-5 text-[#C9882B]" />}
                {i === 2 && <Flame className="w-5 h-5 text-amber-600" />}
                {i === 3 && <Brain className="w-5 h-5 text-indigo-600" />}
                {i === 4 && <Check className="w-5 h-5 text-emerald-600" />}
              </div>
              <h3 className="font-bold text-base text-[#1F3A22] mb-2">{b.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-[#FAF6EE] rounded-3xl p-6 sm:p-8 border-2 border-[#E7D0A8] shadow-sm">
          <h3 className="text-xl font-serif font-bold text-[#1F3A22] text-center mb-6">
            Purity Comparison: GauTattva vs Others
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-300 text-stone-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Quality Parameter</th>
                  <th className="py-3 px-4 text-[#1F3A22] bg-[#EAE0CD]/40 rounded-t-xl font-bold">
                    GauTattva Organics
                  </th>
                  <th className="py-3 px-4">Commercial Dairy Ghee</th>
                  <th className="py-3 px-4">Refined Seed / Palm Oils</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-stone-900">Milk Source</td>
                  <td className="py-3.5 px-4 bg-[#EAE0CD]/30 font-bold text-[#1F3A22] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Grass-Fed Indigenous Gir Cows
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">Hybrid Jersey / Buffalo Milk</td>
                  <td className="py-3.5 px-4 text-stone-600">Genetically Modified Seeds</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-stone-900">Churning Method</td>
                  <td className="py-3.5 px-4 bg-[#EAE0CD]/30 font-bold text-[#1F3A22] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Earthen Pot Wooden Bilona
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">Cream Centrifugal Separator</td>
                  <td className="py-3.5 px-4 text-stone-600">Chemical Hexane Extraction</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-stone-900">Lactose &amp; Casein</td>
                  <td className="py-3.5 px-4 bg-[#EAE0CD]/30 font-bold text-[#1F3A22] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Certified 0% (Not Detected)
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">Residual Milk Solids Present</td>
                  <td className="py-3.5 px-4 text-stone-600">N/A</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-stone-900">Smoke Point</td>
                  <td className="py-3.5 px-4 bg-[#EAE0CD]/30 font-bold text-[#1F3A22] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> 250°C (Never releases free radicals)
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">~190°C - 200°C</td>
                  <td className="py-3.5 px-4 text-stone-600">Oxidizes rapidly under heat</td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-medium text-stone-900">Texture &amp; Aroma</td>
                  <td className="py-3.5 px-4 bg-[#EAE0CD]/30 font-bold text-[#1F3A22] flex items-center gap-1.5 rounded-b-xl">
                    <Check className="w-4 h-4 text-emerald-600" /> Golden Granular (Danedar)
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">Smooth / Waxy artificial aroma</td>
                  <td className="py-3.5 px-4 text-stone-600">Deodorized synthetic liquid</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
