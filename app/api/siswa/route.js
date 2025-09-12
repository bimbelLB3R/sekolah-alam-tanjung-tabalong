import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const kelas = searchParams.get("kelas");   // misal: "kelas-1"
  const rombel = searchParams.get("rombel"); // misal: "rombel-a"

  try {
    let sql = "SELECT * FROM pendaftaran_siswa";
    const params = [];

    if (kelas && rombel) {
      sql += " WHERE kelas = ? AND rombel = ?";
      params.push(kelas, rombel);
    }

    const [rows] = await pool.query(sql, params);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Gagal ambil data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
