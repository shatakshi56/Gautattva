'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Bot,
  User,
  Loader2,
} from 'lucide-react';

type ChatMode = 'health' | 'purity' | 'sales';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('health');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Pranam Ji 🙏 I am the Gautattva Vedic AI Concierge. How may I assist you with our authentic A2 Gir Cow Bilona Ghee, our certified Jagdamba lab report, or choosing the perfect jar size?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          mode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || 'Pranam Ji! How else may I assist you?' },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Pranam Ji! Our certified lab report (JLFD260702144) confirms 0% sugars, 0% casein residue, and 100% pure A2 Gir Cow bilona ghee. How may I assist further?',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Pranam Ji! Gautattva ghee is hand-churned in Jaipur from pure Gir cow curd. Feel free to download our official lab report above.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const modeQuestions: Record<ChatMode, Array<{ label: string; query: string }>> = {
    health: [
      { label: 'Lactose safe? 🥛', query: 'Can lactose intolerant people safely consume Gautattva ghee?' },
      { label: 'Empty stomach benefits? 🌅', query: 'What are the Ayurvedic benefits of eating 1 spoon A2 ghee on an empty stomach?' },
      { label: 'Heart & Cholesterol? ❤️', query: 'Does A2 Gir cow ghee increase bad cholesterol or is it heart-healthy?' },
      { label: 'Gut & Butyric Acid 🌿', query: 'How does natural butyric acid in Vedic ghee heal the gut lining and digestion?' },
      { label: 'Smoke point (250°C)? 🍳', query: 'What is the smoke point of your ghee for high-heat Indian cooking?' },
    ],
    purity: [
      { label: 'Lab report dikhao 🔬', query: 'Can you show me the official Jagdamba lab report numbers and certified findings?' },
      { label: '5-Step Bilona method? 🏺', query: 'Explain how the 5-step Vedic Bilona process is done with wooden ravaiya.' },
      { label: 'Zero Palm oil/Adulteration? 🛡️', query: 'Is your ghee tested 100% free from palm oil, vanaspati, and chemical solvents?' },
      { label: 'A1 vs A2 Gir Cow? 🐄', query: 'What makes indigenous Gir cow A2 ghee superior to commercial A1 Jersey cow ghee?' },
      { label: 'Why granular (danedar)? ✨', query: 'Why does authentic Vedic ghee have a golden granular (danedar) texture?' },
    ],
    sales: [
      { label: 'Which jar size? 🏺', query: 'Which jar size should I choose: 500ml, 1 Litre, or 2 Litre?' },
      { label: '2L Free Gifts? 🎁', query: 'What free gifts come with the 2 Litre value pack?' },
      { label: 'WhatsApp Reorder? 📲', query: 'How does the automated WhatsApp AI reorder replenishment work?' },
      { label: 'Delivery time (Shiprocket)? 🚚', query: 'How fast does Shiprocket deliver across India?' },
      { label: 'Discount coupon code? 🏷️', query: 'Is there any special discount coupon code for my first order?' },
    ],
  };

  const presetQuestions = modeQuestions[mode];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-4 rounded-full bg-[#1F3A22] text-[#FDFBF7] shadow-2xl hover:scale-105 transition-all glow-gold flex items-center gap-2.5 border-2 border-[#C9882B]"
          aria-label="Open Vedic AI Chat"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#C9882B]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            Ask Vedic AI
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[560px] bg-white rounded-3xl shadow-2xl border-2 border-[#C9882B]/30 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="bg-[#1F3A22] text-white p-4 flex items-center justify-between border-b border-[#2D5331]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C9882B]">
                <img src="/gautattva-logo.jpg" alt="GauTattva" className="object-cover w-full h-full" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-white">GauTattva AI Concierge</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini 3.8 Flash • Vedic AI
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Pills */}
          <div className="bg-[#FAF6EE] px-3 py-2 border-b border-stone-200 flex items-center justify-between gap-1">
            <button
              onClick={() => setMode('health')}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                mode === 'health'
                  ? 'bg-[#1F3A22] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Heart className="w-3 h-3 text-rose-400" />
              <span>Health</span>
            </button>

            <button
              onClick={() => setMode('purity')}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                mode === 'purity'
                  ? 'bg-[#1F3A22] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Purity</span>
            </button>

            <button
              onClick={() => setMode('sales')}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                mode === 'sales'
                  ? 'bg-[#1F3A22] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <ShoppingBag className="w-3 h-3 text-[#C9882B]" />
              <span>Sales</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FDFBF7]">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#1F3A22] text-[#C9882B] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                    🪔
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-[#C9882B] text-white rounded-br-none'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-stone-400 italic">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9882B]" />
                <span>Consulting Vedic knowledge base &amp; lab reports...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Prompts Carousel */}
          <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-100 flex gap-1.5 overflow-x-auto">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.query)}
                className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[10px] font-medium text-stone-700 whitespace-nowrap hover:border-[#C9882B] hover:text-[#C9882B] transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'health'
                  ? 'Ask health questions (e.g. gut health, cholesterol, empty stomach)...'
                  : mode === 'purity'
                  ? 'Ask purity questions (e.g. Jagdamba lab report, Bilona method)...'
                  : 'Ask sales questions (e.g. best jar size, delivery time, coupons)...'
              }
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:border-[#C9882B]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#1F3A22] hover:bg-[#142817] text-white transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
