'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Percent,
  CheckCircle2,
  Trash
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartQty, removeFromCart, addToast } = useStore();

  // Voucher state
  const [promoCode, setPromoCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<{ code: string; type: 'percent' | 'flat'; value: number } | null>(null);

  // Formatter helper
  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Calculations
  const totalPriceItems = cart.reduce((total, item) => total + item.harga * item.jumlah, 0);
  
  // Calculate discount
  let discountAmount = 0;
  if (activeDiscount) {
    if (activeDiscount.type === 'percent') {
      discountAmount = totalPriceItems * (activeDiscount.value / 100);
    } else {
      discountAmount = activeDiscount.value;
    }
  }

  const costAdminFee = totalPriceItems > 0 ? 10000 : 0;
  const payableGrandTotal = Math.max(0, totalPriceItems - discountAmount + costAdminFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const code = promoCode.trim().toUpperCase();

    if (code === 'STEPS15') {
      setActiveDiscount({ code: 'STEPS15', type: 'percent', value: 15 });
      addToast('Kode voucher STEPS15 berhasil diaktifkan! Diskon 15% telah dipotong.', 'success');
      setPromoCode('');
    } else if (code === 'DISKON30K') {
      setActiveDiscount({ code: 'DISKON30K', type: 'flat', value: 30000 });
      addToast('Kode voucher DISKON30K berhasil diaktifkan! Potongan Rp 30.000 telah dipotong.', 'success');
      setPromoCode('');
    } else {
      addToast('Kode voucher tidak valid atau telah kedaluwarsa!', 'error');
    }
  };

  const handleRemovePromo = () => {
    setActiveDiscount(null);
    addToast('Voucher diskon dihapus dari ringkasan belanja.', 'info');
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      addToast('Keranjang Anda masih kosong!', 'error');
      return;
    }
    // Save coupon settings inside sessionStorage to bind correctly in Checkout
    if (activeDiscount) {
      sessionStorage.setItem('active_discount', JSON.stringify(activeDiscount));
    } else {
      sessionStorage.removeItem('active_discount');
    }
    router.push('/checkout');
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Navbar />

      <main className="flex-grow py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="text-indigo-600 dark:text-indigo-400" />
          Keranjang Belanja
        </h1>

        {cart.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl py-16 px-4 text-center space-y-4 shadow-sm flex flex-col items-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-505">
              <ShoppingBag size={36} />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Keranjang Belanja Kosong</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Belum ada pasang sepatu yang dimasukkan ke tas belanja. Silakan temukan sepatu impian Anda di katalog!
              </p>
            </div>
            <Link
              id="btn-back-to-products"
              href="/products"
              className="h-11 px-6 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl text-sm font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-md"
            >
              Mulai Cari Sepatu
            </Link>
          </div>
        ) : (
          /* CART FILLED STATE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Box: Items Column */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                
                {/* Header row desktop labels */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 text-xs font-bold text-slate-400 font-mono">
                  <div className="col-span-6 uppercase">Sepatu & Varian</div>
                  <div className="col-span-3 uppercase text-center">Jumlah Pasang</div>
                  <div className="col-span-3 uppercase text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-850">
                  {cart.map((item) => {
                    const itemSubtotal = item.harga * item.jumlah;
                    return (
                      <div 
                        id={`cart-item-${item.id}-${item.pilihUkuran}`}
                        key={`${item.id}-${item.pilihUkuran}-${item.pilihWarna}`}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-6"
                      >
                        {/* Shoe descriptor col-6 */}
                        <div className="sm:col-span-6 flex gap-4">
                          <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-50 border shrink-0">
                            <Image src={item.gambar} alt={item.nama} fill className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{item.merek}</span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              <Link href={`/products/${item.id}`} className="hover:text-indigo-600 transition-colors">
                                {item.nama}
                              </Link>
                            </h3>
                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-semibold pt-0.5">
                              <span className="bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-md border text-slate-705 dark:text-slate-350">
                                EUR Size: {item.pilihUkuran}
                              </span>
                              <span className="bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-md border text-slate-705 dark:text-slate-350 font-sans">
                                Warna: {item.pilihWarna}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Adjuster col-3 */}
                        <div className="sm:col-span-3 flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                          <span className="sm:hidden text-xs text-slate-400 font-bold font-mono">Jumlah:</span>
                          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-9 w-28 p-0.5 overflow-hidden">
                            <button
                              id={`btn-cartitem-dec-${item.id}-${item.pilihUkuran}`}
                              onClick={() => updateCartQty(item.id, item.pilihUkuran, item.pilihWarna, item.jumlah - 1)}
                              disabled={item.jumlah <= 1}
                              className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 rounded-lg transition-colors cursor-pointer font-bold font-mono"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="flex-1 text-center font-bold font-mono text-xs">
                              {item.jumlah}
                            </span>
                            <button
                              id={`btn-cartitem-inc-${item.id}-${item.pilihUkuran}`}
                              onClick={() => updateCartQty(item.id, item.pilihUkuran, item.pilihWarna, item.jumlah + 1)}
                              disabled={item.jumlah >= item.stokSedia}
                              className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 rounded-lg transition-colors cursor-pointer font-bold font-mono"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal & trash col-3 */}
                        <div className="sm:col-span-3 flex sm:flex-col items-center justify-between sm:items-end gap-3">
                          <span className="sm:hidden text-xs text-slate-400 font-bold font-mono">Subtotal:</span>
                          <div className="text-right sm:space-y-0.5">
                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                              {formatIDR(itemSubtotal)}
                            </div>
                            <span className="hidden sm:inline text-[10px] text-slate-455 font-mono">
                              {formatIDR(item.harga)} / psg
                            </span>
                          </div>
                          
                          <button
                            id={`btn-remove-item-${item.id}-${item.pilihUkuran}`}
                            onClick={() => removeFromCart(item.id, item.pilihUkuran, item.pilihWarna)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer ml-4 sm:ml-0"
                            title="Hapus sepasang"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Free delivery recommendation bar */}
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/50 flex gap-3 text-xs leading-relaxed text-indigo-700 dark:text-indigo-400">
                <CheckCircle2 size={18} className="shrink-0 text-indigo-505" />
                <p>
                  <b>Bebas Biaya Admin!</b> Belanjaan Anda di atas Rp 1.500.000 memenuhi syarat asuransi box instan tanpa tambahan biaya premium proteksi.
                </p>
              </div>

            </div>

            {/* Right Box: Total Summary checkout card layout */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Promo input form */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 rounded-2xl space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Tag size={16} className="text-indigo-600 dark:text-indigo-400" /> Gunakan Voucher Diskon
                </h3>
                <p className="text-xs text-slate-400">
                  Masukkan voucher StepStyle untuk mendapat potongan spesial. (Gunakan kode: <b className="text-indigo-500 select-all">STEPS15</b> atau <b className="text-indigo-500 select-all">DISKON30K</b>)
                </p>
                
                {activeDiscount ? (
                  <div className="bg-indigo-50 dark:bg-indigo-950/50 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Percent size={14} className="text-indigo-650" />
                      <div className="text-xs">
                        <span className="block font-bold text-indigo-755 dark:text-indigo-400">Voucher &ldquo;{activeDiscount.code}&rdquo; Aktif</span>
                        <span className="text-[10px] text-slate-500 font-medium">Potongan {activeDiscount.type === 'percent' ? `${activeDiscount.value}%` : formatIDR(activeDiscount.value)}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-xs font-bold text-rose-500 hover:underline"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      id="promo-input-field"
                      type="text"
                      placeholder="KODE VOUCHER"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold tracking-widest placeholder-slate-400 text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350 uppercase"
                    />
                    <button
                      id="btn-apply-voucher"
                      type="submit"
                      className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer"
                    >
                      Terapkan
                    </button>
                  </form>
                )}
              </div>

              {/* Order total receipt breakdown */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 rounded-2xl">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Ringkasan Belanja
                </h3>

                <div className="space-y-4 border-b border-slate-100 dark:border-slate-850 pb-4 mb-4 text-xs">
                  <div className="flex justify-between items-center text-slate-655 dark:text-slate-400">
                    <span>Total Harga ({cart.reduce((tot, i) => tot + i.jumlah, 0)} psg)</span>
                    <span className="font-bold text-slate-850 font-mono">{formatIDR(totalPriceItems)}</span>
                  </div>
                  
                  {activeDiscount && (
                    <div className="flex justify-between items-center text-rose-600 dark:text-rose-450">
                      <span>Voucher Potongan ({activeDiscount.code})</span>
                      <span className="font-bold font-mono">-{formatIDR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-655 dark:text-slate-400">
                    <span>Biaya Layanan Admin</span>
                    <span className="font-bold text-slate-850 font-mono">{formatIDR(costAdminFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Total Pembayaran</span>
                  <div className="text-right">
                    <span className="font-display text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400 block font-mono">
                      {formatIDR(payableGrandTotal)}
                    </span>
                    <span className="text-[10px] text-slate-405 leading-none">Sudah termasuk PPN 11%</span>
                  </div>
                </div>

                {/* Primary navigation trigger to Checkout */}
                <button
                  id="btn-proceed-to-checkout"
                  onClick={handleCheckoutClick}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  LANJUT KE CHECKOUT <ArrowRight size={16} />
                </button>

                {/* Safety notes */}
                <span className="block text-center text-[10px] text-slate-400 font-medium mt-3 leading-snug">
                  Dengan mengklik Lanjut, Anda menyetujui Kebijakan Sizing Return StepStyle.
                </span>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
