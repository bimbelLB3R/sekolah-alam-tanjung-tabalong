// app/api/presensi/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT  p.id,
    DATE_FORMAT(p.tanggal, '%Y-%m-%d') AS tanggal,
    p.jam,
    p.jenis,
    u.name AS nama,
    p.photo_url
FROM presensi p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;
    `);
//     const [rows] = await pool.query(`
//       SELECT  p.id,
//     p.tanggal,
//     p.jam,
//     p.jenis,
//     u.name AS nama,
//     p.photo_url
// FROM presensi p
// JOIN users u ON p.user_id = u.id
// WHERE p.tanggal = CURDATE()
// ORDER BY p.created_at DESC;
//     `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetch presensi:", error);
    return NextResponse.json({ error: "Gagal fetch presensi" }, { status: 500 });
  }
}
