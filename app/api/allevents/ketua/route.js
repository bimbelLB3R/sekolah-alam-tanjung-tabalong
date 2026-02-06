import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req) {
    const cookieStore=await cookies();
      const token = cookieStore.get("token")?.value;
      if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    const name = payload.name;
    // console.log(name)
    // console.log("JWT PAYLOAD:", payload);

    const eventId = req.nextUrl.searchParams.get("event_id");

    const [rows] = await pool.query(
      `
      SELECT id FROM event_committees
      WHERE event_id = ?
        AND position_name = 'Ketua'
        AND person_name = ?
      LIMIT 1
      `,
      [eventId, name]
    );

    return NextResponse.json({
      allowed: rows.length > 0,
    });
  } catch (e) {
    return NextResponse.json({ allowed: false });
  }
}
