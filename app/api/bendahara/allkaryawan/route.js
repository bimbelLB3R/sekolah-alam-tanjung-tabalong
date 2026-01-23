import pool from "@/lib/db";
import { NextResponse } from "next/server";
// GET semua user (flat list)
export async function GET() {
  const [rows] = await pool.query(`
    SELECT u.id, u.name, u.email, r.name AS role
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id WHERE (r.name='guru' or r.name='manajemen' or r.name='staff')
  `);

  return NextResponse.json(rows); 
}
