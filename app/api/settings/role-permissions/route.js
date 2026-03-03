// app/api/settings/role-permissions/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/settings/role-permissions
 * Mengambil semua permissions, dikelompokkan per role
 */
export async function GET() {
//   let connection;

  try {
    // connection = await pool.getConnection();

    const [rows] = await pool.execute(
      `SELECT role_name, route_path 
       FROM role_permissions 
       ORDER BY role_name, route_path`
    );

    // Kelompokkan per role seperti struktur rolePermissions.js
    const permissions = {};
    
    rows.forEach(row => {
      if (!permissions[row.role_name]) {
        permissions[row.role_name] = [];
      }
      permissions[row.role_name].push(row.route_path);
    });

    return NextResponse.json({ success: true, permissions });
  } catch (err) {
    console.error("GET role-permissions error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("oke")
  }
}

/**
 * POST /api/settings/role-permissions
 * Menyimpan permissions untuk sebuah role (replace semua route untuk role tersebut)
 * Body: { roleName: string, routes: string[] }
 */
export async function POST(req) {
//   let connection;

  try {
    const body = await req.json();
    const { roleName, routes } = body;

    if (!roleName || !Array.isArray(routes)) {
      return NextResponse.json(
        { success: false, error: "roleName dan routes (array) harus diisi" },
        { status: 400 }
      );
    }

    // connection = await pool.getConnection();
    // await connection.beginTransaction();

    // 1. Hapus semua permission lama untuk role ini
    await pool.query(
      `DELETE FROM role_permissions WHERE role_name = ?`,
      [roleName]
    );

    // 2. Insert permission baru (jika ada)
    if (routes.length > 0) {
      const values = routes.map(route => [roleName, route]);
      await pool.query(
        `INSERT INTO role_permissions (role_name, route_path) VALUES ?`,
        [values]
      );
    }

    // await pool.commit();

    return NextResponse.json({
      success: true,
      message: `Permissions untuk role '${roleName}' berhasil diperbarui`,
    });
  } catch (err) {
    // if (pool) await pool.rollback();
    console.error("POST role-permissions error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    // if (pool) pool.release();
    console.log("oke")
  }
}