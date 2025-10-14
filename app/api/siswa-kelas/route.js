import pool from "@/lib/db";
import { NextResponse } from "next/server";

// 📌 POST - assign beberapa siswa ke satu kelas
export async function POST(req) {
  try {
    const { kelas_id, siswa_ids } = await req.json();

    if (!kelas_id || !siswa_ids || !Array.isArray(siswa_ids) || siswa_ids.length === 0) {
      return NextResponse.json(
        { error: "Kelas dan minimal 1 siswa harus dipilih." },
        { status: 400 }
      );
    }

    // Buat tahun ajaran otomatis (misalnya tahun berjalan)
    const now = new Date();
    const tahunAjaran = `${now.getFullYear()}/${now.getFullYear() + 1}`;

    // Buat satu query untuk banyak siswa (batch insert)
    const values = siswa_ids.map((id) => [id, kelas_id, tahunAjaran]);
    const sql = `
      INSERT INTO siswa_kelas (id, siswa_id, kelas_id, tahun_ajaran)
      VALUES ${values.map(() => "(UUID(), ?, ?, ?)").join(", ")}
    `;

    await pool.query(sql, values.flat());

    return NextResponse.json({
      message: "Siswa berhasil dimasukkan ke kelas",
      count: siswa_ids.length,
    });
  } catch (error) {
    console.error("Error assign siswa ke kelas:", error);
    return NextResponse.json({ error: "Gagal assign siswa ke kelas" }, { status: 500 });
  }
}

// 📌 GET - ambil semua data relasi siswa & kelas
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const kelasId = searchParams.get("kelas_id");

  let query = `
    SELECT sk.siswa_id, k.id as kelas_id, sk.id as siswa_kelas_id,
           s.nama_lengkap, k.kelas_lengkap, sk.tahun_ajaran, sk.aktif
    FROM siswa_kelas sk
    JOIN biodata_siswa s ON sk.siswa_id = s.id
    JOIN nama_kelas k ON sk.kelas_id = k.id
  `;

  let values = [];

  if (kelasId) {
    query += ` WHERE sk.kelas_id = ? AND sk.aktif = TRUE`;
    values.push(kelasId);
  }

  query += ` ORDER BY k.kelas_lengkap, s.nama_lengkap`;

  const [rows] = await pool.query(query, values);
  return Response.json(rows);
}


// 📌 DELETE - hapus siswa dari kelas
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID relasi diperlukan" }, { status: 400 });
    }

    await pool.query(`DELETE FROM siswa_kelas WHERE id = ?`, [id]);
    return NextResponse.json({ message: "Data relasi siswa kelas berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus siswa kelas:", error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}

// Pindah kelas beberapa siswa
export async function PUT(req) {
  try {
    const { siswa_ids, kelas_id_baru, tahun_ajaran } = await req.json();

    if (!siswa_ids || siswa_ids.length === 0 || !kelas_id_baru || !tahun_ajaran) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Nonaktifkan kelas lama sekaligus
    await pool.query(
      `UPDATE siswa_kelas SET aktif = false WHERE siswa_id IN (${siswa_ids.map(() => "?").join(",")}) AND aktif = true`,
      siswa_ids
    );

    // 2. Insert kelas baru sekaligus
    const values = siswa_ids.map(() => "(UUID(), ?, ?, ?, true)").join(", ");
    const params = siswa_ids.flatMap((id) => [id, kelas_id_baru, tahun_ajaran]);
    await pool.query(
      `INSERT INTO siswa_kelas (id, siswa_id, kelas_id, tahun_ajaran, aktif) VALUES ${values}`,
      params
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error pindah kelas:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

