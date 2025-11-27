import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerUser } from '@/lib/blog/auth-server';
import slugify from 'slugify';
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const authorId = searchParams.get('author_id');
    const offset = (page - 1) * limit;

    // ================================
    // ✅ QUERY UTAMA (TANPA content!)
    // ================================
    let sql = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image,
        p.status,
        p.created_at,
        p.published_at,
        u.name AS author_name,
        c.name AS category_name
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
      sql += ' AND p.title LIKE ?'; // ✅ TIDAK search di content
      params.push(`%${search}%`);
    }

    if (authorId) {
      sql += ' AND p.author_id = ?';
      params.push(authorId);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await pool.query(sql, params);

    // ================================
    // ✅ COUNT YANG RINGAN (NO JOIN!)
    // ================================
    let countSql = `SELECT COUNT(*) as total FROM posts p WHERE 1=1`;
    const countParams = [];

    if (status) {
      countSql += ' AND p.status = ?';
      countParams.push(status);
    }

    if (search) {
      countSql += ' AND p.title LIKE ?';
      countParams.push(`%${search}%`);
    }

    if (authorId) {
      countSql += ' AND p.author_id = ?';
      countParams.push(authorId);
    }

    const [countResult] = await pool.query(countSql, countParams);
    const total = countResult[0]?.total || 0;

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

    // ============================
    // ✅ GENERATE SLUG AMAN
    // ============================
    let slug = slugify(title, { lower: true, strict: true });
    const [existingSlug] = await pool.query(
      'SELECT id FROM posts WHERE slug = ? LIMIT 1',
      [slug]
    );

    if (existingSlug.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const publishedAt = status === 'published' ? new Date() : null;

    // ============================
    // ✅ INSERT POST
    // ============================
    const [result] = await pool.query(
      `INSERT INTO posts 
        (title, slug, content, excerpt, featured_image, status, author_id, category_id, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        content || '',
        excerpt || '',
        featured_image || '',
        status || 'draft',
        user.id,
        category_id || null,
        publishedAt
      ]
    );

    const postId = result.insertId;

    // ============================
    // ✅ BULK TAG HANDLING (CEPAT)
    // ============================
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const cleanTags = tags
        .map(t => t?.trim())
        .filter(Boolean);

      if (cleanTags.length > 0) {
        // 1️⃣ Insert tags (ignore duplicate)
        const insertTagValues = cleanTags.map(tag => [
          tag,
          slugify(tag, { lower: true, strict: true })
        ]);

        await pool.query(
          `INSERT IGNORE INTO tags (name, slug) VALUES ?`,
          [insertTagValues]
        );

        // 2️⃣ Ambil semua tag ID
        const tagSlugs = insertTagValues.map(t => t[1]);
        const [tagRows] = await pool.query(
          `SELECT id FROM tags WHERE slug IN (?)`,
          [tagSlugs]
        );

        // 3️⃣ Bulk insert post_tags
        const postTagValues = tagRows.map(tag => [postId, tag.id]);

        if (postTagValues.length > 0) {
          await pool.query(
            `INSERT INTO post_tags (post_id, tag_id) VALUES ?`,
            [postTagValues]
          );
        }
      }
    }

    return NextResponse.json({ id: postId, slug }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    );
  }
}
