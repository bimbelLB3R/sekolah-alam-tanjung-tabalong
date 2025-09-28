import { NextResponse } from "next/server";
import pool from "@/lib/db";

// UPDATE event
export async function PUT(req, { params }) {
  try {
    const { id } =await params;
    const { title, description, event_date, icon,url,url_peserta } = await req.json();

    await pool.query(
      "UPDATE events SET title=?, description=?, event_date=?, icon=?, url=?, url_peserta=? WHERE id=?",
      [title, description, event_date, icon,url,url_peserta, id]
    );

    return NextResponse.json({ message: "Event updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE event
export async function DELETE(req, { params }) {
  try {
    const { id } =await params;
    await pool.query("DELETE FROM events WHERE id=?", [id]);

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
