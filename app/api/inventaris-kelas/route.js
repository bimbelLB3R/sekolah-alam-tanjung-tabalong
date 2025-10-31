import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Ambil inventaris berdasarkan kelas
export async function GET(request) {
//   let connection;
  try {
    const { searchParams } = new URL(request.url);
    const kelasLengkap = searchParams.get("kelas_lengkap");
    const kategori = searchParams.get("kategori");

    if (!kelasLengkap) {
      return NextResponse.json(
        { success: false, error: "Parameter kelas_lengkap diperlukan" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    let query = `
      SELECT * FROM inventaris_kelas 
      WHERE kelas_lengkap = ?
    `;
    const params = [kelasLengkap];

    if (kategori && kategori !== 'all') {
      query += ` AND kategori = ?`;
      params.push(kategori);
    }

    query += ` ORDER BY kategori ASC, nama_barang ASC`;

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/inventaris-kelas:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    // if (connection) connection.release();
    console.log("yes")
  }
}

// POST - Tambah inventaris baru
export async function POST(request) {
//   let connection;
  try {
    const body = await request.json();
    const {
      kelas_lengkap,
      nama_barang,
      kategori,
      jumlah,
      satuan,
      kondisi,
      keterangan,
      lokasi,
    } = body;

    // Validasi
    if (!kelas_lengkap || !nama_barang || !kategori) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (jumlah && jumlah < 1) {
      return NextResponse.json(
        { success: false, error: "Jumlah harus lebih dari 0" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    // Generate UUID
    const [uuidResult] = await pool.query('SELECT UUID() as uuid');
    const inventarisId = uuidResult[0].uuid;

    const query = `
      INSERT INTO inventaris_kelas 
        (id, kelas_lengkap, nama_barang, kategori, jumlah, satuan, kondisi, keterangan, lokasi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      inventarisId,
      kelas_lengkap,
      nama_barang.trim(),
      kategori,
      jumlah || 1,
      satuan?.trim() || 'unit',
      kondisi || 'Baik',
      keterangan?.trim() || null,
      lokasi?.trim() || null,
    ]);

    // Fetch created item
    const [rows] = await pool.query(
      "SELECT * FROM inventaris_kelas WHERE id = ?",
      [inventarisId]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/inventaris-kelas:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json(
        { success: false, error: "Kelas tidak ditemukan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal menambah inventaris" },
      { status: 500 }
    );
  } finally {
    // if (connection) connection.release();
    console.log("yes")
  }
}

// PUT - Update inventaris
export async function PUT(request) {
//   let connection;
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

    const {
      nama_barang,
      kategori,
      jumlah,
      satuan,
      kondisi,
      keterangan,
      lokasi,
    } = body;

    // Validasi
    if (!nama_barang || !kategori) {
      return NextResponse.json(
        { success: false, error: "Nama barang dan kategori harus diisi" },
        { status: 400 }
      );
    }

    if (jumlah && jumlah < 1) {
      return NextResponse.json(
        { success: false, error: "Jumlah harus lebih dari 0" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    const [result] = await pool.query(
      `UPDATE inventaris_kelas
       SET 
         nama_barang = ?,
         kategori = ?,
         jumlah = ?,
         satuan = ?,
         kondisi = ?,
         keterangan = ?,
         lokasi = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [
        nama_barang.trim(),
        kategori,
        jumlah || 1,
        satuan?.trim() || 'unit',
        kondisi || 'Baik',
        keterangan?.trim() || null,
        lokasi?.trim() || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Inventaris tidak ditemukan" },
        { status: 404 }
      );
    }

    const [rows] = await pool.query(
      "SELECT * FROM inventaris_kelas WHERE id = ?",
      [id]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/inventaris-kelas:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate inventaris" },
      { status: 500 }
    );
  } finally {
    // if (connection) connection.release();
    console.log("yes")
  }
}

// DELETE - Hapus inventaris
export async function DELETE(request) {
//   let connection;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Parameter id diperlukan" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    const [result] = await pool.query(
      "DELETE FROM inventaris_kelas WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Inventaris tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Inventaris berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/inventaris-kelas:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus inventaris" },
      { status: 500 }
    );
  } finally {
    // if (connection) connection.release();
    console.log("yes")
  }
}