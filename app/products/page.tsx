'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/products';
import { 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  ArrowUpDown,
  Heart,
  ChevronLeft,
  ChevronRight,
  PackageX
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Component wrapper around Search Params to support Next 15 App router constraints
function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, wishlist, loadingProducts } = useStore();

  // View States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter & Search States
  const [searchVal, setSearchVal] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [selectedMerek, setSelectedMerek] = useState<string>('Semua');
  const [selectedUkuran, setSelectedUkuran] = useState<number | null>(null);
  const [selectedWarna, setSelectedWarna] = useState<string>('Semua');
  const [priceMax, setPriceMax] = useState<number>(3500000);
  const [sortBy, setSortBy] = useState<string>('terbaru');
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);

  // Pagination Core States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Derive unique options from current master products array
  const uniqueBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.merek));
    return ['Semua', ...Array.from(brands)];
  }, [products]);

  const uniqueSizes = useMemo(() => {
    const sizes = new Set<number>();
    products.forEach(p => p.ukuranSedia.forEach(s => sizes.add(s)));
    return Array.from(sizes).sort((a, b) => a - b);
  }, [products]);

  const uniqueColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(p => {
      p.warna.forEach(w => {
        // Simple standardization
        if (w.toLowerCase().includes('putih')) colors.add('Putih');
        else if (w.toLowerCase().includes('hitam')) colors.add('Hitam');
        else if (w.toLowerCase().includes('abu')) colors.add('Abu-abu');
        else if (w.toLowerCase().includes('pink') || w.toLowerCase().includes('muda')) colors.add('Merah Muda');
        else colors.add(w);
      });
    });
    return ['Semua', ...Array.from(colors)];
  }, [products]);

  // Synchronize filters with URL params
  useEffect(() => {
    const catParam = searchParams.get('kategori');
    const searchParam = searchParams.get('search');
    const filterParam = searchParams.get('filter');

    const timer = setTimeout(() => {
      if (catParam) {
        setSelectedKategori(catParam);
      } else {
        setSelectedKategori('Semua');
      }

      if (searchParam) {
        setSearchVal(searchParam);
      } else {
        setSearchVal('');
      }

      if (filterParam === 'wishlist') {
        setOnlyWishlist(true);
      } else {
        setOnlyWishlist(false);
      }

      // Reset pagination on query criteria mutation
      setCurrentPage(1);
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Reset Filters trigger
  const handleResetFilters = () => {
    setSelectedKategori('Semua');
    setSelectedMerek('Semua');
    setSelectedUkuran(null);
    setSelectedWarna('Semua');
    setPriceMax(3500000);
    setSearchVal('');
    setOnlyWishlist(false);
    setSortBy('terbaru');
    setCurrentPage(1);
    router.push('/products');
  };

  // Main compute: pipeline filtering, sorting & paging
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query Debounce surrogate
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase().trim();
      result = result.filter(p => 
        p.nama.toLowerCase().includes(q) || 
        p.merek.toLowerCase().includes(q) ||
        p.deskripsi.toLowerCase().includes(q)
      );
    }

    // 2. Filter Kategori
    if (selectedKategori !== 'Semua') {
      result = result.filter(p => p.kategori.toLowerCase() === selectedKategori.toLowerCase());
    }

    // 3. Filter Merek
    if (selectedMerek !== 'Semua') {
      result = result.filter(p => p.merek.toLowerCase() === selectedMerek.toLowerCase());
    }

    // 4. Filter Ukuran
    if (selectedUkuran !== null) {
      result = result.filter(p => p.ukuranSedia.includes(selectedUkuran));
    }

    // 5. Filter Warna Standardized
    if (selectedWarna !== 'Semua') {
      result = result.filter(p => 
        p.warna.some(w => w.toLowerCase().includes(selectedWarna.toLowerCase()))
      );
    }

    // 6. Max Price range
    result = result.filter(p => p.harga <= priceMax);

    // 7. Only Wishlist Special State
    if (onlyWishlist) {
      result = result.filter(p => wishlist.includes(p.id));
    }

    // 8. Sorting
    if (sortBy === 'termurah') {
      result.sort((a, b) => a.harga - b.harga);
    } else if (sortBy === 'termahal') {
      result.sort((a, b) => b.harga - a.harga);
    } else if (sortBy === 'terpopuler') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // 'terbaru' (default by reversing id order or static)
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, searchVal, selectedKategori, selectedMerek, selectedUkuran, selectedWarna, priceMax, onlyWishlist, wishlist, sortBy]);

  // Compute Pagination slicing
  const totalItems = processedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProducts, currentPage]);

  const changePage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      
      {/* Search Header Banner */}
      <section className="bg-slate-900 text-white py-12 px-4 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop')]" />
        <div className="mx-auto max-w-7xl relative z-10 space-y-3">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">StepStyle Katalog</span>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl tracking-tight">
            {onlyWishlist ? 'Koleksi Wishlist Anda' : 'Jelajahi Katalog Sepatu Premium'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            {onlyWishlist 
              ? 'Daftar semua pasang sepatu favorit pilihan Anda yang siap dimasukkan ke keranjang belanja.'
              : 'Gunakan panel faset filter untuk menyaring ukuran kaki, warna material mesh, dan batas anggaran belanja.'
            }
          </p>
        </div>
      </section>

      {/* Main Content Catalog Grid layout */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTER PANEL - DESKTOP */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                <span className="font-display font-bold text-slate-950 dark:text-white flex items-center gap-1.5 text-base">
                  <SlidersHorizontal size={18} /> Saring Pencarian
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-0.5 cursor-pointer"
                  title="Reset Saringan"
                >
                  <RotateCcw size={12} /> Atur Ulang
                </button>
              </div>

              {/* Only Wishlist Switch */}
              <div className="pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
                <button
                  id="btn-filter-wishlist-toggle"
                  onClick={() => setOnlyWishlist(!onlyWishlist)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all border ${
                    onlyWishlist 
                      ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-450' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Heart size={14} fill={onlyWishlist ? "currentColor" : "none"} /> Hanya Favorit (Wishlist)
                  </span>
                  <span className="bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[10px]">
                    {wishlist.length}
                  </span>
                </button>
              </div>

              {/* Filter Kategori Pria, Wanita, Anak */}
              <div className="space-y-2 pb-5 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender Kategori</h4>
                <div id="filter-gender-group" className="flex flex-col gap-1.5">
                  {['Semua', 'Pria', 'Wanita', 'Anak'].map((k) => (
                    <button
                      key={k}
                      onClick={() => { setSelectedKategori(k); setCurrentPage(1); }}
                      className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        selectedKategori === k
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-905 dark:hover:text-white'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Merek */}
              <div className="space-y-2 pb-5 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Merek Sepatu</h4>
                <div id="filter-brand-group" className="flex flex-wrap gap-1.5">
                  {uniqueBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => { setSelectedMerek(b); setCurrentPage(1); }}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        selectedMerek === b
                          ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Ukuran (Sizes) */}
              <div className="space-y-2 pb-5 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ukuran Sedia</h4>
                <div id="filter-size-group" className="grid grid-cols-4 gap-1.5">
                  {uniqueSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedUkuran(selectedUkuran === sz ? null : sz);
                        setCurrentPage(1);
                      }}
                      className={`h-9 text-xs rounded-lg border flex items-center justify-center font-semibold transition-all cursor-pointer ${
                        selectedUkuran === sz
                          ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Warna */}
              <div className="space-y-2 pb-5 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Aksen Warna</h4>
                <div id="filter-color-group" className="flex flex-wrap gap-1.5">
                  {uniqueColors.map((col) => (
                    <button
                      key={col}
                      onClick={() => { setSelectedWarna(col); setCurrentPage(1); }}
                      className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        selectedWarna === col
                          ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Range Anggaran */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Anggaran Maks</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 text-[11px] font-bold normal-case">
                    {formatIDR(priceMax)}
                  </span>
                </div>
                <input
                  id="filter-price-slider"
                  type="range"
                  min={500000}
                  max={3500000}
                  step={50000}
                  value={priceMax}
                  onChange={(e) => { setPriceMax(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-800"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Rp 500rb</span>
                  <span>Rp 3,5jt</span>
                </div>
              </div>

            </div>
          </aside>

          {/* CATALOG MAIN GRID DISPLAY */}
          <div className="flex-1 space-y-6">
            
            {/* Control Panel: Search input, View mode, Sorting dropdown */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Search Inside Catalog */}
              <div className="relative flex-1 max-w-sm">
                <input
                  id="internal-catalog-search"
                  type="text"
                  placeholder="Cari dalam katalog..."
                  value={searchVal}
                  onChange={(e) => { setSearchVal(e.target.value); setCurrentPage(1); }}
                  className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200"
                />
                <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>

              {/* Right sorting controllers */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                
                {/* Mobile Filter Toggle */}
                <button
                  id="btn-trigger-mobile-filter"
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1 text-xs font-semibold px-4 h-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300"
                >
                  <Filter size={14} /> Saring ({onlyWishlist ? 1 : 0} aktif)
                </button>

                {/* Grid vs List View toggle */}
                <div id="view-mode-toggle" className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-slate-450 dark:text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid Model"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-slate-450 dark:text-slate-500 hover:text-slate-800'
                    }`}
                    title="List Model"
                  >
                    <List size={15} />
                  </button>
                </div>

                {/* Sort dropdown */}
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 pointer-events-none">
                    <ArrowUpDown size={12} />
                  </span>
                  <select
                    id="sort-select-dropdown"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="h-9 pl-7 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-755 font-bold focus:outline-none dark:bg-slate-950 dark:border-slate-800 select-none text-slate-600 dark:text-slate-300"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="termurah">Termurah</option>
                    <option value="termahal">Termahal</option>
                    <option value="terpopuler">Terpopuler</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Total Results metadata info */}
            <div className="flex justify-between items-center px-1 text-xs font-semibold text-slate-400">
              <span id="results-count">Total: {totalItems} produk ditemukan</span>
              {viewMode === 'list' && <span>Menampilkan mode daftar ringkas</span>}
            </div>

            {/* List and Grid display rendering */}
            {loadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="aspect-square w-full rounded-xl bg-slate-200 dark:bg-slate-815" />
                    <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-815" />
                    <div className="h-6 w-3/4 bg-slate-250 dark:bg-slate-815 rounded" />
                    <div className="h-5 w-2/4 bg-slate-200 dark:bg-slate-815 rounded" />
                  </div>
                ))}
              </div>
            ) : totalItems === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl py-16 px-4 text-center space-y-4 shadow-sm flex flex-col items-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500">
                  <PackageX size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Tidak Ada Sepatu yang Cocok</h3>
                  <p className="text-sm text-slate-400 max-w-sm">
                    Kombinasi filter, merk, ukuran kaki, atau kata kunci pencarian Anda tidak mencocokkan produk mana pun di katalog kami.
                  </p>
                </div>
                <button
                  id="btn-reset-notfound"
                  onClick={handleResetFilters}
                  className="h-10 px-5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl transition-all cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW DISPLAY */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* LIST VIEW DISPLAY */
              <div className="flex flex-col gap-4">
                {paginatedProducts.map((p) => {
                  const isOutOfStock = p.stok <= 0;
                  return (
                    <div 
                      key={p.id} 
                      className="flex border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-850 p-4 rounded-2xl hover:shadow-md transition-all gap-4 select-none"
                    >
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-xl overflow-hidden bg-slate-50 border shrink-0">
                        <Image src={p.gambar} alt={p.nama} fill className="object-cover" referrerPolicy="no-referrer" />
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold bg-rose-500 px-1.5 py-0.5 rounded uppercase">Habis</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-500 uppercase">{p.merek}</span>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                            <Link href={`/products/${p.id}`}>{p.nama}</Link>
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 max-w-xl mt-1 leading-relaxed hidden sm:block">
                            {p.deskripsi}
                          </p>
                        </div>
                        <div className="flex justify-between items-baseline mt-2">
                          <span className="font-display font-extrabold text-indigo-600 dark:text-indigo-400 text-base sm:text-lg">
                            {formatIDR(p.harga)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Kategori: <b className="text-slate-800 dark:text-white">{p.kategori}</b> • Sisa <b className="text-slate-800 dark:text-white">{p.stok} pasang</b>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div id="catalog-pagination" className="flex items-center justify-center gap-2 pt-10 border-t border-slate-100 dark:border-slate-900">
                <button
                  id="btn-prev-page"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const idx = i + 1;
                  return (
                    <button
                      key={idx}
                      id={`btn-page-${idx}`}
                      onClick={() => changePage(idx)}
                      className={`h-9 w-9 text-xs rounded-xl border flex items-center justify-center font-bold font-mono transition-all ${
                        currentPage === idx
                          ? 'bg-indigo-600 border-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/25'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {idx}
                    </button>
                  );
                })}
                <button
                  id="btn-next-page"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Selanjutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* MOBILE DRAWER FILTER SLIDEOVER PANEL */}
      {showMobileFilters && (
        <div id="mobile-filter-drawer" className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop mask */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Sliding container content */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-slate-950 py-4 px-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-900">
              <h2 className="text-base font-bold dark:text-white flex items-center gap-1.5"><SlidersHorizontal size={16} /> Filter Produk</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-slate-500 font-semibold text-xs"
              >
                Selesai
              </button>
            </div>

            {/* Category selection */}
            <div className="py-2 border-b dark:border-slate-900">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Kategori</h4>
              <div className="flex flex-col gap-1">
                {['Semua', 'Pria', 'Wanita', 'Anak'].map((k) => (
                  <button
                    key={k}
                    onClick={() => setSelectedKategori(k)}
                    className={`text-left text-xs px-3 py-2 rounded-lg ${
                      selectedKategori === k ? 'bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands selection */}
            <div className="py-3 border-b dark:border-slate-900">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Merek</h4>
              <div className="flex flex-wrap gap-1">
                {uniqueBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedMerek(b)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-lg border ${
                      selectedMerek === b ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes selection */}
            <div className="py-3 border-b dark:border-slate-900">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Ukuran</h4>
              <div className="grid grid-cols-4 gap-1">
                {uniqueSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedUkuran(selectedUkuran === sz ? null : sz)}
                    className={`h-8 text-xs rounded-lg border flex items-center justify-center font-bold ${
                      selectedUkuran === sz ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset option */}
            <button
              onClick={() => { handleResetFilters(); setShowMobileFilters(false); }}
              className="mt-6 w-full h-10 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl text-xs"
            >
              Atur Ulang / Kosongkan
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Main page component to wrap dynamic search query variables safely in Next.js suspense boundaries
export default function ProductsPage() {
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
      <CatalogContent />
    </Suspense>
  );
}
