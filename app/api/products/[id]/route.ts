import { NextRequest, NextResponse } from 'next/server';
import { getMockProductById, updateMockProduct, deleteMockProduct } from '@/lib/dbMock';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prod = await getMockProductById(id);
    if (!prod) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(prod, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengambil detail produk' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateMockProduct(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal memperbarui produk' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteMockProduct(id);
    if (!success) {
      return NextResponse.json({ error: 'Produk tidak ditemukan atau gagal dihapus' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Produk berhasil dihapus' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menghapus produk' }, { status: 500 });
  }
}
