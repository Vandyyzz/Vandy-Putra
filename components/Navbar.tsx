'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search,
  Settings
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, user, darkMode, toggleDarkMode } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((total, item) => total + item.jumlah, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Katalog Sepatu', path: '/products' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header id="main-nav-bar" className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" id="logo-nav" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold font-display shadow-md shadow-indigo-600/30 group-hover:bg-indigo-700 transition-all">
              S
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Step<span className="text-indigo-600 dark:text-indigo-400">Style</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  id={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              id="search-input-desktop"
              type="text"
              placeholder="Cari sepatu impianmu (misal: Air Force)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <button type="submit" className="hidden">Cari</button>
          </form>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Theme Toggle */}
          <button
            id="theme-toggler"
            onClick={toggleDarkMode}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
            title="Ubah Mode Layar"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>

          {/* Wishlist Link */}
          <Link
            id="btn-wishlist-nav"
            href="/products?filter=wishlist"
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950 animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Bag Link */}
          <Link
            id="btn-cart-nav"
            href="/cart"
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Keranjang Belanja"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Profile Link */}
          <Link
            id="btn-account-nav"
            href="/account"
            className="flex items-center gap-1 rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={user ? `Akun: ${user.nama}` : "Login / Daftar"}
          >
            <User size={20} className={user ? "text-indigo-600 dark:text-indigo-400" : ""} />
            {user && (
              <span className="hidden lg:inline text-xs font-semibold max-w-[80px] truncate text-slate-700 dark:text-slate-300">
                {user.nama.split(' ')[0]}
              </span>
            )}
          </Link>

          {/* Admin Navigation Icon - Only visible for admin role */}
          {user?.role === 'admin' && (
            <Link
              id="btn-admin-nav"
              href="/admin"
              className="rounded-full p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors animate-pulse"
              title="Panel Admin"
            >
              <Settings size={20} />
            </Link>
          )}

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            id="btn-hamburger-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Open main menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 px-4 py-4 space-y-4 shadow-xl transition-all">
          
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              id="search-input-mobile"
              type="text"
              placeholder="Cari sandal atau sepatu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <button type="submit" className="hidden">Cari</button>
          </form>

          {/* Nav Links */}
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  id={`nav-link-mobile-${link.name.toLowerCase().replace(' ', '-')}`}
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center h-11 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Quick Admin Navigation for Admin */}
            {user?.role === 'admin' && (
              <Link
                id="nav-link-mobile-admin"
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center h-11 px-4 rounded-xl text-sm font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400"
              >
                Panel Administrasi (Dashboard)
              </Link>
            )}
          </div>

          {/* Current Quick Info */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center px-2">
            {user ? (
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Masuk sebagai</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.nama} ({user.role})</span>
              </div>
            ) : (
              <Link 
                href="/account" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400"
              >
                Masuk / Daftar Akun
              </Link>
            )}
            <div className="text-xs text-slate-400 font-mono">StepStyle 2026</div>
          </div>
        </div>
      )}
    </header>
  );
}
