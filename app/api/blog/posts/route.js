import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerUser } from '@/lib/blog/auth-server';
import slugify from 'slugify';

// GET - List all posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const authorId = searchParams.get('author_id');
    const offset = (page - 1) * limit;

    let sql = `
      SELECT p.*, u.name as author_name, c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (authorId) {
      sql += ' AND p.author_id = ?';
      params.push(authorId);
    }

    // Count total
    const countSql = sql.replace('SELECT p.*, u.name as author_name, c.name as category_name', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countSql, params);
    const total = countResult[0]?.total || 0;

    // Get posts with pagination
    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await pool.query(sql, params);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST - Create new post
export async function POST(request) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, featured_image, status, category_id, tags } = body;

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    const [existingSlug] = await pool.query('SELECT id FROM posts WHERE slug = ?', [slug]);
    if (existingSlug.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const publishedAt = status === 'published' ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO posts (title, slug, content, excerpt, featured_image, status, author_id, category_id, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content || '', excerpt || '', featured_image || '', status || 'draft', user.id, category_id || null, publishedAt]
    );

    const postId = result.insertId;

    console.log('Created post with ID:', postId); // Debug log

    // Handle tags
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        if (!tagName || tagName.trim() === '') continue; // Skip empty tags
        
        const tagSlug = slugify(tagName.trim(), { lower: true, strict: true });
        
        // Insert or get existing tag
        await pool.query(
          'INSERT IGNORE INTO tags (name, slug) VALUES (?, ?)',
          [tagName.trim(), tagSlug]
        );
        
        const [tagResult] = await pool.query('SELECT id FROM tags WHERE slug = ?', [tagSlug]);
        
        console.log('Tag found:', tagResult); // Debug log
        
        if (tagResult && tagResult.length > 0 && tagResult[0].id) {
          await pool.query(
            'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
            [postId, tagResult[0].id]
          );
        }
      }
    }

    return NextResponse.json({ id: postId, slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      error: 'Failed to create post', 
      details: error.message 
    }, { status: 500 });
  }
}