// // app/api/presensi/summary/route.js
// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('user_id');
//     const bulan = searchParams.get('bulan'); // format: YYYY-MM
//     const tahun = searchParams.get('tahun'); // format: YYYY
    
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: "user_id required" },
//         { status: 400 }
//       );
//     }

//     let dateFilter = "";
//     const params = [userId];

//     if (bulan && tahun) {
//       // Filter by bulan dan tahun spesifik (YYYY-MM)
//       dateFilter = "AND DATE_FORMAT(tanggal, '%Y-%m') = ?";
//       params.push(`${tahun}-${bulan}`);
//     } else if (tahun) {
//       // Filter by tahun saja
//       dateFilter = "AND YEAR(tanggal) = ?";
//       params.push(tahun);
//     } else {
//       // Default: bulan dan tahun saat ini
//       dateFilter = "AND MONTH(tanggal) = MONTH(CURRENT_DATE()) AND YEAR(tanggal) = YEAR(CURRENT_DATE())";
//     }

//     const [rows] = await pool.query(
//       `SELECT 
//         COUNT(CASE WHEN jenis = 'masuk' AND keterangan = 'tepat waktu' THEN 1 END) as jumlah_tepat_waktu,
//         COUNT(CASE WHEN jenis = 'masuk' AND keterangan = 'terlambat' THEN 1 END) as jumlah_terlambat,
//         COUNT(CASE WHEN jenis = 'masuk' THEN 1 END) as total_hadir,
//         COUNT(CASE WHEN jenis = 'pulang' THEN 1 END) as total_pulang
//        FROM presensi 
//        WHERE user_id = ? ${dateFilter}`,
//       params
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


// tanpa params

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

    // Query untuk ambil data presensi bulan dan tahun saat ini
    const [rows] = await pool.query(
      `SELECT 
        COUNT(CASE WHEN jenis = 'masuk' AND keterangan = 'tepat waktu' THEN 1 END) as jumlah_tepat_waktu,
        COUNT(CASE WHEN jenis = 'masuk' AND keterangan = 'terlambat' THEN 1 END) as jumlah_terlambat,
        COUNT(CASE WHEN jenis = 'masuk' THEN 1 END) as total_hadir,
        COUNT(CASE WHEN jenis = 'pulang' THEN 1 END) as total_pulang
       FROM presensi 
       WHERE user_id = ? 
       AND MONTH(tanggal) = MONTH(CURRENT_DATE()) 
       AND YEAR(tanggal) = YEAR(CURRENT_DATE())`,
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