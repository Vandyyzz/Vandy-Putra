import { NextRequest, NextResponse } from 'next/server';
import { updateMockOrderStatus } from '@/lib/dbMock';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status wajib dikirimkan' }, { status: 400 });
    }

    const updated = await updateMockOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal memperbarui pesanan' }, { status: 500 });
  }
}
