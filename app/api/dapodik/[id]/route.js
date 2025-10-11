import pool from "@/lib/db";

export async function PATCH(req, { params }) {
  const { id } = params
  const body = await req.json()
  const [field, value] = Object.entries(body)[0]

  await pool.query(`UPDATE biodata_siswa SET ${field} = ? WHERE id = ?`, [value, id])
  return Response.json({ success: true })
}
