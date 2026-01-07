// app/api/presensi/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    // const today=new Date().toLocaleDateString("en-CA");
    const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Makassar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

    console.log(today)
    const [rows] = await pool.query(`
      SELECT  
        p.id,
        DATE_FORMAT(p.tanggal, '%Y-%m-%d') AS tanggal,
        p.jam,
        p.jenis,
        p.keterangan,
        u.name AS nama,
        p.photo_url
      FROM presensi p FORCE INDEX (idx_presensi_created_user)
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.tanggal = ?
      ORDER BY p.created_at DESC;
    `,[today]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetch presensi:", error);
    return NextResponse.json(
      { error: "Gagal fetch presensi" },
      { status: 500 }
    );
  }
}
