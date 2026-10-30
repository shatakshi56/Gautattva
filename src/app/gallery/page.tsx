'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import {
  Sparkles,
  Camera,
  Maximize2,
  X,
  ArrowRight,
  ShieldCheck,
  Heart,
  ChevronRight,
  Sun,
  MapPin,
  Clock,
  Award
} from 'lucide-react';

interface FullGalleryItem {
  id: string;
  title: string;
  category: 'cows' | 'process' | 'harvest' | 'rituals';
  categoryLabel: string;
  image: string;
  location: string;
  timeOfDay: string;
  caption: string;
  story: string;
}

const EXTENDED_GALLERY: FullGalleryItem[] = [
  {
    id: '1',
    title: 'Sacred Indigenous Gir Cows in Aravalli Pastures',
    category: 'cows',
    categoryLabel: 'Gir Gaushala',
    image: '/gir-cows-pasture.jpg',
    location: 'Aravalli Hills Pasture, Jaipur',
    timeOfDay: 'Morning Grazing • 07:30 AM',
    caption: 'Our free-grazing indigenous Gir cows grazing on wild neem, tulsi, and seasonal grasses.',
    story: 'Pure Bos Indicus Gir cows possess a prominent hump housing the Surya Ketu Nadi. As they roam freely under natural solar rays, they synthesize gold salts into their milk, creating authentic A2 beta-casein purity.',
  },
  {
    id: '2',
    title: 'Traditional Bi-Directional Wooden Bilona Churning',
    category: 'process',
    categoryLabel: 'Vedic Churning',
    image: '/bilona-process.jpg',
    location: 'Vedic Churning Hall, Jaipur',
    timeOfDay: 'Brahma Muhurta • 04:30 AM',
    caption: 'Two-way clockwise and anticlockwise wooden churning of cultured A2 curd before dawn.',
    story: 'Unlike industrial centrifugal machines that destroy fragile milk enzymes with heat and speed, the gentle wooden bilona separates silky makhan at room temperature, preserving vitamins A, D, E, and K2.',
  },
  {
    id: '3',
    title: 'Golden Danedar Texture of Handcrafted Ghee',
    category: 'harvest',
    categoryLabel: 'Pure Ghee',
    image: '/gallery/danedar_ghee_texture_1793012211924.jpg',
    location: 'Packaging Sanctum',
    timeOfDay: 'Post Clarification • Natural Cooling',
    caption: 'Authentic granular crystallization achieved through slow firewood cooking.',
    story: 'The signature granular (Danedar) crystal structure only forms when slow firewood heating is applied to cultured curd butter, followed by gradual natural cooling in glass jars without artificial chilling.',
  },
  {
    id: '4',
    title: 'Ethical Ahimsa Gaushala & Maternal Calf Milking',
    category: 'cows',
    categoryLabel: 'Gir Gaushala',
    image: '/gallery/gaushala_morning_1793012234096.jpg',
    location: 'Main Sanctuary Cow Shed',
    timeOfDay: 'Dawn Rituals • 06:00 AM',
    caption: 'Ahimsa care: calves drink their fill before any milk is collected for human use.',
    story: 'We practice strict Ahimsa (non-violence) dairying. Every cow is treated as family, retired cows live peacefully their entire lifespan, and young calves have undisputed first right to their mother’s milk.',
  },
  {
    id: '5',
    title: 'Natural Clay Earthen Handis for Curd Fermentation',
    category: 'process',
    categoryLabel: 'Vedic Churning',
    image: '/hero-ghee-jar.jpg',
    location: 'Fermentation Chamber',
    timeOfDay: 'Overnight Culturing • 12 Hours',
    caption: 'Natural terracotta pots infuse earth minerals while maintaining ideal probiotic temperature.',
    story: 'Earthen clay handis are porous and breathe. Overnight culturing in unglazed clay allows healthy lactobacillus strains to thrive, giving the ghee its divine digestive and Ayurvedic properties.',
  },
  {
    id: '6',
    title: 'Single-Origin Raw Forest Wild Honey Harvest',
    category: 'harvest',
    categoryLabel: 'Organic Harvest',
    image: '/products/honey.jpg',
    location: 'Aravalli Forest Border',
    timeOfDay: 'Ethical Wild Harvest',
    caption: '100% unpasteurized raw honey harvested without harming indigenous forest bees.',
    story: 'Harvested from deep wild blooms of neem, kair, and forest wildflowers. Never micro-filtered or heated above natural hive temperature, retaining all live beneficial enzymes and pollen.',
  },
  {
    id: '7',
    title: 'Wood-Pressed (Lakdi Ghani) Kachi Ghani Oils',
    category: 'harvest',
    categoryLabel: 'Organic Harvest',
    image: '/products/oils.jpg',
    location: 'Wooden Press Shed',
    timeOfDay: 'Slow Cold Pressing',
    caption: 'Traditional wooden kolhu press operating below 38°C to retain vital antioxidants.',
    story: 'Extracted slowly using seasoned heavy wood mortars. Zero hexane, zero chemical refining, zero artificial deodorizers—pure cold-pressed wellness as practiced in Vedic Bharat.',
  },
  {
    id: '8',
    title: 'Sacred Gir Cow Dung Havan Dhoop Cups',
    category: 'rituals',
    categoryLabel: 'Sacred Heritage',
    image: '/products/dhoop.jpg',
    location: 'Herbal Blending Sanctum',
    timeOfDay: 'Hand-Molded in Sun',
    caption: 'Purifying cups made with indigenous cow dung, guggul, camphor, and havan samagri.',
    story: 'When ignited, indigenous Gir cow dung combined with pure ghee and camphor releases therapeutic vapors that eliminate airborne pathogens and create a serene, meditative temple atmosphere.',
  },
  {
    id: '9',
    title: 'Artisanal Vedic Chyawanprash Brewed with Wild Amla',
    category: 'harvest',
    categoryLabel: 'Ayurvedic Rasayana',
    image: '/products/chyawanprash.jpg',
    location: 'Ayurvedic Preparation Kuti',
    timeOfDay: 'Slow Brass Cauldron Simmer',
    caption: 'Wild organic forest amla roasted in A2 Bilona Ghee with 40+ rejuvenating herbs.',
    story: 'Follows the ancient recipe from the Charaka Samhita. Each batch is simmered slowly in thick brass vessels with raw organic honey and our pure A2 Bilona Ghee as the lipid carrier for deep cellular rejuvenation.',
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<FullGalleryItem | null>(null);

  const filtered =
    activeTab === 'all'
      ? EXTENDED_GALLERY
      : EXTENDED_GALLERY.filter((item) => item.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* Brand Header */}
      <Header
        onOpenCart={() => {}}
        cartCount={0}
        onOpenSimulator={() => {}}
      />

      {/* Breadcrumb Strip */}
      <div className="bg-[#FAF6EE] border-b border-[#E7D0A8]/60 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Link href="/" className="hover:text-[#C9882B] transition-colors">
              GauTattva Home
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="font-bold text-[#1F3A22]">
              Gaushala &amp; Vedic Heritage Gallery
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-[#8B5A14]">
            <Camera className="w-3.5 h-3.5 text-[#C9882B]" />
            <span>100% Authentic Live Photography from Jaipur Gaushala</span>
          </div>
        </div>
      </div>

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Banner Title */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF5E7] border border-[#E7D0A8] text-[#996417] text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C9882B]" />
              <span>Sanctuary Visual Archives</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F3A22] leading-tight">
              Life at GauTattva: The Sacred Gaushala &amp; Vedic Craft
            </h1>
            <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              Explore an unfiltered photographic window into our gaushala in Jaipur, Rajasthan. Witness the free-grazing Gir cows, early morning wooden bilona churning, earthenware fermentation, and organic Vedic harvesting.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {[
                { id: 'all', label: 'All Archives (9 Photos)' },
                { id: 'cows', label: 'Gir Cows & Gaushala Sanctuary' },
                { id: 'process', label: 'Wooden Bilona & Clay Handis' },
                { id: 'harvest', label: 'Golden Ghee & Organic Harvest' },
                { id: 'rituals', label: 'Vedic Dhoop & Sacred Heritage' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#1F3A22] text-white shadow-md'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Photo with Overlay */}
                <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3.5 left-3.5 bg-[#1F3A22]/90 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.categoryLabel}
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#1F3A22] shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Location & Time Tag */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#FFE500]" />
                      <span>{item.location}</span>
                    </span>
                    <span className="text-stone-200 font-mono text-[10px]">
                      {item.timeOfDay}
                    </span>
                  </div>
                </div>

                {/* Card Description & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F3A22] group-hover:text-[#C9882B] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#996417] font-semibold">
                    <span>Read Vedic Story &amp; Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner at Bottom */}
          <div className="mt-20 bg-gradient-to-r from-[#1F3A22] to-[#2D5432] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="bg-[#FFE500] text-[#1F3A22] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Pure A2 Vedic Harvest
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                Experience This Sacred Craft In Every Spoon
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl">
                Our A2 Gir Cow Vedic Bilona Ghee is churned in the very clay pots and wooden bilonas you see above. Lab-certified with 0% adulteration.
              </p>
            </div>

            <Link
              href="/products/a2-gir-cow-bilona-ghee"
              className="bg-[#C9882B] hover:bg-[#b07321] text-white font-bold text-sm py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 shrink-0"
            >
              <span>Order A2 Bilona Ghee</span>
              <ArrowRight className="w-4 h-4 text-[#FFE500]" />
            </Link>
          </div>

        </div>
      </main>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-700 relative cursor-default max-h-[92vh] flex flex-col"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-16/10 sm:aspect-[16/9] w-full bg-stone-900 shrink-0">
              <Image
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Modal Text Content */}
            <div className="p-6 sm:p-8 bg-white overflow-y-auto space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FEF5E7] text-[#996417] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#E7D0A8]">
                    {selectedPhoto.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    {selectedPhoto.timeOfDay}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#C9882B]" />
                  <span>{selectedPhoto.location}</span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F3A22]">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 mt-2 font-medium leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>

              <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#E7D0A8]/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#996417] tracking-wider block">
                  Vedic Context &amp; Significance
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedPhoto.story}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  Photographed on site at GauTattva Organic Gaushala, Jaipur
                </span>
                <Link
                  href="/products/a2-gir-cow-bilona-ghee"
                  className="bg-[#1F3A22] hover:bg-[#142817] text-white text-xs font-bold py-2 px-4 rounded-full flex items-center gap-1.5"
                >
                  <span>Shop Flagship Ghee</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vedic AI Chat Concierge */}
      <ChatWidget />

      {/* Footer */}
      <Footer onOpenSimulator={() => {}} />
    </div>
  );
}
