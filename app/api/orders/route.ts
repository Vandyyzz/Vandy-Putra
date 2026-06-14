import { NextRequest, NextResponse } from 'next/server';
import { getMockOrders, addMockOrder, getMockProductById, updateMockProduct } from '@/lib/dbMock';

export async function GET() {
  try {
    const list = await getMockOrders();
    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengambil data pesanan' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalHarga, alamat, metodeKirim, metodeBayar, pembeli } = body;

    // Check parameters
    if (!items || !Array.isArray(items) || items.length === 0 || !alamat || !metodeKirim || !metodeBayar || !pembeli) {
      return NextResponse.json({ error: 'Informasi pesanan tidak lengkap' }, { status: 400 });
    }

    // Process each item and deduct stock in database
    for (const item of items) {
      const prod = await getMockProductById(item.id);
      if (prod) {
        if (prod.stok < item.jumlah) {
          return NextResponse.json({ error: `Stok produk ${prod.nama} tidak mencukupi (Tersisa: ${prod.stok})` }, { status: 400 });
        }
        // Deduct stock
        const newStock = Math.max(0, prod.stok - item.jumlah);
        await updateMockProduct(item.id, { stok: newStock });
      }
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal: new Date().toISOString(),
      items,
      totalHarga,
      alamat,
      metodeKirim,
      metodeBayar,
      status: 'Menunggu Pembayaran',
      pembeli
    };

    const savedOrder = await addMockOrder(newOrder);
    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal membuat pesanan baru' }, { status: 500 });
  }
}
