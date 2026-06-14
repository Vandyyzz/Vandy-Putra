import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { StoreProvider } from '@/context/StoreContext';
import ToastContainer from '@/components/ToastContainer';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Toko Sepatu Online - Langkah Kaki Gaya & Nyaman',
  description: 'Temukan koleksi sepatu olahraga, kasual, pria, wanita, dan anak-anak terbaik dari merek-merek ternama dunia bergaya modern.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <StoreProvider>
          {children}
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
