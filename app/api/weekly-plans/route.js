import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Ambil weekly plans
export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const guruId = searchParams.get("guru_id");
    const kelasLengkap = searchParams.get("kelas_lengkap");
    const id = searchParams.get("id");

    // connection = await pool.getConnection();

    // Get specific weekly plan with activities
    if (id) {
      const [plans] = await pool.query(
        `SELECT * FROM weekly_plans WHERE id = ?`,
        [id]
      );

      if (plans.length === 0) {
        return NextResponse.json(
          { success: false, error: "Weekly plan tidak ditemukan" },
          { status: 404 }
        );
      }

      const [activities] = await pool.query(
        `SELECT * FROM weekly_activities 
         WHERE weekly_plan_id = ? 
         ORDER BY FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'), created_at`,
        [id]
      );

      return NextResponse.json({
        ...plans[0],
        activities: activities || []
      });
    }

    // Get list of weekly plans
    let query = `SELECT * FROM weekly_plans WHERE 1=1`;
    const params = [];

    if (guruId) {
      query += ` AND guru_id = ?`;
      params.push(guruId);
    }

    if (kelasLengkap) {
      query += ` AND kelas_lengkap = ?`;
      params.push(kelasLengkap);
    }

    query += ` ORDER BY tahun DESC, minggu_ke DESC`;

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/weekly-plans:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("yes")
  }
}

// POST - Buat weekly plan baru dengan activities
export async function POST(request) {
//   let connection;
  try {
    const body = await request.json();
    const {
      kelas_lengkap,
      guru_id,
      guru_nama,
      minggu_ke,
      tahun,
      tanggal_mulai,
      tanggal_selesai,
      activities,
    } = body;

    // Validasi
    if (!kelas_lengkap || !guru_id || !guru_nama || !minggu_ke || !tahun) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (!activities || activities.length === 0) {
      return NextResponse.json(
        { success: false, error: "Minimal ada satu kegiatan" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();
    // await connection.beginTransaction();

    // Insert weekly plan
    const [planResult] = await pool.query(
      `INSERT INTO weekly_plans 
        (kelas_lengkap, guru_id, guru_nama, minggu_ke, tahun, tanggal_mulai, tanggal_selesai, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'published')`,
      [kelas_lengkap, guru_id, guru_nama, minggu_ke, tahun, tanggal_mulai, tanggal_selesai]
    );

    const weeklyPlanId = planResult.insertId;

    // Insert activities
    const activityValues = activities.map((act) => [
      weeklyPlanId,
      act.hari,
      act.tanggal,
      act.waktu || null,
      act.kegiatan,
      act.target_capaian || null,
    ]);

    await pool.query(
      `INSERT INTO weekly_activities 
        (weekly_plan_id, hari, tanggal, waktu, kegiatan, target_capaian)
      VALUES ?`,
      [activityValues]
    );

    // await pool.commit();

    // Fetch created plan with activities
    const [plans] = await pool.query(
      `SELECT * FROM weekly_plans WHERE id = ?`,
      [weeklyPlanId]
    );

    const [acts] = await pool.query(
      `SELECT * FROM weekly_activities WHERE weekly_plan_id = ?`,
      [weeklyPlanId]
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          ...plans[0],
          activities: acts,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // if (pool) await pool.rollback();
    console.error("Error in POST /api/weekly-plans:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json(
        { success: false, error: "Kelas tidak ditemukan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal menyimpan weekly plan" },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("yes")
  }
}

// DELETE - Hapus weekly plan
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
      "DELETE FROM weekly_plans WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Weekly plan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Weekly plan berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/weekly-plans:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus weekly plan" },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("yes")
  }
}