// import { NextResponse } from "next/server"
// import { jwtVerify } from "jose"
// import { rolePermissions } from "@/lib/rolePermissions"

// export async function middleware(req) {
//   const token = req.cookies.get("token")?.value
//   const url = req.nextUrl

//   if (token && url.pathname === "/login") {
//     return NextResponse.redirect(new URL("/dashboard", req.url))
//   }

//   if (url.pathname.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url))
//     }

//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET)
//       const { payload } = await jwtVerify(token, secret)

//       const userRole = payload.role_name // "guru", "bendahara", dst
//       const allowed = rolePermissions[userRole] || []

//       // 1. superadmin → full akses
//       if (allowed.includes("*")) return NextResponse.next()

//       // 2. cek root dashboard → hanya boleh "/dashboard" persis
//       if (url.pathname === "/dashboard" && allowed.includes("/dashboard")) {
//         return NextResponse.next()
//       }

//       // 3. cek path lainnya (harus match prefix)
//       const isAllowed = allowed.some(path => 
//         path !== "/dashboard" && url.pathname.startsWith(path)
//       )

//       if (!isAllowed) {
//         return NextResponse.redirect(new URL("/unauthorized", req.url))
//       }

//       return NextResponse.next()
//     } catch (err) {
//       console.error("JWT verify error:", err.message)
//       return NextResponse.redirect(new URL("/login", req.url))
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/login", "/dashboard/:path*"],
// }

// nambah role untuk ortu
import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { rolePermissions } from "@/lib/rolePermissions"

export async function middleware(req) {
  const token = req.cookies.get("token")?.value
  const url = req.nextUrl

  // --- kalau sudah login & coba buka /login → redirect ke /dashboard (kecuali ortu)
  if (token && url.pathname === "/login") {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      const userRole = payload.role_name

      if (userRole === "ortu") {
        return NextResponse.redirect(new URL("/ortu", req.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    } catch (err) {
      console.error("JWT verify error:", err.message)
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // --- aturan khusus untuk ortu
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      const userRole = payload.role_name

      // kalau ortu mencoba akses dashboard → redirect ke /ortu
      if (userRole === "ortu") {
        return NextResponse.redirect(new URL("/ortu", req.url))
      }

      const allowed = rolePermissions[userRole] || []

      // 1. superadmin → full akses
      if (allowed.includes("*")) return NextResponse.next()

      // 2. cek root dashboard → hanya boleh "/dashboard" persis
      if (url.pathname === "/dashboard" && allowed.includes("/dashboard")) {
        return NextResponse.next()
      }

      // 3. cek path lainnya (harus match prefix)
      const isAllowed = allowed.some(
        (path) => path !== "/dashboard" && url.pathname.startsWith(path)
      )

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }

      return NextResponse.next()
    } catch (err) {
      console.error("JWT verify error:", err.message)
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }
  // --- aturan khusus halaman ortu
if (url.pathname.startsWith("/ortu")) {
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const userRole = payload.role_name

    // Hanya izinkan role "ortu" yang bisa mengakses /ortu
    if (userRole !== "ortu") {
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

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/ortu/:path*"],
}
