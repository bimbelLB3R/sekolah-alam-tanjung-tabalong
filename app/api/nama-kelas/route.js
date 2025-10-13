import pool from "@/lib/db";

// GET all data
export async function GET(request) {
  const [rows] = await pool.query(`
  SELECT 
    nk.id,
    nk.kelas,
    nk.jenjang,
    nk.rombel,
    nk.wali_kelas,
    u.name AS wali_kelas_nama,
    nk.kelas_lengkap,
    nk.created_at
  FROM nama_kelas nk
  LEFT JOIN users u ON nk.wali_kelas = u.id
  ORDER BY nk.created_at DESC
`);

  return Response.json(rows);
}

// POST (create new)
export async function POST(request) {
  const body = await request.json();
  const { kelas, jenjang, rombel, wali_kelas } = body;

  await pool.query(
    `INSERT INTO nama_kelas (id, kelas, jenjang, rombel, wali_kelas) VALUES (UUID(), ?, ?, ?, ?)`,
    [kelas, jenjang, rombel, wali_kelas]
  );

  return Response.json({ success: true });
}

// DELETE
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await pool.query(`DELETE FROM nama_kelas WHERE id = ?`, [id]);
  return Response.json({ success: true });
}

// PUT (update)
export async function PUT(request) {
  const body = await request.json();
  const { id, kelas, jenjang, rombel, wali_kelas } = body;

  await pool.query(
    `UPDATE nama_kelas SET kelas=?, jenjang=?, rombel=?, wali_kelas=? WHERE id=?`,
    [kelas, jenjang, rombel, wali_kelas, id]
  );

  return Response.json({ success: true });
}
