'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore, Order } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/lib/products';
import { 
  Settings, 
  Plus, 
  Pen, 
  Trash2, 
  ShoppingBag, 
  Coins, 
  Grid, 
  FileText,
  AlertOctagon,
  X,
  PlusCircle,
  TrendingUp,
  Package,
  Activity,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

function AdminContent() {
  const router = useRouter();
  const { 
    products, 
    orders, 
    user, 
    refreshProducts, 
    refreshOrders, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    loginSimulated, 
    addToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'katalog' | 'pesanan'>('katalog');

  // Modal / Form trigger states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form input field states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<'Pria' | 'Wanita' | 'Anak'>('Pria');
  const [stock, setStock] = useState(10);
  const [sizes, setSizes] = useState<number[]>([39, 40, 41, 42]);
  const [colors, setColors] = useState<string[]>(['Putih', 'Hitam']);
  const [description, setDescription] = useState('');

  // Sizing and color selectors inside creation form
  const sizeOptions = [28, 30, 32, 34, 36, 38, 39, 40, 41, 42, 43, 44, 45];
  const colorOptions = ['Putih', 'Hitam', 'Abu-abu', 'Biru', 'Merah', 'Kuning', 'Kombinasi'];

  // Refresh lists on load if authorized
  useEffect(() => {
    if (user?.role === 'admin') {
      refreshProducts();
      refreshOrders();
    }
  }, [user]);

  // Handle open modal for creation
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setBrand('');
    setPrice(1200000);
    setImageUrl('https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop');
    setCategory('Pria');
    setStock(15);
    setSizes([39, 40, 41, 42]);
    setColors(['Putih', 'Hitam']);
    setDescription('');
    setShowProductModal(true);
  };

  // Handle open modal for update
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.nama);
    setBrand(p.merek);
    setPrice(p.harga);
    setImageUrl(p.gambar);
    setCategory(p.kategori);
    setStock(p.stok);
    setSizes(p.ukuranSedia);
    setColors(p.warna);
    setDescription(p.deskripsi);
    setShowProductModal(true);
  };

  // Handle sizes array configuration
  const handleToggleSize = (sz: number) => {
    if (sizes.includes(sz)) {
      setSizes(sizes.filter(s => s !== sz));
    } else {
      setSizes([...sizes, sz].sort((a, b) => a - b));
    }
  };

  // Handle colors array configuration
  const handleToggleColor = (col: string) => {
    if (colors.includes(col)) {
      setColors(colors.filter(c => c !== col));
    } else {
      setColors([...colors, col]);
    }
  };

  // Form submission: CREATE or UPDATE
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || price <= 0 || !imageUrl.trim() || !description.trim()) {
      addToast('Harap isi semua kolom wajib pada form produk!', 'error');
      return;
    }

    if (sizes.length === 0) {
      addToast('Harap pilih minimal 1 ukuran sepatu!', 'error');
      return;
    }

    const payload = {
      nama: name.trim(),
      merek: brand.trim(),
      harga: Number(price),
      gambar: imageUrl.trim(),
      kategori: category,
      stok: Number(stock),
      ukuranSedia: sizes,
      warna: colors,
      deskripsi: description.trim(),
      rating: editingProduct ? editingProduct.rating : 5.0
    };

    let success = false;
    if (editingProduct) {
      // Edit mode
      success = await updateProduct(editingProduct.id, payload);
    } else {
      // Create mode
      success = await createProduct(payload);
    }

    if (success) {
      setShowProductModal(false);
    }
  };

  const handleDeleteClick = async (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus sepatu ini dari katalog toko?')) {
      await deleteProduct(productId);
    }
  };

  const handleStatusChange = async (orderId: string, currentStatus: string) => {
    let nextStatus = 'Selesai';
    if (currentStatus === 'Menunggu Pembayaran') {
      nextStatus = 'Diproses';
    } else if (currentStatus === 'Diproses') {
      nextStatus = 'Dikirim';
    } else if (currentStatus === 'Dikirim') {
      nextStatus = 'Selesai';
    } else {
      return; // Already done
    }

    await updateOrderStatus(orderId, nextStatus);
  };

  const calculateTotalSales = () => {
    return orders.reduce((total, ord) => total + ord.totalHarga, 0);
  };

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // ACCESS DENIED DISPLAY
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-505 animate-pulse">
              <ShieldAlert size={36} className="text-amber-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Akses Ditolak (Shield Guard)
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                Anda mencoba masuk ke ruang administrasi tanpa profil otoritas yang memadai. Jalur ini dicagari khusus untuk administrator StepStyle.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                id="btn-admin-bypass-login"
                onClick={() => loginSimulated('admin@stepstyle.co.id', 'Administrator Toko', 'admin')}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck size={16} /> Aktifkan Bypass Mode Admin
              </button>
              <Link
                href="/"
                className="w-full h-11 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                Kembali ke Beranda (Homepage)
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Navbar />

      <main className="flex-grow py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Admin Header overview metrics */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-909 dark:text-white flex items-center gap-2">
              <Settings className="text-indigo-600 dark:text-indigo-405 animate-spin duration-1000" /> Dashboard Administrasi
            </h1>
            <p className="text-xs text-slate-400">Pusat kelola katalog, sedia stok gudang sepatu, dan memproses status pesanan konsumen.</p>
          </div>
          
          <button
            id="btn-admin-add-product-main"
            onClick={handleOpenCreateModal}
            className="h-10 px-5 bg-indigo-600 hover:bg-indigo-505 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus size={16} /> Tambah Sepatu Baru
          </button>
        </div>

        {/* METRICS STATS BENTO ROW */}
        <section id="admin-bento-metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Omzet Toko</span>
            <div className="font-display text-lg sm:text-2xl font-black text-indigo-608 dark:text-indigo-402 font-mono">
              {formatIDR(calculateTotalSales())}
            </div>
            <p className="text-[10px] text-slate-450">Sistem Akuntansi Simulasi 2026</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Antrean Pesanan</span>
            <div className="font-display text-xl sm:text-2xl font-black font-mono">
              {orders.filter(o => o.status !== 'Selesai').length} Paket
            </div>
            <p className="text-[10px] text-slate-455">Pesanan baru yang perlu diproses</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Katalog Terindeks</span>
            <div className="font-display text-xl sm:text-2xl font-black font-mono">
              {products.length} Merek
            </div>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5"><Activity size={12} /> Database Seimbang</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tingkat Penjualan</span>
            <div className="font-display text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              98.2%
            </div>
            <p className="text-[10px] text-slate-455">Target kepuasan ulasan bintang 5</p>
          </div>

        </section>

        {/* TABS CONTROLLERS */}
        <div id="admin-tabs" className="flex border-b border-slate-200 dark:border-slate-850 gap-6 sm:gap-10 pb-0.5 mb-6 overflow-x-auto">
          <button
            id="admin-tab-btn-katalog"
            onClick={() => setActiveTab('katalog')}
            className={`text-xs sm:text-sm font-bold pb-4 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'katalog'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📦 KATALOG SEPATU ({products.length})
          </button>
          
          <button
            id="admin-tab-btn-orders"
            onClick={() => setActiveTab('pesanan')}
            className={`text-xs sm:text-sm font-bold pb-4 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'pesanan'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 PESANAN MASUK ({orders.length})
          </button>
        </div>

        {/* TAB 1: PRODUCT CATALOG MANAGER TABLE SCHEMA */}
        {activeTab === 'katalog' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            
            {/* Header labels */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 text-xs font-bold text-slate-400 uppercase font-mono">
              <div className="col-span-6">Model Sepatu</div>
              <div className="col-span-2 text-center">Gudang Stok</div>
              <div className="col-span-2 text-right">Harga Satuan</div>
              <div className="col-span-2 text-center">Aksi Panel</div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {products.map((p) => (
                <div 
                  id={`admin-product-row-${p.id}`}
                  key={p.id} 
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/20"
                >
                  {/* Info model */}
                  <div className="col-span-6 flex gap-3 h-full items-center">
                    <div className="relative h-11 w-11 rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                      <Image src={p.gambar} alt={p.nama} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-xs max-w-sm">
                      <span className="block font-bold text-slate-900 dark:text-white line-clamp-1">{p.nama}</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {p.id} • Kategori: <b>{p.kategori}</b></span>
                    </div>
                  </div>

                  {/* Stock levels */}
                  <div className="col-span-2 text-center text-xs font-bold">
                    {p.stok === 0 ? (
                      <span className="bg-rose-50 border border-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold dark:bg-rose-950/20">Habis</span>
                    ) : p.stok <= 3 ? (
                      <span className="bg-amber-50 border border-amber-100 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold dark:bg-amber-950/20 animate-pulse">{p.stok} Psg</span>
                    ) : (
                      <span className="text-slate-800 dark:text-slate-300 font-mono">{p.stok} Psg</span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="col-span-2 text-right text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {formatIDR(p.harga)}
                  </div>

                  {/* Action block */}
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <button
                      id={`btn-edit-product-${p.id}`}
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/35 rounded-lg transition-colors cursor-pointer"
                      title="Klik untuk menyunting produk"
                    >
                      <Pen size={14} />
                    </button>
                    <button
                      id={`btn-delete-product-${p.id}`}
                      onClick={() => handleDeleteClick(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/35 rounded-lg transition-colors cursor-pointer"
                      title="Hapus permanen dari katalog"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: STORE ORDERS / LOGISTICS PROCESS CONTROL */}
        {activeTab === 'pesanan' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-455">
                Kamar antrean pesanan kosong. Belum ada aktivitas transaksi terekam.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord) => {
                  let statusColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400';
                  let statusActionLabel = 'Proses Pesanan (Diproses)';

                  if (ord.status === 'Diproses') {
                    statusColor = 'bg-indigo-50 text-indigo-750 border-indigo-150 dark:bg-indigo-950/25';
                    statusActionLabel = 'Kirim Paket (Sertakan Resi)';
                  } else if (ord.status === 'Dikirim') {
                    statusColor = 'bg-sky-50 text-sky-700 border-sky-150 dark:bg-sky-950/25 dark:text-sky-400';
                    statusActionLabel = 'Selesaikan Paket (Selesai)';
                  } else if (ord.status === 'Selesai') {
                    statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/25';
                  }

                  return (
                    <div 
                      key={ord.id} 
                      id={`admin-order-card-${ord.id}`}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
                    >
                      
                      {/* Order heading stats */}
                      <div className="px-5 py-3 border-b border-slate-150 dark:border-slate-820 bg-slate-50 dark:bg-slate-950 flex flex-wrap justify-between items-center gap-3">
                        <div className="flex gap-2.5 items-center">
                          <span className="text-xs font-bold">ID Transaksi: <b className="font-mono text-indigo-650 dark:text-indigo-400">{ord.id}</b></span>
                          <span className="text-[10px] text-slate-400 font-medium">Tanggal: {new Date(ord.tanggal).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                          {ord.status}
                        </span>
                      </div>

                      {/* Customer info body */}
                      <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Customer recipient and cargo address col-5 */}
                        <div className="md:col-span-5 space-y-2 text-xs">
                          <h4 className="font-bold text-slate-455 uppercase tracking-wider">Penerima & Alamat Kirim</h4>
                          <p className="font-bold text-slate-900 dark:text-white leading-none">{ord.pembeli?.nama}</p>
                          <p className="text-slate-404">{ord.pembeli?.email}</p>
                          <p className="text-slate-500 leading-relaxed font-sans">{ord.alamat}</p>
                        </div>

                        {/* Shoes list col-4 */}
                        <div className="md:col-span-4 space-y-2 text-xs border-t md:border-t-0 md:border-x dark:border-slate-800 pt-4 md:pt-0 md:px-6">
                          <h4 className="font-bold text-slate-455 uppercase tracking-wider">Item Pembelian</h4>
                          <div className="space-y-1">
                            {ord.items.map((it, idx) => (
                              <p key={idx} className="font-medium">
                                - {it.nama} <b className="font-mono text-[10px] text-slate-400">(EUR {it.pilihUkuran} x {it.jumlah})</b>
                              </p>
                            ))}
                          </div>
                          <p className="pt-2 text-[10px] text-slate-400">Total Harga Barang: <b>{formatIDR(ord.totalHarga)}</b></p>
                        </div>

                        {/* Status operator col-3 */}
                        <div className="md:col-span-3 flex flex-col justify-between items-stretch text-right min-h-[140px] pt-4 md:pt-0">
                          <div className="text-xs">
                            <span className="block text-slate-400 leading-normal">Pembayaran: <b>{ord.metodeBayar}</b></span>
                            <span className="block text-slate-400 mt-0.5">Ekspedisi: <b>{ord.metodeKirim}</b></span>
                          </div>

                          <div className="space-y-2 border-t pt-3 dark:border-slate-850">
                            <span className="block text-xs font-bold text-indigo-650 dark:text-indigo-400 font-mono">{formatIDR(ord.totalHarga)}</span>
                            
                            {/* Action progression clicker */}
                            {ord.status !== 'Selesai' && (
                              <button
                                id={`btn-admin-order-progress-${ord.id}`}
                                onClick={() => handleStatusChange(ord.id, ord.status)}
                                className="w-full h-9 bg-slate-900 border hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold tracking-wide transition-all cursor-pointer"
                              >
                                {statusActionLabel}
                              </button>
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* DETAILED DIALOG MODAL: CREATE AND EDITION OF SNEAKERS */}
      {showProductModal && (
        <div id="product-admin-modal-layout" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          
          <div className="relative bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b dark:border-slate-850 mb-5">
              <h3 className="font-display font-extrabold text-lg text-slate-950 dark:text-white flex items-center gap-1.5">
                <PlusCircle size={20} className="text-indigo-600" /> {editingProduct ? 'Sunting Sepatu' : 'Tambah Sepatu Baru'}
              </h3>
              <button 
                onClick={() => setShowProductModal(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-950"
                title="Tutup Form"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form body container */}
            <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 pb-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Merek / Pabrik</label>
                  <input
                    id="admin-form-brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                    placeholder="Nike (e.g. Adidas)"
                    required
                  />
                </div>

                {/* Model Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Model Sepatu</label>
                  <input
                    id="admin-form-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                    placeholder="Air Force 1 Ultra High"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Price in numeric IDR */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Harga Jual (Rupiah)</label>
                  <input
                    id="admin-form-price"
                    type="number"
                    value={price === 0 ? '' : price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                    placeholder="1500000"
                    required
                  />
                </div>

                {/* Category dropdown */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Kategori Gender</label>
                  <select
                    id="admin-form-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                  >
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                    <option value="Anak">Anak</option>
                  </select>
                </div>

                {/* Stock slider or input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Stok Tersedia</label>
                  <input
                    id="admin-form-stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                    min={0}
                    required
                  />
                </div>
              </div>

              {/* Shoe photo url */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">URL Gambar Sepatu (Unsplash / Picsum)</label>
                <input
                  id="admin-form-image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              {/* Sizes checklist available */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Pilih Ukuran Tersedia (EUR Sizing)</label>
                <div id="admin-form-sizes-group" className="flex flex-wrap gap-2">
                  {sizeOptions.map((sz) => {
                    const active = sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${
                          active 
                            ? 'bg-indigo-650 text-white ring-2 ring-indigo-505/20 font-black' 
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors checklist selection */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Aksen Warna Material</label>
                <div id="admin-form-colors-group" className="flex flex-wrap gap-2">
                  {colorOptions.map((col) => {
                    const active = colors.includes(col);
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handleToggleColor(col)}
                        className={`px-3 h-8 rounded-lg text-xs font-bold transition-all ${
                          active 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black' 
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200/80'
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Long Description text */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Deskripsi Produk Lengkap</label>
                <textarea
                  id="admin-form-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-850 dark:bg-slate-950 dark:border-slate-800 text-slate-350"
                  placeholder="Ceritakan fitur sol dalam, kenyamanan bantalan lari, dan estetika bahan sepatu..."
                  required
                />
              </div>

              {/* Primary Dialog CTAs */}
              <div className="pt-4 border-t flex flex-col sm:flex-row gap-2.5">
                <button
                  id="btn-admin-product-save"
                  type="submit"
                  className="h-10 flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {editingProduct ? 'SIMPAN DETAIL PERUBAHAN' : 'BUAT SEPATU BARU'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="h-10 px-5 border hover:bg-slate-50 rounded-xl text-xs font-semibold"
                >
                  Batal / Tutup
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function AdminPage() {
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
      <AdminContent />
    </Suspense>
  );
}
