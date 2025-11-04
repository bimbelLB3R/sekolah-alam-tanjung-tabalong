// lib/rolePermissions.js
export const rolePermissions = {
  superadmin: ["*"], // bisa semua
  guru: ["/dashboard","/dashboard/my-activities","/dashboard/guru","/dashboard/ijin","/dashboard/manajemen/data-presensi","/dashboard/presensi", "/dashboard/data-kelas", "/dashboard/reservasi"],
  bendahara: ["/dashboard","/dashboard/bendahara", "/dashboard/siswa", "/dashboard/reservasi","/dashboard/manajemen/data-presensi","/dashboard/allevents"],
  manajemen: [
    "/dashboard",
    "/dashboard/guru",
    "/dashboard/presensi",
    "/dashboard/data-kelas",
    "/dashboard/reservasi",
    "/dashboard/manajemen",
    "/dashboard/events",
    "/dashboard/allevents",
    "/dashboard/ijin",
  ],
  ortu:["/ortu"]
}
