// app/api/peserta-tahfidz/[id]/route.js
import pool from "@/lib/db";

// ✅ GET Detail Peserta + Perkembangan
export async function GET(req, { params }) {
  const { id } =await params; //id peserta_tahfidz

  try {
    const [pesertaRows] = await pool.execute(
      "SELECT created_at, nama_siswa, nama_rombel FROM peserta_tilawati WHERE id = ?",
      [id]
    );

    if (pesertaRows.length === 0) {
      return new Response(JSON.stringify({ error: "Peserta tidak ditemukan" }), { status: 404 });
    }

    const siswa = pesertaRows[0];

    const [perkembanganRows] = await pool.execute(
      "SELECT id, peserta_id, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, jilid, halaman, catatan FROM perkembangan_tilawati WHERE peserta_id = ? ORDER BY tanggal DESC",
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
    const { tanggal, jilid, halaman, catatan,nama_pembimbing } = body;

    await pool.execute(
      "UPDATE perkembangan_tilawati SET tanggal = ?, jilid = ?, halaman = ?, catatan = ?,nama_pembimbing=? WHERE id = ?",
      [tanggal, jilid, halaman, catatan,nama_pembimbing, id]
    );

    const [rows] = await pool.execute(
      "SELECT id, peserta_id, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, jilid, halaman, catatan FROM perkembangan_tilawati WHERE id = ?",
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
      "DELETE FROM perkembangan_tilawati WHERE id = ? AND peserta_id = ?",
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
    const { tanggal, jilid, halaman, catatan,nama_pembimbing } = body;

    const [result] = await pool.execute(
      "INSERT INTO perkembangan_tilawati (peserta_id, tanggal, jilid, halaman, catatan,nama_pembimbing) VALUES (?, ?, ?, ?, ?,?)",
      [id, tanggal, jilid, halaman, catatan,nama_pembimbing]
    );

    // ambil kembali data yang baru ditambah biar strukturnya sama seperti GET
    const [rows] = await pool.execute(
      "SELECT id, peserta_id, DATE_FORMAT(tanggal, '%Y-%m-%d') AS tanggal, jilid, halaman, catatan FROM perkembangan_tilawati WHERE id = ?",
      [result.insertId] //id dari data yang baru saja dikirim, otomatis dikasih dr mysql
    );

    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("DB error POST:", error);
    return Response.json({ error: "Failed to insert data" }, { status: 500 });
  }
}
