'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'pin' | 'password'>('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('admin@gautattva.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = mode === 'pin' ? { pin } : { email, password };
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Connection failed. Please check server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F3A22] flex items-center justify-center p-4 relative overflow-hidden text-[#1C1917]">
      {/* Background Vedic Geometric Aura */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C9882B]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#FDFBF7] rounded-3xl shadow-2xl border-2 border-[#E7D0A8] p-7 sm:p-9 relative z-10 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9882B] mx-auto shadow-md">
            <Image
              src="/gautattva-logo.jpg"
              alt="GauTattva Organics"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9882B] block">
              GauTattva™ Organics • Merchant Hub
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1F3A22]">
              Secure Admin Console
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Strictly restricted to authorized store managers &amp; administrators.
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('pin');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'pin'
                ? 'bg-white text-[#1F3A22] shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#C9882B]" />
            <span>Master PIN</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('password');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'password'
                ? 'bg-white text-[#1F3A22] shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#C9882B]" />
            <span>Email &amp; Password</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {mode === 'pin' ? (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                4-Digit Master PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={4}
                  required
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • •"
                  className="w-full text-center tracking-widest text-xl font-bold font-mono px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:border-[#C9882B] focus:ring-2 focus:ring-[#C9882B]/20 transition-all"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1 text-center">
                Demo Admin PIN: <strong className="font-mono text-[#C9882B]">7821</strong>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gautattva.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:border-[#C9882B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:border-[#C9882B]"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Demo Password: <strong className="font-mono text-[#C9882B]">vedicghee2026</strong>
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#C9882B] hover:bg-[#B37521] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Authorize & Enter Console'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Encrypted Session</span>
          </div>
          <span className="font-mono text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">
            RBAC Protected
          </span>
        </div>
      </div>
    </div>
  );
}
