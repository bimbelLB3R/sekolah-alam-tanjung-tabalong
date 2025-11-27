import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerUser } from '@/lib/blog/auth-server';
import { getServerUserFull } from '@/lib/blog/auth-server';
// import { useAuth } from '@/lib/getUserClientSide';
import slugify from 'slugify';
import { deleteFromS3 } from '@/lib/blog/s3';

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

// PUT - Update post (Optimized Production Version)
export async function PUT(request, { params }) {
  try {
    const user = await getServerUserFull();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { title, content, excerpt, featured_image, status, category_id, tags } = body;

    // ✅ 1. Ambil data post SEKALIGUS (ownership + status + published_at)
    const [postRows] = await pool.query(
      `SELECT author_id, status, published_at FROM posts WHERE id = ?`,
      [id]
    );

    if (postRows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = postRows[0];

    // ✅ 2. Validasi kepemilikan
    if (post.author_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ 3. Generate slug baru (aman & cepat)
    let slug = slugify(title, { lower: true, strict: true });

    const [slugRows] = await pool.query(
      `SELECT id FROM posts WHERE slug = ? AND id != ? LIMIT 1`,
      [slug, id]
    );

    if (slugRows.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // ✅ 4. Tentukan published_at
    let publishedAt = post.published_at;
    if (status === "published" && post.status !== "published") {
      publishedAt = new Date();
    }

    // ✅ 5. Update post (1 QUERY SAJA)
    await pool.query(
      `UPDATE posts SET 
        title = ?, slug = ?, content = ?, excerpt = ?,
        featured_image = ?, status = ?, category_id = ?, published_at = ?
       WHERE id = ?`,
      [
        title,
        slug,
        content || "",
        excerpt || "",
        featured_image || "",
        status,
        category_id || null,
        publishedAt,
        id,
      ]
    );

    // ✅ 6. Update tags (AMAN & CEPAT)
    await pool.query(`DELETE FROM post_tags WHERE post_id = ?`, [id]);

    if (Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        if (!tagName || !tagName.trim()) continue;

        const tagSlug = slugify(tagName, { lower: true, strict: true });

        await pool.query(
          `INSERT IGNORE INTO tags (name, slug) VALUES (?, ?)`,
          [tagName.trim(), tagSlug]
        );

        const [tagRows] = await pool.query(
          `SELECT id FROM tags WHERE slug = ? LIMIT 1`,
          [tagSlug]
        );

        if (tagRows.length > 0) {
          await pool.query(
            `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`,
            [id, tagRows[0].id]
          );
        }
      }
    }

    // ✅ ✅ ✅ OUTPUT TETAP SAMA (TIDAK BERUBAH)
    return NextResponse.json({ success: true, slug });

  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}


// DELETE - Delete post
// export async function DELETE(request, { params }) {
//   try {
//     const user = await getServerUser();
    
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id } = await params;

//     const [post] = await pool.query('SELECT author_id FROM posts WHERE id = ?', [id]);
//     if (!post) {
//       return NextResponse.json({ error: 'Post not found' }, { status: 404 });
//     }
    
//     if (post[0].author_id !== user.id ) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//     }

//     await pool.query('DELETE FROM posts WHERE id = ?', [id]);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
//   }
// }
// DELETE - Delete post and associated images from S3
export async function DELETE(request, { params }) {
  try {
    const user = await getServerUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // ✅ 1. Ambil data post SEKALIGUS
    const [postRows] = await pool.query(
      `SELECT author_id, featured_image, content 
       FROM posts 
       WHERE id = ? 
       LIMIT 1`,
      [id]
    );

    if (postRows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = postRows[0];

    // ✅ 2. Validasi ownership
    if (post.author_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ 3. Kumpulkan semua gambar S3
    const imagesToDelete = [];

    // Featured image
    if (post.featured_image) {
      const key = extractS3KeyFromUrl(post.featured_image);
      if (key) imagesToDelete.push(key);
    }

    // Gambar di HTML content
    if (post.content) {
      const contentImages = extractImagesFromHtml(post.content);
      imagesToDelete.push(...contentImages);
    }

    // ✅ 4. HAPUS POST DARI DATABASE DULU (PRIORITAS UTAMA)
    await pool.query("DELETE FROM posts WHERE id = ?", [id]);

    // ✅ 5. HAPUS GAMBAR DI S3 (TIDAK BLOK DELETE POST)
    if (imagesToDelete.length > 0) {
      await Promise.allSettled(
        imagesToDelete.map(async (key) => {
          try {
            await deleteFromS3(key);
            console.log("✅ Deleted image from S3:", key);
          } catch (err) {
            console.error("❌ Failed to delete image:", key, err);
          }
        })
      );
    }

    // ✅ ✅ ✅ OUTPUT TETAP SAMA (TIDAK DIUBAH)
    return NextResponse.json({
      success: true,
      deletedImages: imagesToDelete.length,
    });

  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

// helper function
function extractS3KeyFromUrl(url) {
  if (!url) return null;

  try {
    const patterns = [
      /\.s3\.[\w-]+\.amazonaws\.com\/(.+)$/,
      /\.cloudfront\.net\/(.+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return decodeURIComponent(match[1]);
    }

    const urlObj = new URL(url);
    return urlObj.pathname.replace(/^\/+/, "") || null;

  } catch (err) {
    console.error("Error extracting S3 key:", url, err);
    return null;
  }
}

function extractImagesFromHtml(html) {
  if (!html) return [];

  const images = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const key = extractS3KeyFromUrl(match[1]);
    if (key) images.push(key);
  }

  return images;
}
