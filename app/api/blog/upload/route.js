import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/blog/auth-server';
import { uploadToS3 } from '@/lib/blog/s3';
import pool from '@/lib/db';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size: 5MB' 
      }, { status: 400 });
    }

    // Upload to S3
    const uploadResult = await uploadToS3(file, 'blog/images');

    // Save to database
    await pool.query(
      `INSERT INTO media (filename, original_name, mime_type, size, url, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        uploadResult.filename,
        uploadResult.originalName,
        uploadResult.mimeType,
        uploadResult.size,
        uploadResult.url,
        user.id
      ]
    );

    return NextResponse.json({ 
      url: uploadResult.url,
      filename: uploadResult.filename 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

// GET - List media files
export async function GET(request) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;

    const media = await pool.query(
      `SELECT * FROM media WHERE uploaded_by = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [user.id, limit, offset]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM media WHERE uploaded_by = ?',
      [user.id]
    );

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}