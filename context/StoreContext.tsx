'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/products';

export interface CartItem {
  id: string;
  nama: string;
  merek: string;
  harga: number;
  gambar: string;
  pilihUkuran: number;
  pilihWarna: string;
  jumlah: number;
  stokSedia: number;
}

export interface UserSimulated {
  nama: string;
  email: string;
  role: 'user' | 'admin';
}

export interface ToastMessage {
  id: string;
  text: string;
  tipe: 'success' | 'error' | 'info';
}

export interface Order {
  id: string;
  tanggal: string;
  items: CartItem[];
  totalHarga: number;
  alamat: string;
  metodeKirim: string;
  metodeBayar: string;
  status: 'Menunggu Pembayaran' | 'Diproses' | 'Dikirim' | 'Selesai';
  pembeli: {
    nama: string;
    email: string;
  };
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  user: UserSimulated | null;
  toasts: ToastMessage[];
  loadingProducts: boolean;
  loadingOrders: boolean;
  darkMode: boolean;
  
  // Actions
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  createProduct: (p: Omit<Product, 'id'> & { id?: string }) => Promise<boolean>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  addToCart: (product: Product, size: number, color: string, qty: number) => void;
  removeFromCart: (productId: string, size: number, color: string) => void;
  updateCartQty: (productId: string, size: number, color: string, qty: number) => void;
  clearCart: () => void;
  
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  loginSimulated: (email: string, nama: string, role: 'user' | 'admin') => void;
  logoutSimulated: () => void;
  
  addToast: (text: string, tipe?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  checkoutOrder: (alamat: string, metodeKirim: string, metodeBayar: string, guestUser?: UserSimulated) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  toggleDarkMode: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Global counter for toast identifiers (fully pure and free of impure function calls within rendering sweeps)
let toastCounter = 0;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<UserSimulated | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch products from server
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch orders from server
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load initial store config
  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Theme Check (System & LocalStorage)
      const storedTheme = localStorage.getItem('theme');
      const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      // 2. Local App States
      const storedCart = localStorage.getItem('sepatu_cart');
      if (storedCart) {
        try { setCart(JSON.parse(storedCart)); } catch (e) { console.error(e); }
      }

      const storedWishlist = localStorage.getItem('sepatu_wishlist');
      if (storedWishlist) {
        try { setWishlist(JSON.parse(storedWishlist)); } catch (e) { console.error(e); }
      }

      const storedUser = localStorage.getItem('sepatu_user');
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
      }

      // Fetch catalog
      fetchProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Fetch orders on admin login
  useEffect(() => {
    if (user?.role === 'admin') {
      const timer = setTimeout(() => {
        fetchOrders();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Darkmode handler
  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    addToast(`Mode ${newVal ? 'Gelap' : 'Terang'} diaktifkan`, 'info');
  };

  // Toast handler
  const addToast = (text: string, tipe: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, text, tipe }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // CRUD ops
  const createProduct = async (p: Omit<Product, 'id'> & { id?: string }) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        await fetchProducts();
        addToast('Produk baru berhasil ditambahkan', 'success');
        return true;
      }
      const data = await res.json();
      addToast(data.error || 'Gagal menambahkan produk', 'error');
      return false;
    } catch (err) {
      addToast('Kesalahan jaringan saat tambah produk', 'error');
      return false;
    }
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        await fetchProducts();
        addToast('Detail produk berhasil disimpan', 'success');
        return true;
      }
      addToast('Gagal mengubah produk', 'error');
      return false;
    } catch (err) {
      addToast('Kesalahan jaringan saat ubah produk', 'error');
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
        addToast('Produk berhasil dihapus dari katalog', 'success');
        return true;
      }
      addToast('Gagal menghapus produk', 'error');
      return false;
    } catch (err) {
      addToast('Kesalahan jaringan saat hapus produk', 'error');
      return false;
    }
  };

  // Cart actions
  const addToCart = (product: Product, size: number, color: string, qty: number) => {
    if (product.stok <= 0) {
      addToast('Maaf, produk ini sedang habis', 'error');
      return;
    }

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.id === product.id && item.pilihUkuran === size && item.pilihWarna === color
      );

      let newCart = [...prevCart];
      if (existingIdx > -1) {
        const item = newCart[existingIdx];
        const combinedQty = item.jumlah + qty;
        if (combinedQty > product.stok) {
          addToast(`Stok terbatas! Tidak bisa memesan melebihi batas stok (${product.stok})`, 'error');
          return prevCart;
        }
        newCart[existingIdx] = { ...item, jumlah: combinedQty };
        addToast(`Model/Ukuran sama, jumlah di keranjang ditambah ke: ${combinedQty}`, 'success');
      } else {
        if (qty > product.stok) {
          addToast(`Stok terbatas! Tersedia ${product.stok} pasang`, 'error');
          return prevCart;
        }
        newCart.push({
          id: product.id,
          nama: product.nama,
          merek: product.merek,
          harga: product.harga,
          gambar: product.gambar,
          pilihUkuran: size,
          pilihWarna: color,
          jumlah: qty,
          stokSedia: product.stok
        });
        addToast(`${product.nama} dimasukkan ke keranjang`, 'success');
      }

      localStorage.setItem('sepatu_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: string, size: number, color: string) => {
    setCart((prevCart) => {
      const filtered = prevCart.filter(
        (item) => !(item.id === productId && item.pilihUkuran === size && item.pilihWarna === color)
      );
      localStorage.setItem('sepatu_cart', JSON.stringify(filtered));
      addToast('Item dihapus dari keranjang', 'info');
      return filtered;
    });
  };

  const updateCartQty = (productId: string, size: number, color: string, qty: number) => {
    setCart((prevCart) => {
      const targeted = prevCart.map((item) => {
        if (item.id === productId && item.pilihUkuran === size && item.pilihWarna === color) {
          if (qty > item.stokSedia) {
            addToast(`Stok terbatas! Hanya tersedia ${item.stokSedia} pasang`, 'error');
            return item;
          }
          return { ...item, jumlah: Math.max(1, qty) };
        }
        return item;
      });
      localStorage.setItem('sepatu_cart', JSON.stringify(targeted));
      return targeted;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('sepatu_cart');
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prevWish) => {
      const isExist = prevWish.includes(productId);
      let nextWish;
      const targetProduct = products.find(p => p.id === productId);
      const name = targetProduct ? targetProduct.nama : 'Produk';
      
      if (isExist) {
        nextWish = prevWish.filter((id) => id !== productId);
        addToast(`${name} dihapus dari Whishlist`, 'info');
      } else {
        nextWish = [...prevWish, productId];
        addToast(`${name} berhasil disimpan ke Wishlist`, 'success');
      }
      localStorage.setItem('sepatu_wishlist', JSON.stringify(nextWish));
      return nextWish;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Authentication actions
  const loginSimulated = (email: string, nama: string, role: 'user' | 'admin') => {
    const userProfile: UserSimulated = { email, nama, role };
    setUser(userProfile);
    localStorage.setItem('sepatu_user', JSON.stringify(userProfile));
    addToast(`Selamat datang kembali, ${nama}!`, 'success');
  };

  const logoutSimulated = () => {
    setUser(null);
    localStorage.removeItem('sepatu_user');
    addToast('Anda telah logout', 'info');
  };

  // Checkout actions
  const checkoutOrder = async (alamat: string, metodeKirim: string, metodeBayar: string, guestUser?: UserSimulated) => {
    const activeUser = user || guestUser;
    if (!activeUser) {
      addToast('Lakukan login/daftar sebelum checkout', 'error');
      return false;
    }

    if (cart.length === 0) {
      addToast('Keranjang Anda kosong', 'error');
      return false;
    }

    const payload = {
      items: cart,
      totalHarga: cart.reduce((acc, item) => acc + item.harga * item.jumlah, 0),
      alamat,
      metodeKirim,
      metodeBayar,
      pembeli: {
        nama: activeUser.nama,
        email: activeUser.email
      }
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Success
        clearCart();
        await fetchProducts(); // Refresh stocks on catalog
        if (activeUser.role === 'admin') {
          await fetchOrders(); // Reload orders as admin
        }
        addToast('Pesanan berhasil dibuat! Silakan cek menu akun Anda.', 'success');
        return true;
      } else {
        const errorData = await res.json();
        addToast(errorData.error || 'Gagal memproses checkout', 'error');
        return false;
      }
    } catch (err) {
      addToast('Kesalahan jaringan. Gagal memproses order.', 'error');
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchOrders();
        addToast(`Status pesanan ${orderId} berhasil diubah menjadi ${status}`, 'success');
        return true;
      }
      addToast('Gagal mengubah status pesanan', 'error');
      return false;
    } catch (err) {
      console.error(err);
      addToast('Kesalahan jaringan', 'error');
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        wishlist,
        user,
        toasts,
        loadingProducts,
        loadingOrders,
        darkMode,
        refreshProducts: fetchProducts,
        refreshOrders: fetchOrders,
        createProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        isInWishlist,
        loginSimulated,
        logoutSimulated,
        addToast,
        removeToast,
        checkoutOrder,
        updateOrderStatus,
        toggleDarkMode
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
