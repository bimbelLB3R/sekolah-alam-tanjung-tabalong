// app/api/peserta-tahfidz/route.js
import pool from "@/lib/db";

export async function GET() {
  try {
    

    const [rows] = await pool.execute(
      "SELECT id,created_at, nama_siswa, nama_rombel FROM peserta_tahfidz ORDER BY created_at DESC"
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



