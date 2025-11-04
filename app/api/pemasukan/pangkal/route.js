


import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const siswaKelasId = searchParams.get('siswaKelasId');
    const search = searchParams.get('search') || '';

    let whereConditions = ["ps.jenis_pembayaran COLLATE utf8mb4_unicode_ci = 'Uang Pangkal'"];
    let queryParams = [];

    if (startDate && endDate) {
      whereConditions.push('ps.tgl_bayar BETWEEN ? AND ?');
      queryParams.push(startDate, endDate);
    }

    if (siswaKelasId) {
      whereConditions.push('sk.kelas_id COLLATE utf8mb4_unicode_ci = ?');
      queryParams.push(siswaKelasId);
    }

    if (search) {
      whereConditions.push('(bs.nama_lengkap COLLATE utf8mb4_unicode_ci LIKE ? OR bs.nik COLLATE utf8mb4_unicode_ci LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // === QUERY UTAMA ===
    const dataQuery = `
      SELECT 
        ps.id,
        ps.siswa_id,
        ps.siswa_kelas_id,
        ps.tahun_ajaran,
        ps.jenis_pembayaran,
        ps.jml_bayar,
        ps.tgl_bayar,
        ps.cara_bayar,
        ps.penerima,
        ps.keterangan,
        ps.created_at,
        bs.nama_lengkap,
        bs.nik,
        bs.jenjang,
        nk.kelas_lengkap
      FROM pembayaran_siswa ps
      INNER JOIN biodata_siswa bs 
        ON ps.siswa_id COLLATE utf8mb4_unicode_ci = bs.id
      LEFT JOIN siswa_kelas sk 
        ON ps.siswa_kelas_id COLLATE utf8mb4_unicode_ci = sk.id
      LEFT JOIN nama_kelas nk 
        ON sk.kelas_id COLLATE utf8mb4_unicode_ci = nk.id
      ${whereClause}
      ORDER BY ps.tgl_bayar DESC, ps.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await pool.execute(dataQuery, queryParams);

    // === TOTAL DATA ===
    const countQuery = `
      SELECT COUNT(*) as total
      FROM pembayaran_siswa ps
      INNER JOIN biodata_siswa bs 
        ON ps.siswa_id COLLATE utf8mb4_unicode_ci = bs.id
      LEFT JOIN siswa_kelas sk 
        ON ps.siswa_kelas_id COLLATE utf8mb4_unicode_ci = sk.id
      LEFT JOIN nama_kelas nk 
        ON sk.kelas_id COLLATE utf8mb4_unicode_ci = nk.id
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, queryParams);
    const totalRecords = countResult[0].total;

    // === TOTAL PEMBAYARAN ===
    const sumQuery = `
      SELECT SUM(ps.jml_bayar) as total_pembayaran
      FROM pembayaran_siswa ps
      INNER JOIN biodata_siswa bs 
        ON ps.siswa_id COLLATE utf8mb4_unicode_ci = bs.id
      LEFT JOIN siswa_kelas sk 
        ON ps.siswa_kelas_id COLLATE utf8mb4_unicode_ci = sk.id
      LEFT JOIN nama_kelas nk 
        ON sk.kelas_id COLLATE utf8mb4_unicode_ci = nk.id
      ${whereClause}
    `;
    const [sumResult] = await pool.execute(sumQuery, queryParams);
    const totalPembayaran = sumResult[0].total_pembayaran || 0;

    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      summary: {
        totalPembayaran: parseFloat(totalPembayaran)
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: 'Gagal mengambil data pembayaran Uang Pangkal',
      details: error.message
    }, { status: 500 });
  }
}
