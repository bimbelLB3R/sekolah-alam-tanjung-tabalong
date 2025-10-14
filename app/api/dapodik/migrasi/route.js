// app/api/dapodik/route.js
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id, 
        s.nama_lengkap, 
        nk.kelas_lengkap
      FROM biodata_siswa s
      LEFT JOIN siswa_kelas sk ON sk.siswa_id = s.id AND sk.aktif = 1
      LEFT JOIN nama_kelas nk ON nk.id = sk.kelas_id
    `);

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal mengambil data siswa" }, { status: 500 });
  }
}
