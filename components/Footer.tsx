'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Mail, Send, Shield, Zap, SendToBack, Sparkles } from 'lucide-react';

export default function Footer() {
  const { addToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Silakan masukkan format email yang valid!', 'error');
      return;
    }
    addToast('Terima kasih! Anda berhasil mendaftar newsletter diskon kami.', 'success');
    setEmail('');
  };

  return (
    <footer id="global-footer" className="bg-slate-900 text-slate-300 dark:bg-slate-950 dark:text-slate-400 border-t border-slate-800">
      
      {/* Newsletter Accent Banner */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-950/70 p-8 rounded-3xl border border-slate-800/60 shadow-xl">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 mb-3">
              <Sparkles size={12} /> Diskon Eksklusif 15%
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Gabung Channel Newsletter Kami
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Dapatkan berita rilis sepatu sneakers edisi terbatas dan kode diskon voucher khusus pelanggan pertama langsung di kotak masuk email Anda.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  id="newsletter-email-field"
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-800 bg-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
              <button
                id="btn-subscribe-newsletter"
                type="submit"
                className="h-11 px-6 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                Langganan <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Footer Sitemap Links */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Logo & Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold font-display">
                S
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                StepStyle
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Distributor sepatu premium online terpercaya di Indonesia. Menyediakan jaminan 100% Original dari merek global terpopuler langsung ke rumah Anda.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1"><Shield size={12} /> Safe Checkout</span>
              <span className="flex items-center gap-1"><Zap size={12} /> Fast Delivery</span>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">Koleksi Sepatu</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products?kategori=Pria" className="hover:text-indigo-400 transition-colors">Kategori Pria</Link>
              </li>
              <li>
                <Link href="/products?kategori=Wanita" className="hover:text-indigo-400 transition-colors">Kategori Wanita</Link>
              </li>
              <li>
                <Link href="/products?kategori=Anak" className="hover:text-indigo-400 transition-colors">Kategori Anak</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-indigo-400 transition-colors">Lihat Semua Katalog</Link>
              </li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">Panduan & Bantuan</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="cursor-not-allowed text-slate-500 line-through">Panduan Ukuran</span>
              </li>
              <li>
                <span className="cursor-not-allowed text-slate-500 line-through">Kebijakan Retur</span>
              </li>
              <li>
                <span className="cursor-not-allowed text-slate-500 line-through">Lacak Pengiriman</span>
              </li>
              <li>
                <span className="cursor-not-allowed text-slate-500 line-through">FAQ Pertanyaan</span>
              </li>
            </ul>
          </div>

          {/* Hubungi */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">Hubungi Kami</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p>Email: CS@stepstyle.co.id</p>
              <p>WhatsApp: +62 812-3456-7890</p>
              <p className="text-xs">Senin - Minggu: 09.00 - 21.00 WIB</p>
            </div>
          </div>

        </div>

        {/* Footnotes */}
        <div className="mt-16 pt-8 border-t border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 StepStyle Indonesia. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-help">Sitemap</span>
            <span className="hover:text-slate-400 cursor-help">Syarat & Ketentuan</span>
            <span className="hover:text-slate-400 cursor-help">Privasi Data</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
