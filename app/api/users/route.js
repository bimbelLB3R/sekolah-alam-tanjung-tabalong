import pool from "@/lib/db";
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
  try {
    const { name, email, role_id } = await req.json();

    await pool.query(
      "INSERT INTO users (id, name, email, role_id) VALUES (UUID(), ?, ?, ?)",
      [name, email, role_id]
    );

    return NextResponse.json({ message: "User berhasil ditambahkan" });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Gagal menambahkan user" }, { status: 500 });
  }
}

// PUT update user
export async function PUT(req) {
  try {
    const { id, name, email, role_id } = await req.json();

    await pool.query(
      "UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?",
      [name, email, role_id, id]
    );

    return NextResponse.json({ message: "User berhasil diperbarui" });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Gagal memperbarui user" }, { status: 500 });
  }
}

// DELETE hapus user
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Gagal menghapus user" }, { status: 500 });
  }
}
