'use client';

import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { JarSize } from '@/lib/types';
import knowledgeBase from '@/data/knowledge_base.json';

interface StickyBottomBarProps {
  selectedJar: JarSize;
  onInstantBuy: (jar: JarSize) => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  selectedJar,
  onInstantBuy,
}) => {
  const variant =
    knowledgeBase.product.variants.find((v) => v.id === selectedJar) ||
    knowledgeBase.product.variants[1];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E7D0A8] py-3 px-4 shadow-2xl md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-[#1F3A22]">
              {variant.size}
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
              Pure A2
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-[#1F3A22]">₹{variant.price}</span>
            <span className="text-xs text-stone-400 line-through">₹{variant.mrp}</span>
            <span className="text-[10px] text-rose-700 font-bold ml-0.5">Prepaid Only (No COD)</span>
          </div>
        </div>

        <button
          onClick={() => onInstantBuy(selectedJar)}
          className="flex-1 py-3 px-5 rounded-xl bg-[#C9882B] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 hover:bg-[#B37521] transition-all"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>1-Tap Order</span>
        </button>
      </div>
    </div>
  );
};
