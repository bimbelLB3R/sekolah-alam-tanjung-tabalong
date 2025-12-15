// pages/guru.js atau pages/teachers.js

import TeachersListPage from "../components/teacherprofiles/TeacherList";
export const metadata = {
  title: "Profil Guru & Fasilitator - Tim Pengajar SATT",
  icons: {
    icon: '/logo-sattico.png', // <-- path dari /public
  shortcut: "/favicon.ico",
  apple: "/logo-sattico.png",
  },
  description: "Kenali tim pengajar dan fasilitator Sekolah Alam Tanjung Tabalong. Guru-guru berpengalaman dan berdedikasi untuk pendidikan karakter anak Indonesia.",
  keywords: [
    "guru SATT",
    "fasilitator sekolah alam",
    "profil pengajar Tabalong",
    "tim pendidik SATT",
    "guru sekolah alam tanjung"
  ],
  openGraph: {
    title: "Profil Guru & Fasilitator - Sekolah Alam Tanjung Tabalong",
    description: "👨‍🏫 Kenali tim pengajar SATT yang berpengalaman, berdedikasi, dan passionate dalam membimbing perkembangan anak.",
    url: "https://sekolahalam-tanjungtabalong.id/profile-guru",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-ppdb.jpg",
        width: 1200,
        height: 630,
        alt: "Profil Guru dan Fasilitator SATT",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profil Guru & Fasilitator - SATT",
    description: "👨‍🏫 Kenali tim pengajar SATT yang berpengalaman dan berdedikasi.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-ppdb.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/profile-guru",
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

async function getTeachers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/teachers`, {
    cache: 'no-store' // atau bisa pakai revalidate untuk caching
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch teachers');
  }
  
  return res.json();
}

export default async function GuruPage() {
  const data = await getTeachers();
  
  return <TeachersListPage data={data} />;
}