import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT bs.*
FROM biodata_siswa bs
WHERE bs.nama_lengkap NOT IN (SELECT nama_siswa FROM peserta_tahfidz) 
ORDER BY bs.nama_lengkap ASC;
    `);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data" }),
      { status: 500 }
    );
  }
}
