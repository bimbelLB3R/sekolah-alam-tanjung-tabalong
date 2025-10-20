import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT g.*, u.name 
      FROM gaji_karyawan g
      JOIN users u ON g.user_id = u.id
      ORDER BY g.created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      user_id,
      jabatan,
      departemen,
      gaji_pokok,
      tunjangan_bpjs,
      tunjangan_jabatan,
      tunjangan_makan,
      tunjangan_kehadiran,
      tunjangan_sembako,
      tunjangan_kepala_keluarga,
      potongan_makan,
      effective_date
    } = data;

    // Generate UUID untuk gaji_karyawan_id
    const gajiKaryawanId = randomUUID();

    // Insert ke tabel gaji_karyawan
    await pool.query(
      `INSERT INTO gaji_karyawan 
      (id, user_id, jabatan, departemen, gaji_pokok, tunjangan_bpjs, tunjangan_jabatan, tunjangan_makan, tunjangan_kehadiran, tunjangan_sembako, tunjangan_kepala_keluarga, potongan_makan, effective_date)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        gajiKaryawanId,
        user_id,
        jabatan,
        departemen,
        gaji_pokok,
        tunjangan_bpjs,
        tunjangan_jabatan,
        tunjangan_makan,
        tunjangan_kehadiran,
        tunjangan_sembako,
        tunjangan_kepala_keluarga,
        potongan_makan,
        effective_date
      ]
    );

    // Insert ke tabel histori
    await pool.query(
      `INSERT INTO gaji_karyawan_histori 
      (gaji_karyawan_id, gaji_pokok, tunjangan_bpjs, tunjangan_jabatan, tunjangan_makan, tunjangan_kehadiran, tunjangan_sembako, tunjangan_kepala_keluarga, potongan_makan, effective_date)
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        gajiKaryawanId,
        gaji_pokok,
        tunjangan_bpjs,
        tunjangan_jabatan,
        tunjangan_makan,
        tunjangan_kehadiran,
        tunjangan_sembako,
        tunjangan_kepala_keluarga,
        potongan_makan,
        effective_date
      ]
    );

    return NextResponse.json({ message: "Data gaji & histori berhasil dibuat", id: gajiKaryawanId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    const data = await req.json();
    const {
      id,
      jabatan,
      departemen,
      gaji_pokok,
      tunjangan_bpjs,
      tunjangan_jabatan,
      tunjangan_makan,
      tunjangan_kehadiran,
      tunjangan_sembako,
      tunjangan_kepala_keluarga,
      potongan_makan,
      effective_date
    } = data;

    // Pastikan ID ada
    if (!id) {
      return NextResponse.json({ error: "ID tidak boleh kosong" }, { status: 400 });
    }

    // Update data utama
    await pool.query(
      `UPDATE gaji_karyawan SET
        jabatan = ?,
        departemen = ?,
        gaji_pokok = ?,
        tunjangan_bpjs = ?,
        tunjangan_jabatan = ?,
        tunjangan_makan = ?,
        tunjangan_kehadiran = ?,
        tunjangan_sembako = ?,
        tunjangan_kepala_keluarga = ?,
        potongan_makan = ?,
        effective_date = ?
      WHERE id = ?`,
      [
        jabatan,
        departemen,
        gaji_pokok,
        tunjangan_bpjs,
        tunjangan_jabatan,
        tunjangan_makan,
        tunjangan_kehadiran,
        tunjangan_sembako,
        tunjangan_kepala_keluarga,
        potongan_makan,
        effective_date,
        id,
      ]
    );

    // Tambahkan histori perubahan
    await pool.query(
      `INSERT INTO gaji_karyawan_histori 
      (gaji_karyawan_id, gaji_pokok, tunjangan_bpjs, tunjangan_jabatan, tunjangan_makan, tunjangan_kehadiran, tunjangan_sembako, tunjangan_kepala_keluarga, potongan_makan, effective_date)
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        id,
        gaji_pokok,
        tunjangan_bpjs,
        tunjangan_jabatan,
        tunjangan_makan,
        tunjangan_kehadiran,
        tunjangan_sembako,
        tunjangan_kepala_keluarga,
        potongan_makan,
        effective_date
      ]
    );

    return NextResponse.json({ message: "✅ Data gaji berhasil diperbarui & histori disimpan" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await pool.query(`DELETE FROM gaji_karyawan WHERE id = ?`, [id]);
    return NextResponse.json({ message: "Data gaji berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
