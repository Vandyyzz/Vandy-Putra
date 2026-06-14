'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  ArrowLeft, 
  CheckCircle, 
  ShoppingBag,
  Info
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, checkoutOrder, loginSimulated, addToast } = useStore();

  // Validate session voucher
  const [activeDiscount, setActiveDiscount] = useState<{ code: string; type: 'percent' | 'flat'; value: number } | null>(null);

  // Form input states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formZip, setFormZip] = useState('');
  
  // Method configurations
  const [shippingMethod, setShippingMethod] = useState<'regular' | 'express' | 'instant'>('regular');
  const [paymentMethod, setPaymentMethod] = useState<string>('bca_va');

  // Validation Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Populate info on render
  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    const timer = setTimeout(() => {
      // Auto populate auth user if exists
      if (user) {
        setFormName(user.nama);
        setFormEmail(user.email);
      } else {
        // Force quick guest login or prompt
        setFormName("Pelanggan Tamu");
        setFormEmail("tamu@mail.com");
      }

      // Check discount memory
      const storedDisc = sessionStorage.getItem('active_discount');
      if (storedDisc) {
        try {
          setActiveDiscount(JSON.parse(storedDisc));
        } catch (e) {
          console.error(e);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [cart, user, router]);

  // Pricing calculations
  const totalPriceItems = cart.reduce((total, item) => total + item.harga * item.jumlah, 0);
  
  let discountAmount = 0;
  if (activeDiscount) {
    if (activeDiscount.type === 'percent') {
      discountAmount = totalPriceItems * (activeDiscount.value / 100);
    } else {
      discountAmount = activeDiscount.value;
    }
  }

  // Shipping cost configuration
  const getShippingCost = () => {
    if (shippingMethod === 'express') return 35000;
    if (shippingMethod === 'instant') return 60000;
    return 0; // Free regular
  };

  const getShippingLabel = () => {
    if (shippingMethod === 'express') return 'Express (J&T Yes)';
    if (shippingMethod === 'instant') return 'Instant (GoSend)';
    return 'Reguler (JNE Bebas Ongkir)';
  };

  const getPaymentLabel = () => {
    if (paymentMethod === 'bca_va') return 'Transfer Bank (BCA VA)';
    if (paymentMethod === 'mandiri_va') return 'Transfer Bank (Mandiri VA)';
    if (paymentMethod === 'cc') return 'Kartu Kredit (Visa/Mastercard)';
    return 'Cash On Delivery (COD)';
  };

  const serviceFee = 10000;
  const grandPayableTotal = totalPriceItems - discountAmount + getShippingCost() + serviceFee;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.name = 'Nama lengkap wajib diisi!';
    if (!formEmail.trim() || !formEmail.includes('@')) errs.email = 'Format email tidak valid!';
    if (!formPhone.trim() || formPhone.length < 9) errs.phone = 'No HP tidak valid!';
    if (!formAddress.trim()) errs.address = 'Alamat lengkap wajib diisi!';
    if (!formCity.trim()) errs.city = 'Kota/Kecamatan wajib diisi!';
    if (!formZip.trim()) errs.zip = 'Kode POS wajib diisi!';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Harap perbaiki kesalahan input pada formulir!', 'error');
      // Scroll to error
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    
    let activeUser = user;
    // Automatically log in guests if they are not logged in, to map their order history
    if (!user) {
      activeUser = { email: formEmail.trim(), nama: formName.trim(), role: 'user' };
      loginSimulated(formEmail.trim(), formName.trim(), 'user');
    }

    const fullAddressString = `${formAddress}, ${formCity}, Kode Pos: ${formZip}, HP: ${formPhone}`;
    const shippingMethodLabel = getShippingLabel();
    const paymentMethodLabel = getPaymentLabel();

    const success = await checkoutOrder(
      fullAddressString,
      shippingMethodLabel,
      paymentMethodLabel,
      activeUser || undefined
    );

    setSubmitting(false);

    if (success) {
      sessionStorage.removeItem('active_discount');
      // Redirect to Account / User dashboard
      router.push('/account?tab=histori&success=true');
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Navbar />

      <main className="flex-grow py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            id="btn-back-to-cart"
            href="/cart"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-650 transition-colors"
          >
            <ArrowLeft size={16} /> KEMBALI KE KERANJANG
          </Link>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
          Proses Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Shipping Form */}
          <div className="lg:col-span-7 space-y-6">
            
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Box 1: Recipient Identity */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 rounded-2xl space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b dark:border-slate-800 pb-3">
                  <MapPin size={20} className="text-indigo-650" /> 1. Alamat Pengiriman
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Nama Lengkap Recipient</label>
                    <input
                      id="input-shipping-name"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className={`w-full h-10 px-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 ${
                        errors.name ? 'border-rose-500' : 'border-slate-200'
                      }`}
                      placeholder="Budi Santoso"
                    />
                    {errors.name && <span className="text-[10px] font-bold text-rose-500">{errors.name}</span>}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Email Pemesan</label>
                    <input
                      id="input-shipping-email"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className={`w-full h-10 px-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 ${
                        errors.email ? 'border-rose-500' : 'border-slate-200'
                      }`}
                      placeholder="budi@mail.com"
                    />
                    {errors.email && <span className="text-[10px] font-bold text-rose-500">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Nomor HP / WhatsApp</label>
                    <input
                      id="input-shipping-phone"
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className={`w-full h-10 px-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 ${
                        errors.phone ? 'border-rose-500' : 'border-slate-200'
                      }`}
                      placeholder="08123456789"
                    />
                    {errors.phone && <span className="text-[10px] font-bold text-rose-500">{errors.phone}</span>}
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Kota / Kecamatan</label>
                    <input
                      id="input-shipping-city"
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className={`w-full h-10 px-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 ${
                        errors.city ? 'border-rose-500' : 'border-slate-200'
                      }`}
                      placeholder="Jakarta Selatan"
                    />
                    {errors.city && <span className="text-[10px] font-bold text-rose-500">{errors.city}</span>}
                  </div>
                </div>

                {/* Full Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Alamat Rumah Lengkap (Jalan, RT/RW, Blok)</label>
                  <textarea
                    id="input-shipping-address"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    rows={3}
                    className={`w-full p-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 ${
                      errors.address ? 'border-rose-500' : 'border-slate-200'
                    }`}
                    placeholder="Jl. Sudirman No 12, Kel. Karet Tengsin, RT 05 RW 01"
                  />
                  {errors.address && <span className="text-[10px] font-bold text-rose-500">{errors.address}</span>}
                </div>

                {/* Postal code */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Kode POS</label>
                    <input
                      id="input-shipping-zip"
                      type="text"
                      value={formZip}
                      onChange={(e) => setFormZip(e.target.value)}
                      className={`w-full h-10 px-3 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 ${
                        errors.zip ? 'border-rose-500' : 'border-slate-200'
                      }`}
                      placeholder="10220"
                    />
                    {errors.zip && <span className="text-[10px] font-bold text-rose-500">{errors.zip}</span>}
                  </div>
                  <div className="flex items-end text-[10px] text-slate-400 font-medium pb-2 leading-relaxed">
                    Pesanan Anda dikemas dengan boks ekspedisi beralas busa proteksi penuh.
                  </div>
                </div>

              </div>

              {/* Box 2: Shipping Method Options */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 rounded-2xl space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b dark:border-slate-800 pb-3">
                  <Truck size={20} className="text-indigo-650" /> 2. Pilih Kurir Pengiriman
                </h3>

                <div id="checkout-shipping-group" className="space-y-3">
                  
                  {/* Regular choice */}
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'regular' 
                      ? 'border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20' 
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850'
                  }`}>
                    <div className="flex gap-3 items-center">
                      <input
                        type="radio"
                        name="shipping_opt"
                        checked={shippingMethod === 'regular'}
                        onChange={() => setShippingMethod('regular')}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <div>
                        <span className="block text-sm font-bold">Kurir Reguler (JNE)</span>
                        <span className="block text-[11px] text-slate-400">Estimasi sampai: 2-3 hari kerja</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-md">Bebas Ongkir</span>
                  </label>

                  {/* Express choice */}
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'express' 
                      ? 'border-indigo-600 bg-indigo-50/10' 
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800'
                  }`}>
                    <div className="flex gap-3 items-center">
                      <input
                        type="radio"
                        name="shipping_opt"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <div>
                        <span className="block text-sm font-bold">Kurir Kilat (J&T Yes)</span>
                        <span className="block text-[11px] text-slate-400">Estimasi sampai: 1 hari kerja (Besok sampai)</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-850 font-mono">Rp 35.000</span>
                  </label>

                  {/* Instant choice */}
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'instant' 
                      ? 'border-indigo-600 bg-indigo-50/10' 
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800'
                  }`}>
                    <div className="flex gap-3 items-center">
                      <input
                        type="radio"
                        name="shipping_opt"
                        checked={shippingMethod === 'instant'}
                        onChange={() => setShippingMethod('instant')}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <div>
                        <span className="block text-sm font-bold">Sameday Instant (GoSend)</span>
                        <span className="block text-[11px] text-slate-400">Sampai dalam 3-6 jam setelah order diproses</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-850 font-mono">Rp 60.000</span>
                  </label>

                </div>
              </div>

              {/* Box 3: Payment Options */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 rounded-2xl space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b dark:border-slate-800 pb-3">
                  <CreditCard size={20} className="text-indigo-650" /> 3. Pilih Metode Pembayaran
                </h3>

                <div id="checkout-payment-group" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* BCA Virtual Account */}
                  <label className={`flex gap-3 items-center p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'bca_va' ? 'border-slate-900 bg-slate-50 dark:border-white' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentMethod === 'bca_va'}
                      onChange={() => setPaymentMethod('bca_va')}
                      className="text-slate-905 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="block font-bold">BCA Virtual Account</span>
                      <span className="block text-[10px] text-slate-400 font-mono">BCA VA: Otomatis Verifikasi</span>
                    </div>
                  </label>

                  {/* Mandiri Virtual Account */}
                  <label className={`flex gap-3 items-center p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'mandiri_va' ? 'border-slate-900 bg-slate-50 dark:border-white' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentMethod === 'mandiri_va'}
                      onChange={() => setPaymentMethod('mandiri_va')}
                      className="text-slate-905 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="block font-bold">Mandiri Virtual Account</span>
                      <span className="block text-[10px] text-slate-400 font-mono font-sans">Verifikasi Real-time</span>
                    </div>
                  </label>

                  {/* Credit Card */}
                  <label className={`flex gap-3 items-center p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cc' ? 'border-slate-900 bg-slate-50 dark:border-white' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentMethod === 'cc'}
                      onChange={() => setPaymentMethod('cc')}
                      className="text-slate-905 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="block font-bold">Kartu Kredit</span>
                      <span className="block text-[10px] text-slate-400">Cicilan 0% Visa/Mastercard</span>
                    </div>
                  </label>

                  {/* COD */}
                  <label className={`flex gap-3 items-center p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-slate-900 bg-slate-50 dark:border-white' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-slate-905 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="block font-bold">Bayar di Tempat (COD)</span>
                      <span className="block text-[10px] text-slate-404">Bayar saat kurir mengantar paket</span>
                    </div>
                  </label>

                </div>
              </div>

              {/* Submit hidden support */}
              <button type="submit" className="hidden">Konfirmasi Order</button>
            </form>

          </div>

          {/* Right: Receipt Breakdown Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Box 4: Selected Basket list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 rounded-2xl">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b dark:border-slate-850 pb-3">
                Pesanan Sepatu Anda
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-[280px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.pilihUkuran}`} className="flex justify-between items-center py-3 first:pt-0">
                    <div className="flex gap-3 items-center">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-50 border shrink-0">
                        <Image src={item.gambar} alt={item.nama} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-xs max-w-[160px] sm:max-w-[200px]">
                        <span className="block font-bold text-slate-900 dark:text-white truncate">{item.nama}</span>
                        <span className="block text-[10px] text-slate-400 font-mono uppercase">EUR: {item.pilihUkuran} • {item.jumlah} psg</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {formatIDR(item.harga * item.jumlah)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Voucher applied indicator */}
              {activeDiscount && (
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-755 dark:text-indigo-400 font-medium">
                  ✓ Potongan promo aktif: <b>{activeDiscount.code} (-{activeDiscount.type === 'percent' ? `${activeDiscount.value}%` : formatIDR(activeDiscount.value)})</b>
                </div>
              )}

            </div>

            {/* Box 5: Final calculation tally checklist */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 rounded-2xl">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b dark:border-slate-850">
                Ringkasan Pembayaran
              </h3>

              <div className="space-y-3.5 text-xs pb-4 border-b dark:border-slate-850 mb-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal Belanja</span>
                  <span className="font-bold text-slate-800 dark:text-slate-350 font-mono">{formatIDR(totalPriceItems)}</span>
                </div>
                {activeDiscount && (
                  <div className="flex justify-between text-rose-600">
                    <span>Potongan Kode Voucher</span>
                    <span className="font-bold font-mono">-{formatIDR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Ongkos Kirim ({getShippingLabel().split(' ')[0]})</span>
                  <span className="font-bold text-slate-800 dark:text-slate-350 font-mono">{formatIDR(getShippingCost())}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Administrasi</span>
                  <span className="font-bold text-slate-800 dark:text-slate-350 font-mono">{formatIDR(serviceFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Total Akhir Bayar</span>
                <span className="font-display text-lg sm:text-2xl font-extrabold text-indigo-650 dark:text-indigo-400 font-mono block">
                  {formatIDR(grandPayableTotal)}
                </span>
              </div>

              {/* Giant CTA Button */}
              <button
                id="btn-confirm-checkout-final"
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'MEMPROSES PESANAN...' : 'KONFIRMASI & BAYAR SEKARANG'}
              </button>

              <div className="flex items-start gap-1.5 mt-4 text-[10px] text-slate-400">
                <Info size={14} className="shrink-0 text-slate-400" />
                <p className="leading-snug">
                  <b>Simulasi Transaksi:</b> Mengklik tombol berarti menyimulasikan verifikasi transfer pembayaran virtual account. Data pesanan akan disimpan ke menu histori order akun Anda secara instan.
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
