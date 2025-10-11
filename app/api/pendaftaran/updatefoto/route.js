import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import pool from "@/lib/db"; // koneksi MySQL kamu

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
    const file = formData.get("file");
    const id = formData.get("id");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const bucket = process.env.AWS_S3_BUCKET;
    const key = fileName;

    // === Upload ke S3 ===
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const newUrl = `https://${bucket}.s3.ap-southeast-1.amazonaws.com/${key}`;

    // === Ambil foto lama untuk dihapus (opsional) ===
    const [rows] = await pool.query("SELECT fotoAnak FROM biodata_siswa WHERE id = ?", [id]);
    const oldUrl = rows[0]?.fotoAnak;
    if (oldUrl) {
      const oldKey = oldUrl.split("/").pop();
      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: oldKey,
        })
      );
    }

    // === Update URL baru di database ===
    await pool.query("UPDATE biodata_siswa SET fotoAnak = ? WHERE id = ?", [newUrl, id]);

    return Response.json({ success: true, url: newUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
