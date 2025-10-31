import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Monitoring kegiatan untuk kepala sekolah
export async function GET(request) {
//   let connection;
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get("tanggal");
    const kelasLengkap = searchParams.get("kelas_lengkap");
    const status = searchParams.get("status");

    // connection = await pool.getConnection();

    let query = `
      SELECT 
        wa.*,
        wp.kelas_lengkap,
        wp.guru_id,
        wp.guru_nama,
        wp.minggu_ke,
        wp.tahun,
        wp.tanggal_mulai,
        wp.tanggal_selesai
      FROM weekly_activities wa
      JOIN weekly_plans wp ON wa.weekly_plan_id = wp.id
      WHERE 1=1
    `;
    
    const params = [];

    // Filter by date
    if (tanggal) {
      query += ` AND wa.tanggal = ?`;
      params.push(tanggal);
    }

    // Filter by kelas
    if (kelasLengkap) {
      query += ` AND wp.kelas_lengkap = ?`;
      params.push(kelasLengkap);
    }

    // Filter by status
    if (status) {
      query += ` AND wa.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY wa.tanggal DESC, wp.kelas_lengkap ASC, wa.created_at ASC`;

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows || [], { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/weekly-activities/monitoring:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    // if (connection) connection.release();
    console.log("yes")
  }
}

// GET Summary statistics
export async function POST(request) {
//   let connection;
  try {
    const body = await request.json();
    const { start_date, end_date } = body;

    // connection = await pool.getConnection();

    // Summary by class
    const summaryQuery = `
      SELECT 
        wp.kelas_lengkap,
        wp.guru_nama,
        COUNT(wa.id) as total_kegiatan,
        SUM(CASE WHEN wa.status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN wa.status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN wa.evaluasi IS NOT NULL AND wa.evaluasi != '' THEN 1 ELSE 0 END) as with_evaluation
      FROM weekly_plans wp
      LEFT JOIN weekly_activities wa ON wp.id = wa.weekly_plan_id
      WHERE 1=1
      ${start_date ? 'AND wa.tanggal >= ?' : ''}
      ${end_date ? 'AND wa.tanggal <= ?' : ''}
      GROUP BY wp.kelas_lengkap, wp.guru_nama
      ORDER BY wp.kelas_lengkap ASC
    `;

    const params = [];
    if (start_date) params.push(start_date);
    if (end_date) params.push(end_date);

    const [summary] = await pool.query(summaryQuery, params);

    return NextResponse.json({
      success: true,
      data: summary || []
    }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/weekly-activities/monitoring:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    // if (connection) connection.release();
    console.log("yes")
  }
}