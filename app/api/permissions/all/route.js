// app/api/permissions/all/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * GET /api/permissions/all
 * Diakses oleh middleware untuk mendapatkan semua role permissions
 * HANYA boleh dipanggil secara internal
 */
export async function GET(req) {
  try {
    // Validasi internal request (opsional tapi recommended)
    const isInternal = req.headers.get("x-internal-request") === "true";
    
    if (!isInternal && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const [rows] = await pool.query(
      `SELECT role_name, route_path 
       FROM role_permissions 
       ORDER BY role_name, route_path`
    );

    const permissions = {};
    
    rows.forEach(row => {
      if (!permissions[row.role_name]) {
        permissions[row.role_name] = [];
      }
      permissions[row.role_name].push(row.route_path);
    });

    // Fallback jika DB kosong
    if (Object.keys(permissions).length === 0) {
      return NextResponse.json({
        success: true,
        permissions: {
          superadmin: ["*"],
          guru: ["/dashboard","/dashboard/my-activities","/dashboard/guru","/dashboard/ijin","/dashboard/manajemen/data-presensi","/dashboard/presensi", "/dashboard/data-kelas", "/dashboard/reservasi","/dashboard/manajemen/dapodik/","/dashboard/blog","/dashboard/activities","/dashboard/allevents","/dashboard/drive","/dashboard/drive/","/dashboard/meeting-notes"],
          bendahara: ["/dashboard","/dashboard/bendahara", "/dashboard/siswa", "/dashboard/reservasi","/dashboard/manajemen/data-presensi","/dashboard/allevents/","/dashboard/blog","/dashboard/activities","/dashboard/rekap-kehadiran","/dashboard/drive","/dashboard/drive/"],
          manajemen: ["/dashboard","/dashboard/blog","/dashboard/guru","/dashboard/presensi","/dashboard/data-kelas","/dashboard/reservasi","/dashboard/manajemen","/dashboard/events","/dashboard/allevents","/dashboard/ijin","/dashboard/my-activities","/dashboard/activities","/dashboard/rekap-kehadiran","/dashboard/drive","/dashboard/drive/"],
          ortu: ["/ortu"],
          staff: ["/dashboard/manajemen/data-presensi","/dashboard/presensi","/dashboard"]
        }
      });
    }

    return NextResponse.json({ success: true, permissions });
  } catch (err) {
    console.error("GET permissions/all error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}