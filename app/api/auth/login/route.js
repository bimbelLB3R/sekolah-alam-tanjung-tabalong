// import bcrypt from "bcryptjs"
// import { SignJWT } from "jose"
// import { NextResponse } from "next/server"
// import pool from "@/lib/db"

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json()

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 })
//     }

//     // JOIN tabel users dan roles untuk ambil role name
//     const [rows] = await pool.query(
//       `SELECT u.id, u.name AS user_name, u.email, u.password, r.id AS role_id, r.name AS role_name
//        FROM users u
//        JOIN roles r ON u.role_id = r.id
//        WHERE u.email = ?`,
//       [email]
//     )

//     const user = rows[0]

//     if (!user) {
//       return NextResponse.json({ error: "User tidak ditemukan" }, { status: 401 })
//     }

//     const validPassword = await bcrypt.compare(password, user.password)
//     if (!validPassword) {
//       return NextResponse.json({ error: "Password salah" }, { status: 401 })
//     }

//     const secret = new TextEncoder().encode(process.env.JWT_SECRET)

//     // Payload JWT berisi role_name
//     const token = await new SignJWT({
//       id: user.id,
//       name: user.user_name,
//       role_id: user.role_id,
//       role_name: user.role_name, // <-- ini yang baru
//     })
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime("6h")
//       .sign(secret)

//     const res = NextResponse.json({
//       message: "Login berhasil",
//       user: {
//         id: user.id,
//         name: user.user_name,
//         email: user.email,
//         role_id: user.role_id,
//         role_name: user.role_name,
//       },
//     })

//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//       maxAge: 60 * 60 * 6 , //enam jam kadaluarsa
//     })

//     return res
//   } catch (error) {
//     console.error("Login error:", error)
//     return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
//   }
// }

// Optimasi Login route
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // ✅ GUNAKAN execute (lebih stabil & cepat)
    const [rows] = await pool.execute(
      `SELECT 
         u.id, 
         u.name AS user_name, 
         u.email, 
         u.password, 
         r.id AS role_id, 
         r.name AS role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?
       LIMIT 1`,
      [email]
    );

    // ✅ VALIDASI USER
    if (!rows.length) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // ✅ VALIDASI PASSWORD
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    // ✅ VALIDASI ENV JWT
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET belum diset!");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // ✅ JWT PAYLOAD TETAP SAMA (TIDAK BERUBAH)
    const token = await new SignJWT({
      id: user.id,
      name: user.user_name,
      role_id: user.role_id,
      role_name: user.role_name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("6h")
      .sign(secret);

    // ✅ RESPONSE TETAP SAMA
    const res = NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.user_name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
      },
    });

    // ✅ COOKIE LEBIH AMAN
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",        // ✅ anti CSRF dasar
      path: "/",
      maxAge: 60 * 60 * 6,    // 6 jam
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
