import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Hitung jumlah ijin semua karyawan bulan lalu
export async function GET(request) {
  try {
    // Query utama: hitung total berbagai jenis ijin untuk SEMUA karyawan
    const [countResult] = await pool.execute(
      `SELECT 
        COUNT(*) AS total_ijin,
        COUNT(CASE WHEN jenis_ijin = 'keluar' THEN 1 END) AS total_ijin_keluar,
        COUNT(CASE WHEN jenis_ijin = 'tidak_masuk' THEN 1 END) AS total_ijin_tidak_masuk,
        COUNT(CASE WHEN jenis_ijin = 'keluar' AND dipotong_tunjangan = true THEN 1 END) AS total_ijin_keluar_dipotong,
        COUNT(CASE WHEN dipotong_tunjangan = true THEN 1 END) AS total_ijin_dipotong
      FROM ijin_karyawan
      WHERE tanggal_ijin >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        AND tanggal_ijin < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')`
    );

    // Ambil daftar detail ijin bulan lalu dengan info user
    const [detailIjin] = await pool.execute(
      `SELECT 
        ik.id,
        ik.user_id,
        u.name AS nama_karyawan,
        u.email,
        ik.jenis_ijin,
        ik.tanggal_ijin,
        ik.jam_keluar,
        ik.jam_kembali,
        ik.alasan_ijin,
        ik.dipotong_tunjangan,
        ik.created_at
      FROM ijin_karyawan ik
      LEFT JOIN users u ON ik.user_id = u.id
      WHERE ik.tanggal_ijin >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        AND ik.tanggal_ijin < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      ORDER BY ik.tanggal_ijin DESC, u.name ASC`
    );

    // Rekap per karyawan
    const [rekapPerKaryawan] = await pool.execute(
      `SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(*) AS total_ijin,
        COUNT(CASE WHEN ik.jenis_ijin = 'keluar' THEN 1 END) AS total_ijin_keluar,
        COUNT(CASE WHEN ik.jenis_ijin = 'tidak_masuk' THEN 1 END) AS total_ijin_tidak_masuk,
        COUNT(CASE WHEN ik.jenis_ijin = 'keluar' AND ik.dipotong_tunjangan = true THEN 1 END) AS total_ijin_keluar_dipotong,
        COUNT(CASE WHEN ik.dipotong_tunjangan = true THEN 1 END) AS total_ijin_dipotong
      FROM ijin_karyawan ik
      LEFT JOIN users u ON ik.user_id = u.id
      WHERE ik.tanggal_ijin >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        AND ik.tanggal_ijin < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      GROUP BY u.id, u.name, u.email
      ORDER BY u.name ASC`
    );

    // Hitung bulan lalu untuk periode
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const periode = lastMonth.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          periode: periode,
          summary: {
            total_ijin: countResult[0].total_ijin,
            total_ijin_keluar: countResult[0].total_ijin_keluar,
            total_ijin_tidak_masuk: countResult[0].total_ijin_tidak_masuk,
            total_ijin_keluar_dipotong: countResult[0].total_ijin_keluar_dipotong,
            total_ijin_dipotong: countResult[0].total_ijin_dipotong,
          },
          rekap_per_karyawan: rekapPerKaryawan,
          detail_ijin: detailIjin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching ijin count:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server.',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}