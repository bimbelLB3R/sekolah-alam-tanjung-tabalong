import pool from "@/lib/db";
import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

// GET semua user
export async function GET() {
  const [rows] = await pool.query(`
    SELECT u.id AS user_id, u.name AS user_name, u.email, r.id AS role_id, r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
  `);

  const grouped = [];
  rows.forEach((row) => {
    let role = grouped.find((r) => r.id === row.role_id);
    if (!role) {
      role = { id: row.role_id, name: row.role_name, users: [] };
      grouped.push(role);
    }
    if (row.user_id||row.user_id=='') {
      role.users.push({
        id: row.user_id,
        name: row.user_name,
        email: row.email,
      });
    }
  });

  return NextResponse.json(grouped);
}

// POST tambah user
export async function POST(req) {
  const { name, email, role_id } = await req.json();
  const db = await getConnection();
  await db.query("INSERT INTO users (id, name, email, role_id) VALUES (UUID(), ?, ?, ?)", [name, email, role_id]);
  await db.end();
  return NextResponse.json({ message: "User berhasil ditambahkan" });
}

// PUT update user
export async function PUT(req) {
  const { id, name, email, role_id } = await req.json();
  const db = await getConnection();
  await db.query("UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?", [name, email, role_id, id]);
  await db.end();
  return NextResponse.json({ message: "User berhasil diperbarui" });
}

// DELETE hapus user
export async function DELETE(req) {
  const { id } = await req.json();
  const db = await getConnection();
  await db.query("DELETE FROM users WHERE id = ?", [id]);
  await db.end();
  return NextResponse.json({ message: "User berhasil dihapus" });
}
