// app/api/users/list/route.js
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

async function verifyToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

// GET - List all users untuk dropdown
export async function GET(req) {
  try {
    const user = await verifyToken()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.name ASC`
    )

    return NextResponse.json({ data: rows })

  } catch (error) {
    console.error("GET users list error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}