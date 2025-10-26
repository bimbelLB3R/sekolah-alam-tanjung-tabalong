
// app/api/notifications/delete/route.js
// DELETE - Hapus notifikasi
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
export async function DELETE(request) {
  try {
   const user = await getUserFromCookie();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    await pool.query(
      `DELETE FROM notifikasi 
       WHERE id = ? AND user_id = ?`,
      [notificationId, user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}