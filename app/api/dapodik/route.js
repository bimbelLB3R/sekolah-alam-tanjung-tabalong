// app/api/biodata/route.js
import pool from "@/lib/db";

export async function GET() {
  try {

    const [rows] = await pool.query(
      `SELECT * FROM biodata_siswa ORDER BY created_at DESC`
    );

    // await pool.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data" }),
      { status: 500 }
    );
  }
}

// // GET all events (sorted by event_date)
// export async function GET() {
//   try {
//     const [rows] = await pool.query(
//       `SELECT id, nama_lengkap, alamat, no_hp_ibu, email FROM biodata_siswa ORDER BY created_at DESC`
//     );
//     return NextResponse.json(rows);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
