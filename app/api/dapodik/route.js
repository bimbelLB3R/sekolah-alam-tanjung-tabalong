// app/api/dapodik/route.js
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jenjang = searchParams.get("jenjang");
    const kelas = searchParams.get("kelas");

    let query = `
      SELECT DISTINCT
        bs.*,
        nk.kelas_lengkap,
        nk.jenjang as jenjang_kelas,
        nk.kelas as tingkat_kelas
      FROM biodata_siswa bs
      LEFT JOIN siswa_kelas sk ON bs.id = sk.siswa_id AND sk.aktif = 1
      LEFT JOIN nama_kelas nk ON sk.kelas_id = nk.id
      WHERE 1=1
    `;
    
    const params = [];

    if (jenjang && jenjang !== "all") {
      query += ` AND (bs.jenjang = ? OR nk.jenjang = ?)`;
      params.push(jenjang, jenjang);
    }

    if (kelas && kelas !== "all") {
      query += ` AND nk.kelas = ?`;
      params.push(kelas);
    }

    query += ` ORDER BY bs.created_at DESC`;

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const [checkData] = await pool.query(
      "SELECT id FROM biodata_siswa WHERE id = ?",
      [id]
    );

    if (checkData.length === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    await pool.query("DELETE FROM biodata_siswa WHERE id = ?", [id]);

    return NextResponse.json(
      { message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}