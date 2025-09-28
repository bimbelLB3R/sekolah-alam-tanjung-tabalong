import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// GET all events (sorted by event_date)
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM events ORDER BY event_date ASC");
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create new event
export async function POST(req) {
  try {
    const { title, description, event_date, icon,url,url_peserta } = await req.json();
    const id = uuidv4();

    await pool.query(
      "INSERT INTO events (id, title, description, event_date, icon,url) VALUES (?, ?, ?, ?, ?,?,?)",
      [id, title, description, event_date, icon || "Calendar",url||null,url_peserta||null]
    );

    return NextResponse.json({ message: "Event created successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
