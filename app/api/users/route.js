// import pool from "@/lib/db";
// import { NextResponse } from "next/server";

// // GET semua user
// export async function GET() {
//   const [rows] = await pool.query(`
//     SELECT u.id AS user_id, u.name AS user_name, u.email, r.id AS role_id, r.name AS role_name
//     FROM users u
//     LEFT JOIN roles r ON u.role_id = r.id
//   `);

//   const grouped = [];
//   rows.forEach((row) => {
//     let role = grouped.find((r) => r.id === row.role_id);
//     if (!role) {
//       role = { id: row.role_id, name: row.role_name, users: [] };
//       grouped.push(role);
//     }
//     if (row.user_id||row.user_id=='') {
//       role.users.push({
//         id: row.user_id,
//         name: row.user_name,
//         email: row.email,
//       });
//     }
//   });

//   return NextResponse.json(grouped);
// }

// // POST tambah user
// export async function POST(req) {
//   try {
//     const { name, email, role_id } = await req.json();

//     await pool.query(
//       "INSERT INTO users (id, name, email, role_id) VALUES (UUID(), ?, ?, ?)",
//       [name, email, role_id]
//     );

//     return NextResponse.json({ message: "User berhasil ditambahkan" });
//   } catch (err) {
//     console.error("POST error:", err);
//     return NextResponse.json({ error: "Gagal menambahkan user" }, { status: 500 });
//   }
// }

// // PUT update user
// export async function PUT(req) {
//   try {
//     const { id, name, email, role_id } = await req.json();

//     await pool.query(
//       "UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?",
//       [name, email, role_id, id]
//     );

//     return NextResponse.json({ message: "User berhasil diperbarui" });
//   } catch (err) {
//     console.error("PUT error:", err);
//     return NextResponse.json({ error: "Gagal memperbarui user" }, { status: 500 });
//   }
// }

// // DELETE hapus user
// export async function DELETE(req) {
//   try {
//     const { id } = await req.json();

//     await pool.query("DELETE FROM users WHERE id = ?", [id]);

//     return NextResponse.json({ message: "User berhasil dihapus" });
//   } catch (err) {
//     console.error("DELETE error:", err);
//     return NextResponse.json({ error: "Gagal menghapus user" }, { status: 500 });
//   }
// }




// penambahan toogle
import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET semua user
export async function GET() {
  const [rows] = await pool.query(`
    SELECT u.id AS user_id, u.name AS user_name, u.email, u.isActive, r.id AS role_id, r.name AS role_name
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
    if (row.user_id || row.user_id == '') {
      role.users.push({
        id: row.user_id,
        name: row.user_name,
        email: row.email,
        isActive: Boolean(row.isActive), // Convert ke boolean
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
      "INSERT INTO users (id, name, email, role_id, isActive) VALUES (UUID(), ?, ?, ?, TRUE)",
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

// PATCH toggle status user (BARU)
export async function PATCH(req) {
  try {
    const { id, isActive } = await req.json();

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: "ID dan isActive (boolean) diperlukan" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "UPDATE users SET isActive = ? WHERE id = ?",
      [isActive, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: `User berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
      success: true 
    });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Gagal mengubah status user" }, { status: 500 });
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