'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  TrendingUp, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Star 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/lib/products';

export default function Home() {
  const { products, loadingProducts } = useStore();
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  // Pick top rated and in-stock products as recommendations
  useEffect(() => {
    if (products.length > 0) {
      const sorted = [...products]
        .filter(p => p.stok > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4); // Top 4
      
      const timer = setTimeout(() => {
        setRecommendations(sorted);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [products]);

  const categories = [
    {
      id: 'pria',
      nama: 'Sepatu Pria',
      gambar: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
      jumlah: '5+ Model',
      deskripsi: 'Sempurnakan performa & gaya kasual harianmu.',
      filter: 'Pria',
      bgColor: 'bg-indigo-900/10 dark:bg-indigo-950/20',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'wanita',
      nama: 'Sepatu Wanita',
      gambar: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=600&auto=format&fit=crop',
      jumlah: '3+ Model',
      deskripsi: 'Minimalis, trendi, & mengedepankan dwi-kenyamanan.',
      filter: 'Wanita',
      bgColor: 'bg-rose-900/10 dark:bg-rose-950/20',
      textColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      id: 'anak',
      nama: 'Sepatu Anak',
      gambar: 'https://images.unsplash.com/photo-1514989940723-e8e5163ccbe8?q=80&w=600&auto=format&fit=crop',
      jumlah: '2 Model',
      deskripsi: 'Desain fleksibel mendukung gerak aktif buah hati.',
      filter: 'Anak',
      bgColor: 'bg-emerald-900/10 dark:bg-emerald-950/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  const testimonials = [
    {
      id: 1,
      nama: "Rian Hidayat",
      peran: "Pecinta Sneakers",
      Kota: "Bandung",
      komentar: "Gila sih, Adidas Ultrabooost Carbon-nya original 100%. Kemasan super tebal dan pengiriman cuma makan waktu 1 hari sampai ke Bandung. Layanan CS responsif maksimal!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 2,
      nama: "Amelia Putri",
      peran: "Runner Amatir",
      Kota: "Jakarta",
      komentar: "Beli Nike Air Max di sini dapet diskon voucher anak baru 15%. Ukuran sesuai chart panduan, pas banget di kaki dan empuk buat lari pagi. Bakal langganan terus!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: 3,
      nama: "Dedi Wijaya",
      peran: "Ayah 2 Anak",
      Kota: "Surabaya",
      komentar: "Pesan sepatu Nike Flex Runner buat anak. Bahannya lentur tanpa tali, gampang dipake sendiri sama si kecil. Sangat rekomen beli sepatu di StepStyle.",
      rating: 4,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section id="hero-banner" className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-white to-indigo-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Product Slogan Grid */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                  <TrendingUp size={14} /> Edisi Terbatas Mid-Year Sale 2026
                </div>
                
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-none">
                  Langkah Lebih <span className="text-indigo-600 dark:text-indigo-400">Percaya Diri</span> Bersama Kami
                </h1>
                
                <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto lg:mx-0">
                  Temukan koleksi sneakers original pilihan dan sepatu olahraga berkonsep premium dari brand internasional legendaris dengan penawaran spektakuler hari ini.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link
                    id="hero-cta-primary"
                    href="/products"
                    className="h-12 px-6 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Mulai Belanja <ArrowRight size={16} />
                  </Link>
                  <Link
                    id="hero-cta-secondary"
                    href="/products?filter=wishlist"
                    className="h-12 px-6 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 flex items-center gap-2 transition-all"
                  >
                    Lihat Wishlist Anda
                  </Link>
                </div>

                {/* Micro guarantees */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-left max-w-md mx-auto lg:mx-0">
                  <div>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-lg">100%</h4>
                    <p className="text-xs text-slate-500">Produk Original</p>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-lg">30 Hari</h4>
                    <p className="text-xs text-slate-500">Garansi Ukuran</p>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-lg">Gratis</h4>
                    <p className="text-xs text-slate-500">Ongkir Jabodetabek</p>
                  </div>
                </div>

              </motion.div>

              {/* Spectacular Large Shoe Promo Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative flex justify-center items-center"
              >
                {/* Decorative glowing backdrops */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />
                
                <div className="relative shadow-2xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-4 max-w-md w-full">
                  <div className="relative aspect-video rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
                      alt="Adidas Ultraboost"
                      fill
                      priority
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                      HOT SALE
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Adidas</span>
                      <h3 className="font-bold text-slate-950 dark:text-white text-sm sm:text-base">Adidas Ultraboost Light Carbon</h3>
                    </div>
                    <span className="text-rose-500 dark:text-rose-400 font-display font-bold text-sm sm:text-base">Rp 3.200.000</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-500"><Star size={14} className="fill-amber-400 text-amber-400" /> 4.9 (24 ulasan)</span>
                    <Link href="/products/adidas-ultraboost" className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5 hover:underline">
                      Review Sepatu <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

              </motion.div>

            </div>
          </div>
        </section>

        {/* ECO-SYSTEM SERVICE ADVANTAGES */}
        <section id="advantages" className="bg-white dark:bg-slate-950 py-12 border-y border-slate-200/60 dark:border-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-2xl transition-colors">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">Pengiriman Instant & Aman</h4>
                  <p className="mt-1 text-sm text-slate-500">Mendukung pengiriman instant Sameday wilayah perkotaan besar & asuransi penuh kargo.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-2xl transition-colors">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
                  <RotateCcw size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">30 Hari Garansi Retur Sizing</h4>
                  <p className="mt-1 text-sm text-slate-500">Sepatu kebesaran/kekecilan? Tukar gratis ukuran Anda dalam tempo 30 hari tanpa syarat ribet.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-2xl transition-colors">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">Jaminan Keaslian 100%</h4>
                  <p className="mt-1 text-sm text-slate-500">Semua pasang produk dipasok langsung dari distributor sah. Uang kembali 2x lipat jika tiruan.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CATALOG CATEGORIES */}
        <section id="categories" className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl text-center">
                Pilih Berdasarkan Kategori
              </h2>
              <p className="text-slate-550 text-sm">
                Temukan model konstruksi performa sol luar yang disesuaikan khusus untuk aktivitas harian Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link
                  id={`cat-card-${cat.id}`}
                  key={cat.id}
                  href={`/products?kategori=${cat.filter}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <Image
                      src={cat.gambar}
                      alt={cat.nama}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <span className="absolute bottom-4 right-4 bg-white/90 text-slate-900 dark:bg-slate-950/90 dark:text-white px-3 py-1 rounded-full text-xs font-bold leading-none shadow-sm">
                      {cat.jumlah}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className={`font-display text-xl font-bold ${cat.textColor}`}>
                      {cat.nama}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {cat.deskripsi}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <span>Jelajahi Produk {cat.filter}</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* RECOMMENDED PRODUCTS */}
        <section id="recommendations" className="py-16 bg-white dark:bg-slate-950 h-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Rekomendasi Sepatu Terbaik
                </h2>
                <p className="text-slate-500 text-sm hidden sm:block">
                  Koleksi terpopuler dengan rating bintang tertinggi dari ulasan para verified buyer.
                </p>
              </div>
              <Link 
                id="btn-see-all-recommendations" 
                href="/products" 
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-1 group/btn"
              >
                Lihat Semua <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="animate-pulse flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="aspect-square w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                Data katalog kosong atau gagal dimuat.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {recommendations.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS */}
        <section id="testimonials" className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Dengarkan Kata Pelanggan Kami
              </h2>
              <p className="text-slate-550 text-sm">
                Kepuasan pembeli adalah prioritas utama kami. Ribuan ulasan bintang lima telah diverifikasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <div
                  id={`testi-card-${test.id}`}
                  key={test.id}
                  className="flex flex-col bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/75 dark:border-slate-800 shadow-sm relative"
                >
                  {/* Testimonial Stars */}
                  <div className="flex text-amber-400 gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} fill={i < test.rating ? "currentColor" : "none"} className={i < test.rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"} />
                    ))}
                  </div>

                  <p className="text-slate-650 dark:text-slate-355 text-sm italic leading-relaxed flex-grow">
                    &ldquo;{test.komentar}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <img 
                      src={test.avatar} 
                      alt={test.nama} 
                      className="w-10 h-10 rounded-full object-cover shadow-inner bg-slate-100"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-950 dark:text-white">{test.nama}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{test.peran} • {test.Kota}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
