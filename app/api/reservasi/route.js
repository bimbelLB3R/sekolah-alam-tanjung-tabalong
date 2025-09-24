import { NextResponse } from "next/server"
import pool from "@/lib/db"
export async function POST(req) {
  try {
    const body = await req.json()
    const { nama, orangtua, telepon, email, tanggal } = body

    const query = `
      INSERT INTO reservasi (id, nama, orangtua, telepon, email, tanggal) 
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `
    await pool.query(query, [nama, orangtua, telepon, email, tanggal])

    return NextResponse.json({ success: true, message: "Reservasi berhasil disimpan" })
  } catch (error) {
    console.error("Error simpan reservasi:", error)
    return NextResponse.json({ success: false, message: "Gagal simpan data" }, { status: 500 })
  }
}
