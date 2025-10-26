// app/api/pembayaran/[id]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/pembayaran/[id]
 * Mendapatkan detail pembayaran berdasarkan ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const query = `
      SELECT 
        p.*,
        bs.nama_lengkap,
        bs.nik,
        bs.jenis_kelamin,
        nk.kelas_lengkap,
        nk.jenjang
      FROM pembayaran_siswa p
      INNER JOIN biodata_siswa bs ON p.siswa_id = bs.id
      INNER JOIN siswa_kelas sk ON p.siswa_kelas_id = sk.id
      INNER JOIN nama_kelas nk ON sk.kelas_id = nk.id
      WHERE p.id = ?
    `;

    const [results] = await pool.execute(query, [id]);

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Data pembayaran tidak ditemukan'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: results[0]
    });

  } catch (error) {
    console.error('Error getting pembayaran detail:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil detail pembayaran',
      error: error.message
    }, { status: 500 });
  }
}

/**
 * PUT /api/pembayaran/[id]
 * Update pembayaran
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      jenis_pembayaran,
      jml_bayar,
      tgl_bayar,
      cara_bayar,
      penerima,
      keterangan
    } = body;

    // Validasi input
    if (!jenis_pembayaran || !jml_bayar || !tgl_bayar || !cara_bayar || !penerima) {
      return NextResponse.json({
        success: false,
        message: 'Semua field wajib diisi kecuali keterangan'
      }, { status: 400 });
    }

    const query = `
      UPDATE pembayaran_siswa 
      SET jenis_pembayaran = ?, jml_bayar = ?, tgl_bayar = ?, 
          cara_bayar = ?, penerima = ?, keterangan = ?
      WHERE id = ?
    `;

    const [result] = await pool.execute(query, [
      jenis_pembayaran,
      jml_bayar,
      tgl_bayar,
      cara_bayar,
      penerima,
      keterangan || null,
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        message: 'Data pembayaran tidak ditemukan'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil diupdate'
    });

  } catch (error) {
    console.error('Error updating pembayaran:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate pembayaran',
      error: error.message
    }, { status: 500 });
  }
}

/**
 * DELETE /api/pembayaran/[id]
 * Hapus pembayaran
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const query = 'DELETE FROM pembayaran_siswa WHERE id = ?';
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        message: 'Data pembayaran tidak ditemukan'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting pembayaran:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus pembayaran',
      error: error.message
    }, { status: 500 });
  }
}