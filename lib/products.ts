export interface Product {
  id: string;
  nama: string;
  merek: string;
  harga: number;
  gambar: string;
  kategori: 'Pria' | 'Wanita' | 'Anak';
  ukuranSedia: number[];
  warna: string[];
  stok: number;
  rating: number;
  deskripsi: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "nike-airforce1",
    nama: "Nike Air Force 1 '07 All White",
    merek: "Nike",
    harga: 1549000,
    gambar: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
    kategori: "Pria",
    ukuranSedia: [39, 40, 41, 42, 43],
    warna: ["Putih", "Hitam"],
    stok: 12,
    rating: 4.8,
    deskripsi: "Sepatu sneaker legendaris yang memadukan kenyamanan di lapangan basket dengan gaya kasual sehari-hari. Menampilkan kulit sintetis yang bersih, performa bantalan Nike Air yang empuk, serta desain sol luar karet bundar yang ikonik."
  },
  {
    id: "adidas-ultraboost",
    nama: "Adidas Ultraboost Light Carbon",
    merek: "Adidas",
    harga: 3200000,
    gambar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    kategori: "Pria",
    ukuranSedia: [40, 41, 42, 43, 44],
    warna: ["Hitam Carbon", "Abu-abu", "Merah Neon"],
    stok: 5,
    rating: 4.9,
    deskripsi: "Ultraboost paling ringan yang pernah ada, dibuat dengan generasi terbaru bantalan adidas BOOST. Dirancang secara presisi untuk kenyamanan tiada tanding sepanjang hari, sirkulasi udara luar biasa dari Primeknit+, serta cengkeraman Continental™ Rubber yang legendaris."
  },
  {
    id: "nb-574-grey",
    nama: "New Balance 574 Legacy Grey",
    merek: "New Balance",
    harga: 1499000,
    gambar: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop",
    kategori: "Pria",
    ukuranSedia: [38, 39, 40, 41, 42],
    warna: ["Abu-Abu Klasik", "Biru Navy"],
    stok: 8,
    rating: 4.7,
    deskripsi: "Desain sneaker paling ikonik dari New Balance yang tak lekang oleh waktu. Menampilkan lapisan atas kulit suede premium dikombinasikan dengan jaring bersirkulasi udara, bantalan ENCAP yang empuk dan sol karet berprofil kokoh untuk kenyamanan harian."
  },
  {
    id: "converse-chuck70",
    nama: "Converse Chuck 70 Vintage High Top",
    merek: "Converse",
    harga: 999000,
    gambar: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600&auto=format&fit=crop",
    kategori: "Wanita",
    ukuranSedia: [36, 37, 38, 39, 40],
    warna: ["Kuning Mustard", "Hitam"],
    stok: 15,
    rating: 4.6,
    deskripsi: "Sebuah penghormatan untuk Chuck Taylor All Star asli tahun 1970-an. Chuck 70 dibangun dengan kanvas organik premium 12oz, jahitan sayap lidah sepatu yang diperkuat, sol samping karet premium yang lebih tinggi, serta bantalan insole OrthoLite®."
  },
  {
    id: "vans-oldskool",
    nama: "Vans Old Skool Classic Black/White",
    merek: "Vans",
    harga: 999000,
    gambar: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
    kategori: "Pria",
    ukuranSedia: [38, 39, 40, 41, 42, 43],
    warna: ["Hitam/Putih", "Full Black"],
    stok: 20,
    rating: 4.7,
    deskripsi: "Sepatu skate klasik pertama dari Vans yang menampilkan garis samping ikonik (jazz stripe). Dibuat dengan kanvas tahan lama dan lapisan kulit suede, bagian pergelangan kaki empuk yang suportif, serta sol karet waffle andalan Vans."
  },
  {
    id: "puma-rsx-triple",
    nama: "Puma RS-X Triple Black Chunky",
    merek: "Puma",
    harga: 1899000,
    gambar: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop",
    kategori: "Pria",
    ukuranSedia: [39, 40, 41, 42, 43],
    warna: ["Full Black", "Putih Silver"],
    stok: 7,
    rating: 4.5,
    deskripsi: "Sneaker futuristik bergaya retro-running dengan siluet tebal (chunky). Dilengkapi dengan teknologi penyerapan kejut Running System (RS) orisinal dari Puma di bagian sol tengah, serta kombinasi material mesh, nubuck, dan karet premium di bagian atas."
  },
  {
    id: "nike-airmax-sc",
    nama: "Nike Air Max SC Light Pink",
    merek: "Nike",
    harga: 1199000,
    gambar: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=600&auto=format&fit=crop",
    kategori: "Wanita",
    ukuranSedia: [36, 37, 38, 39, 40],
    warna: ["Merah Muda Pastel", "Putih Salju"],
    stok: 4,
    rating: 4.8,
    deskripsi: "Sempurnakan gaya Anda dengan kenyamanan bantalan udara Air Max yang terlihat. Sepatu ini menggabungkan garis-garis siluet kasual, kaya tekstur bahan kulit dan mesh daur ulang, serta bantalan awet yang dirancang khusus untuk kenyamanan kaki wanita."
  },
  {
    id: "adidas-stansmith",
    nama: "Adidas Stan Smith Pride Edition",
    merek: "Adidas",
    harga: 1600000,
    gambar: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
    kategori: "Wanita",
    ukuranSedia: [36, 37, 38, 39, 40],
    warna: ["Putih Hijau Klasik", "Putih Floral"],
    stok: 9,
    rating: 4.8,
    deskripsi: "Sejak tahun 70-an, Stan Smith telah menetapkan standar sepatu olahraga bergaya minimalis. Desain kulit murni berlubang 3-stripes yang legendaris, kini diperbarui dengan material Primegreen berkinerja tinggi sebagai langkah kepedulian lingkungan."
  },
  {
    id: "nike-kids-flex",
    nama: "Nike Flex Runner Kids Edition",
    merek: "Nike",
    harga: 679000,
    gambar: "https://images.unsplash.com/photo-1514989940723-e8e5163ccbe8?q=80&w=600&auto=format&fit=crop",
    kategori: "Anak",
    ukuranSedia: [30, 31, 32, 33, 34, 35],
    warna: ["Biru Terang", "Hitam Putih", "Merah Crimson"],
    stok: 15,
    rating: 4.6,
    deskripsi: "Sepatu slip-on anak-anak yang luar biasa lentur dan ringan. Menghilangkan kerumitan tali sepatu dengan tali elastis di sisi samping, busa bawah kaki yang super empuk, memudahkan anak-anak berlari dan bermain sepanjang hari."
  },
  {
    id: "nb-kids-iz996",
    nama: "New Balance Kids IZ996 Cushion Hook",
    merek: "New Balance",
    harga: 799000,
    gambar: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=600&auto=format&fit=crop",
    kategori: "Anak",
    ukuranSedia: [28, 29, 30, 31, 32],
    warna: ["Kombinasi Warna-warni", "Abu-abu Klasik"],
    stok: 0, // Out of stock example to show UX
    rating: 4.4,
    deskripsi: "Sneaker anak bergaya retro dengan perekat ganda velkro (hook-and-loop) yang kokoh. Memberikan dukungan tumit yang luar biasa aman, bahan atas yang bersirkulasi udara, serta teknologi sol tengah C-CAP yang memberikan stabilitas peredam kejut maksimal."
  }
];
