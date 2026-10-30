'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ShieldCheck, Phone, Menu, X, ChevronDown, Bell, Package } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  cartCount: number;
  onOpenSimulator: () => void;
  onOpenReminder?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  cartCount,
  onOpenSimulator,
  onOpenReminder,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const handleAnchorClick = (anchorId: string, e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${anchorId}`);
      }
    }
  };

  const handleMobileAnchorClick = (anchorId: string, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${anchorId}`);
      }
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E7E5E4] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9882B] shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/gautattva-logo.jpg"
                alt="GauTattva Organics Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1F3A22] leading-none">
                GauTattva™
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9882B]">
                ORGANICS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1C1917]">
            <Link
              href="/#about"
              onClick={(e) => handleAnchorClick('about', e)}
              className="hover:text-[#C9882B] transition-colors"
            >
              About GauTattva
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-[#C9882B] transition-colors py-2 font-medium cursor-pointer"
                aria-expanded={productsDropdownOpen}
              >
                <span>Products</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    productsDropdownOpen ? 'rotate-180 text-[#C9882B]' : 'text-stone-500'
                  }`}
                />
              </button>

              {productsDropdownOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-xl border border-[#E7D0A8] p-3 space-y-1.5">
                    {/* Active Product: A2 Gir Cow Vedic Bilona Ghee */}
                    <Link
                      href="/products/a2-gir-cow-bilona-ghee"
                      onClick={() => setProductsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FEF5E7] transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#FEF5E7] border border-[#E7D0A8] flex items-center justify-center shrink-0 mt-0.5 text-lg">
                        🧈
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#1F3A22] group-hover:text-[#C9882B] transition-colors">
                            A2 Gir Cow Vedic Bilona Ghee
                          </span>
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                            Available Now
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                          Handcrafted curd-churned golden Danedar ghee (350ml, 500ml, 1L, 5L)
                        </p>
                      </div>
                    </Link>

                    {/* Upcoming Products Header */}
                    <div className="px-2 pt-2.5 pb-1 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
                        Future Product Range
                      </span>
                      <span className="text-[9px] font-bold text-[#C9882B] bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#E7D0A8]/60">
                        Coming Soon
                      </span>
                    </div>

                    {/* Future Product 1: Cultured Vedic Makhan */}
                    <div className="flex items-start gap-3 p-2.5 rounded-xl opacity-65 hover:opacity-100 transition-opacity">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mt-0.5 text-base">
                        🥛
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-stone-700">A2 Cultured White Butter (Makhan)</span>
                          <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                            Upcoming
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">Fresh artisanal churned white butter</p>
                      </div>
                    </div>

                    {/* Future Product 2: Raw Wild Honey */}
                    <div className="flex items-start gap-3 p-2.5 rounded-xl opacity-65 hover:opacity-100 transition-opacity">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mt-0.5 text-base">
                        🍯
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-stone-700">Wild Forest Raw Honey</span>
                          <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                            Upcoming
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">Unprocessed forest hive single-origin honey</p>
                      </div>
                    </div>

                    {/* Future Product 3: Wood Pressed Cold Pressed Oils */}
                    <div className="flex items-start gap-3 p-2.5 rounded-xl opacity-65 hover:opacity-100 transition-opacity">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mt-0.5 text-base">
                        🌿
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-stone-700">Wood-Pressed Kachi Ghani Oils</span>
                          <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                            Upcoming
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">Cold-pressed pure mustard &amp; sesame oils</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#vedic-process"
              onClick={(e) => handleAnchorClick('vedic-process', e)}
              className="hover:text-[#C9882B] transition-colors"
            >
              5-Step Bilona
            </Link>
            <Link href="/gallery" className="hover:text-[#C9882B] transition-colors">
              Gaushala Gallery
            </Link>
            <Link
              href="/#lab-report"
              onClick={(e) => handleAnchorClick('lab-report', e)}
              className="flex items-center gap-1.5 hover:text-[#C9882B] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F3A22]" />
              <span>Lab Report</span>
            </Link>
            <Link
              href="/orders"
              className="hover:text-[#FFE500] transition-colors flex items-center gap-1.5 font-bold text-xs py-1.5 px-3.5 rounded-full bg-[#1F3A22] text-white hover:bg-[#142817] border border-[#C9882B]/40 shadow-xs"
            >
              <Package className="w-3.5 h-3.5 text-[#FFE500]" />
              <span>My Orders</span>
            </Link>
            <button
              onClick={onOpenSimulator}
              className="bg-[#FEF5E7] text-[#996417] px-3 py-1.5 rounded-full text-xs font-semibold border border-[#E7D0A8] hover:bg-[#FCEFD8] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>WhatsApp Reorder Demo</span>
            </button>

            {onOpenReminder && (
              <button
                onClick={onOpenReminder}
                className="bg-white hover:bg-[#FEF5E7] text-[#1F3A22] hover:text-[#C9882B] px-3 py-1.5 rounded-full text-xs font-semibold border border-[#E7D0A8] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-[#C9882B]" />
                <span>Set Reminder</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+919057000446"
              className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#57534E] hover:text-[#1F3A22]"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9882B]" />
              <span>+91 9057000446</span>
            </a>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#1F3A22] text-[#FDFBF7] hover:bg-[#142817] transition-all hover:scale-105"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9882B] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1C1917]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E7E5E4] px-4 py-4 space-y-3">
            {/* Products Mobile Accordion */}
            <div className="border-b border-stone-100 pb-2">
              <button
                type="button"
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="w-full flex items-center justify-between py-2 text-sm font-semibold text-[#1C1917]"
              >
                <span className="flex items-center gap-2">
                  <span>Products</span>
                  <span className="text-[10px] bg-[#FEF5E7] text-[#996417] px-2 py-0.5 rounded-full border border-[#E7D0A8]">
                    1 Available • 3 Coming Soon
                  </span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileProductsOpen ? 'rotate-180 text-[#C9882B]' : 'text-stone-500'
                  }`}
                />
              </button>

              {mobileProductsOpen && (
                <div className="mt-2 pl-3 pr-2 py-2 space-y-2 bg-[#FAF6EE] rounded-xl border border-[#E7D0A8]/60">
                  <Link
                    href="/products/a2-gir-cow-bilona-ghee"
                    onClick={() => {
                      setMobileProductsOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-1 text-xs font-bold text-[#1F3A22]"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🧈</span>
                      <span>A2 Gir Cow Vedic Bilona Ghee</span>
                    </span>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                      Available Now
                    </span>
                  </Link>

                  <div className="flex items-center justify-between py-1 text-xs text-stone-500 opacity-70">
                    <span className="flex items-center gap-1.5">
                      <span>🍯</span>
                      <span>Raw Wild Forest Honey</span>
                    </span>
                    <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                      Coming Soon
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 text-xs text-stone-500 opacity-70">
                    <span className="flex items-center gap-1.5">
                      <span>🌿</span>
                      <span>Wood-Pressed Kachi Ghani Oils</span>
                    </span>
                    <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#about"
              onClick={(e) => handleMobileAnchorClick('about', e)}
              className="block py-2 text-sm font-medium text-[#1C1917]"
            >
              About GauTattva
            </Link>
            <Link
              href="/#vedic-process"
              onClick={(e) => handleMobileAnchorClick('vedic-process', e)}
              className="block py-2 text-sm font-medium text-[#1C1917]"
            >
              5-Step Vedic Bilona Process
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#1C1917]"
            >
              Gaushala Gallery &amp; Photos
            </Link>
            <Link
              href="/#lab-report"
              onClick={(e) => handleMobileAnchorClick('lab-report', e)}
              className="w-full text-left py-2 text-sm font-medium text-[#1C1917] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#1F3A22]" />
              Official Lab Test Report (JLFD260702144)
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left py-2.5 px-3 text-sm font-bold text-white bg-[#1F3A22] border border-[#C9882B]/40 rounded-xl flex items-center justify-between shadow-xs"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FFE500]" />
                <span>My Orders &bull; Track &amp; Invoices</span>
              </span>
              <span className="text-[10px] bg-[#C9882B] text-white px-2 py-0.5 rounded-full font-semibold">
                GauTattva
              </span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSimulator();
              }}
              className="w-full text-left py-2.5 px-3 text-sm font-semibold text-[#996417] bg-[#FEF5E7] rounded-xl flex items-center justify-between"
            >
              <span>⚡ WhatsApp Reorder Simulator</span>
            </button>

            {onOpenReminder && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReminder();
                }}
                className="w-full text-left py-2.5 px-3 text-sm font-bold text-[#1F3A22] bg-white rounded-xl border border-[#E7D0A8] flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#C9882B]" />
                  <span>Set Replenishment Reminder</span>
                </span>
                <span className="text-[10px] bg-[#FEF5E7] text-[#996417] px-2 py-0.5 rounded-full font-bold">
                  Interactive
                </span>
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
