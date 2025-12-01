import ActivitiesClient from "../components/activities/ActivityClient";

export const metadata = {
  title: "Aktivitas Siswa - Dokumentasi Kegiatan Belajar SATT",
   icons: {
    icon: '/logo-sattico.png', // <-- path dari /public
  shortcut: "/favicon.ico",
  apple: "/logo-sattico.png",
  },
  description: "Galeri aktivitas siswa Sekolah Alam Tanjung Tabalong. Lihat kegiatan belajar outdoor, eksplorasi alam, project-based learning, dan momen berharga siswa SATT.",
  keywords: [
    "aktivitas siswa SATT",
    "kegiatan belajar outdoor",
    "dokumentasi sekolah alam tabalong",
    "galeri kegiatan anak",
    "project based learning",
    "eksplorasi alam Tabalong"
  ],
  openGraph: {
    title: "Aktivitas Siswa - Sekolah Alam Tanjung Tabalong",
    description: "🌿 Lihat keseruan aktivitas belajar siswa SATT! Dari eksplorasi alam hingga project-based learning yang menyenangkan.",
    url: "https://sekolahalam-tanjungtabalong.id/activities",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-activities.jpg",
        width: 1200,
        height: 630,
        alt: "Aktivitas Siswa Sekolah Alam Tanjung Tabalong",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aktivitas Siswa - SATT",
    description: "🌿 Lihat keseruan aktivitas belajar siswa SATT! Dari eksplorasi alam hingga project-based learning.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-activities.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/activities",
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

export default function ActivitiesPage(){
  return <div><ActivitiesClient/></div>
}