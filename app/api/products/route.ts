import { NextRequest, NextResponse } from 'next/server';
import { getMockProducts, addMockProduct } from '@/lib/dbMock';

export async function GET() {
  try {
    const list = await getMockProducts();
    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengambil data produk' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Simple validation
    if (!body.nama || !body.harga || !body.kategori || !body.stok) {
      return NextResponse.json({ error: 'Nama, harga, kategori, dan stok wajib diisi' }, { status: 400 });
    }

    const newProd = {
      id: body.id || `sepatu-${Date.now()}`,
      nama: body.nama,
      merek: body.merek || 'Tanpa Merek',
      harga: Number(body.harga),
      gambar: body.gambar || 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop',
      kategori: body.kategori,
      ukuranSedia: body.ukuranSedia && Array.isArray(body.ukuranSedia) ? body.ukuranSedia.map(Number) : [39, 40, 41, 42],
      warna: body.warna && Array.isArray(body.warna) ? body.warna : ['Putih'],
      stok: Number(body.stok),
      rating: body.rating ? Number(body.rating) : 5.0,
      deskripsi: body.deskripsi || 'Tidak ada deskripsi.'
    };

    const saved = await addMockProduct(newProd);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menambahkan produk' }, { status: 500 });
  }
}
