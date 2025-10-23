// app/api/pendaftaran/[id]/pdf/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } =await params;

    const [rows] = await pool.query(
      "SELECT * FROM biodata_siswa WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Data pendaftaran tidak ditemukan"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error("Error get data:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}