import Link from 'next/link';
import { notFound } from 'next/navigation';
import pool from '@/lib/db';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  const siteUrl = 'https://sekolah-alam-tanjung-tabalong.vercel.app';
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const description = post.excerpt || post.title;
  const imageUrl = post.featured_image || `${siteUrl}/default-blog-image.jpg`; // fallback ke default image jika ada

  return {
    title: `${post.title} | Blog Sekolah Alam Tanjung Tabalong`,
    description: description,
    keywords: post.tags?.map(tag => tag.name).join(', ') || '',
    authors: [{ name: post.author_name }],
    openGraph: {
      title: post.title,
      description: description,
      url: articleUrl,
      siteName: 'Sekolah Alam Tanjung Tabalong',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      locale: 'id_ID',
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name],
      section: post.category_name || 'Blog',
      tags: post.tags?.map(tag => tag.name) || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: [imageUrl],
      creator: `@${post.author_name?.replace(/\s+/g, '')}` || '@sekolahalam',
    },
    alternates: {
      canonical: articleUrl,
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
}

async function getPost(slug) {
  const [posts] = await pool.query(
    `SELECT p.*, u.name as author_name, u.email as author_email,
            c.name as category_name, c.slug as category_slug
     FROM posts p
     LEFT JOIN users u ON p.author_id = u.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.status = 'published'`,
    [slug]
  );

  if (posts.length === 0) return null;

  // Get tags
  const [tags] = await pool.query(
    `SELECT t.* FROM tags t
     JOIN post_tags pt ON t.id = pt.tag_id
     WHERE pt.post_id = ?`,
    [posts[0].id]
  );

  // Increment view count
  await pool.query(
    'UPDATE posts SET view_count = view_count + 1 WHERE id = ?',
    [posts[0].id]
  );

  return { ...posts[0], tags };
}

async function getRelatedPosts(postId, categoryId, limit = 3) {
  const [posts] = await pool.query(
    `SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.published_at,
            c.name as category_name
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id != ? AND p.category_id = ? AND p.status = 'published'
     ORDER BY p.published_at DESC
     LIMIT ?`,
    [postId, categoryId, limit]
  );

  return posts;
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = post.category_id
    ? await getRelatedPosts(post.id, post.category_id)
    : [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const estimatedReadTime = Math.ceil(
    (post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0) / 200
  );

  const siteUrl = 'https://sekolah-alam-tanjung-tabalong.vercel.app';
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  
  // Structured Data untuk SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featured_image ? [post.featured_image] : [],
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
      email: post.author_email,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sekolah Alam Tanjung Tabalong',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`, // Sesuaikan dengan logo Anda
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: post.category_name || 'Blog',
    keywords: post.tags?.map(tag => tag.name).join(', '),
    wordCount: post.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0,
    inLanguage: 'id-ID',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            {post.category_name && (
              <>
                <span>›</span>
                <Link 
                  href={`/blog?category=${post.category_slug}`}
                  className="hover:text-blue-600"
                >
                  {post.category_name}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-gray-900 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {post.category_name && (
              <Link
                href={`/blog?category=${post.category_slug}`}
                className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4 hover:bg-blue-200 transition-colors"
              >
                {post.category_name}
              </Link>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {post.author_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author_name}</p>
                  <p className="text-sm text-gray-500">{formatDate(post.published_at)}</p>
                </div>
              </div>
              
              <span className="text-gray-400">•</span>
              
              <div className="flex items-center gap-1 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{estimatedReadTime} menit baca</span>
              </div>

              <span className="text-gray-400">•</span>

              <div className="flex items-center gap-1 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.view_count || 0} views</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-12
                       prose-headings:font-bold prose-headings:text-gray-900
                       prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                       prose-p:text-gray-700 prose-p:leading-relaxed
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-gray-900 prose-strong:font-semibold
                       prose-img:rounded-lg prose-img:shadow-md
                       prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4
                       prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12 pb-8 border-b">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="mb-12 pb-8 border-b">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Bagikan artikel ini:</h3>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://sekolah-alam-tanjung-tabalong.vercel.app/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://sekolah-alam-tanjung-tabalong.vercel.app/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - https://sekolah-alam-tanjung-tabalong.vercel.app/blog/' + post.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`}>
                    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                      <div className="h-40 relative overflow-hidden">
                        {related.featured_image ? (
                          <img
                            src={related.featured_image}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {related.excerpt || 'Baca selengkapnya...'}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Back to Blog Button */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Blog
          </Link>
        </div>
      </div>
    </div>
  );
}