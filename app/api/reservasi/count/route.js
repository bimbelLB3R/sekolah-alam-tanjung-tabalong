import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM reservasi")
    return NextResponse.json({ total: rows[0].total })
  } catch (err) {
    console.error("Error ambil jumlah reservasi:", err)
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 })
  }
}
