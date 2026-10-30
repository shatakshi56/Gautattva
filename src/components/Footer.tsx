'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import knowledgeBase from '@/data/knowledge_base.json';

interface FooterProps {
  onOpenLabReport?: () => void;
  onOpenSimulator: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSimulator,
}) => {
  return (
    <footer className="bg-[#142817] text-stone-300 pt-16 pb-24 md:pb-12 border-t border-[#1F3A22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9882B]">
                <Image
                  src="/gautattva-logo.jpg"
                  alt="GauTattva Organics"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white block leading-none">
                  GauTattva™
                </span>
                <span className="text-[10px] text-[#C9882B] uppercase tracking-widest font-bold">
                  ORGANICS
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              &quot;Rooted in tradition, inspired by purity&quot;. Authentic Vedic Bilona Ghee hand-churned from cultured curd of purebred indigenous Gir cows.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-[#C9882B]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="/orders" className="text-amber-300 font-bold hover:text-white transition-colors flex items-center gap-1">
                  <span>📦 My Orders &bull; Track &amp; Invoices</span>
                </Link>
              </li>
              <li>
                <Link href="/#brand-products" className="hover:text-white transition-colors">
                  A2 Vedic Ghee &amp; Products
                </Link>
              </li>
              <li>
                <Link href="/#vedic-process" className="hover:text-white transition-colors">
                  5-Step Bilona Journey
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Gaushala Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/#lab-report" className="hover:text-white transition-colors">
                  Jagdamba Lab Report (NABL)
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenSimulator}
                  className="text-amber-300 hover:text-white transition-colors text-left font-semibold"
                >
                  WhatsApp AI Reorder Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Lab & Purity Credentials */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-[#C9882B]">
              Certifications &amp; Lab
            </h4>
            <div className="space-y-2 text-stone-400">
              <p>
                <strong className="text-white">NABL Test House:</strong> Jagdamba Laboratories (Report JLFD260702144)
              </p>
              <p>
                <strong className="text-white">Purity Index:</strong> 100% Passed • 0% Sugars • 0% Casein
              </p>
              <p>
                <strong className="text-white">Packaging:</strong> 100% Recyclable Glass Jars
              </p>
              <p>
                <strong className="text-white">Regulatory:</strong> FSSAI Verified
              </p>
            </div>
          </div>

          {/* Manufacturer & Support */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider text-[#C9882B]">
              Packed &amp; Marketed By
            </h4>
            <div className="space-y-2 text-stone-400">
              <p className="text-stone-200 font-semibold">
                {knowledgeBase.brand.manufacturer.name}
              </p>
              <p className="leading-relaxed">
                {knowledgeBase.brand.manufacturer.address}
              </p>
              <p className="flex items-center gap-1.5 pt-1 text-amber-300">
                <Phone className="w-3.5 h-3.5" />
                <a href="tel:+919057000446" className="hover:underline">
                  +91 9057000446
                </a>
              </p>
              <p className="flex items-center gap-1.5 text-stone-300">
                <Mail className="w-3.5 h-3.5" />
                <a href="mailto:care@gautattvaorganics.com" className="hover:underline">
                  care@gautattvaorganics.com
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 GauTattva™ Organics. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with reverence for Gau Mata</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>in Jaipur, Rajasthan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
