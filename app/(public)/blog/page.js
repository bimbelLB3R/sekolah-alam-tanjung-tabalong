import Link from 'next/link';
import Image from 'next/image';
import pool from '@/lib/db';

export const metadata = {
  title: 'Blog - Artikel & Berita Terbaru | Sekolah Alam Tanjung Tabalong',
  description: 'Baca artikel dan berita terbaru dari Sekolah Alam Tanjung Tabalong. Temukan informasi seputar pendidikan, kegiatan sekolah, dan tips parenting.',
  keywords: 'blog sekolah alam, artikel pendidikan, berita sekolah, sekolah alam tabalong',
  openGraph: {
    title: 'Blog - Artikel & Berita Terbaru',
    description: 'Baca artikel dan berita terbaru dari Sekolah Alam Tanjung Tabalong',
    url: 'https://sekolah-alam-tanjung-tabalong.vercel.app/blog',
    siteName: 'Sekolah Alam Tanjung Tabalong',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Artikel & Berita Terbaru',
    description: 'Baca artikel dan berita terbaru dari Sekolah Alam Tanjung Tabalong',
  },
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
};

async function getPosts(searchParams) {
  const page = parseInt(searchParams?.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;
  const category = searchParams?.category || '';
  const search = searchParams?.search || '';

  let sql = `
    SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.published_at,
           u.name as author_name, c.name as category_name, c.slug as category_slug
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published'
  `;
  const params = [];

  if (category) {
    sql += ' AND c.slug = ?';
    params.push(category);
  }

  if (search) {
    sql += ' AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countSql = sql.replace(
    'SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.published_at, u.name as author_name, c.name as category_name, c.slug as category_slug',
    'SELECT COUNT(*) as total'
  );
  const [countResult] = await pool.query(countSql, params);
  const total = countResult.total;

  sql += ' ORDER BY p.published_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [posts] = await pool.query(sql, params);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getCategories() {
  const [categories] = await pool.query(
    `SELECT c.*, COUNT(p.id) as post_count
     FROM categories c
     LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
     GROUP BY c.id
     HAVING post_count > 0
     ORDER BY c.name ASC`
  );
  return categories;
}

async function getFeaturedPost() {
  const [posts] = await pool.query(
    `SELECT p.*, u.name as author_name, c.name as category_name, c.slug as category_slug
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.status = 'published'
     ORDER BY p.view_count DESC, p.published_at DESC
     LIMIT 1`
  );
  return posts[0] || null;
}

export default async function BlogPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const [{ posts, pagination }, categories, featuredPost] = await Promise.all([
    getPosts(resolvedParams),
    getCategories(),
    getFeaturedPost(),
  ]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Temukan artikel, tips, dan berita terbaru dari kami
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Post */}
            {featuredPost && !resolvedParams?.search && !resolvedParams?.category && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Artikel Unggulan
                </h2>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                    <div className="md:flex">
                      <div className="md:w-1/2 h-64 md:h-auto relative">
                        {featuredPost.featured_image ? (
                          <img
                            src={featuredPost.featured_image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="md:w-1/2 p-8">
                        {featuredPost.category_name && (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-3">
                            {featuredPost.category_name}
                          </span>
                        )}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                          {featuredPost.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {featuredPost.excerpt || 'Baca selengkapnya...'}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{featuredPost.author_name}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(featuredPost.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-8">
              <form method="GET" className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={resolvedParams?.search || ''}
                  placeholder="Cari artikel..."
                  className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Tidak ada artikel</h3>
                <p className="mt-2 text-gray-500">Belum ada artikel yang dipublikasikan</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                        <div className="h-48 relative overflow-hidden">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          {post.category_name && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium mb-2">
                              {post.category_name}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {post.excerpt || 'Baca selengkapnya...'}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{post.author_name}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {pagination.page > 1 && (
                      <Link
                        href={`/blog?page=${pagination.page - 1}${resolvedParams?.category ? `&category=${resolvedParams.category}` : ''}${resolvedParams?.search ? `&search=${resolvedParams.search}` : ''}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        ← Sebelumnya
                      </Link>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = pagination.page <= 3 ? i + 1 : pagination.page - 2 + i;
                        if (pageNum > pagination.totalPages) return null;
                        return (
                          <Link
                            key={pageNum}
                            href={`/blog?page=${pageNum}${resolvedParams?.category ? `&category=${resolvedParams.category}` : ''}${resolvedParams?.search ? `&search=${resolvedParams.search}` : ''}`}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              pageNum === pagination.page
                                ? 'bg-green-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}
                    </div>

                    {pagination.page < pagination.totalPages && (
                      <Link
                        href={`/blog?page=${pagination.page + 1}${resolvedParams?.category ? `&category=${resolvedParams.category}` : ''}${resolvedParams?.search ? `&search=${resolvedParams.search}` : ''}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Selanjutnya →
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kategori</h3>
              <div className="space-y-2">
                <Link
                  href="/blog"
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    !resolvedParams?.category
                      ? 'bg-green-100 text-green-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Semua Artikel
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.slug}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      resolvedParams?.category === cat.slug
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-sm text-gray-500">({cat.post_count})</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}