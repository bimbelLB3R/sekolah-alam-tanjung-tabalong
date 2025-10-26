// app/api/pembayaran/siswa/kelas-aktif/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/pembayaran/siswa/kelas-aktif?siswa_id=xxx
 * Mendapatkan kelas aktif siswa berdasarkan siswa_id
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const siswaId = searchParams.get('siswa_id');

    if (!siswaId) {
      return NextResponse.json({
        success: false,
        message: 'siswa_id diperlukan'
      }, { status: 400 });
    }

    const query = `
      SELECT 
        sk.id as siswa_kelas_id,
        sk.siswa_id,
        sk.kelas_id,
        sk.tahun_ajaran,
        nk.kelas_lengkap,
        nk.jenjang,
        bs.nama_lengkap,
        bs.jenjang
      FROM siswa_kelas sk
      INNER JOIN nama_kelas nk ON sk.kelas_id = nk.id
      INNER JOIN biodata_siswa bs ON sk.siswa_id = bs.id
      WHERE sk.siswa_id = ? AND sk.aktif = 1
      LIMIT 1
    `;

    const [results] = await pool.execute(query, [siswaId]);

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Kelas aktif tidak ditemukan untuk siswa ini'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: results[0]
    });

  } catch (error) {
    console.error('Error getting kelas aktif:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kelas',
      error: error.message
    }, { status: 500 });
  }
}