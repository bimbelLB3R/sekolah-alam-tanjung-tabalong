// // app/api/users/count/route.js
// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function GET() {
//   try {

//     const [rows] = await pool.execute("SELECT COUNT(*) as total FROM users");
//     // await pool.end();

//     return NextResponse.json({ count: rows[0].total });
//   } catch (error) {
//     console.error("Error fetching user count:", error);
//     return NextResponse.json({ error: "Failed to fetch user count" }, { status: 500 });
//   }
// }

// optimasi route
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export const dynamic = "force-dynamic" // ✅ pastikan tidak ke-cache static oleh Next.js

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total FROM users"
    )

    // ✅ response tetap sama (TIDAK berubah)
    return NextResponse.json(
      { count: rows[0].total },
      {
        headers: {
          "Cache-Control": "no-store", // ✅ pastikan selalu realtime
        },
      }
    )
  } catch (error) {
    console.error("Error fetching user count:", error)
    return NextResponse.json(
      { error: "Failed to fetch user count" },
      { status: 500 }
    )
  }
}
