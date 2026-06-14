'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const wish = isInWishlist(product.id);
  const isOutOfStock = product.stok <= 0;

  // Indonesian Currency Formatter helper
  const formatIDR = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    // Choose first shoe size and color as quick-default
    const defaultSize = product.ukuranSedia[0] || 40;
    const defaultColor = product.warna[0] || 'Utama';
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      id={`product-card-${product.id}`} 
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 h-full"
    >
      
      {/* Product Image & Badges Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">Detail {product.nama}</span>
        </Link>

        {/* Shoes Picture */}
        <Image
          src={product.gambar}
          alt={product.nama}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center zoom-image group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          priority={false}
        />

        {/* Wishlist Floating Button */}
        <button
          id={`btn-wishlist-card-${product.id}`}
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
            wish 
              ? 'bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/45 dark:border-rose-900/50' 
              : 'bg-white/90 border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title="Simpan ke Wishlist"
        >
          <Heart size={18} fill={wish ? "currentColor" : "none"} className={wish ? "scale-110" : ""} />
        </button>

        {/* Tags */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {/* Category Tag */}
          <span className="rounded-full bg-slate-900/85 dark:bg-slate-950/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {product.kategori}
          </span>
          
          {/* Stock Tag/Overlay */}
          {isOutOfStock ? (
            <span className="rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              Habis
            </span>
          ) : product.stok <= 3 ? (
            <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-950 shadow-sm animate-pulse">
              Sisa {product.stok}
            </span>
          ) : null}
        </div>

        {/* Quick hover link indicators */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 pointer-events-none">
          <span className="bg-white/95 text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-indigo-600 hover:text-white transition-colors pointer-events-auto">
            <Eye size={14} /> Lihat Detail
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {product.merek}
        </p>

        {/* Name */}
        <h3 className="mt-1 font-sans text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[38px]">
          <Link href={`/products/${product.id}`} className="focus:outline-none">
            {product.nama}
          </Link>
        </h3>

        {/* Rating Row */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex text-amber-400">
            <Star size={13} fill="currentColor" />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">• Terjual</span>
        </div>

        {/* Price & Cart row */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60">
          <div>
            <span className="block text-[10px] text-slate-400 dark:text-slate-550 font-medium">Harga</span>
            <span className="font-display text-base font-bold text-indigo-600 dark:text-indigo-400">
              {formatIDR(product.harga)}
            </span>
          </div>

          <button
            id={`btn-quick-add-cart-${product.id}`}
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-300 dark:bg-slate-850 dark:text-slate-700 cursor-not-allowed'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white'
            }`}
            title={isOutOfStock ? "Stok Habis" : "Masukkan default size ke keranjang"}
          >
            <ShoppingCart size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
