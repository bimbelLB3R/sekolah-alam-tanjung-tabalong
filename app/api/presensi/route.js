// app/api/presensi/route.js
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pool from "@/lib/db";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  let connection;

  try {
    const formData = await req.formData();
    const file = formData.get("photo");
    const userId = formData.get("user_id");
    const jenis = formData.get("jenis"); // masuk / pulang
    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");
    const device = formData.get("device");
    const tanggal = formData.get("tanggal"); // YYYY-MM-DD
    const jam = formData.get("jam"); // HH:MM:SS
    const gpsValidated = formData.get("gps_validated") === "true";

    // Validasi input
    if (!file || !userId || !jenis || !tanggal || !jam) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Get connection from pool
    connection = await pool.getConnection();

    // === VALIDASI 1: Cek apakah sudah presensi hari ini ===
    const [existingPresensi] = await connection.query(
      `SELECT jenis FROM presensi 
       WHERE user_id = ? AND tanggal = ? AND jenis = ?`,
      [userId, tanggal, jenis]
    );

    if (existingPresensi.length > 0) {
      connection.release();
      return NextResponse.json(
        {
          success: false,
          error: `Anda sudah melakukan absen ${jenis} hari ini`,
        },
        { status: 400 }
      );
    }

    // === VALIDASI 2: Jika absen pulang, harus sudah absen masuk ===
    if (jenis === "pulang") {
      const [checkMasuk] = await connection.query(
        `SELECT id FROM presensi 
         WHERE user_id = ? AND tanggal = ? AND jenis = 'masuk'`,
        [userId, tanggal]
      );

      if (checkMasuk.length === 0) {
        connection.release();
        return NextResponse.json(
          {
            success: false,
            error: "Anda harus absen masuk terlebih dahulu",
          },
          { status: 400 }
        );
      }
    }

    // === AMBIL ROLE USER ===
    const [roleRows] = await connection.query(
      `SELECT r.name AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?
       LIMIT 1`,
      [userId]
    );

    const role = roleRows[0]?.role;

    // === AMBIL JAM BATAS DARI DATABASE (bukan hardcode) ===
    const [settingRows] = await connection.query(
      `SELECT setting_value FROM system_settings 
       WHERE setting_key = 'jam_batas_masuk' 
       LIMIT 1`
    );

    // Fallback ke "07:15:00" jika belum ada pengaturan di DB
    const jamBatas = settingRows[0]?.setting_value ?? "07:15:00";

    // === HITUNG KETERANGAN (hanya untuk jenis 'masuk') ===
    let keterangan = null;

    if (jenis === "masuk") {
      // Role yang bebas jam (tidak terikat jam batas)
      const roleBebasJam = ["staff", "superadmin"];

      if (roleBebasJam.includes(role)) {
        keterangan = "tepat waktu";
      } else if (jam > jamBatas) {
        keterangan = "terlambat";
      } else {
        keterangan = "tepat waktu";
      }
    }

    // === UPLOAD KE S3 (hanya jika validasi lolos) ===
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `presensi/${userId}/${tanggal}/${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
      })
    );

    const photoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // === SIMPAN KE DATABASE ===
    await connection.query(
      `INSERT INTO presensi
        (user_id, tanggal, jam, jenis, keterangan, latitude, longitude, device_info, photo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, tanggal, jam, jenis, keterangan, latitude, longitude, device, photoUrl]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      photoUrl,
      keterangan: keterangan || "N/A",
      message:
        keterangan === "terlambat"
          ? "Presensi berhasil, namun Anda terlambat"
          : "Presensi berhasil!",
    });
  } catch (err) {
    console.error("Presensi error:", err);

    if (connection) connection.release();

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
