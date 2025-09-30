// app/api/peserta-tahfidz/[id]/route.js
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // ambil info peserta
    const [pesertaRows] = await pool.execute(
      "SELECT created_at,nama_siswa, nama_rombel FROM peserta_tahfidz WHERE id = ? ORDER BY created_at ASC",
      [id]
    );

    if (pesertaRows.length === 0) {
      return new Response(JSON.stringify({ error: "Peserta tidak ditemukan" }), { status: 404 });
    }

    const siswa = pesertaRows[0];

    // ambil perkembangan peserta
    const [perkembanganRows] = await pool.execute(
      "SELECT peserta_id, DATE_FORMAT(pt.tanggal, '%Y-%m-%d') AS tanggal, surah, ayat, catatan FROM perkembangan_tahfidz pt WHERE peserta_id = ? ORDER BY tanggal DESC",
      [id]
    );

    return new Response(
      JSON.stringify({
        siswa,
        perkembangan: perkembanganRows,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch detail" }), { status: 500 });
  }
}
