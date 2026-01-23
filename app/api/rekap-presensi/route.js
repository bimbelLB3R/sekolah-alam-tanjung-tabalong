// app/api/rekap-presensi/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM
    const userId = searchParams.get('user_id'); // Optional, untuk filter per user

    // Validasi parameter month
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      );
    }

    const [year, monthNum] = month.split('-');
    const startDate = `${year}-${monthNum}-01`;
    const endDate = `${year}-${monthNum}-${new Date(year, monthNum, 0).getDate()}`;

    // Get connection from pool
    connection = await pool.getConnection();

    // Query yang efisien dengan JOIN dan agregasi di database
    // Menggunakan CASE untuk pivot jenis masuk/pulang
    // PENTING: Jika tidak ada presensi pulang, maka tidak ada row dengan jenis='pulang'
    let query = `
      SELECT 
        u.id as user_id,
        u.name as nama,
        p.tanggal,
        MAX(CASE WHEN p.jenis = 'masuk' THEN p.jam END) as jam_masuk,
        MAX(CASE WHEN p.jenis = 'pulang' THEN p.jam END) as jam_pulang,
        MAX(CASE WHEN p.jenis = 'masuk' THEN p.keterangan END) as keterangan_masuk,
        MAX(CASE WHEN p.jenis = 'pulang' THEN p.keterangan END) as keterangan_pulang,
        MAX(CASE WHEN p.jenis = 'masuk' THEN p.latitude END) as latitude_masuk,
        MAX(CASE WHEN p.jenis = 'masuk' THEN p.longitude END) as longitude_masuk,
        MAX(CASE WHEN p.jenis = 'masuk' THEN p.device_info END) as device_info,
        MAX(CASE WHEN p.jenis = 'masuk' THEN p.photo_url END) as photo_url_masuk,
        MAX(CASE WHEN p.jenis = 'pulang' THEN p.photo_url END) as photo_url_pulang,
        -- Check apakah ada presensi pulang atau tidak
        SUM(CASE WHEN p.jenis = 'pulang' THEN 1 ELSE 0 END) as has_pulang
      FROM presensi p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.tanggal BETWEEN ? AND ?
    `;

    const params = [startDate, endDate];

    // Tambahkan filter user jika ada
    if (userId && userId !== 'all') {
      query += ' AND p.user_id = ?';
      params.push(userId);
    }

    query += `
      GROUP BY u.id, u.name, p.tanggal
      ORDER BY u.name, p.tanggal
    `;

    const [results] = await connection.execute(query, params);

    // Format hasil untuk frontend
    const formattedData = results.map(row => ({
      id: `${row.user_id}-${row.tanggal}`,
      user_id: row.user_id,
      nama: row.nama,
      tanggal: row.tanggal,
      jam_masuk: row.jam_masuk,
      jam_pulang: row.jam_pulang,
      keterangan_masuk: row.keterangan_masuk,
      keterangan_pulang: row.keterangan_pulang,
      has_pulang: row.has_pulang > 0, // Boolean: apakah ada presensi pulang
      latitude_masuk: row.latitude_masuk ? parseFloat(row.latitude_masuk) : null,
      longitude_masuk: row.longitude_masuk ? parseFloat(row.longitude_masuk) : null,
      device_info: row.device_info,
      photo_url_masuk: row.photo_url_masuk,
      photo_url_pulang: row.photo_url_pulang
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      meta: {
        month,
        total_records: formattedData.length
      }
    });

  } catch (error) {
    console.error('❌ API Rekap Presensi Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    // ✅ PENTING: Kembalikan connection ke pool
    if (connection) {
      connection.release();
    }
  }
}

// ✅ Optional: Disable caching untuk real-time data
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;