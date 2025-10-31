// app/api/jurnal/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
// import mysql from 'mysql2/promise';

// Konfigurasi koneksi database
// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
// };

// Fungsi untuk membuat koneksi
// async function getConnection() {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     return connection;
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// }

// GET - Ambil semua data jurnal
export async function GET(request) {
//   let connection;
  try {
    // connection = await getConnection();
    
    const { searchParams } = new URL(request.url);
    const jenis = searchParams.get('jenis');
    const search = searchParams.get('search');
    
    let query = 'SELECT * FROM jurnal_harian WHERE 1=1';
    const params = [];
    
    if (jenis && jenis !== 'SEMUA') {
      query += ' AND jenis_transaksi = ?';
      params.push(jenis);
    }
    
    if (search) {
      query += ' AND (deskripsi LIKE ? OR kode_transaksi LIKE ? OR kategori LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY tanggal DESC, created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    
    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    // if (connection) await connection.end();
    console.log("yes")
  }
}

// POST - Tambah data jurnal baru
export async function POST(request) {
//   let connection;
  try {
    const body = await request.json();
    const { tanggal, kode_transaksi, deskripsi, kategori, jenis_transaksi, jumlah, keterangan } = body;
    
    // Validasi
    if (!tanggal || !kode_transaksi || !deskripsi || !jenis_transaksi || !jumlah) {
      return NextResponse.json({
        success: false,
        error: 'Data tidak lengkap'
      }, { status: 400 });
    }
    
    // connection = await getConnection();
    
    // Hitung saldo
    const [saldoResult] = await pool.execute(
      'SELECT SUM(CASE WHEN jenis_transaksi = "MASUK" THEN jumlah ELSE -jumlah END) as saldo FROM jurnal_harian'
    );
    
    const saldoSebelumnya = saldoResult[0].saldo || 0;
    const saldoBaru = jenis_transaksi === 'MASUK' 
      ? saldoSebelumnya + parseFloat(jumlah)
      : saldoSebelumnya - parseFloat(jumlah);
    
    const query = `
      INSERT INTO jurnal_harian 
      (tanggal, kode_transaksi, deskripsi, kategori, jenis_transaksi, jumlah, saldo, keterangan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      tanggal,
      kode_transaksi,
      deskripsi,
      kategori || null,
      jenis_transaksi,
      jumlah,
      saldoBaru,
      keterangan || null
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        ...body,
        saldo: saldoBaru
      }
    }, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    
    // Handle duplicate key error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({
        success: false,
        error: 'Kode transaksi sudah digunakan'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    // if (connection) await connection.end();
    console.log("yes")
  }
}

// PUT - Update data jurnal
export async function PUT(request) {
//   let connection;
  try {
    const body = await request.json();
    const { id, tanggal, kode_transaksi, deskripsi, kategori, jenis_transaksi, jumlah, keterangan } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID tidak ditemukan'
      }, { status: 400 });
    }
    
    // connection = await getConnection();
    
    const query = `
      UPDATE jurnal_harian 
      SET tanggal = ?, kode_transaksi = ?, deskripsi = ?, kategori = ?, 
          jenis_transaksi = ?, jumlah = ?, keterangan = ?
      WHERE id = ?
    `;
    
    const [result] = await pool.execute(query, [
      tanggal,
      kode_transaksi,
      deskripsi,
      kategori || null,
      jenis_transaksi,
      jumlah,
      keterangan || null,
      id
    ]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: 'Data tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: body
    });
  } catch (error) {
    console.error('PUT Error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({
        success: false,
        error: 'Kode transaksi sudah digunakan'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    // if (connection) await connection.end();
    console.log("yes")
  }
}

// DELETE - Hapus data jurnal
export async function DELETE(request) {
//   let connection;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID tidak ditemukan'
      }, { status: 400 });
    }
    
    // connection = await getConnection();
    
    const [result] = await pool.execute(
      'DELETE FROM jurnal_harian WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: 'Data tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Data berhasil dihapus'
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    // if (connection) await connection.end();
    console.log("yes")
  }
}