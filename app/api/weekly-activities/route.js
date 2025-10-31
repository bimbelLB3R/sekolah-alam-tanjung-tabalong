// import pool from "@/lib/db";
// import { NextResponse } from "next/server";

// // GET - Ambil kegiatan berdasarkan tanggal
// export async function GET(request) {
// //   let connection;
//   try {
//     const { searchParams } = new URL(request.url);
//     const tanggal = searchParams.get("tanggal");
//     const guruId = searchParams.get("guru_id");

//     if (!tanggal || !guruId) {
//       return NextResponse.json(
//         { success: false, error: "Parameter tanggal dan guru_id diperlukan" },
//         { status: 400 }
//       );
//     }

//     // connection = await pool.getConnection();

//     const query = `
//   SELECT 
//     wa.*,
//     wp.kelas_lengkap,
//     wp.minggu_ke,
//     wp.tahun,
//     CONVERT_TZ(wa.evaluasi_at, '+00:00', '+08:00') AS tanggal_evaluasi
//   FROM weekly_activities wa
//   JOIN weekly_plans wp ON wa.weekly_plan_id = wp.id
//   WHERE DATE(CONVERT_TZ(wa.tanggal, '+00:00', '+08:00')) = ? 
//     AND wp.guru_id = ?
//   ORDER BY wa.created_at
// `;

//     const [rows] = await pool.query(query, [tanggal, guruId]);

//     return NextResponse.json(rows || [], { status: 200 });
//   } catch (error) {
//     console.error("Error in GET /api/weekly-activities:", error);
//     return NextResponse.json(
//       { success: false, error: "Terjadi kesalahan server" },
//       { status: 500 }
//     );
//   } finally {
//     // if (pool) pool.release();
//     console.log("yes")
//   }
// }

// // PUT - Update evaluasi kegiatan
// export async function PUT(request) {
// //   let connection;
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");
//     const body = await request.json();

//     if (!id) {
//       return NextResponse.json(
//         { success: false, error: "Parameter id diperlukan" },
//         { status: 400 }
//       );
//     }

//     const { evaluasi, status } = body;

//     if (!evaluasi || evaluasi.trim() === "") {
//       return NextResponse.json(
//         { success: false, error: "Evaluasi harus diisi" },
//         { status: 400 }
//       );
//     }

//     // connection = await pool.getConnection();

//     const [result] = await pool.query(
//       `UPDATE weekly_activities
//        SET evaluasi = ?, status = ?, evaluasi_at = NOW()
//        WHERE id = ?`,
//       [evaluasi.trim(), status || 'completed', id]
//     );

//     if (result.affectedRows === 0) {
//       return NextResponse.json(
//         { success: false, error: "Kegiatan tidak ditemukan" },
//         { status: 404 }
//       );
//     }

//     const [rows] = await pool.query(
//       "SELECT * FROM weekly_activities WHERE id = ?",
//       [id]
//     );

//     return NextResponse.json(
//       { success: true, data: rows[0] },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in PUT /api/weekly-activities:", error);
//     return NextResponse.json(
//       { success: false, error: "Gagal menyimpan evaluasi" },
//       { status: 500 }
//     );
//   } finally {
//     // if (pool) pool.release();
//     console.log("yes")
//   }
// }

import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Ambil kegiatan berdasarkan tanggal
export async function GET(request) {
  // let connection;
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get("tanggal");
    const guruId = searchParams.get("guru_id");

    if (!tanggal || !guruId) {
      return NextResponse.json(
        { success: false, error: "Parameter tanggal dan guru_id diperlukan" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    const query = `
      SELECT 
        wa.*,
        wp.kelas_lengkap,
        wp.minggu_ke,
        wp.tahun,
        CONVERT_TZ(wa.evaluasi_at, '+00:00', '+08:00') AS tanggal_evaluasi
      FROM weekly_activities wa
      JOIN weekly_plans wp ON wa.weekly_plan_id = wp.id
      WHERE DATE(CONVERT_TZ(wa.tanggal, '+00:00', '+08:00')) = ? AND wp.guru_id = ?
      ORDER BY wa.created_at
    `;

    const [rows] = await pool.query(query, [tanggal, guruId]);

    return NextResponse.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/weekly-activities:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("yes")
  }
}

// POST - Tambah kegiatan baru
export async function POST(request) {
  // let connection;
  try {
    const body = await request.json();
    const { weekly_plan_id, hari, tanggal, waktu, kegiatan, target_capaian } = body;

    // Validasi
    if (!weekly_plan_id || !hari || !tanggal || !kegiatan) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    // Generate UUID untuk activity
    const [uuidResult] = await pool.query('SELECT UUID() as uuid');
    const activityId = uuidResult[0].uuid;

    const query = `
      INSERT INTO weekly_activities 
        (id, weekly_plan_id, hari, tanggal, waktu, kegiatan, target_capaian)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      activityId,
      weekly_plan_id,
      hari,
      tanggal,
      waktu || null,
      kegiatan.trim(),
      target_capaian?.trim() || null,
    ]);

    // Fetch created activity
    const [rows] = await pool.query(
      "SELECT * FROM weekly_activities WHERE id = ?",
      [activityId]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/weekly-activities:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambah kegiatan" },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("yes")
  }
}

// PATCH - Update kegiatan (selain evaluasi)
export async function PATCH(request) {
  // let connection;
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

    const { hari, tanggal, waktu, kegiatan, target_capaian } = body;

    // Validasi
    if (!kegiatan || kegiatan.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Kegiatan harus diisi" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    const [result] = await pool.query(
      `UPDATE weekly_activities
       SET 
         hari = ?,
         tanggal = ?,
         waktu = ?,
         kegiatan = ?,
         target_capaian = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [
        hari,
        tanggal,
        waktu || null,
        kegiatan.trim(),
        target_capaian?.trim() || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    const [rows] = await pool.query(
      "SELECT * FROM weekly_activities WHERE id = ?",
      [id]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/weekly-activities:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupdate kegiatan" },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("yes")
  }
}

// PUT - Update evaluasi kegiatan
export async function PUT(request) {
  // let connection;
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

    const { evaluasi, status } = body;

    if (!evaluasi || evaluasi.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Evaluasi harus diisi" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();

    const [result] = await pool.query(
      `UPDATE weekly_activities
       SET evaluasi = ?, status = ?, evaluasi_at = NOW()
       WHERE id = ?`,
      [evaluasi.trim(), status || 'completed', id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    const [rows] = await pool.query(
      "SELECT * FROM weekly_activities WHERE id = ?",
      [id]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/weekly-activities:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan evaluasi" },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("yes")
  }
}

// DELETE - Hapus kegiatan
export async function DELETE(request) {
  // let connection;
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
      "DELETE FROM weekly_activities WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Kegiatan berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/weekly-activities:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kegiatan" },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("yes")
  }
}