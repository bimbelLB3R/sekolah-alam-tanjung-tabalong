import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Get latest published posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 3;

    const [posts] = await pool.query(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.published_at,
              u.name as author_name, c.name as category_name
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.status = 'published'
       ORDER BY p.published_at DESC
       LIMIT ?`,
      [limit]
    );

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}