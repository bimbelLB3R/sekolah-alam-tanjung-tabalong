// app/api/pendaftaran/[id]/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to extract S3 key from URL
function extractS3Key(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    // Remove leading slash
    return urlObj.pathname.substring(1);
  } catch {
    // If URL parsing fails, try to extract filename
    return url.split("/").slice(-2).join("/"); // Get last 2 parts (folder/filename)
  }
}

// PATCH - Update file URLs setelah upload berhasil
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    // Cek apakah pendaftaran exists
    const [rows] = await pool.query(
      "SELECT id FROM biodata_siswa WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Data pendaftaran tidak ditemukan"
      }, { status: 404 });
    }

    const query = `
      UPDATE biodata_siswa 
      SET 
        buktiBayar = ?,
        fotoAnak = ?,
        fotoKia = ?,
        kkPdf = ?,
        status_upload = 'completed'
      WHERE id = ?
    `;

    const values = [
      body.files?.buktiBayar || null,
      body.files?.fotoAnak || null,
      body.files?.fotoKia || null,
      body.files?.kkPdf || null,
      id
    ];

    await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: "File berhasil diupdate"
    });

  } catch (error) {
    console.error("Error update data:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// DELETE - Hapus pendaftaran dan file dari S3
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Ambil data file URLs sebelum dihapus
    const [rows] = await pool.query(
      "SELECT buktiBayar, fotoAnak, fotoKia, kkPdf FROM biodata_siswa WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Data tidak ditemukan"
      }, { status: 404 });
    }

    const fileData = rows[0];

    // Hapus dari database dulu
    await pool.query("DELETE FROM biodata_siswa WHERE id = ?", [id]);

    // Hapus file dari S3 (async, tidak perlu wait)
    const deletePromises = [];
    for (const [key, url] of Object.entries(fileData)) {
      if (url) {
        try {
          const s3Key = extractS3Key(url);
          if (s3Key) {
            deletePromises.push(
              s3.send(
                new DeleteObjectCommand({
                  Bucket: process.env.AWS_S3_BUCKET,
                  Key: s3Key,
                })
              ).catch(err => {
                console.error(`Gagal hapus file ${key} dari S3:`, err);
              })
            );
          }
        } catch (err) {
          console.error(`Error processing ${key}:`, err);
        }
      }
    }

    // Jalankan delete S3 secara parallel
    await Promise.allSettled(deletePromises);

    return NextResponse.json({
      success: true,
      message: "Data dan file berhasil dihapus"
    });

  } catch (error) {
    console.error("Error delete data:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// GET - Ambil data pendaftaran by ID (bonus untuk debugging)
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const [rows] = await pool.query(
      "SELECT * FROM biodata_siswa WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Data tidak ditemukan"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error("Error get data:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}