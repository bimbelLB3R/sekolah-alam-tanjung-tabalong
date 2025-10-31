import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const kelasLengkap = searchParams.get("kelas_lengkap");

    if (!kelasLengkap) {
      return NextResponse.json(
        { success: false, error: "Parameter kelas_lengkap diperlukan" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT 
        id,
        created_at,
        updated_at,
        kelas_lengkap,
        wali_kelas,
        kas_masuk,
        kas_keluar,
        keterangan
      FROM keuangan_kelas
      WHERE kelas_lengkap = ?
      ORDER BY created_at DESC`,
      [kelasLengkap]
    );

    return NextResponse.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/keuangan-kelas:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();

    const { kelas_lengkap, wali_kelas, kas_masuk, kas_keluar, keterangan } = body;

    // Validasi
    if (!kelas_lengkap) {
      return NextResponse.json(
        { success: false, error: "kelas_lengkap diperlukan" },
        { status: 400 }
      );
    }

    if (!keterangan || keterangan.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Keterangan diperlukan" },
        { status: 400 }
      );
    }

    const kasMasukValue = parseFloat(kas_masuk) || 0;
    const kasKeluarValue = parseFloat(kas_keluar) || 0;

    if (kasMasukValue === 0 && kasKeluarValue === 0) {
      return NextResponse.json(
        { success: false, error: "Kas masuk atau kas keluar harus diisi" },
        { status: 400 }
      );
    }

    if (kasMasukValue < 0 || kasKeluarValue < 0) {
      return NextResponse.json(
        { success: false, error: "Nilai kas tidak boleh negatif" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const [result] = await connection.query(
      `INSERT INTO keuangan_kelas 
        (kelas_lengkap, wali_kelas, kas_masuk, kas_keluar, keterangan)
      VALUES (?, ?, ?, ?, ?)`,
      [
        kelas_lengkap,
        wali_kelas || null,
        kasMasukValue,
        kasKeluarValue,
        keterangan.trim(),
      ]
    );

    // Fetch inserted data
    const [rows] = await connection.query(
      "SELECT * FROM keuangan_kelas WHERE id = ?",
      [result.insertId]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/keuangan-kelas:", error);
    
    // Handle foreign key constraint error
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json(
        { success: false, error: "Kelas atau wali kelas tidak ditemukan di database" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data keuangan" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Parameter id diperlukan" },
        { status: 400 }
      );
    }

    const { kelas_lengkap, wali_kelas, kas_masuk, kas_keluar, keterangan } = body;

    // Validasi
    if (!keterangan || keterangan.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Keterangan diperlukan" },
        { status: 400 }
      );
    }

    const kasMasukValue = parseFloat(kas_masuk) || 0;
    const kasKeluarValue = parseFloat(kas_keluar) || 0;

    if (kasMasukValue === 0 && kasKeluarValue === 0) {
      return NextResponse.json(
        { success: false, error: "Kas masuk atau kas keluar harus diisi" },
        { status: 400 }
      );
    }

    if (kasMasukValue < 0 || kasKeluarValue < 0) {
      return NextResponse.json(
        { success: false, error: "Nilai kas tidak boleh negatif" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const [result] = await connection.query(
      `UPDATE keuangan_kelas
      SET 
        kelas_lengkap = ?,
        wali_kelas = ?,
        kas_masuk = ?,
        kas_keluar = ?,
        keterangan = ?
      WHERE id = ?`,
      [
        kelas_lengkap,
        wali_kelas || null,
        kasMasukValue,
        kasKeluarValue,
        keterangan.trim(),
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch updated data
    const [rows] = await connection.query(
      "SELECT * FROM keuangan_kelas WHERE id = ?",
      [id]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/keuangan-kelas:", error);
    
    // Handle foreign key constraint error
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json(
        { success: false, error: "Kelas atau wali kelas tidak ditemukan di database" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data keuangan" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function DELETE(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Parameter id diperlukan" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const [result] = await connection.query(
      "DELETE FROM keuangan_kelas WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/keuangan-kelas:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data keuangan" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

