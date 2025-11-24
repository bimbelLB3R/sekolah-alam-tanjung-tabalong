'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LatestBlogSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const res = await fetch('/api/blog/posts/latest?limit=3');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching latest posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'Baca artikel lengkap untuk mengetahui lebih lanjut...';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="space-y-6 p-3">
        <h2 className="text-4xl font-semibold text-center mb-8">Artikel Terbaru</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-2xl shadow-md animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="space-y-6 p-3">
        <h2 className="text-4xl font-semibold text-center mb-8">Artikel Terbaru</h2>
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-4">Belum ada artikel yang dipublikasikan</p>
          <Button asChild variant="outline">
            <Link href="/blog">Lihat Semua Artikel</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 p-3">
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-8">
        <h2 className="text-4xl font-semibold">Artikel Terbaru</h2>
        <Button asChild variant="outline">
          <Link href="/blog">Lihat Semua</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {articles.map((article) => (
          <Card key={article.id} className="rounded-2xl shadow-md hover:shadow-xl transition-shadow group overflow-hidden">
            {/* Featured Image */}
            {article.featured_image && (
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <CardHeader>
              {article.category_name && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium mb-2 w-fit">
                  {article.category_name}
                </span>
              )}
              <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDate(article.published_at)}</span>
                {article.author_name && (
                  <>
                    <span>•</span>
                    <span>{article.author_name}</span>
                  </>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-lg mb-4 line-clamp-3 text-gray-600">
                {truncateText(article.excerpt)}
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/blog/${article.slug}`}>Baca Selengkapnya</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA ke halaman blog */}
      <div className="text-center mt-8">
        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
          <Link href="/blog">
            Jelajahi Semua Artikel
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </Button>
      </div>
    </section>
  );
}