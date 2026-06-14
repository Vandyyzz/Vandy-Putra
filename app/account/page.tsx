'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore, Order } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  User, 
  ShoppingBag, 
  LogOut, 
  FileText, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  TrendingDown,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Mail,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginSimulated, logoutSimulated, addToast } = useStore();

  // Active view tab state: 'profil' | 'histori'
  const [activeTab, setActiveTab] = useState<'profil' | 'histori'>('profil');

  // Login form status
  const [isRegister, setIsRegister] = useState(false);
  const [inputNama, setInputNama] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPw, setInputPw] = useState('');

  // Edit profile states
  const [editNama, setEditNama] = useState('');
  const [editTel, setEditTel] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Orders loaded from API
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Sync tab from URL params (e.g., when redirected after successful checkout)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const checkoutSuccess = searchParams.get('success');

    const timer = setTimeout(() => {
      if (tabParam === 'histori') {
        setActiveTab('histori');
      }

      if (checkoutSuccess === 'true') {
        addToast('Pesanan kami terima! Harap salin nomor pembayaran Virtual Account Anda.', 'success');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Loading customer's order history
  const loadMyOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        // Since this is a demo, regular users see all orders they made matching their email
        // or all orders in mock-persistence if you want full demonstration!
        const filtered = data.filter((o: any) => o.pembeli?.email === user.email);
        setMyOrders(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setEditNama(user.nama);
        loadMyOrders();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Handles Simulated Auth operations
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || !inputPw.trim()) {
      addToast('Harap lengkapi semua kolom form!', 'error');
      return;
    }

    if (isRegister && !inputNama.trim()) {
      addToast('Masukan nama Anda!', 'error');
      return;
    }

    // Role decider based on email / credentials trigger
    let role: 'user' | 'admin' = 'user';
    if (inputEmail.toLowerCase().includes('admin') || inputPw === 'admin123') {
      role = 'admin';
    }

    const nameToUse = isRegister ? inputNama : (role === 'admin' ? 'Administrator Shop' : 'Budi Santoso');
    loginSimulated(inputEmail.trim(), nameToUse, role);
    
    // Clear forms
    setInputNama('');
    setInputEmail('');
    setInputPw('');
  };

  // Handles Shortcut buttons to make testing incredibly fluid!
  const triggerShortcutLogin = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      loginSimulated('admin@stepstyle.co.id', 'Administrator StepStyle', 'admin');
    } else {
      loginSimulated('budi@mail.com', 'Budi Santoso', 'user');
    }
  };

  // Profile detail updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNama.trim()) {
      addToast('Nama lengkap tidak boleh kosong!', 'error');
      return;
    }
    // Submmit Simulated profile update
    loginSimulated(user!.email, editNama.trim(), user!.role);
    addToast('Perubahan profil berhasil disimpan!', 'success');
  };

  const handleManualOrderReceived = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Selesai' })
      });
      if (res.ok) {
        addToast(`Pesanan ${orderId} selesai! Terima kasih telah berbelanja di StepStyle.`, 'success');
        loadMyOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Navbar />

      <main className="flex-grow py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {!user ? (
          /* LOGGED OUT DISPLAY: Interactive simulated authentication card */
          <div className="max-w-md mx-auto relative z-10 my-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-650">
                  <User size={28} />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white-850">
                  {isRegister ? 'Buat Akun Baru' : 'Masuk ke StepStyle'}
                </h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {isRegister 
                    ? 'Daftarkan email Anda untuk menabung wishlist dan merekam riwayat checkout sepatu.'
                    : 'Akses histori pesanan, simpan alamat rumah, dan perbarui info profil Anda.'
                  }
                </p>
              </div>

              {/* Normal login credentials submit */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegister && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-455 uppercase">Nama Lengkap</label>
                    <input
                      id="auth-input-name"
                      type="text"
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800"
                      placeholder="Agus Budiman"
                      value={inputNama}
                      onChange={(e) => setInputNama(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-455 uppercase">Alamat Email</label>
                  <div className="relative">
                    <input
                      id="auth-input-email"
                      type="email"
                      className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                      placeholder="agus@mail.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      required
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-455 uppercase">Kata Sandi (Password)</label>
                  <div className="relative">
                    <input
                      id="auth-input-password"
                      type="password"
                      className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                      placeholder="••••••••"
                      value={inputPw}
                      onChange={(e) => setInputPw(e.target.value)}
                      required
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <button
                  id="btn-auth-submit"
                  type="submit"
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  {isRegister ? 'DAFTAR AKUN BARU' : 'MASUK SEKARANG'}
                </button>
              </form>

              {/* Login mode toggle */}
              <div className="text-center pt-2">
                <button
                  id="btn-switch-auth-mode"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-indigo-600 hover:underline font-semibold dark:text-indigo-400"
                >
                  {isRegister ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar gratis'}
                </button>
              </div>

              {/* TESTING SHORTCUTS BORDER */}
              <div className="border-t dark:border-slate-800 pt-4 space-y-3">
                <div className="text-[11px] font-bold text-center text-slate-455 uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none">
                  <Sparkles size={12} className="text-amber-500" /> Demo Shortcut Login
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-shortcut-login-user"
                    onClick={() => triggerShortcutLogin('user')}
                    className="h-10 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Masuk Sebagai Pembeli
                  </button>
                  <button
                    id="btn-shortcut-login-admin"
                    onClick={() => triggerShortcutLogin('admin')}
                    className="h-10 border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Masuk Sebagai Admin
                  </button>
                </div>
                <span className="block text-[10px] text-center text-slate-400 leading-tight">
                  Gunakan tombol di atas untuk login simulasi instan tanpa verifikasi email!
                </span>
              </div>

            </div>
          </div>
        ) : (
          /* LOGGED IN DISPLAY: Tabs layout dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left box: Nav list */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-white font-display text-2xl font-bold uppercase shadow-lg shadow-indigo-600/25 mb-3">
                  {user.nama.charAt(0)}
                </div>
                <h3 className="font-display font-black text-slate-900 dark:text-white tracking-tight leading-snug truncate">
                  {user.nama}
                </h3>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350">
                  {user.role === 'admin' ? '🏷️ Admin Toko' : '🛒 Pembeli Terdaftar'}
                </span>
                <p className="mt-2 text-xs text-slate-400 truncate">{user.email}</p>

                {/* Log out option */}
                <button
                  id="btn-logout-account-dashboard"
                  onClick={logoutSimulated}
                  className="mt-6 w-full h-10 bg-slate-150 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-755 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut size={14} /> Keluar Akun (Logout)
                </button>
              </div>

              {/* Sidebar Tabs Links list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-2 rounded-2xl shadow-sm space-y-1">
                <button
                  id="btn-tab-profil"
                  onClick={() => setActiveTab('profil')}
                  className={`w-full flex items-center gap-2.5 px-4 h-11 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'profil'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-850'
                  }`}
                >
                  <User size={15} /> EDIT DETAIL PROFIL
                </button>
                <button
                  id="btn-tab-histori"
                  onClick={() => setActiveTab('histori')}
                  className={`w-full flex items-center gap-2.5 px-4 h-11 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'histori'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-850'
                  }`}
                >
                  <ShoppingBag size={15} /> RIWAYAT PESANAN (HISTORI)
                </button>
              </div>

              {/* Super Administrative shortcut if role matches */}
              {user.role === 'admin' && (
                <Link
                  id="btn-quick-admin-redirect"
                  href="/admin"
                  className="h-11 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  MASUK DASHBOARD ADMIN <ArrowRight size={14} />
                </Link>
              )}

            </div>

            {/* Right box: Dynamic active view body output */}
            <div className="lg:col-span-9">
              
              {activeTab === 'profil' ? (
                /* VIEW: PROFILE FORM UTILITY */
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/85 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="border-b dark:border-slate-855 pb-4">
                    <h3 className="font-display font-extrabold text-lg text-slate-905 dark:text-white">Detail Pengguna & Kontak</h3>
                    <p className="text-xs text-slate-400">Sunting informasi kontak pengiriman default Anda agar proses belanja lebih instan.</p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-455 uppercase">Nama Lengkap</label>
                      <input
                        id="profile-edit-name"
                        type="text"
                        value={editNama}
                        onChange={(e) => setEditNama(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800"
                        placeholder="Nama asli Anda"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-455 uppercase">Alamat Email (Uneditable)</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full h-10 pl-9 pr-3 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-450 dark:bg-slate-955 dark:border-slate-850 cursor-not-allowed"
                          title="Email tidak dapat diganti setelah registrasi"
                        />
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-455 uppercase">Nomor Telepon Default</label>
                      <div className="relative">
                        <input
                          id="profile-edit-tel"
                          type="tel"
                          value={editTel}
                          onChange={(e) => setEditTel(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-955 dark:border-slate-800"
                          placeholder="081234567890"
                        />
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-455 uppercase">Alamat Pengiriman Rumah Default</label>
                      <textarea
                        id="profile-edit-address"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-955 dark:border-slate-800"
                        placeholder="Masukkan alamat RT/RW/No rumah Anda"
                      />
                    </div>

                    <button
                      id="btn-save-profile-final"
                      type="submit"
                      className="h-10 px-6 bg-slate-900 border hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      SIMPAN PERUBAHAN PROFIL
                    </button>
                  </form>
                </div>
              ) : (
                /* VIEW: ORDER HISTORY TABLE LOGS CONTAINER */
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/85 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="border-b dark:border-slate-850 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-slate-905 dark:text-white">Riwayat Checkout Belanja</h3>
                      <p className="text-xs text-slate-400">Total belanjaan sepatu yang didaftarkan menggunakan akun email Anda.</p>
                    </div>
                    <button
                      onClick={loadMyOrders}
                      disabled={loadingOrders}
                      className="text-xs font-semibold text-indigo-650 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950"
                      title="Muat Ulang Pesanan"
                    >
                      <RefreshCw size={12} className={loadingOrders ? "animate-spin" : ""} /> Update Histori
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                    </div>
                  ) : myOrders.length === 0 ? (
                    <div className="text-center py-12 space-y-3 flex flex-col items-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-400">
                        <ShoppingBag size={24} />
                      </div>
                      <p className="text-sm text-slate-455 font-semibold">Anda belum pernah melakukan order sepatu apa pun.</p>
                      <Link href="/products" className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400">
                        Belanja Koleksi Sepatu Hari Ini →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {myOrders.map((ord) => {
                        let statusColor = 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/20';
                        if (ord.status === 'Selesai') statusColor = 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20';
                        else if (ord.status === 'Dikirim') statusColor = 'bg-sky-50 border-sky-100 text-sky-700 dark:bg-sky-950/20';

                        return (
                          <div 
                            id={`history-card-${ord.id}`}
                            key={ord.id} 
                            className="border border-slate-150 rounded-2xl dark:border-slate-800 overflow-hidden shadow-sm flex flex-col"
                          >
                            {/* Summary meta bar */}
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-150 dark:bg-slate-955 dark:border-slate-815 flex flex-wrap justify-between items-center gap-2 text-xs">
                              <span className="font-bold text-slate-805 dark:text-slate-350">ID Pesanan: <b className="font-mono text-indigo-650 dark:text-indigo-400">{ord.id}</b></span>
                              <span className="text-slate-400 font-medium">Tanggal: {new Date(ord.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                {ord.status}
                              </span>
                            </div>

                            {/* Item thumbnail previews */}
                            <div className="p-4 divide-y dark:divide-slate-800">
                              {ord.items.map((it: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                                  <div className="flex gap-3">
                                    <div className="relative h-10 w-10 bg-slate-50 border rounded-lg overflow-hidden shrink-0">
                                      <Image src={it.gambar} alt={it.nama} fill className="object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="text-xs">
                                      <span className="block font-bold text-slate-900 dark:text-white line-clamp-1">{it.nama}</span>
                                      <span className="block text-[10px] text-slate-400 font-mono">EUR {it.pilihUkuran} • Varian: {it.pilihWarna} • {it.jumlah} pasang</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{formatIDR(it.harga * it.jumlah)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Bottom Payment details */}
                            <div className="border-t border-slate-150 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-950/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                              <div className="text-xs">
                                <span className="block text-slate-400 leading-normal">Pembayaran: <b>{ord.metodeBayar}</b></span>
                                <span className="block text-slate-400 mt-0.5 max-w-sm truncate" title={ord.alamat}>Pengiriman: <b>{ord.alamat}</b></span>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-0 pt-3 sm:pt-0">
                                <div className="text-right">
                                  <span className="text-[10px] block text-slate-455 font-bold uppercase tracking-wider leading-none">Total Bayar</span>
                                  <span className="font-display font-extrabold text-base text-indigo-600 dark:text-indigo-400 font-mono">{formatIDR(ord.totalHarga)}</span>
                                </div>

                                {/* Delivery Confirmation prompt */}
                                {ord.status === 'Dikirim' && (
                                  <button
                                    id={`btn-confirm-received-${ord.id}`}
                                    onClick={() => handleManualOrderReceived(ord.id)}
                                    className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                  >
                                    Konfirmasi Terima Barang
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
        </div>
        <Footer />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
