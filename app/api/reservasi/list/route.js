import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const search = searchParams.get("search") || ""
    const limit = 10
    const offset = (page - 1) * limit

    let whereClause = ""
    let values = [limit, offset]

    if (search) {
      whereClause = "WHERE nama LIKE ? OR orangtua LIKE ?"
      values = [`%${search}%`, `%${search}%`, limit, offset]
    }

    const [rows] = await pool.query(
      `
      SELECT SQL_CALC_FOUND_ROWS * 
      FROM reservasi 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
      `,
      values
    )

    const [[{ "FOUND_ROWS()": total }]] = await pool.query("SELECT FOUND_ROWS()")

    return NextResponse.json({
      data: rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error ambil data reservasi:", error)
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 })
  }
}
