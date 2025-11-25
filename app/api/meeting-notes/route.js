// app/api/meeting-notes/route.js
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { v4 as uuidv4 } from "uuid"
import { dateInputToIsoUTC } from "@/lib/formatDateInputToIso"

// Helper function untuk verify token
async function verifyToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

// GET - List meeting notes dengan pagination, search, filter
export async function GET(req) {
  try {
    const user = await verifyToken()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const filterSupervisor = searchParams.get("supervisor") || ""
    const filterDateFrom = searchParams.get("dateFrom") || ""
    const filterDateTo = searchParams.get("dateTo") || ""
    
    const offset = (page - 1) * limit

    let whereConditions = []
    let queryParams = []

    if (search) {
      whereConditions.push("(mn.meeting_name LIKE ? OR mn.agenda LIKE ?)")
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    if (filterSupervisor) {
      whereConditions.push("mn.supervisor_id = ?")
      queryParams.push(filterSupervisor)
    }

    if (filterDateFrom) {
      whereConditions.push("mn.meeting_date >= ?")
      queryParams.push(filterDateFrom)
    }

    if (filterDateTo) {
      whereConditions.push("mn.meeting_date <= ?")
      queryParams.push(filterDateTo)
    }

    const whereClause = whereConditions.length > 0 
      ? "WHERE " + whereConditions.join(" AND ")
      : ""

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM meeting_notes mn ${whereClause}`,
      queryParams
    )
    const total = countResult[0].total

    // Get paginated data - PERBAIKAN DI SINI
    const [rows] = await pool.query(
      `SELECT 
        mn.*,
        supervisor.name as supervisor_name,
        creator.name as creator_name,
        (SELECT COUNT(*) FROM meeting_participants WHERE meeting_note_id = mn.id) as participant_count,
        (SELECT COUNT(*) FROM meeting_result_sections WHERE meeting_note_id = mn.id) as section_count,
        (SELECT COUNT(*) FROM meeting_attachments WHERE meeting_note_id = mn.id) as attachment_count
      FROM meeting_notes mn
      LEFT JOIN users supervisor ON mn.supervisor_id = supervisor.id
      LEFT JOIN users creator ON mn.created_by = creator.id
      ${whereClause}
      ORDER BY mn.meeting_date DESC, mn.meeting_time_start DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    )

    return NextResponse.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("GET meeting notes error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}

// POST - Create new meeting note
export async function POST(req) {
//   const pool = await pool.getpool()
  
  try {
    const user = await verifyToken()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { 
      meeting_name, 
      meeting_date, 
      meeting_time_start,
      meeting_time_end, 
      supervisor_id,
      agenda,
      participants = [],
      result_sections = [],
      attachments = []
    } = body

    // Validasi required fields
    if (!meeting_name || !meeting_date || !meeting_time_start || !meeting_time_end || !supervisor_id || !agenda) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }

    // await pool.beginTransaction()

    // Generate UUID untuk meeting note
    const meetingNoteId = uuidv4()

    // Insert meeting note
    await pool.query(
      `INSERT INTO meeting_notes 
        (id, meeting_name, meeting_date, meeting_time_start, meeting_time_end, supervisor_id, agenda, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [meetingNoteId, meeting_name, meeting_date, meeting_time_start, meeting_time_end, supervisor_id, agenda, user.id]
    )

    // Insert participants
    if (participants.length > 0) {
      const participantValues = participants.map(userId => [meetingNoteId, userId])
      await pool.query(
        `INSERT INTO meeting_participants (meeting_note_id, user_id) VALUES ?`,
        [participantValues]
      )
    }

    // Insert result sections
    if (result_sections.length > 0) {
      for (let i = 0; i < result_sections.length; i++) {
        const section = result_sections[i]
        if (section.section_name && section.section_content) {
          await pool.query(
            `INSERT INTO meeting_result_sections 
              (meeting_note_id, section_name, section_content, order_index)
            VALUES (?, ?, ?, ?)`,
            [meetingNoteId, section.section_name, section.section_content, i]
          )
        }
      }
    }

    // Insert attachments
    if (attachments.length > 0) {
      for (const attachment of attachments) {
        await pool.query(
          `INSERT INTO meeting_attachments 
            (meeting_note_id, file_url, file_name, file_type)
          VALUES (?, ?, ?, ?)`,
          [meetingNoteId, attachment.file_url, attachment.file_name, attachment.file_type || 'image']
        )
      }
    }

    // await pool.commit()

    return NextResponse.json({ 
      message: "Notulensi berhasil dibuat",
      id: meetingNoteId
    }, { status: 201 })

  } catch (error) {
    // await pool.rollback()
    console.error("POST meeting notes error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  } finally {
    // pool.release()
    console.log("yes")
  }
}