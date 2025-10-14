// lib/rolePermissions.js
export const rolePermissions = {
  superadmin: ["*"], // bisa semua
  guru: ["/dashboard","/dashboard/guru","/dashboard/manajemen/data-presensi","/dashboard/presensi", "/dashboard/data-kelas", "/dashboard/reservasi"],
  bendahara: ["/dashboard","/dashboard/bendahara", "/dashboard/siswa", "/dashboard/reservasi"],
  manajemen: [
    "/dashboard",
    "/dashboard/guru",
    "/dashboard/presensi",
    "/dashboard/data-kelas",
    "/dashboard/reservasi",
    "/dashboard/manajemen",
    "/dashboard/events",
  ],
  ortu:["/ortu"]
}
