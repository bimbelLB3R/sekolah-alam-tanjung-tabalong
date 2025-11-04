// app/api/kelas-list/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aktifOnly = searchParams.get('aktifOnly') === 'true'; // Optional: filter only active classes
    const tahunAjaran = searchParams.get('tahunAjaran'); // Optional: filter by specific tahun ajaran

    let whereConditions = [];
    let queryParams = [];

    if (aktifOnly) {
      whereConditions.push('sk.aktif = 1');
    }

    if (tahunAjaran) {
      whereConditions.push('sk.tahun_ajaran = ?');
      queryParams.push(tahunAjaran);
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    const query = `
      SELECT 
        nk.id,
        nk.kelas,
        nk.jenjang,
        nk.rombel,
        nk.wali_kelas,
        nk.kelas_lengkap,
        nk.created_at as kelas_created_at,
        GROUP_CONCAT(DISTINCT sk.tahun_ajaran ORDER BY sk.tahun_ajaran DESC SEPARATOR ', ') as tahun_ajaran_list,
        COUNT(DISTINCT sk.siswa_id) as jumlah_siswa,
        MAX(sk.tahun_ajaran) as tahun_ajaran_terbaru
      FROM nama_kelas nk
      LEFT JOIN siswa_kelas sk ON nk.id COLLATE utf8mb4_unicode_ci = sk.kelas_id COLLATE utf8mb4_unicode_ci
      ${whereClause}
      GROUP BY nk.id, nk.kelas, nk.jenjang, nk.rombel, nk.wali_kelas, nk.kelas_lengkap, nk.created_at
      ORDER BY 
        FIELD(nk.jenjang, 'KB', 'TK', 'SD', 'SMP', 'SMA'),
        nk.kelas ASC,
        nk.rombel ASC
    `;

    const [rows] = await pool.execute(query, queryParams);

    // Format response dengan informasi lengkap
    const formattedData = rows.map(row => ({
      id: row.id,
      kelas: row.kelas,
      jenjang: row.jenjang,
      rombel: row.rombel,
      waliKelas: row.wali_kelas,
      kelasLengkap: row.kelas_lengkap,
      // Untuk kompatibilitas dengan komponen yang ada
      nama_kelas: row.kelas_lengkap,
      // Tahun ajaran terbaru sebagai default
      tahun_ajaran: row.tahun_ajaran_terbaru || '-',
      // List semua tahun ajaran yang pernah ada
      tahunAjaranList: row.tahun_ajaran_list || '-',
      jumlahSiswa: row.jumlah_siswa || 0,
      createdAt: row.kelas_created_at
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      total: formattedData.length
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: 'Gagal mengambil data kelas',
      details: error.message
    }, { status: 500 });
  }
}