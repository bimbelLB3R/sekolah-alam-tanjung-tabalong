"use client"
import { Suspense } from 'react';
import BlogDashboardPage from '../components/blog/BlogDashboardPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogDashboardPage />
    </Suspense>
  );
}
