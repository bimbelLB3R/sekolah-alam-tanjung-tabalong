import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(req) {
  const token = req.cookies.get("token")?.value
  const url = req.nextUrl

  // kalau sudah login & coba buka /login → redirect ke /dashboard
  if (token && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // cek path dashboard
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)

      const userRole = payload.role_name // contoh: "guru", "bendahara", "super-admin", dll

      // kalau super-admin → akses semua halaman
      if (userRole === "super-admin") {
        return NextResponse.next()
      }

      // ambil segmen kedua setelah /dashboard/
      const pathSegments = url.pathname.split("/")
      const targetPath = pathSegments[2] // misal: /dashboard/guru → "guru"

      // mapping role ke halaman yang diizinkan
      const allowedPaths = {
        guru: ["presensi", "siswa","reservasi"], // guru bisa akses beberapa halaman /dashboard/siswa dst
        bendahara: ["bendahara","siswa","reservasi","manajemen"],
        manajemen: ["presensi", "siswa","reservasi","manajemen"],
      }

      const roleAllowed = allowedPaths[userRole] || []

      // cek apakah targetPath ada dalam daftar allowed untuk userRole
      if (targetPath && !roleAllowed.includes(targetPath)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }

      return NextResponse.next()
    } catch (err) {
      console.error("JWT verify error:", err.message)
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

// matcher supaya cuma jalan di route tertentu
export const config = {
  matcher: ["/login", "/dashboard/:path*"],
}
