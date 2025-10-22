// app/api/ijin-karyawan/[id]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';



// GET single record by ID
export async function GET(request, { params }) {
 

  try {
    const { id } =await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID tidak valid' },
        { status: 400 }
      );
    }

    

    const [rows] = await pool.execute(
      `SELECT 
        ik.id,
        ik.user_id,
        u.name as nama_karyawan,
        u.email as email_karyawan,
        ik.jenis_ijin,
        ik.tanggal_ijin,
        ik.jam_keluar,
        ik.jam_kembali,
        ik.alasan_ijin,
        ik.pemberi_ijin_id,
        p.name as nama_pemberi_ijin,
        ik.dipotong_tunjangan,
        ik.created_at,
        ik.updated_at
      FROM ijin_karyawan ik
      INNER JOIN users u ON ik.user_id = u.id
      INNER JOIN users p ON ik.pemberi_ijin_id = p.id
      WHERE ik.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: rows[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching ijin:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    console.log("yes")
  }
}

// PATCH - Update status dipotong_tunjangan
export async function PATCH(request, { params }) {
 

  try {
    const { id } =await params;
    const body = await request.json();
    const { dipotong_tunjangan } = body;

    // Validasi ID
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID tidak valid' },
        { status: 400 }
      );
    }

    // Validasi input
    if (typeof dipotong_tunjangan !== 'boolean') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Status dipotong_tunjangan harus berupa boolean (true/false)' 
        },
        { status: 400 }
      );
    }

 

    // Cek apakah data exists
    const [checkData] = await pool.execute(
      'SELECT id FROM ijin_karyawan WHERE id = ?',
      [id]
    );

    if (checkData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Data ijin tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update status dipotong_tunjangan
    await pool.execute(
      'UPDATE ijin_karyawan SET dipotong_tunjangan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [dipotong_tunjangan, id]
    );

    // Ambil data yang sudah diupdate
    const [updatedData] = await pool.execute(
      `SELECT 
        ik.id,
        ik.user_id,
        u.name as nama_karyawan,
        u.email as email_karyawan,
        ik.jenis_ijin,
        ik.tanggal_ijin,
        ik.jam_keluar,
        ik.jam_kembali,
        ik.alasan_ijin,
        ik.pemberi_ijin_id,
        p.name as nama_pemberi_ijin,
        ik.dipotong_tunjangan,
        ik.created_at,
        ik.updated_at
      FROM ijin_karyawan ik
      INNER JOIN users u ON ik.user_id = u.id
      INNER JOIN users p ON ik.pemberi_ijin_id = p.id
      WHERE ik.id = ?`,
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Status pemotongan tunjangan berhasil diupdate',
        data: updatedData[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating ijin:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    console.log("yes")
  }
}

// DELETE - Hapus data ijin (opsional)
export async function DELETE(request, { params }) {
 

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID tidak valid' },
        { status: 400 }
      );
    }


    // Cek apakah data exists
    const [checkData] = await pool.execute(
      'SELECT id FROM ijin_karyawan WHERE id = ?',
      [id]
    );

    if (checkData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Data ijin tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete data
    await pool.execute(
      'DELETE FROM ijin_karyawan WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Data ijin berhasil dihapus'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting ijin:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    console.log("yes")
  }
}