'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/getUserClientSide';
import PostForm from '@/app/dashboard/components/blog/PostForm';

export default function EditPostPage() {
  const { user, loading: authLoading, mounted } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
console.log(post)
  useEffect(() => {
    if (!mounted) return;
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, mounted, router]);

  useEffect(() => {
    if (!user || !id) return;
    fetchData();
  }, [user, id]);

  const fetchData = async () => {
    try {
      const [postRes, catRes] = await Promise.all([
        fetch(`/api/dashboard/blog/posts/${id}`),
        fetch('/api/dashboard/blog/categories')
      ]);

      if (!postRes.ok) {
        if (postRes.status === 404) {
          setError('Artikel tidak ditemukan');
        } else {
          setError('Gagal memuat artikel');
        }
        return;
      }

      const postData = await postRes.json();
      const catData = await catRes.json();

      setPost(postData[0]);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading || loading) {
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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h2 className="font-semibold mb-1">Error</h2>
          <p>{error}</p>
          <Link href="/dashboard/blog" className="mt-3 inline-block text-red-600 hover:underline">
            ← Kembali ke daftar artikel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/blog"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Artikel</h1>
          <p className="text-gray-600">Perbarui artikel: {post?.title}</p>
        </div>
      </div>

      {/* Form */}
      <PostForm post={post} categories={categories} />
    </div>
  );
}