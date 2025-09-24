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
  try {
    const formData = await req.formData();
    const file = formData.get("photo");
    const userId = formData.get("user_id");
    const type = formData.get("type"); // MASUK / KELUAR
    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");
    const device = formData.get("device");

    // ambil dari frontend
    const tanggal = formData.get("tanggal"); // YYYY-MM-DD
    const jam = formData.get("jam");         // HH:MM:SS

    // Upload ke S3
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
      })
    );

    const photoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Simpan ke DB
    await pool.query(
      `INSERT INTO presensi 
       (user_id, tanggal, jam, jenis, latitude, longitude, device_info, photo_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, tanggal, jam, type, latitude, longitude, device, photoUrl]
    );

    return NextResponse.json({ success: true, photoUrl });
  } catch (err) {
    console.error("Presensi error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
