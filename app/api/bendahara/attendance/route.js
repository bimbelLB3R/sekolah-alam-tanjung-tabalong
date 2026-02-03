import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Ambil data kehadiran (presensi masuk) bulan lalu
export async function GET(request) {
  try {
    // Ambil data presensi masuk bulan lalu dengan keterangan kehadiran
    const [attendanceData] = await pool.execute(
      `SELECT 
        id,
        user_id,
        tanggal,
        jam,
        jenis,
        keterangan as status,
        latitude,
        longitude,
        created_at
      FROM presensi
      WHERE jenis = 'masuk'
        AND tanggal >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        AND tanggal < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      ORDER BY tanggal DESC, user_id ASC`
    );

    return NextResponse.json(attendanceData, { status: 200 });
  } catch (error) {
    console.error('Error fetching attendance data:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}