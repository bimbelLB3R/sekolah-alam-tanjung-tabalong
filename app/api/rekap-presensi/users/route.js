// app/api/users/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.getAll('role'); // ['guru','manajemen']

    connection = await pool.getConnection();

    let query = `
      SELECT DISTINCT
        u.id as user_id,
        u.name as nama,
        u.email,
        r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      INNER JOIN presensi p ON u.id = p.user_id
    `;

    const params = [];

    // ✅ Jika ada filter role
    if (roleFilter.length > 0) {
      const placeholders = roleFilter.map(() => '?').join(',');
      query += ` WHERE r.name IN (${placeholders})`;
      params.push(...roleFilter);
    }

    query += ' ORDER BY u.name';

    const [results] = await connection.execute(query, params);

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        total: results.length
      }
    });

  } catch (error) {
    console.error('❌ API Users Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
