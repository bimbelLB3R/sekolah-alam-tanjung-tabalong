// import { jwtVerify } from "jose";
// import pool from "./db";
// import { cookies } from "next/headers"

// export async function getUserFromCookie() {
//   const cookieStore =await cookies()
//   const token = cookieStore.get("token")?.value

//   if (!token) return null;

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret);

//     // Ambil data user dari database
//     const [rows] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [
//       payload.id,
//     ]);

//     return rows[0] || null;
//   } catch (err) {
//     console.error("JWT error:", err);
//     return null;
//   }
// }


import { jwtVerify } from "jose";
import pool from "./db";
import { cookies } from "next/headers";

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Ambil data user dari database (termasuk role)
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name as role_name 
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [payload.id]
    );

    return rows[0] || null;
  } catch (err) {
    console.error("JWT error:", err);
    return null;
  }
}