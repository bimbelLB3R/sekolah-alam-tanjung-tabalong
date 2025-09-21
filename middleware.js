import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(req) {
  const token = req.cookies.get("token")?.value
  const url = req.nextUrl

  // kalau sudah login & coba buka /login → redirect ke /dashboard
  if (token && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // proteksi dashboard
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (err) {
      console.error("JWT verify error:", err.message)
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"], // login juga dicek
}
