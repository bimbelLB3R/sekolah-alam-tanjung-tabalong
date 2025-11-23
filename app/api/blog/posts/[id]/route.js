import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerUser } from '@/lib/blog/auth-server';
import { getServerUserFull } from '@/lib/blog/auth-server';
// import { useAuth } from '@/lib/getUserClientSide';
import slugify from 'slugify';

// GET - Get single post
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const posts = await pool.query(
      `SELECT p.*, u.name as author_name, c.name as category_name
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (posts.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get tags
    const tags = await pool.query(
      `SELECT t.* FROM tags t
       JOIN post_tags pt ON t.id = pt.tag_id
       WHERE pt.post_id = ?`,
      [id]
    );

    return NextResponse.json({ ...posts[0], tags });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT - Update post
export async function PUT(request, { params }) {
  try {
    const user = await getServerUserFull();
    // const user=await useAuth();
    console.log(user)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, featured_image, status, category_id, tags } = body;

    // Check ownership or admin
    const [post] = await pool.query('SELECT author_id FROM posts WHERE id = ?', [id]);
    console.log(post)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    if (post[0].author_id !== user.id ) {
        // console.log("Author_id",post.author_id);
        // console.log("User_id",user.id)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate new slug if title changed
    let slug = slugify(title, { lower: true, strict: true });
    const existingSlug = await pool.query('SELECT id FROM posts WHERE slug = ? AND id != ?', [slug, id]);
    if (existingSlug.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // Set published_at if publishing for first time
    const [currentPost] = await pool.query('SELECT status, published_at FROM posts WHERE id = ?', [id]);
    let publishedAt = currentPost.published_at;
    if (status === 'published' && currentPost.status !== 'published') {
      publishedAt = new Date();
    }

    await pool.query(
      `UPDATE posts SET 
        title = ?, slug = ?, content = ?, excerpt = ?, 
        featured_image = ?, status = ?, category_id = ?, published_at = ?
       WHERE id = ?`,
      [title, slug, content, excerpt, featured_image, status, category_id || null, publishedAt, id]
    );

    // Update tags
    await pool.query('DELETE FROM post_tags WHERE post_id = ?', [id]);
    
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tagSlug = slugify(tagName, { lower: true, strict: true });
        await pool.query('INSERT IGNORE INTO tags (name, slug) VALUES (?, ?)', [tagName, tagSlug]);
        const [tag] = await pool.query('SELECT id FROM tags WHERE slug = ?', [tagSlug]);
        await pool.query('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [id, tag.id]);
      }
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE - Delete post
export async function DELETE(request, { params }) {
  try {
    const user = await getServerUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const [post] = await pool.query('SELECT author_id FROM posts WHERE id = ?', [id]);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    if (post[0].author_id !== user.id ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await pool.query('DELETE FROM posts WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}