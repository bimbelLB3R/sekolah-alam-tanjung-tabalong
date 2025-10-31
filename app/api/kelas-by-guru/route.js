import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Ambil kelas berdasarkan guru_id
export async function GET(request) {
//   let connection;
  try {
    const { searchParams } = new URL(request.url);
    const guruId = searchParams.get("guru_id");

    if (!guruId) {
      return NextResponse.json(
        { success: false, error: "Parameter guru_id diperlukan" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    // Cek apakah guru ini adalah wali kelas
    const [kelasWali] = await pool.query(
      `SELECT 
        nk.id,
        nk.kelas_lengkap,
        nk.wali_kelas,
        u.name as wali_kelas_nama
      FROM nama_kelas nk
      LEFT JOIN users u ON nk.wali_kelas = u.id
      WHERE nk.wali_kelas = ?`,
      [guruId]
    );

    if (kelasWali.length > 0) {
      // Guru adalah wali kelas
      return NextResponse.json({
        is_wali_kelas: true,
        kelas: kelasWali,
      }, { status: 200 });
    }

    // Guru bukan wali kelas, ambil semua kelas
    const [allKelas] = await pool.query(
      `SELECT 
        nk.id,
        nk.kelas_lengkap,
        nk.wali_kelas,
        u.name as wali_kelas_nama
      FROM nama_kelas nk
      LEFT JOIN users u ON nk.wali_kelas = u.id
      ORDER BY nk.kelas_lengkap ASC`
    );

    return NextResponse.json({
      is_wali_kelas: false,
      kelas: allKelas,
    }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/kelas-by-guru:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    // if (connection) connection.release();
    console.log("yes")
  }
}