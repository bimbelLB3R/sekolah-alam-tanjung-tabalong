// app/api/activities/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/getUserFromToken';



// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

// // GET - Ambil semua activities
export async function GET(request) {
  try {
    // const pool = await getpool();
    const [rows] = await pool.query(
      'SELECT * FROM activities WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    // await pool.end();
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}



// POST - Tambah activity baru
export async function POST(request) {
  try {
    const user = await getUserFromToken();
    console.log("penulis",user)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, content, image } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let slug = generateSlug(title);
    
    // const pool = await getpool();
    let slugExists = true;
    let counter = 1;
    let finalSlug = slug;

    while (slugExists) {
      const [existing] = await pool.execute(
        'SELECT id FROM activities WHERE slug = ?',
        [finalSlug]
      );
      
      if (existing.length === 0) {
        slugExists = false;
      } else {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO activities (slug, title, description, content, image, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [finalSlug, title, description, content || '', image || '', user.name]
    );
    // await pool.end();

    return NextResponse.json({
      success: true,
      data: { 
        id: result.insertId, 
        slug: finalSlug, 
        title, 
        description, 
        content, 
        image,
        created_by: user.id
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}

