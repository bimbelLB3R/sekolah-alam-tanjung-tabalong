import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats'); // optional: true/false
    
    // const connection = await pool.getConnection();
    
    try {
      let query;
      let params = [];

      if (includeStats === 'true') {
        // Query dengan statistik kehadiran
        query = `
          SELECT 
            u.id,
            u.name,
            u.email,
            COUNT(DISTINCT p.tanggal) as totalHariHadir,
            SUM(CASE WHEN p.keterangan = 'tepat waktu' AND p.jenis = 'masuk' THEN 1 ELSE 0 END) as totalTepatWaktu,
            SUM(CASE WHEN p.keterangan = 'terlambat' AND p.jenis = 'masuk' THEN 1 ELSE 0 END) as totalTerlambat,
            ROUND(
              (SUM(CASE WHEN p.keterangan = 'tepat waktu' AND p.jenis = 'masuk' THEN 1 ELSE 0 END) * 100.0) / 
              NULLIF(COUNT(CASE WHEN p.jenis = 'masuk' THEN 1 END), 0), 
              2
            ) as persentaseKehadiran
          FROM users u
          INNER JOIN roles r ON u.role_id = r.id
          LEFT JOIN presensi p ON u.id = p.user_id
          WHERE r.name = 'guru' OR r.name='manajemen'
          GROUP BY u.id, u.name, u.email
          ORDER BY u.name ASC
        `;
      } else {
        // Query sederhana tanpa statistik
        query = `
          SELECT 
            u.id,
            u.name,
            u.email
          FROM users u
          INNER JOIN roles r ON u.role_id = r.id
          WHERE r.name = 'guru' or r.name='manajemen'
          ORDER BY u.name ASC
        `;
      }
      
      const [results] = await pool.query(query, params);
      
      return NextResponse.json({
        success: true,
        data: results,
        total: results.length
      });

    } finally {
    //   connection.release();
    console.log("yes")
    }

  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Optional: GET single teacher by ID
export async function POST(request) {
  try {
    const body = await request.json();
    const { teacherId } = body;

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'teacherId is required' },
        { status: 400 }
      );
    }

    // const connection = await pool.getConnection();
    
    try {
      const query = `
        SELECT 
          u.id,
          u.name,
          u.email,
          r.name as role_name,
          u.created_at
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.id = ? AND (r.name = 'guru' or r.name='manajemen')
      `;
      
      const [results] = await pool.query(query, [teacherId]);
      
      if (results.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Teacher not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: results[0]
      });

    } finally {
    //   connection.release();
    console.log("yes")
    }

  } catch (error) {
    console.error('Error fetching teacher detail:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}