import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 })
    }

    // JOIN tabel users dan roles untuk ambil role name
    const [rows] = await pool.query(
      `SELECT u.id, u.name AS user_name, u.email, u.password, r.id AS role_id, r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    )

    const user = rows[0]

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 401 })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    // Payload JWT berisi role_name
    const token = await new SignJWT({
      id: user.id,
      name: user.user_name,
      role_id: user.role_id,
      role_name: user.role_name, // <-- ini yang baru
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret)

    const res = NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.user_name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
      },
    })

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    })

    return res
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
