// app/api/pembayaran/siswa/search/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';// Sesuaikan dengan config database Anda

/**
 * GET /api/pembayaran/siswa/search
 * Autocomplete pencarian nama siswa
 * Query params: q (query search)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q || q.length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Minimal 2 karakter untuk pencarian'
      }, { status: 400 });
    }

    const query = `
      SELECT 
        bs.id as siswa_id,
        bs.nama_lengkap,
        bs.nik
      FROM biodata_siswa bs
      WHERE bs.nama_lengkap LIKE ?
      ORDER BY bs.nama_lengkap
      LIMIT 10
    `;

    const [results] = await pool.execute(query, [`%${q}%`]);

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Error searching siswa:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mencari data siswa',
      error: error.message
    }, { status: 500 });
  }
}