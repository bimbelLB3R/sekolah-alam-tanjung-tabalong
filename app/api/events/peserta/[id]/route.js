import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req, { params }) {
  const { id } =await params; // ambil id dari URL params

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Hapus siswa dulu (foreign key)
    await conn.query("DELETE FROM peserta_event_students WHERE peserta_event_id = ?", [id]);

    // Hapus peserta/guru
    const [result] = await conn.query("DELETE FROM peserta_events_fpt WHERE id = ?", [id]);

    await conn.commit();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Peserta tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Peserta berhasil dihapus" });
  } catch (err) {
    // await conn.rollback();
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    conn.release();
  }
}
