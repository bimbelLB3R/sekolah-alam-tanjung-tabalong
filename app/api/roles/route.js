import pool from "@/lib/db"
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
  try {
    const { name } = await req.json();

    await pool.query(
      "INSERT INTO roles (id, name) VALUES (UUID(), ?)",
      [name]
    );
        // Ambil data role yang baru dimasukkan (atau generate id sendiri di frontend)
    const [rows] = await pool.query("SELECT * FROM roles WHERE name = ?", [name]);
    const newRole = rows[0];

    return NextResponse.json(newRole, { status: 201 });

  } catch (error) {
    console.error("Error tambah role:", error);
    return NextResponse.json({ error: "Gagal menambahkan role" }, { status: 500 });
  }
}

// PUT update role
export async function PUT(req) {
  try {
    const { id, name } = await req.json();

    await pool.query(
      "UPDATE roles SET name = ? WHERE id = ?",
      [name, id]
    );

    return NextResponse.json({ id,name });
  } catch (error) {
    console.error("Error update role:", error);
    return NextResponse.json({ error: "Gagal memperbarui role" }, { status: 500 });
  }
}

  // DELETE hapus role
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await pool.query("DELETE FROM roles WHERE id = ?", [id]);

    return NextResponse.json({ message: "Role berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus role:", error);
    return NextResponse.json(
      { error: "Gagal menghapus role" },
      { status: 500 }
    );
  }
}

