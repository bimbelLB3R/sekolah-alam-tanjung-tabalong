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

    return new Response(
      JSON.stringify({ message: "Peserta berhasil ditambahkan", id: result.insertId }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error: "Gagal menambahkan peserta" }), {
      status: 500,
    });
  }
}





