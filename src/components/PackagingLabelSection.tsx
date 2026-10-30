'use client';

import React from 'react';
import Image from 'next/image';
import { Award, CheckCircle2, Phone, Mail, MapPin, Leaf, Recycle, Shield } from 'lucide-react';
import knowledgeBase from '@/data/knowledge_base.json';

export const PackagingLabelSection: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C9882B] bg-[#FEF5E7] px-3 py-1 rounded-full border border-[#E7D0A8]">
            Authentic Label Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F3A22] mt-3">
            Every Detail Printed. Nothing Hidden.
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Inspect our official product packaging label sheet below. From DEALKARTS manufacturing premises in Jaipur to FSSAI licensing and complete lab-matched nutritional facts.
          </p>
        </div>

        {/* High-Resolution Label Showcase Banner */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#E7D0A8] shadow-lg bg-[#FAF6EE] p-4 sm:p-6 mb-8">
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-2xl overflow-hidden shadow-inner bg-white">
            <Image
              src="/gautattva-label.jpg"
              alt="Official GauTattva Organics Packaging Label Sheet"
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="text-center mt-3">
            <span className="text-xs text-stone-500 italic">
              Official GauTattva™ Organics A2 Gir Cow Ghee packaging label &amp; lid seal (Jaipur, Rajasthan)
            </span>
          </div>
        </div>

        {/* Breakdown of Verified Packaging Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF5E7] text-[#C9882B] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1F3A22]">Manufactured &amp; Packed By</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>{knowledgeBase.brand.manufacturer.name}</strong><br />
              {knowledgeBase.brand.manufacturer.address}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>FSSAI Certified Unit</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF5E7] text-[#C9882B] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1F3A22]">Dedicated Customer Care</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Have questions regarding your batch or certified lab test?
            </p>
            <div className="space-y-1 text-xs font-medium text-stone-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9882B]" />
                <a href="tel:+919057000446" className="hover:underline">
                  +91 9057000446
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9882B]" />
                <a href="mailto:care@gautattvaorganics.com" className="hover:underline">
                  care@gautattvaorganics.com
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF5E7] text-[#C9882B] flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#1F3A22]">Purity &amp; Sustainability Seals</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Recyclable
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 12 Months Shelf Life
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Vegetarian (Green Dot)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Make in India
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
