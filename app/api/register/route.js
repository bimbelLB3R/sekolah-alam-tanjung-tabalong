import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

// koneksi ke Aurora


export async function POST(req) {
  try {
    const { name, email, password, role_id } = await req.json();

    if (!name || !email || !password || !role_id) {
      return new Response(JSON.stringify({ error: "Lengkapi semua field" }), { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role_id]
    );

    return new Response(JSON.stringify({ message: "User berhasil didaftarkan", userId: result.insertId }), { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan" }), { status: 500 });
  }
}
