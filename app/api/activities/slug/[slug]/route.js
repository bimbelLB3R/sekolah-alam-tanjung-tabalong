// app/api/activities/slug/[slug]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';



// GET activity by slug
export async function GET(request, { params }) {
  try {
    const { slug } =await params;
    
    // const connection = await getConnection();
    const [rows] = await pool.execute(
      'SELECT * FROM activities WHERE slug = ? AND is_active = TRUE',
      [slug]
    );
    // await pool.end();

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: rows[0] 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}