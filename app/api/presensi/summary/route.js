
// // tanpa params

// // app/api/presensi/summary/route.js
// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('user_id');
    
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: "user_id required" },
//         { status: 400 }
//       );
//     }

//     // Query untuk ambil data presensi bulan dan tahun saat ini
//     const [rows] = await pool.query(
//       `SELECT 
//         COUNT(CASE WHEN jenis = 'masuk' AND keterangan = 'tepat waktu' THEN 1 END) as jumlah_tepat_waktu,
//         COUNT(CASE WHEN jenis = 'masuk' AND keterangan = 'terlambat' THEN 1 END) as jumlah_terlambat,
//         COUNT(CASE WHEN jenis = 'masuk' THEN 1 END) as total_hadir,
//         COUNT(CASE WHEN jenis = 'pulang' THEN 1 END) as total_pulang
//        FROM presensi 
//        WHERE user_id = ? 
//        AND MONTH(tanggal) = MONTH(CURRENT_DATE()) 
//        AND YEAR(tanggal) = YEAR(CURRENT_DATE())`,
//       [userId]
//     );

//     const summary = rows[0] || {
//       jumlah_tepat_waktu: 0,
//       jumlah_terlambat: 0,
//       total_hadir: 0,
//       total_pulang: 0
//     };

//     return NextResponse.json({
//       success: true,
//       ...summary
//     });

//   } catch (error) {
//     console.error("Error getting presensi summary:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// ambil data bulan lalu
// app/api/presensi/summary/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "user_id required" },
        { status: 400 }
      );
    }

    // Query untuk ambil data presensi 1 bulan sebelumnya
    const [rows] = await pool.query(
      `SELECT 
        COUNT(CASE WHEN jenis = 'masuk' AND keterangan = 'tepat waktu' THEN 1 END) as jumlah_tepat_waktu,
        COUNT(CASE WHEN jenis = 'masuk' AND keterangan = 'terlambat' THEN 1 END) as jumlah_terlambat,
        COUNT(CASE WHEN jenis = 'masuk' THEN 1 END) as total_hadir,
        COUNT(CASE WHEN jenis = 'pulang' THEN 1 END) as total_pulang
       FROM presensi 
       WHERE user_id = ? 
       AND tanggal >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
       AND tanggal < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')`,
      [userId]
    );

    const summary = rows[0] || {
      jumlah_tepat_waktu: 0,
      jumlah_terlambat: 0,
      total_hadir: 0,
      total_pulang: 0
    };

    return NextResponse.json({
      success: true,
      ...summary
    });

  } catch (error) {
    console.error("Error getting presensi summary:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}