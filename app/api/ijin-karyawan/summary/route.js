// app/api/ijin-karyawan/route.js
import { NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';
import pool from '@/lib/db';

// Konfigurasi connection pool untuk RDS
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0
// });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Pagination
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;
  
  // Filters
  const search = searchParams.get('search') || '';
  const jenisIjin = searchParams.get('jenis_ijin') || '';
  const startDate = searchParams.get('start_date') || '';
  const endDate = searchParams.get('end_date') || '';
  const sortBy = searchParams.get('sort_by') || 'tanggal_ijin';
  const sortOrder = searchParams.get('sort_order') || 'DESC';

  try {
    // Build WHERE clause dengan prepared statement untuk keamanan
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('u.name LIKE ?');
      queryParams.push(`%${search}%`);
    }

    if (jenisIjin) {
      whereConditions.push('ik.jenis_ijin = ?');
      queryParams.push(jenisIjin);
    }

    if (startDate) {
      whereConditions.push('ik.tanggal_ijin >= ?');
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push('ik.tanggal_ijin <= ?');
      queryParams.push(endDate);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Validasi sort column untuk mencegah SQL injection
    const allowedSortColumns = {
      'tanggal_ijin': 'ik.tanggal_ijin',
      'name': 'u.name',
      'jenis_ijin': 'ik.jenis_ijin',
      'created_at': 'ik.created_at'
    };
    
    const sortColumn = allowedSortColumns[sortBy] || 'ik.tanggal_ijin';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Query utama dengan JOIN yang optimal
    // Menggunakan STRAIGHT_JOIN hint jika diperlukan untuk force join order
    const dataQuery = `
      SELECT 
        ik.id,
        ik.user_id,
        ik.jenis_ijin,
        ik.tanggal_ijin,
        ik.jam_keluar,
        ik.jam_kembali,
        ik.alasan_ijin,
        ik.dipotong_tunjangan,
        ik.created_at,
        u.name as nama_karyawan,
        u.email as email_karyawan
      FROM ijin_karyawan ik
      INNER JOIN users u ON ik.user_id = u.id
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT ? OFFSET ?
    `;

    // Query untuk total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ijin_karyawan ik
      INNER JOIN users u ON ik.user_id = u.id
      ${whereClause}
    `;

    // Eksekusi query secara parallel untuk efisiensi
    const [dataResults, countResults] = await Promise.all([
      pool.query(dataQuery, [...queryParams, limit, offset]),
      pool.query(countQuery, queryParams)
    ]);

    const data = dataResults[0];
    const total = countResults[0][0].total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch data',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Optional: Export untuk close pool saat aplikasi shutdown
// export async function closePool() {
//   await pool.end();
// }