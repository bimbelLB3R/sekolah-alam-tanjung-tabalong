import pool from "@/lib/db"
import { getConnection } from "@/lib/db"
import { NextResponse } from "next/server"

// GET semua role
export async function GET() {
  const [rows] = await pool.query(`
    SELECT r.id as role_id, r.name as role_name,
           u.id as user_id, u.name as user_name, u.email
    FROM roles r
    LEFT JOIN users u ON u.role_id = r.id
    ORDER BY r.name, u.name
  `)

  const grouped = []
  rows.forEach((row) => {
    let role = grouped.find((r) => r.id === row.role_id)
    if (!role) {
      role = { id: row.role_id, name: row.role_name, users: [] }
      grouped.push(role)
    }
    if (row.user_id) {
      role.users.push({
        id: row.user_id,
        name: row.user_name,
        email: row.email,
      })
    }
  })

  return NextResponse.json(grouped)
}


// POST tambah role
export async function POST(req) {
  const { name } = await req.json();
  const db = await getConnection();
  await db.query("INSERT INTO roles (id, name) VALUES (UUID(), ?)", [name]);
  await db.end();
  return Response.json({ message: "Role berhasil ditambahkan" });
}

// PUT update role
export async function PUT(req) {
  const { id, name } = await req.json();
  const db = await getConnection();
  await db.query("UPDATE roles SET name = ? WHERE id = ?", [name, id]);
  await db.end();
  return Response.json({ message: "Role berhasil diperbarui" });
}

// DELETE hapus role
export async function DELETE(req) {
  const { id } = await req.json();
  const db = await getConnection();
  await db.query("DELETE FROM roles WHERE id = ?", [id]);
  await db.end();
  return Response.json({ message: "Role berhasil dihapus" });
}
