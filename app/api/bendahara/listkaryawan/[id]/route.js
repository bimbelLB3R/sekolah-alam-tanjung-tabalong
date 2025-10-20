import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const {id} = await params;
  try {
    const [rows] = await pool.query(
      `SELECT gk.*, u.name 
       FROM gaji_karyawan gk
       JOIN users u ON u.id = gk.user_id
       WHERE gk.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
