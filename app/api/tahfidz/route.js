// app/api/tahfidz/route.js
import pool from "@/lib/db";

export async function GET() {
  try {
    

    const [rows] = await pool.execute(
      "SELECT id,created_at, nama_siswa, nama_rombel,pembimbing FROM peserta_tahfidz ORDER BY created_at DESC"
    );

    // await pool.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}

// POST
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama_siswa, nama_rombel, pembimbing } = body;

    if (!nama_siswa || !nama_rombel || !pembimbing) {
      return new Response(
        JSON.stringify({ error: "Semua field wajib diisi" }),
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
  `INSERT INTO peserta_tahfidz (id, nama_siswa, nama_rombel, pembimbing) 
   VALUES (UUID(), ?, ?, ?)`,
  [nama_siswa, nama_rombel, pembimbing]
);

   // result.insertId biasanya kosong kalau pakai UUID()
    // maka ambil data berdasarkan kombinasi field unik (atau ambil UUID dari DB)
    // Di sini kita asumsikan nama_siswa + pembimbing + nama_rombel unik
    const [rows] = await pool.query(
      `SELECT * FROM peserta_tahfidz 
       WHERE nama_siswa = ? AND nama_rombel = ? AND pembimbing = ? 
       ORDER BY created_at DESC LIMIT 1`,
      [nama_siswa, nama_rombel, pembimbing]
    );

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Gagal mengambil data baru" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error: "Gagal menambahkan peserta" }), {
      status: 500,
    });
  }
}





