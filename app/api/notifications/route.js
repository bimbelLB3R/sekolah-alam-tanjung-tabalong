// // app/api/notifications/route.js
// import { NextResponse } from "next/server";
// import pool from "@/lib/db"; // Sesuaikan dengan import Anda
// import { getUserFromCookie } from "@/lib/getUserFromCookie";

// // GET - Ambil semua notifikasi user
// export async function GET(request) {
//   try {
//     const user = await getUserFromCookie();
    
//     if (!user) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const [notifications] = await pool.query(
//       `SELECT 
//         n.*,
//         i.jenis_ijin,
//         i.tanggal_ijin,
//         i.jam_keluar,
//         i.jam_kembali,
//         i.dipotong_tunjangan,
//         u.name as nama_pengaju
//       FROM notifikasi n
//       LEFT JOIN ijin_karyawan i ON n.ijin_id = i.id
//       LEFT JOIN users u ON i.user_id = u.id
//       WHERE n.user_id = ?
//       ORDER BY n.created_at DESC
//       LIMIT 50`,
//       [user.id]
//     );

//     // Hitung unread count
//     const [countResult] = await pool.query(
//       `SELECT COUNT(*) as unread_count 
//        FROM notifikasi 
//        WHERE user_id = ? AND is_read = FALSE`,
//       [user.id]
//     );

//     return NextResponse.json({
//       notifications,
//       unread_count: countResult[0].unread_count,
//     });
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch notifications" },
//       { status: 500 }
//     );
//   }
// }

// Optimasi query
// app/api/notifications/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export async function GET() {
  try {
    const user = await getUserFromCookie();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /**
     * ✅ 1. Ambil notifikasi + unread_count dalam SATU QUERY
     * ✅ 2. Pakai subquery agar tetap index-friendly
     * ✅ 3. Tetap LIMIT 50
     */
    const [rows] = await pool.query(
      `
      SELECT 
        n.*,
        i.jenis_ijin,
        i.tanggal_ijin,
        i.jam_keluar,
        i.jam_kembali,
        i.dipotong_tunjangan,
        u.name AS nama_pengaju,
        (
          SELECT COUNT(*) 
          FROM notifikasi 
          WHERE user_id = ? AND is_read = 0
        ) AS unread_count
      FROM notifikasi n
      LEFT JOIN ijin_karyawan i ON n.ijin_id = i.id
      LEFT JOIN users u ON i.user_id = u.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
      `,
      [user.id, user.id]
    );

    return NextResponse.json({
      notifications: rows,
      unread_count: rows[0]?.unread_count ?? 0,
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
