



// // saya tambahkan cache untuk publik agar lancar saat diakses ribuan user
// // middleware.js
// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { rolePermissions } from "@/lib/rolePermissions";


// export async function middleware(req) {
//   const token = req.cookies.get("token")?.value;
//   const url = req.nextUrl;

//   // ✅ BUAT RESPONSE AWAL (agar bisa diset header)
//   const res = NextResponse.next();

//   // =====================================================
//   // ✅ 1️⃣ CACHE-CONTROL SELEKTIF (HANYA UNTUK API PUBLIK)
//   // =====================================================

//   // khusus di dashboard gak usah pakai cache biar data langsung refresh
//   const PUBLIC_API_CACHE = [
//     "/api/blog",
//     "/api/events"
//   ];


//   const isPublicApi = PUBLIC_API_CACHE.some((path) =>
//     url.pathname.startsWith(path)
//   );

//   if (url.pathname.startsWith("/api")) {
//     if (isPublicApi && req.method==="GET") {
//       // ✅ API PUBLIK → BOLEH CACHED
//       res.headers.set(
//         "Cache-Control",
//         "public, s-maxage=60, stale-while-revalidate=300"
//       );
//     } else {
//       // ❌ API PRIVATE / AUTH → WAJIB NO CACHE
//       res.headers.set("Cache-Control", "no-store, max-age=0");
//     }
//   }

//   // ====================================
//   // ✅ 2️⃣ REDIRECT JIKA SUDAH LOGIN
//   // ====================================

//   if (token && url.pathname === "/login") {
//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//       const { payload } = await jwtVerify(token, secret);
//       const userRole = payload.role_name;

//       if (userRole === "ortu") {
//         return NextResponse.redirect(new URL("/ortu", req.url));
//       } else {
//         return NextResponse.redirect(new URL("/dashboard", req.url));
//       }
//     } catch (err) {
//       console.error("JWT verify error:", err.message);
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // ====================================
//   // ✅ 3️⃣ PROTEKSI DASHBOARD
//   // ====================================

//   if (url.pathname.startsWith("/dashboard")) {
//     if (!token) {
//       const loginUrl = new URL("/login", req.url);
//       loginUrl.searchParams.set("callbackUrl", url.pathname); // ✅ TAMBAHAN
//       return NextResponse.redirect(loginUrl);
//     }

//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//       const { payload } = await jwtVerify(token, secret);
//       const userRole = payload.role_name;

//       // 🚫 Ortu tidak boleh ke dashboard
//       if (userRole === "ortu") {
//         return NextResponse.redirect(new URL("/ortu", req.url));
//       }

//       const allowed = rolePermissions[userRole] || [];

//       // ✅ Superadmin full akses
//       if (allowed.includes("*")) return res;

//       // ✅ Root dashboard
//       if (url.pathname === "/dashboard" && allowed.includes("/dashboard")) {
//         return res;
//       }

//       // ✅ Cek prefix path
//       const isAllowed = allowed.some(
//         (path) => path !== "/dashboard" && url.pathname.startsWith(path)
//       );

      

//       if (!isAllowed) {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }

//       return res;
//     } catch (err) {
//       console.error("JWT verify error:", err.message);
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   // ====================================
//   // ✅ 4️⃣ PROTEKSI HALAMAN ORTU
//   // ====================================

//   if (url.pathname.startsWith("/ortu")) {
//     if (!token) {
//       const loginUrl = new URL("/login", req.url);
//       loginUrl.searchParams.set("callbackUrl", url.pathname); // ✅ TAMBAHAN
//       return NextResponse.redirect(loginUrl);
//     }

//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//       const { payload } = await jwtVerify(token, secret);
//       const userRole = payload.role_name;

//       // ✅ Hanya ortu boleh masuk
//       if (userRole !== "ortu") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }

//       return res;
//     } catch (err) {
//       console.error("JWT verify error:", err.message);
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return res;
// }

// // ✅ MATCHER DITAMBAH API
// export const config = {
//   matcher: [
//     "/login",
//     "/dashboard/:path*",
//     "/ortu/:path*",
//     "/api/:path*", // ✅ PENTING agar cache-control aktif
//   ],
// };


// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { rolePermissions } from "@/lib/rolePermissions";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl;
  const res = NextResponse.next();

  // ====================================
  // 1️⃣ CACHE API
  // ====================================
  const PUBLIC_API_CACHE = ["/api/blog", "/api/events"];

  const isPublicApi = PUBLIC_API_CACHE.some((path) =>
    url.pathname.startsWith(path)
  );

  if (url.pathname.startsWith("/api")) {
    if (isPublicApi && req.method === "GET") {
      res.headers.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=300"
      );
    } else {
      res.headers.set("Cache-Control", "no-store, max-age=0");
    }
  }

  // ====================================
  // 2️⃣ REDIRECT JIKA SUDAH LOGIN
  // ====================================
  if (token && url.pathname === "/login") {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      return payload.role_name === "ortu"
        ? NextResponse.redirect(new URL("/ortu", req.url))
        : NextResponse.redirect(new URL("/dashboard", req.url));
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ====================================
  // 3️⃣ PROTEKSI DASHBOARD
  // ====================================
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", url.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role_name;

      if (userRole === "ortu") {
        return NextResponse.redirect(new URL("/ortu", req.url));
      }

      const allowed = rolePermissions[userRole] || [];

     // ====================================
// 🔐 KHUSUS DETAIL ALLEVENTS (GURU KETUA)
// ====================================
const match = url.pathname.match(
  /^\/dashboard\/allevents\/(\d+)(\/.*)?$/
);

if (userRole === "guru" && match) {
  const eventId = match[1]; // <-- AMBIL ID EVENT

  try {
    const checkUrl = new URL("/api/allevents/ketua", req.url);
    checkUrl.searchParams.set("event_id", eventId);

    const apiRes = await fetch(checkUrl, {
      headers: { cookie: `token=${token}` },
    });

    const result = await apiRes.json();

    if (!result.allowed) {
      return NextResponse.redirect(
        new URL("/unauthorized", req.url)
      );
    }

    // ✅ Ketua → BOLEH AKSES SEMUA SUB-PATH
    return res;
  } catch (err) {
    console.error("Cek ketua event gagal:", err);
    return NextResponse.redirect(
      new URL("/unauthorized", req.url)
    );
  }
}

      // ====================================
      // ROLE NORMAL
      // ====================================
      if (allowed.includes("*")) return res;

      if (
        url.pathname === "/dashboard" &&
        allowed.includes("/dashboard")
      ) {
        return res;
      }

      const isAllowed = allowed.some(
        (path) =>
          path !== "/dashboard" && url.pathname.startsWith(path)
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      return res;
    } catch (err) {
      console.error("JWT error:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ====================================
  // 4️⃣ PROTEKSI ORTU
  // ====================================
  if (url.pathname.startsWith("/ortu")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", url.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      if (payload.role_name !== "ortu") {
        return NextResponse.redirect(
          new URL("/unauthorized", req.url)
        );
      }

      return res;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

// ====================================
export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/ortu/:path*",
    "/api/:path*",
  ],
};
