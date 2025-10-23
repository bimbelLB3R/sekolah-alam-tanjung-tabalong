// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
// import { NextResponse } from "next/server"
// import { randomUUID } from "crypto"

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// })

// export async function POST(req) {
//   try {
//     const formData = await req.formData()
//     const file = formData.get("file")

//     if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)
//     const fileName = `${randomUUID()}-${file.name}`

//     await s3.send(
//       new PutObjectCommand({
//         Bucket: process.env.AWS_S3_BUCKET,
//         Key: fileName,
//         Body: buffer,
//         ContentType: file.type,
//       })
//     )

//     const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
//     return NextResponse.json({ url })
//   } catch (e) {
//     console.error(e)
//     return NextResponse.json({ error: "Upload gagal" }, { status: 500 })
//   }
// }


// app/api/pendaftaran/upload/route.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import pool from "@/lib/db";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Validasi tipe file
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const pendaftaranId = formData.get("pendaftaranId");

    // Validasi file
    if (!file) {
      return NextResponse.json({ 
        error: "File tidak ditemukan" 
      }, { status: 400 });
    }

    // Validasi pendaftaran ID
    if (!pendaftaranId) {
      return NextResponse.json({ 
        error: "ID Pendaftaran tidak ditemukan" 
      }, { status: 400 });
    }

    // Cek apakah pendaftaran ID valid
    const [rows] = await pool.query(
      "SELECT id FROM biodata_siswa WHERE id = ?",
      [pendaftaranId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ 
        error: "Pendaftaran tidak ditemukan" 
      }, { status: 404 });
    }

    // Validasi tipe file
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: "Tipe file tidak diizinkan. Gunakan JPG, JPEG, atau PNG" 
      }, { status: 400 });
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: "Ukuran file maksimal 5MB" 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate nama file dengan ID pendaftaran
    const fileExt = file.name.split(".").pop();
    const fileName = `pendaftaran-${pendaftaranId}/${randomUUID()}.${fileExt}`;

    // Upload ke S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      url 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Upload gagal: " + error.message 
    }, { status: 500 });
  }
}