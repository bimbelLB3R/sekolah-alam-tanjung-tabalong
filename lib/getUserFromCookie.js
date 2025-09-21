import { jwtVerify } from "jose";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
   waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function getUserFromCookie(cookies) {
  const token = cookies.get("token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Ambil data user dari database
    const [rows] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [
      payload.id,
    ]);

    return rows[0] || null;
  } catch (err) {
    console.error("JWT error:", err);
    return null;
  }
}
