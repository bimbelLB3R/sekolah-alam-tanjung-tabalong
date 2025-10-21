// app/api/settings/gps/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET - Ambil status GPS validation
export async function GET(request) {
  
  try {
    
    const [rows] = await pool.execute(
      "SELECT setting_value FROM system_settings WHERE setting_key = ?",
      ["gps_validation_enabled"]
    );

    if (rows.length === 0) {
      // Jika belum ada, insert default true
      await pool.execute(
        "INSERT INTO system_settings (setting_key, setting_value, description) VALUES (?, ?, ?)",
        ["gps_validation_enabled", "true", "Enable or disable GPS location validation"]
      );
      
      return NextResponse.json({ 
        success: true, 
        enabled: true 
      });
    }

    const enabled = rows[0].setting_value === "true";
    
    return NextResponse.json({ 
      success: true, 
      enabled 
    });

  } catch (error) {
    console.error("Error fetching GPS setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch setting" },
      { status: 500 }
    );
  } finally {
    
    console.log("oke")
  }
}

// POST - Update status GPS validation
export async function POST(request) {
//   let connection;
  
  try {
    const { enabled, userId } = await request.json();
    
    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid enabled value" },
        { status: 400 }
      );
    }

    // connection = await mysql.createConnection(dbConfig);
    
    // Update setting
    await pool.execute(
      `UPDATE system_settings 
       SET setting_value = ?, updated_by = ?, updated_at = NOW() 
       WHERE setting_key = ?`,
      [enabled.toString(), userId || null, "gps_validation_enabled"]
    );

    return NextResponse.json({ 
      success: true, 
      enabled,
      message: `GPS validation ${enabled ? 'enabled' : 'disabled'}` 
    });

  } catch (error) {
    console.error("Error updating GPS setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update setting" },
      { status: 500 }
    );
  } finally {
    
    console.log("oke")
  }
}