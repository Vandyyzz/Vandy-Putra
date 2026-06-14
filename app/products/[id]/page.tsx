'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/products';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Check, 
  ThumbsUp, 
  Sparkles,
  Info
} from 'lucide-react';

interface Params {
  id: string;
}

export default function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const { products, addToCart, toggleWishlist, isInWishlist } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'spesifikasi' | 'ulasan'>('deskripsi');
  const [zoomScale, setZoomScale] = useState(false);

  // Load product detail matching parameters
  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.id === productId);
      const timer = setTimeout(() => {
        if (found) {
          setProduct(found);
          setSelectedSize(found.ukuranSedia[0] || null);
          setSelectedColor(found.warna[0] || 'Default');
        }
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [productId, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Sepatu tidak ditemukan!</h2>
          <p className="text-slate-500 text-sm max-w-sm">
            Produk dengan kode ID &ldquo;{productId}&rdquo; tidak dikenali atau telah dihapus dari katalog database.
          </p>
          <Link href="/products" className="h-10 px-5 bg-indigo-600 text-white rounded-xl text-sm font-semibold flex items-center gap-1">
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWish = isInWishlist(product.id);
  const isOutOfStock = product.stok <= 0;

  // Derive products of same brand as recommendations
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.merek === product.merek && p.stok > 0)
    .slice(0, 4);

  // Indonesian Currency Formatter helper
  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const incrementQty = () => {
    if (quantity < product.stok) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (selectedSize === null) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  // Mock reviewer comments matching specific ratings
  const mockReviews = [
    {
      id: 1,
      nama: "Herlambang S.",
      rating: 5,
      tanggal: "28 Mei 2026",
      komentar: "Produk beneran original, detail jahitan rapih. Sol luarnya empuk banget dipake seharian bekerja. Packaging aman mulus dengan bubble wrap double.",
      varian: `Size: ${selectedSize || 42}, Warna: ${selectedColor || 'Default'}`
    },
    {
      id: 2,
      nama: "Siti Rahmawati",
      rating: 5,
      tanggal: "14 April 2026",
      komentar: "Rekomendasi banget untuk yang suka gaya retro minimalis. Sesuai deskripsi, bahan premium banget. Seller ramah, proses paking cepet.",
      varian: `Size: ${selectedSize || 38}, Warna: ${selectedColor || 'Default'}`
    }
  ];

  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Navbar />

      <main className="flex-grow py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back navigation button */}
        <div className="mb-6">
          <Link
            id="btn-back-to-catalog"
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={16} /> KEMBALI KE KATALOG SEPATU
          </Link>
        </div>

        {/* Dynamic Detail Body Grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm">
          
          {/* LEFT COLUMN: Zoomable shoe illustration panel */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div 
              id="product-zoom-stage"
              className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 cursor-zoom-in"
              onClick={() => setZoomScale(!zoomScale)}
              title="Klik untuk memperbesar gambar"
            >
              <Image
                src={product.gambar}
                alt={product.nama}
                fill
                priority
                className={`object-cover object-center transition-transform duration-300 ${zoomScale ? 'scale-150' : 'scale-100'}`}
                referrerPolicy="no-referrer"
              />
              
              {/* Informative zoom label overlay */}
              <span className="absolute bottom-3 right-3 bg-slate-900/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                {zoomScale ? 'Perkecil 1x' : 'Perbesar 1.5x'}
              </span>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  {product.kategori}
                </span>
                {isOutOfStock ? (
                  <span className="bg-rose-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                    Stok Habis
                  </span>
                ) : product.stok <= 3 ? (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm animate-bounce">
                    Terbatas! Sisa {product.stok}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Carousel thumbnails triggers */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    num === 1 
                      ? 'border-indigo-600 shadow-sm' 
                      : 'border-slate-150 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                  disabled={num !== 1}
                >
                  <Image
                    src={product.gambar}
                    alt={`${product.nama} thumb ${num}`}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {num !== 1 && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white uppercase font-mono">ANGLE {num}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Specific configurations - selecting options, checkout & summary */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Name & Brand */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 font-mono">
                  {product.merek} ORIGINAL
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white leading-tight">
                  {product.nama}
                </h1>
              </div>

              {/* Rating scores */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-500">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {product.rating}
                  </span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <span className="text-slate-300 dark:text-slate-800">|</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                  Verified Original Product
                </span>
              </div>

              {/* Pricing row in IDR */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-900">
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-400 font-medium font-mono">Banderol Resmi StepStyle</span>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {formatIDR(product.harga)}
                  </div>
                </div>
                <div className="text-right text-xs text-indigo-505 font-medium hidden sm:block">
                  <p>✓ Bebas Ongkir Wilayah Utama</p>
                  <p>✓ Cicilan 0% dengan Kartu Kredit</p>
                </div>
              </div>

              {/* Select size section */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-450 dark:text-slate-400">
                  <span className="uppercase tracking-wider">Pilih Ukuran Tersedia (EUR)</span>
                  <span className="text-indigo-600 underline text-[11px] cursor-help dark:text-indigo-400">Panduan Sizing Chart</span>
                </div>
                <div id="detail-size-selector" className="flex flex-wrap gap-2">
                  {product.ukuranSedia.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-10 px-4 rounded-xl text-xs font-bold tracking-wider border flex items-center justify-center transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-600/20'
                          : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select color section */}
              <div className="space-y-2.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                  Pilih Varian Warna
                </span>
                <div id="detail-color-selector" className="flex flex-wrap gap-2">
                  {product.warna.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`h-9 px-3.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedColor === col
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 hover:bg-slate-50'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select quantity section */}
              <div className="space-y-2.5 pt-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                  Tentukan Jumlah Pesanan
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-10 w-32 p-1 overflow-hidden">
                    <button
                      id="btn-qty-decrement"
                      onClick={decrementQty}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-30 rounded-lg transition-colors cursor-pointer font-bold font-mono"
                    >
                      -
                    </button>
                    <span id="label-qty-counter" className="flex-1 text-center font-bold font-mono text-sm">
                      {quantity}
                    </span>
                    <button
                      id="btn-qty-increment"
                      onClick={incrementQty}
                      disabled={quantity >= product.stok || isOutOfStock}
                      className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-30 rounded-lg transition-colors cursor-pointer font-bold font-mono"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Tersisa <b className="text-slate-800 dark:text-white leading-none font-bold">{product.stok} pasang</b> di gudang
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Actions: Add to Cart & Wishlist */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3">
              
              {/* Primary Cart Action */}
              <button
                id="btn-add-to-cart-detail"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`h-12 flex-1 rounded-xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-all text-white cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-350 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                }`}
              >
                <ShoppingCart size={18} /> {isOutOfStock ? 'STOK SEDANG HABIS' : 'MASUKKAN KE KERANJANG'}
              </button>

              {/* Secondary Wishlist Action */}
              <button
                id="btn-wishlist-detail"
                onClick={() => toggleWishlist(product.id)}
                className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all active:scale-90 shrink-0 cursor-pointer ${
                  isWish
                    ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900/50'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                }`}
                title={isWish ? "Hapus dari wishlist" : "Tambahkan ke wishlist"}
              >
                <Heart size={20} fill={isWish ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Quick Guarantees bar */}
            <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Jaminan Refund Sizing</span>
              <span className="flex items-center gap-1.5"><Truck size={14} className="text-indigo-500" /> JNE & GoSend Regular</span>
            </div>

          </div>

        </div>

        {/* TABS SECTION: Description, Specs, Reviews */}
        <section id="additional-info-tab-grid" className="mt-12 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* Tab Header row */}
          <div className="flex border-b border-slate-100 dark:border-slate-850 gap-4 sm:gap-8 overflow-x-auto pb-0.5">
            {[
              { id: 'deskripsi', label: 'Deskripsi Lengkap' },
              { id: 'spesifikasi', label: 'Spesifikasi Produk' },
              { id: 'ulasan', label: `Ulasan Pembeli (${mockReviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-sm font-bold pb-4 border-b-2 transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body contents */}
          <div className="pt-6">
            {activeTab === 'deskripsi' && (
              <div id="tab-deskripsi" className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <p>{product.deskripsi}</p>
                <p>Setiap cetakan sol dalam sepatu ini direkayasa secara anatomis agar sirkulasi pemompaan energi balik ke pergelangan kaki berjalan nyaman. Dibungkus dengan bahan jaring bersirkulasi udara yang melindungi kaki dari sirkulasi suhu lembap selama pergerakan intens harian.</p>
              </div>
            )}

            {activeTab === 'spesifikasi' && (
              <div id="tab-spesifikasi" className="max-w-md">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b dark:border-slate-850">
                      <td className="py-2.5 text-slate-500 font-medium">Merek Resmi</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{product.merek}</td>
                    </tr>
                    <tr className="border-b dark:border-slate-850">
                      <td className="py-2.5 text-slate-500 font-medium">Kategori Penggunaan</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">Sneaker Olahraga Kasual {product.kategori}</td>
                    </tr>
                    <tr className="border-b dark:border-slate-850">
                      <td className="py-2.5 text-slate-500 font-medium">Warna Varian</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{product.warna.join(', ')}</td>
                    </tr>
                    <tr className="border-b dark:border-slate-850">
                      <td className="py-2.5 text-slate-500 font-medium">Kondisi Barang</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 text-emerald-500">100% Baru + Box Original</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'ulasan' && (
              <div id="tab-ulasan" className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-905 max-w-sm">
                  <div className="text-center shrink-0">
                    <span className="block text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{product.rating}</span>
                    <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Skor Ulasan</span>
                  </div>
                  <div>
                    <div className="flex text-amber-500 gap-0.5">
                      <Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} fill="currentColor" /><Star size={15} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">Dihitung dari 100% ulasan pembeli terverifikasi di Indonesia.</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-850 space-y-6">
                  {mockReviews.map((rev) => (
                    <div key={rev.id} className="pt-6 first:pt-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="block text-sm font-bold text-slate-950 dark:text-white">{rev.nama}</span>
                          <span className="block text-[10px] text-slate-400 font-medium mt-0.5 font-mono">{rev.tanggal} • {rev.varian}</span>
                        </div>
                        <div className="flex text-amber-500 gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-650 dark:text-slate-455 mt-3 leading-relaxed">
                        &ldquo;{rev.komentar}&rdquo;
                      </p>
                      <button 
                        className="mt-3 flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                        title="Bantu ulasan ini bermanfaat"
                      >
                        <ThumbsUp size={12} /> Bermanfaat (4)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section id="similar-section" className="mt-16 space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  Pilihan Serupa dari {product.merek}
                </h2>
                <p className="text-slate-455 text-xs hidden sm:block">
                  Koleksi alternatif sneakers premium dari merk yang sama yang patut Anda lirik.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
