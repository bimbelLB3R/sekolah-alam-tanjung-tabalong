// app/api/settings/jam-batas/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/settings/jam-batas
 * Mengambil pengaturan jam batas dari database
 */
export async function GET() {
  let connection;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT setting_value FROM system_settings 
       WHERE setting_key = 'jam_batas_masuk' 
       LIMIT 1`
    );

    // Default fallback jika belum ada di DB
    const jamBatas = rows[0]?.setting_value ?? "07:15:00";

    return NextResponse.json({ success: true, jamBatas });
  } catch (err) {
    console.error("GET jam-batas error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

/**
 * POST /api/settings/jam-batas
 * Menyimpan pengaturan jam batas ke database
 * Body: { jamBatas: "HH:MM:SS", userId: number }
 */
export async function POST(req) {
  let connection;

  try {
    const body = await req.json();
    const { jamBatas, userId } = body;

    // Validasi format jam (HH:MM atau HH:MM:SS)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    if (!jamBatas || !timeRegex.test(jamBatas)) {
      return NextResponse.json(
        { success: false, error: "Format jam tidak valid. Gunakan format HH:MM atau HH:MM:SS" },
        { status: 400 }
      );
    }

    // Normalisasi ke HH:MM:SS
    const jamBatasNormalized = jamBatas.length === 5 ? `${jamBatas}:00` : jamBatas;

    connection = await pool.getConnection();

    // Upsert: update jika ada, insert jika belum ada
    // updated_at dihandle otomatis oleh ON UPDATE CURRENT_TIMESTAMP
    await connection.query(
      `INSERT INTO system_settings (setting_key, setting_value, description, updated_by)
       VALUES ('jam_batas_masuk', ?, 'Jam batas maksimal presensi masuk tepat waktu', ?)
       ON DUPLICATE KEY UPDATE
         setting_value = VALUES(setting_value),
         updated_by    = VALUES(updated_by)`,
      [jamBatasNormalized, userId ?? null]
    );

    return NextResponse.json({
      success: true,
      jamBatas: jamBatasNormalized,
      message: "Jam batas berhasil diperbarui",
    });
  } catch (err) {
    console.error("POST jam-batas error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}