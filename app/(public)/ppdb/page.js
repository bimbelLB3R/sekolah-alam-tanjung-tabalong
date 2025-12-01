import PpdbClient from "../components/ppdb/PpdbClient";
export const metadata = {
  title: "SPMB - Penerimaan Peserta Didik Baru SATT",
  description: "Daftar sekarang! Pendaftaran siswa baru Sekolah Alam Tanjung Tabalong . Info syarat, jadwal, biaya, dan cara pendaftaran lengkap.",
  keywords: [
    "PPDB SATT",
    "pendaftaran sekolah alam tabalong",
    "daftar sekolah alam tanjung",
    "biaya sekolah alam tabalong",
    "syarat masuk SATT",
    "sekolah alam Kalimantan Selatan"
  ],
  openGraph: {
    title: "SPMB - Daftar Sekarang di SATT!",
      icons: {
    icon: '/logo-sattico.png', 
  shortcut: "/logo-sattico.png",
  apple: "/logo-sattico.png",
  },
    description: "🎓 Pendaftaran dibuka! Sekolah Alam Tanjung Tabalong menerima siswa baru . Pendidikan berbasis alam dengan 4 pilar karakter.",
    url: "https://sekolahalam-tanjungtabalong.id/ppdb",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-ppdb.jpg",
        width: 1200,
        height: 630,
        alt: "PPDB SATT 2025/2026 - Pendaftaran Siswa Baru",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPMB - Daftar Sekarang di SATT!",
    description: "🎓 Pendaftaran siswa baru dibuka! Info lengkap syarat, jadwal, dan biaya.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-ppdb.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/ppdb",
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

export default function PpdbPage(){
  return <div>
    <PpdbClient/>
  </div>
}