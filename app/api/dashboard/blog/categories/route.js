import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerUser } from '@/lib/blog/auth-server';
import slugify from 'slugify';

// GET - List all categories
export async function GET() {
  try {
    const categories = await pool.query(
      `SELECT c.*, COUNT(p.id) as post_count
       FROM categories c
       LEFT JOIN posts p ON c.id = p.category_id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(request) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug exists
    const existing = await pool.query('SELECT id FROM categories WHERE slug = ?', [slug]);
    console.log("exciting",existing)
    if (existing[0].length > 0) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name.trim(), slug, description || null]
    );

    return NextResponse.json({ id: result.insertId, name, slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}