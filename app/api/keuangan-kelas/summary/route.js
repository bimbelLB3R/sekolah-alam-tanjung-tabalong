import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  let connection;
  try {
    connection = await pool.getConnection();

    const query = `
      SELECT 
        kelas_lengkap,
        wali_kelas,
        COUNT(*) as total_transaksi,
        COALESCE(SUM(kas_masuk), 0) as total_masuk,
        COALESCE(SUM(kas_keluar), 0) as total_keluar,
        (COALESCE(SUM(kas_masuk), 0) - COALESCE(SUM(kas_keluar), 0)) as saldo
      FROM keuangan_kelas
      GROUP BY kelas_lengkap, wali_kelas
      ORDER BY kelas_lengkap ASC
    `;

    const [rows] = await connection.query(query);

    return NextResponse.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/keuangan-kelas/summary:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}