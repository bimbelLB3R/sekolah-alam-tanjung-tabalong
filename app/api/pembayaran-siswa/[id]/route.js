// app/api/pembayaran-siswa/[id]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/pembayaran-siswa/[id]
 * Mendapatkan semua pembayaran siswa berdasarkan siswa_id
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const query = `
      SELECT 
        p.*,
        nk.kelas_lengkap
      FROM pembayaran_siswa p
      LEFT JOIN siswa_kelas sk ON p.siswa_kelas_id = sk.id
      LEFT JOIN nama_kelas nk ON sk.kelas_id = nk.id
      WHERE p.siswa_id = ?
      ORDER BY p.tgl_bayar DESC, p.created_at DESC
    `;

    const [results] = await pool.execute(query, [id]);

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length
    });

  } catch (error) {
    console.error('Error getting pembayaran siswa:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pembayaran',
      error: error.message,
      data: []
    }, { status: 500 });
  }
}