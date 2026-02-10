// lib/rolePermissions.js
export const rolePermissions = {
  superadmin: ["*"], // bisa semua
  guru: ["/dashboard","/dashboard/my-activities","/dashboard/guru","/dashboard/ijin","/dashboard/manajemen/data-presensi","/dashboard/presensi", "/dashboard/data-kelas", "/dashboard/reservasi","/dashboard/manajemen/dapodik/","/dashboard/blog","/dashboard/activities","/dashboard/allevents","/dashboard/drive","/dashboard/drive/"],
  bendahara: ["/dashboard","/dashboard/bendahara", "/dashboard/siswa", "/dashboard/reservasi","/dashboard/manajemen/data-presensi","/dashboard/allevents/","/dashboard/blog","/dashboard/activities","/dashboard/rekap-kehadiran","/dashboard/drive"],
  manajemen: [
    "/dashboard",
    "/dashboard/blog",
    "/dashboard/guru",
    "/dashboard/presensi",
    "/dashboard/data-kelas",
    "/dashboard/reservasi",
    "/dashboard/manajemen",
    "/dashboard/events",
    "/dashboard/allevents",
    "/dashboard/ijin",
    "/dashboard/my-activities",
    "/dashboard/activities",
    "/dashboard/rekap-kehadiran",
    "/dashboard/drive"
  ],
  ortu:["/ortu"],
  staff:["/dashboard/manajemen/data-presensi","/dashboard/presensi","/dashboard"]
}
