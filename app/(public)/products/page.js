
export const metadata = {
  title: "Produk & Karya Siswa - Galeri Hasil Belajar SATT",
   icons: {
    icon: '/logo-sattico.png', // <-- path dari /public
  shortcut: "/favicon.ico",
  apple: "/logo-sattico.png",
  },
  description: "Galeri produk dan karya siswa Sekolah Alam Tanjung Tabalong. Hasil karya kreatif, produk kewirausahaan, dan project siswa yang menginspirasi.",
  keywords: [
    "produk siswa SATT",
    "karya siswa sekolah alam",
    "galeri produk Tabalong",
    "kewirausahaan siswa",
    "hasil karya anak SATT",
    "project siswa sekolah alam"
  ],
  openGraph: {
    title: "Produk & Karya Siswa - Sekolah Alam Tanjung Tabalong",
    description: "🎨 Lihat hasil karya kreatif dan produk kewirausahaan siswa SATT. Bukti nyata dari Pilar Kewirausahaan yang kami terapkan!",
    url: "https://sekolahalam-tanjungtabalong.id/products",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-products.jpg",
        width: 1200,
        height: 630,
        alt: "Produk dan Karya Siswa SATT",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Produk & Karya Siswa - SATT",
    description: "🎨 Lihat hasil karya kreatif dan produk kewirausahaan siswa SATT.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-products.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/products",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
export default function ProductsPage(){
    return <>Ini adalah halaman produk</>
}