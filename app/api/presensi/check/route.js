// app/api/presensi/check/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET - Cek status presensi hari ini untuk user tertentu
export async function GET(request) {
//   let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const tanggal = searchParams.get('tanggal'); // format: YYYY-MM-DD
    
    if (!userId || !tanggal) {
      return NextResponse.json(
        { success: false, error: "user_id dan tanggal required" },
        { status: 400 }
      );
    }

    // connection = await mysql.createConnection(dbConfig);
    
    // Cek apakah user sudah absen masuk dan pulang hari ini
    const [rows] = await pool.execute(
      `SELECT jenis, jam, photo_url 
       FROM presensi 
       WHERE user_id = ? AND tanggal = ?
       ORDER BY jam ASC`,
      [userId, tanggal]
    );

    const sudahMasuk = rows.some(r => r.jenis === 'masuk');
    const sudahPulang = rows.some(r => r.jenis === 'pulang');

    // Detail presensi jika ada
    const masukData = rows.find(r => r.jenis === 'masuk');
    const pulangData = rows.find(r => r.jenis === 'pulang');

    return NextResponse.json({ 
      success: true,
      sudahMasuk,
      sudahPulang,
      masuk: masukData ? {
        jam: masukData.jam,
        photo_url: masukData.photo_url
      } : null,
      pulang: pulangData ? {
        jam: pulangData.jam,
        photo_url: pulangData.photo_url
      } : null
    });

  } catch (error) {
    console.error("Error checking presensi:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check presensi" },
      { status: 500 }
    );
  } finally {
    // if (connection) await connection.end();
    console.log("yes")
  }
}