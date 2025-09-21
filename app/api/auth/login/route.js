import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email dan password wajib diisi" }), { status: 400 })
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
    const user = rows[0]

    if (!user) {
      return new Response(JSON.stringify({ error: "User tidak ditemukan" }), { status: 401 })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return new Response(JSON.stringify({ error: "Password salah" }), { status: 401 })
    }

    // Buat token pakai jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({ id: user.id, role_id: user.role_id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret)

    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    })

    return new Response(
      JSON.stringify({
        message: "Login berhasil",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role_id: user.role_id,
        },
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return new Response(JSON.stringify({ error: "Terjadi kesalahan" }), { status: 500 })
  }
}
