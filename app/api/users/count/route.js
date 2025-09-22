// app/api/users/count/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const [rows] = await pool.execute("SELECT COUNT(*) as total FROM users");
    await pool.end();

    return NextResponse.json({ count: rows[0].total });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return NextResponse.json({ error: "Failed to fetch user count" }, { status: 500 });
  }
}
