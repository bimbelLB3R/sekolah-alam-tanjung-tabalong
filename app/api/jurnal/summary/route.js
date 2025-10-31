// app/api/jurnal/summary/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
// import mysql from 'mysql2/promise';

// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
// };

// async function getConnection() {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     return connection;
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// }

export async function GET(request) {
//   let connection;
  try {
    // connection = await getConnection();
    
    const query = `
      SELECT 
        SUM(CASE WHEN jenis_transaksi = 'MASUK' THEN jumlah ELSE 0 END) as total_masuk,
        SUM(CASE WHEN jenis_transaksi = 'KELUAR' THEN jumlah ELSE 0 END) as total_keluar,
        SUM(CASE WHEN jenis_transaksi = 'MASUK' THEN jumlah ELSE -jumlah END) as saldo_akhir
      FROM jurnal_harian
    `;
    
    const [rows] = await pool.execute(query);
    
    return NextResponse.json({
      success: true,
      data: {
        totalMasuk: parseFloat(rows[0].total_masuk) || 0,
        totalKeluar: parseFloat(rows[0].total_keluar) || 0,
        saldo: parseFloat(rows[0].saldo_akhir) || 0
      }
    });
  } catch (error) {
    console.error('Summary Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    // if (connection) await connection.end();
    console.log("yes")
  }
}