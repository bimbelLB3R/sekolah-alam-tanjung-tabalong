// app/api/notifications/mark-read/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

// POST - Tandai notifikasi sebagai sudah dibaca
export async function POST(request) {
  try {
    const user = await getUserFromCookie();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId } = body;

    if (notificationId) {
      // Tandai satu notifikasi
      const [result] = await pool.query(
        `UPDATE notifikasi 
         SET is_read = TRUE 
         WHERE id = ? AND user_id = ?`,
        [notificationId, user.id]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { error: "Notification not found or already read" },
          { status: 404 }
        );
      }
    } else {
      // Tandai semua notifikasi sebagai dibaca
      await pool.query(
        `UPDATE notifikasi 
         SET is_read = TRUE 
         WHERE user_id = ? AND is_read = FALSE`,
        [user.id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}