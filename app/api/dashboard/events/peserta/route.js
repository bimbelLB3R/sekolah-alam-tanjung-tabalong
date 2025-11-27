import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function POST(req) {
  const { guru_pj, jabatan, asal_sekolah, kontak_pj, siswa } = await req.json()
  const id = uuidv4()

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // Simpan data guru/PJ
    await conn.query(
      "INSERT INTO peserta_events_fpt (id, guru_pj, jabatan, asal_sekolah, kontak_pj) VALUES (?, ?, ?, ?, ?)",
      [id, guru_pj, jabatan, asal_sekolah, kontak_pj]
    )

    // Simpan data siswa
    for (const nama of siswa) {
      if (nama.trim() !== "") {
        await conn.query(
          "INSERT INTO peserta_event_students (id, peserta_event_id, nama_siswa) VALUES (?, ?, ?)",
          [uuidv4(), id, nama]
        )
      }
    }

    await conn.commit()
    return NextResponse.json({ message: "Peserta berhasil disimpan" })
  } catch (err) {
    // await conn.rollback()
    return NextResponse.json({ error: err.message }, { status: 500 })
  } finally {
    conn.release()
  }
}


export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id AS peserta_id,
        p.guru_pj,
        p.jabatan,
        p.asal_sekolah,
        p.kontak_pj,
        s.id AS siswa_id,
        s.nama_siswa
      FROM peserta_events_fpt p
      LEFT JOIN peserta_event_students s 
        ON p.id = s.peserta_event_id
      ORDER BY p.created_at DESC, s.id ASC
    `);

    // Kelompokkan siswa berdasarkan peserta
    const pesertaMap = new Map();

    rows.forEach((row) => {
      if (!pesertaMap.has(row.peserta_id)) {
        pesertaMap.set(row.peserta_id, {
          id: row.peserta_id,
          guru_pj: row.guru_pj,
          jabatan: row.jabatan,
          asal_sekolah: row.asal_sekolah,
          kontak_pj: row.kontak_pj,
          siswa: [],
        });
      }

      if (row.siswa_id) {
        pesertaMap.get(row.peserta_id).siswa.push({
          id: row.siswa_id,
          nama_siswa: row.nama_siswa,
        });
      }
    });

    const result = Array.from(pesertaMap.values());

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saat fetch peserta:", error);
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data peserta" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; // ambil id dari URL params

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