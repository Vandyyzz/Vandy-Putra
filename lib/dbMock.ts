import { Product, INITIAL_PRODUCTS } from './products';

let products: Product[] = [...INITIAL_PRODUCTS];
let orders: any[] = [
  {
    id: "ORD-9921",
    tanggal: "2026-06-12T14:30:00.000Z",
    items: [
      {
        id: "nike-airforce1",
        nama: "Nike Air Force 1 '07 All White",
        harga: 1549000,
        gambar: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
        pilihUkuran: 42,
        pilihWarna: "Putih",
        jumlah: 1
      }
    ],
    totalHarga: 1549000,
    alamat: "Jl. Sudirman No. 12, Jakarta Selatan",
    metodeKirim: "Reguler (JNE)",
    metodeBayar: "Bank Transfer (BCA)",
    status: "Diproses",
    pembeli: {
      nama: "Budi Santoso",
      email: "budi@mail.com"
    }
  }
];

export async function getMockProducts(): Promise<Product[]> {
  return products;
}

export async function getMockProductById(id: string): Promise<Product | undefined> {
  return products.find(p => p.id === id);
}

export async function addMockProduct(product: Product): Promise<Product> {
  // Ensure unique ID
  if (!product.id) {
    product.id = `sepatu-${Date.now()}`;
  }
  products.push(product);
  return product;
}

export async function updateMockProduct(id: string, updatedData: Partial<Product>): Promise<Product | null> {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updatedData };
  return products[index];
}

export async function deleteMockProduct(id: string): Promise<boolean> {
  const countBefore = products.length;
  products = products.filter(p => p.id !== id);
  return products.length < countBefore;
}

export async function getMockOrders(): Promise<any[]> {
  return orders;
}

export async function addMockOrder(order: any): Promise<any> {
  orders.unshift(order);
  return order;
}

export async function updateMockOrderStatus(id: string, status: string): Promise<any> {
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
}
