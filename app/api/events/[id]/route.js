// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// // UPDATE event
// export async function PUT(req, { params }) {
//   try {
//     const { id } =await params;
//     const { title, description, event_date, icon,url,url_peserta } = await req.json();

//     await pool.query(
//       "UPDATE events SET title=?, description=?, event_date=?, icon=?, url=?, url_peserta=? WHERE id=?",
//       [title, description, event_date, icon,url,url_peserta, id]
//     );

//     return NextResponse.json({ message: "Event updated successfully" });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// // DELETE event
// export async function DELETE(req, { params }) {
//   try {
//     const { id } =await params;
//     await pool.query("DELETE FROM events WHERE id=?", [id]);

//     return NextResponse.json({ message: "Event deleted successfully" });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import pool from "@/lib/db";

// UPDATE event
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { title, description, event_date, icon, url, url_peserta } = await req.json();

    // Validasi input
    if (!title || !description || !event_date) {
      return NextResponse.json(
        { error: "Title, description, and event_date are required" },
        { status: 400 }
      );
    }

    // Cek apakah event exists
    const [existing] = await pool.query("SELECT id FROM events WHERE id = ?", [id]);
    
    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Update event
    const [result] = await pool.query(
      "UPDATE events SET title=?, description=?, event_date=?, icon=?, url=?, url_peserta=? WHERE id=?",
      [title, description, event_date, icon || "Calendar", url || null, url_peserta || null, id]
    );

    // Cek apakah ada row yang terupdate
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Failed to update event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Event updated successfully",
      id 
    });
  } catch (err) {
    console.error("Error updating event:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Cek apakah event exists
    const [existing] = await pool.query("SELECT id FROM events WHERE id = ?", [id]);
    
    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Hapus event
    const [result] = await pool.query("DELETE FROM events WHERE id=?", [id]);

    // Cek apakah ada row yang terhapus
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Failed to delete event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Event deleted successfully",
      id 
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET single event (optional - untuk detail page)
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
    
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Error fetching event:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}