import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { token, password } = await req.json();

  // cari token
  const [rows] = await pool.query("SELECT * FROM password_reset_token WHERE token = ?", [token]);
  if (rows.length === 0) {
    return new Response(JSON.stringify({ message: "Token tidak valid" }), { status: 400 });
  }

  const reset = rows[0];
  if (new Date(reset.expired_at) < new Date()) {
    return new Response(JSON.stringify({ message: "Token kadaluarsa" }), { status: 400 });
  }

  // update password
  const hashed = await bcrypt.hash(password, 10);
  await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashed, reset.user_id]);

  // hapus token
  await pool.query("DELETE FROM password_reset_token WHERE token = ?", [token]);

  return Response.json({ message: "Password berhasil direset" });
}
