'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/getUserClientSide';
import BlogPostsTable from './BlogPostsTable';
import { useSearchParams, useRouter } from 'next/navigation';
// import { Suspense } from 'react';

export default function BlogDashboardPage() {
  const { user, loading: authLoading, mounted } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, archived: 0 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  useEffect(() => {
    if (!mounted) return;
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, mounted, router]);

  useEffect(() => {
    if (!user) return;
    fetchPosts();
  }, [user, searchParams]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const page = searchParams.get('page') || 1;
      const statusParam = searchParams.get('status') || '';
      const searchParam = searchParams.get('search') || '';

      const params = new URLSearchParams({ page, limit: 10 });
      if (statusParam) params.append('status', statusParam);
      if (searchParam) params.append('search', searchParam);

      const res = await fetch(`/api/blog/posts?${params}`);
      const data = await res.json();

      setPosts(data.posts || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });

      // Calculate stats from all posts (fetch without pagination for stats)
      const statsRes = await fetch('/api/blog/posts?limit=1000');
      const statsData = await statsRes.json();
      const allPosts = statsData.posts || [];

      setStats({
        total: statsData.pagination?.total || 0,
        published: allPosts.filter(p => p.status === 'published').length,
        draft: allPosts.filter(p => p.status === 'draft').length,
        archived: allPosts.filter(p => p.status === 'archived').length,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

//   console.log(posts)

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    router.push(`/dashboard/blog?${params.toString()}`);
  };

  if (!mounted || authLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-600">Memuat...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    
    <div className="p-6">
      {/* Header */}
     <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Blog</h1>
            <p className="text-gray-600 mt-1">Kelola semua artikel blog Anda</p>
        </div>
        <div className="flex gap-3">
            <Link
            href="/dashboard/blog/categories"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Kelola Kategori
            </Link>
            <Link
            href="/dashboard/blog/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Artikel Baru
            </Link>
        </div>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Artikel" value={stats.total} color="blue" />
        <StatCard label="Dipublikasi" value={stats.published} color="green" />
        <StatCard label="Draft" value={stats.draft} color="yellow" />
        <StatCard label="Diarsipkan" value={stats.archived} color="gray" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleFilter} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              <option value="published">Dipublikasi</option>
              <option value="draft">Draft</option>
              <option value="archived">Diarsipkan</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="mt-2 text-gray-600">Memuat artikel...</p>
          </div>
        ) : (
          <BlogPostsTable posts={posts} onRefresh={fetchPosts} />
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
              {pagination.total} artikel
            </p>
            <div className="flex gap-2">
              {pagination.page > 1 && (
                <Link
                  href={`/dashboard/blog?page=${pagination.page - 1}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Sebelumnya
                </Link>
              )}
              {pagination.page < pagination.totalPages && (
                <Link
                  href={`/dashboard/blog?page=${pagination.page + 1}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Selanjutnya
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[color]}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}