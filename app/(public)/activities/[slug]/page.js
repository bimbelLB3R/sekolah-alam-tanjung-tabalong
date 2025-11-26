// app/activities/[slug]/page.js
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

async function getActivityBySlug(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/activities/slug/${slug}`,
      { 
        cache: 'no-store' // atau 'force-cache' untuk caching
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

export default async function ActivityDetailPage({ params }) {
  const resolvedParams = await params;
  const activity = await getActivityBySlug(resolvedParams.slug);

  if (!activity) {
    notFound();
  }

  // Format date
  const formattedDate = new Date(activity.created_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900">
              {activity.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-sm text-gray-500 border-b pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              {activity.created_by && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Admin</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-lg text-gray-700 leading-relaxed">
              {activity.description}
            </div>

            {/* Full Content */}
            {activity.content && activity.content.trim() !== '' && (
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {activity.content}
                </div>
              </div>
            )}

            {/* Empty State for Content */}
            {(!activity.content || activity.content.trim() === '') && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  Konten detail untuk aktivitas ini sedang dalam proses penulisan.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Back to List Button */}
        <div className="mt-8 text-center">
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Lihat Aktivitas Lainnya
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const activity = await getActivityBySlug(resolvedParams.slug);

  if (!activity) {
    return {
      title: 'Aktivitas Tidak Ditemukan',
    };
  }

  return {
    title: `${activity.title} - Aktivitas Sekolah Alam`,
    description: activity.description,
    openGraph: {
      title: activity.title,
      description: activity.description,
      images: activity.image ? [activity.image] : [],
    },
  };
}