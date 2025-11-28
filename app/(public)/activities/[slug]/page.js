// app/activities/[slug]/page.js
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import ScrollToTopButton from "./ScrollToTopButton";
import ShareButtons from "./ShareButtons";

// Fungsi untuk fetch data aktivitas
async function getActivityBySlug(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/activities/slug/${slug}`,
      { 
        next: { revalidate: 3600 } // Revalidate setiap 1 jam
      }
    );
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching activity:', error);
    return null;
  }
}

// Generate Metadata untuk SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const activity = await getActivityBySlug(resolvedParams.slug);

  // Fallback jika aktivitas tidak ditemukan
  if (!activity) {
    return {
      title: 'Aktivitas Tidak Ditemukan',
      description: 'Halaman aktivitas yang Anda cari tidak ditemukan.',
      robots: {
        index: false,
        follow: false,
      }
    };
  }

  // Format tanggal untuk metadata
  const publishedDate = new Date(activity.created_at).toISOString();
  const modifiedDate = activity.updated_at 
    ? new Date(activity.updated_at).toISOString() 
    : publishedDate;

  // Buat excerpt dari description (max 160 karakter untuk SEO)
  const metaDescription = activity.description?.length > 160
    ? activity.description.substring(0, 157) + '...'
    : activity.description || 'Baca lebih lanjut tentang aktivitas sekolah alam kami.';

  // Base URL untuk absolute URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sekolahalam-tanjungtabalong.id';
  const pageUrl = `${baseUrl}/activities/${resolvedParams.slug}`;
  const imageUrl = activity.image?.startsWith('http') 
    ? activity.image 
    : `${baseUrl}${activity.image}`;

  return {
    // Basic Metadata
    title: activity.title,
    description: metaDescription,
    keywords: [
      'aktivitas sekolah',
      'sekolah alam tanjung tabalong',
      activity.title,
      'pendidikan',
      'kegiatan siswa'
    ],
    authors: [{ name: 'Sekolah Alam Tanjung Tabalong' }],
    creator: 'Sekolah Alam Tanjung Tabalong',
    publisher: 'Sekolah Alam Tanjung Tabalong',

    // Open Graph (Facebook, LinkedIn, etc)
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: activity.title,
      description: metaDescription,
      siteName: 'Sekolah Alam Tanjung Tabalong',
      locale: 'id_ID',
      images: activity.image ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: activity.title,
          type: 'image/jpeg',
        }
      ] : [],
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: ['Sekolah Alam Tanjung Tabalong'],
      section: 'Aktivitas',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: activity.title,
      description: metaDescription,
      images: activity.image ? [imageUrl] : [],
      creator: '@sekolahalam_tanjungtabalong', // Ganti dengan Twitter handle Anda
      site: 'sekolahalam-tanjungtabalong.id',
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Alternate Languages (jika ada)
    alternates: {
      canonical: pageUrl,
      languages: {
        'id-ID': pageUrl,
      },
    },

    // Other Meta Tags
    category: 'education',
  };
}

// Generate Static Params (Optional - untuk static generation)
// Uncomment jika ingin generate static pages
// export async function generateStaticParams() {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/activities`);
//     const data = await res.json();
//     
//     if (!data.success) return [];
//     
//     return data.data.map((activity) => ({
//       slug: activity.slug,
//     }));
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }

// Main Component
export default async function ActivityDetailPage({ params }) {
  const resolvedParams = await params;
  const activity = await getActivityBySlug(resolvedParams.slug);

  // 404 if activity not found
  if (!activity) {
    notFound();
  }

  // Format tanggal untuk tampilan
  const formattedDate = new Date(activity.created_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Hitung reading time (opsional)
  const calculateReadingTime = (text) => {
    if (!text) return 1;
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return time;
  };

  const readingTime = calculateReadingTime(activity.content || activity.description);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb & Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-gray-900 transition">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/activities" className="hover:text-gray-900 transition">
              Aktivitas
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">
              {activity.title}
            </span>
          </nav>

          {/* Back Button */}
          <Link 
            href="/activities"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Aktivitas</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          {activity.image && (
            <div className="relative w-full h-[400px] bg-gray-200">
              <Image
                src={activity.image}
                alt={activity.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <header>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {activity.title}
              </h1>
            </header>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 border-b pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={activity.created_at}>
                  {formattedDate}
                </time>
              </div>
              
              {activity.created_by && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{activity.created_by}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} menit baca</span>
              </div>
            </div>

            {/* Description/Excerpt */}
            {activity.description && (
              <div className="text-xl text-gray-700 leading-relaxed font-medium border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                {activity.description}
              </div>
            )}

            {/* Full Content */}
            {activity.content && activity.content.trim() !== '' ? (
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {activity.content}
                </div>
              </div>
            ) : (
              /* Empty State for Content */
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Konten Sedang Disiapkan
                  </h3>
                  <p className="text-gray-500">
                    Konten detail untuk aktivitas ini sedang dalam proses penulisan. 
                    Silakan kembali lagi nanti untuk informasi lebih lengkap.
                  </p>
                </div>
              </div>
            )}

            {/* Tags/Categories (jika ada) */}
            {activity.tags && activity.tags.length > 0 && (
              <div className="pt-6 border-t">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Tag:</span>
                  {activity.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link
            href="/activities"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Lihat Aktivitas Lainnya
          </Link>

          <ScrollToTopButton />
        </div>

        {/* Share Buttons */}
        <ShareButtons title={activity.title} />
      </div>

      {/* JSON-LD Structured Data untuk SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": activity.title,
            "description": activity.description,
            "image": activity.image ? [activity.image] : [],
            "datePublished": activity.created_at,
            "dateModified": activity.updated_at || activity.created_at,
            "author": {
              "@type": "Organization",
              "name": "Sekolah Alam"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Sekolah Alam",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_APP_URL}/activities/${resolvedParams.slug}`
            }
          })
        }}
      />
    </div>
  );
}