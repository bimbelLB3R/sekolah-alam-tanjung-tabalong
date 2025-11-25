// app/api/biodata/route.js
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM biodata_siswa ORDER BY created_at DESC`
    );

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

    // Cek apakah data ada
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

    // Hapus data
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