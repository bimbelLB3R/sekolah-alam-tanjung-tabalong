// app/api/peserta-tahfidz/[id]/route.js
import pool from "@/lib/db";

// ✅ GET Detail Peserta + Perkembangan
export async function GET(req, { params }) {
  const { id } =await params; //id peserta_tahfidz

  try {
    const [pesertaRows] = await pool.execute(
      "SELECT created_at, nama_siswa, nama_rombel FROM peserta_tahfidz WHERE id = ?",
      [id]
    );

    if (pesertaRows.length === 0) {
      return new Response(JSON.stringify({ error: "Peserta tidak ditemukan" }), { status: 404 });
    }

    const siswa = pesertaRows[0];

    const [perkembanganRows] = await pool.execute(
      "SELECT id, peserta_id, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, surah, ayat, catatan FROM perkembangan_tahfidz WHERE peserta_id = ? ORDER BY tanggal DESC",
      [id]
    );

    return Response.json({ siswa, perkembangan: perkembanganRows });
  } catch (error) {
    console.error("DB error GET:", error);
    return Response.json({ error: "Failed to fetch detail" }, { status: 500 });
  }
}

// ✅ PUT Update Perkembangan
export async function PUT(req, { params }) {
  try {
    const { id } =await  params; // ambil dari URL /api/tahfidz/[id]
    const body = await req.json();
    const { tanggal, surah, ayat, catatan } = body;

    await pool.execute(
      "UPDATE perkembangan_tahfidz SET tanggal = ?, surah = ?, ayat = ?, catatan = ? WHERE id = ?",
      [tanggal, surah, ayat, catatan, id]
    );

    const [rows] = await pool.execute(
      "SELECT id, peserta_id, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, surah, ayat, catatan FROM perkembangan_tahfidz WHERE id = ?",
      [id]
    );

    return Response.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("DB error PUT:", error);
    return Response.json({ error: "Failed to update data" }, { status: 500 });
  }
}

// ✅ DELETE Hapus Perkembangan
export async function DELETE(req, { params }) {
  try {
    const { id: pesertaId } =await  params;
    const body = await req.json();
    const { perkembanganId } = body;

    await pool.execute(
      "DELETE FROM perkembangan_tahfidz WHERE id = ? AND peserta_id = ?",
      [perkembanganId, pesertaId]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("DB error DELETE:", error);
    return Response.json({ error: "Failed to delete data" }, { status: 500 });
  }
}

// ✅ POST Tambah Perkembangan
export async function POST(req, { params }) {
  const { id } =await params;
  try {
    const body = await req.json();
    const { tanggal, surah, ayat, catatan } = body;

    const [result] = await pool.execute(
      "INSERT INTO perkembangan_tahfidz (peserta_id, tanggal, surah, ayat, catatan) VALUES (?, ?, ?, ?, ?)",
      [id, tanggal, surah, ayat, catatan]
    );

    // ambil kembali data yang baru ditambah biar strukturnya sama seperti GET
    const [rows] = await pool.execute(
      "SELECT id, peserta_id, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, surah, ayat, catatan FROM perkembangan_tahfidz WHERE id = ?",
      [result.insertId] //id dari data yang baru saja dikirim, otomatis dikasih dr mysql
    );

    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("DB error POST:", error);
    return Response.json({ error: "Failed to insert data" }, { status: 500 });
  }
}
