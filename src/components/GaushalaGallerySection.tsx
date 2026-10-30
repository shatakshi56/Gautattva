'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  ArrowRight,
  Maximize2,
  MapPin,
  Clock
} from 'lucide-react';

interface TeaserItem {
  id: string;
  title: string;
  categoryLabel: string;
  image: string;
  caption: string;
  timeOfDay: string;
}

const GLIMPSE_PHOTOS: TeaserItem[] = [
  {
    id: '1',
    title: 'Free Grazing Indigenous Gir Cows in Natural Aravalli Pastures',
    categoryLabel: 'Gir Gaushala',
    image: '/gir-cows-pasture.jpg',
    caption: 'Bos Indicus Gir cows with solar-absorbing Surya Ketu Nadi.',
    timeOfDay: 'Morning Grazing',
  },
  {
    id: '2',
    title: 'Two-Way Wooden Bilona Churning at Brahma Muhurta',
    categoryLabel: 'Vedic Churning',
    image: '/bilona-process.jpg',
    caption: 'Slow hand-pulled clockwise & anticlockwise churning before sunrise.',
    timeOfDay: '04:30 AM',
  },
  {
    id: '3',
    title: 'Golden Danedar Texture of Slow Firewood Churned Ghee',
    categoryLabel: 'Pure Ghee',
    image: '/gallery/danedar_ghee_texture_1793012211924.jpg',
    caption: 'Natural granular crystallization in eco-friendly glass jars.',
    timeOfDay: 'Pure Clarification',
  },
  {
    id: '4',
    title: 'Maternal Ahimsa Care & Morning Gaushala Sanctuary',
    categoryLabel: 'Ahimsa Care',
    image: '/gallery/gaushala_morning_1793012234096.jpg',
    caption: 'Calves suckle first; zero synthetic hormones or suction machines.',
    timeOfDay: 'Dawn Rituals',
  },
];

export const GaushalaGallerySection: React.FC = () => {
  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-[#FAF6EE] to-[#FDFBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF5E7] border border-[#E7D0A8] text-[#996417] text-xs font-bold uppercase tracking-widest mb-3">
              <Camera className="w-3.5 h-3.5 text-[#C9882B]" />
              <span>A Glimpse of Gaushala Life</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3A22] leading-tight">
              Life at GauTattva: Authentic Gaushala Archives
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
              Take an authentic glimpse into our Jaipur sanctuary: indigenous Gir cows grazing peacefully, traditional earthen handis, and dawn wooden bilona churning.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-[#1F3A22] hover:bg-[#142817] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all shrink-0 group self-start md:self-auto cursor-pointer"
          >
            <span>Explore Full Gallery (All Archives)</span>
            <ArrowRight className="w-4 h-4 text-[#FFE500] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Item Curated Teaser Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GLIMPSE_PHOTOS.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1F3A22] shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-[#1F3A22]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  {item.categoryLabel}
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {item.timeOfDay}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#C9882B] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
                <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-[#996417]">
                  <span>Click to expand &amp; read story</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Banner Button to Expand Full Gallery */}
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2.5 bg-white hover:bg-[#FEF5E7] text-[#1F3A22] hover:text-[#996417] text-xs sm:text-sm font-bold py-3 px-8 rounded-full border-2 border-[#E7D0A8] shadow-xs hover:shadow-md transition-all group"
          >
            <span>View All High-Resolution Gaushala Photos &amp; Vedic Stories</span>
            <ArrowRight className="w-4 h-4 text-[#C9882B] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};
