// // lib/rolePermissions.js
// export const rolePermissions = {
//   superadmin: ["*"], // bisa semua
//   guru: ["/dashboard","/dashboard/my-activities","/dashboard/guru","/dashboard/ijin","/dashboard/manajemen/data-presensi","/dashboard/presensi", "/dashboard/data-kelas", "/dashboard/reservasi","/dashboard/manajemen/dapodik/","/dashboard/blog","/dashboard/activities","/dashboard/allevents","/dashboard/drive","/dashboard/drive/","/dashboard/meeting-notes"],
//   bendahara: ["/dashboard","/dashboard/bendahara", "/dashboard/siswa", "/dashboard/reservasi","/dashboard/manajemen/data-presensi","/dashboard/allevents/","/dashboard/blog","/dashboard/activities","/dashboard/rekap-kehadiran","/dashboard/drive","/dashboard/drive/"],
//   manajemen: [
//     "/dashboard",
//     "/dashboard/blog",
//     "/dashboard/guru",
//     "/dashboard/presensi",
//     "/dashboard/data-kelas",
//     "/dashboard/reservasi",
//     "/dashboard/manajemen",
//     "/dashboard/events",
//     "/dashboard/allevents",
//     "/dashboard/ijin",
//     "/dashboard/my-activities",
//     "/dashboard/activities",
//     "/dashboard/rekap-kehadiran",
//     "/dashboard/drive","/dashboard/drive/","/dashboard/meeting-notes"
//   ],
//   ortu:["/ortu"],
//   staff:["/dashboard/manajemen/data-presensi","/dashboard/presensi","/dashboard"]
// }


// // lib/rolePermissions.js
// import pool from "@/lib/db";

// /**
//  * DEPRECATED - Hardcode lama (sekarang pindah ke DB)
//  * Hanya digunakan sebagai fallback jika DB tidak tersedia
//  */
// const FALLBACK_PERMISSIONS = {
//   superadmin: ["*"],
//   guru: ["/dashboard","/dashboard/my-activities","/dashboard/guru","/dashboard/ijin","/dashboard/manajemen/data-presensi","/dashboard/presensi", "/dashboard/data-kelas", "/dashboard/reservasi","/dashboard/manajemen/dapodik/","/dashboard/blog","/dashboard/activities","/dashboard/allevents","/dashboard/drive","/dashboard/drive/","/dashboard/meeting-notes"],
//   bendahara: ["/dashboard","/dashboard/bendahara", "/dashboard/siswa", "/dashboard/reservasi","/dashboard/manajemen/data-presensi","/dashboard/allevents/","/dashboard/blog","/dashboard/activities","/dashboard/rekap-kehadiran","/dashboard/drive","/dashboard/drive/"],
//   manajemen: ["/dashboard","/dashboard/blog","/dashboard/guru","/dashboard/presensi","/dashboard/data-kelas","/dashboard/reservasi","/dashboard/manajemen","/dashboard/events","/dashboard/allevents","/dashboard/ijin","/dashboard/my-activities","/dashboard/activities","/dashboard/rekap-kehadiran","/dashboard/drive","/dashboard/drive/","/dashboard/meeting-notes"],
//   ortu: ["/ortu"],
//   staff: ["/dashboard/manajemen/data-presensi","/dashboard/presensi","/dashboard"]
// };

// /**
//  * Load role permissions dari database
//  * Gunakan ini di middleware atau server components
//  */
// export async function getRolePermissions() {
//   // let connection;

//   try {
//     // connection = await pool.getConnection();

//     const [rows] = await pool.query(
//       `SELECT role_name, route_path 
//        FROM role_permissions 
//        ORDER BY role_name, route_path`
//     );

//     const permissions = {};
    
//     rows.forEach(row => {
//       if (!permissions[row.role_name]) {
//         permissions[row.role_name] = [];
//       }
//       permissions[row.role_name].push(row.route_path);
//     });

//     // Jika DB kosong, gunakan fallback
//     if (Object.keys(permissions).length === 0) {
//       console.warn("⚠️ role_permissions tabel kosong, menggunakan fallback hardcode");
//       return FALLBACK_PERMISSIONS;
//     }

//     return permissions;
//   } catch (err) {
//     console.error("❌ Error loading role permissions dari DB:", err);
//     console.warn("⚠️ Menggunakan fallback hardcode");
//     return FALLBACK_PERMISSIONS;
//   } finally {
//     if (pool) pool.release();
//   }
// }

// /**
//  * LEGACY EXPORT - untuk backward compatibility
//  * Gunakan getRolePermissions() untuk yang baru
//  */
// export const rolePermissions = FALLBACK_PERMISSIONS;

// lib/rolePermissions.js

/**
 * HARDCODE FALLBACK
 * Digunakan jika DB tidak tersedia atau untuk backward compatibility
 */
export const FALLBACK_PERMISSIONS = {
  superadmin: ["*"],
  guru: ["/dashboard","/dashboard/my-activities","/dashboard/guru","/dashboard/ijin","/dashboard/manajemen/data-presensi","/dashboard/presensi", "/dashboard/data-kelas", "/dashboard/reservasi","/dashboard/manajemen/dapodik/","/dashboard/blog","/dashboard/activities","/dashboard/allevents","/dashboard/drive","/dashboard/drive/","/dashboard/meeting-notes"],
  bendahara: ["/dashboard","/dashboard/bendahara", "/dashboard/siswa", "/dashboard/reservasi","/dashboard/manajemen/data-presensi","/dashboard/allevents/","/dashboard/blog","/dashboard/activities","/dashboard/rekap-kehadiran","/dashboard/drive","/dashboard/drive/"],
  manajemen: ["/dashboard","/dashboard/blog","/dashboard/guru","/dashboard/presensi","/dashboard/data-kelas","/dashboard/reservasi","/dashboard/manajemen","/dashboard/events","/dashboard/allevents","/dashboard/ijin","/dashboard/my-activities","/dashboard/activities","/dashboard/rekap-kehadiran","/dashboard/drive","/dashboard/drive/"],
  ortu: ["/ortu"],
  staff: ["/dashboard/manajemen/data-presensi","/dashboard/presensi","/dashboard"]
};

/**
 * LEGACY EXPORT - untuk backward compatibility di client components
 * Gunakan getRolePermissionsServer() di server-side
 */
export const rolePermissions = FALLBACK_PERMISSIONS;