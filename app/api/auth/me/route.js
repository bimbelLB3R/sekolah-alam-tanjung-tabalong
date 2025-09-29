import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import pool from "@/lib/db"

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    // ambil data user + role dari DB
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [payload.id]
    )

    if (!rows[0]) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user: rows[0] })
  } catch (err) {
    console.error("Auth me error:", err)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
