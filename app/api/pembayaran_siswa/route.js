

// app/api/pembayaran_siswa/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tahun_ajaran = decodeURIComponent(searchParams.get('tahun_ajaran') || '');
    const siswa_id = searchParams.get('siswa_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort_by = searchParams.get('sort_by') || 'tgl_bayar';
    const sort_order = searchParams.get('sort_order') || 'DESC';
    console.log(tahun_ajaran)
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    // Tambahkan filter hanya jika bukan "Semua"
    if (tahun_ajaran && tahun_ajaran !== '-' && tahun_ajaran.toLowerCase() !== 'semua') {
  whereConditions.push('p.tahun_ajaran');
  params.push(tahun_ajaran);
}

    if (siswa_id) {
      whereConditions.push('p.siswa_id = ?');
      params.push(siswa_id);
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // === Query 1: hitung total ===
    const countQuery = `
      SELECT COUNT(*) as total
      FROM pembayaran_siswa p
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    // === Query 2: ambil data ===
    const dataQuery = `
  SELECT 
    p.*,
    bs.nama_lengkap,
    bs.nik,
    nk.kelas_lengkap,
    nk.jenjang
  FROM pembayaran_siswa p
  INNER JOIN biodata_siswa bs ON p.siswa_id = bs.id
  INNER JOIN siswa_kelas sk ON p.siswa_kelas_id = sk.id
  INNER JOIN nama_kelas nk ON sk.kelas_id = nk.id
  ${whereClause}
  ORDER BY p.${sort_by} ${sort_order}
  LIMIT ${limit} OFFSET ${offset}
`;

    // Gunakan salinan params agar tidak menambah LIMIT/OFFSET ke countQuery
    const dataParams = [...params, limit, offset];

    // console.log('QUERY:', dataQuery);
    // console.log('PARAMS:', dataParams);

    const [results] = await pool.execute(dataQuery, dataParams);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting pembayaran:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data pembayaran',
      error: error.message
    }, { status: 500 });
  }
}

/**
 * POST /api/pembayaran
 * Membuat pembayaran baru
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      siswa_id,
      siswa_kelas_id,
      tahun_ajaran,
      jenis_pembayaran,
      jml_bayar,
      tgl_bayar,
      cara_bayar,
      penerima,
      keterangan
    } = body;

    // Validasi input
    if (!siswa_id || !siswa_kelas_id || !tahun_ajaran || !jenis_pembayaran || 
        !jml_bayar || !tgl_bayar || !cara_bayar || !penerima) {
      return NextResponse.json({
        success: false,
        message: 'Semua field wajib diisi kecuali keterangan'
      }, { status: 400 });
    }

    // Validasi cara_bayar
    if (!['cash', 'transfer'].includes(cara_bayar)) {
      return NextResponse.json({
        success: false,
        message: 'Cara bayar harus cash atau transfer'
      }, { status: 400 });
    }

    const query = `
      INSERT INTO pembayaran_siswa 
      (siswa_id, siswa_kelas_id, tahun_ajaran, jenis_pembayaran, jml_bayar, 
       tgl_bayar, cara_bayar, penerima, keterangan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      siswa_id,
      siswa_kelas_id,
      tahun_ajaran,
      jenis_pembayaran,
      jml_bayar,
      tgl_bayar,
      cara_bayar,
      penerima,
      keterangan || null
    ]);

    // Ambil data lengkap pembayaran yang baru dibuat
    const [newPayment] = await pool.execute(`
      SELECT 
        p.*,
        bs.nama_lengkap,
        nk.kelas_lengkap
      FROM pembayaran_siswa p
      INNER JOIN biodata_siswa bs ON p.siswa_id = bs.id
      INNER JOIN siswa_kelas sk ON p.siswa_kelas_id = sk.id
      INNER JOIN nama_kelas nk ON sk.kelas_id = nk.id
      WHERE p.id = ?
    `, [result.insertId]);

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil disimpan',
      data: newPayment[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating pembayaran:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat menyimpan pembayaran',
      error: error.message
    }, { status: 500 });
  }
}