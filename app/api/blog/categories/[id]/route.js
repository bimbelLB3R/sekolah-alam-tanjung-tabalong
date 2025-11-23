import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerUser } from '@/lib/blog/auth-server';
import slugify from 'slugify';

// PUT - Update category
export async function PUT(request, { params }) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, description } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug exists (except current category)
    const [existing] = await pool.query(
      'SELECT id FROM categories WHERE slug = ? AND id != ?',
      [slug, id]
    );
    
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 });
    }

    await pool.query(
      'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
      [name.trim(), slug, description || null, id]
    );

    return NextResponse.json({ success: true, name, slug });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE - Delete category
export async function DELETE(request, { params }) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if category has posts
    const [posts] = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE category_id = ?',
      [id]
    );

    if (posts[0].count > 0) {
      return NextResponse.json(
        { error: `Tidak dapat menghapus kategori yang memiliki ${posts[0].count} artikel. Hapus atau pindahkan artikel terlebih dahulu.` },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

// GET - Get single category
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [categories] = await pool.query(
      `SELECT c.*, COUNT(p.id) as post_count
       FROM categories c
       LEFT JOIN posts p ON c.id = p.category_id
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );

    if (categories.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(categories[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}