// app/activities/page.js
import ActivityCard from "../components/activities/ActivityCard";


export const metadata = {
  title: "Aktivitas Siswa - Dokumentasi Kegiatan Belajar SATT",
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

async function getActivities() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/activities`, {
      cache: 'no-store' // atau 'force-cache' untuk caching
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aktivitas Anak Sekolah Alam
          </h1>
          <p className="text-gray-600">
            Berbagai kegiatan edukatif dan menyenangkan untuk pengembangan anak
          </p>
        </div>
        
        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">
              Belum ada aktivitas tersedia saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((act) => (
              <ActivityCard
                key={act.id}
                slug={act.slug}
                title={act.title}
                description={act.description}
                image={act.image}
                created_at={act.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
