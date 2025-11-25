// app/api/meeting-notes/[id]/route.js
import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

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

// GET - Detail meeting note
export async function GET(req, { params }) {
  try {
    const user = await verifyToken()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get meeting note
    const [rows] = await pool.query(
      `SELECT 
        mn.*,
        supervisor.name as supervisor_name,
        supervisor.email as supervisor_email,
        creator.name as creator_name
      FROM meeting_notes mn
      LEFT JOIN users supervisor ON mn.supervisor_id = supervisor.id
      LEFT JOIN users creator ON mn.created_by = creator.id
      WHERE mn.id = ?`,
      [id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Notulensi tidak ditemukan" }, { status: 404 })
    }

    const meetingNote = rows[0]

    // Get participants
    const [participants] = await pool.query(
      `SELECT u.id, u.name, u.email
      FROM meeting_participants mp
      JOIN users u ON mp.user_id = u.id
      WHERE mp.meeting_note_id = ?`,
      [id]
    )

    // Get result sections
    const [sections] = await pool.query(
      `SELECT id, section_name, section_content, order_index
      FROM meeting_result_sections
      WHERE meeting_note_id = ?
      ORDER BY order_index`,
      [id]
    )

    // Get attachments
    const [attachments] = await pool.query(
      `SELECT id, file_url, file_name, file_type, uploaded_at
      FROM meeting_attachments
      WHERE meeting_note_id = ?
      ORDER BY uploaded_at`,
      [id]
    )

    return NextResponse.json({
      ...meetingNote,
      participants,
      result_sections: sections,
      attachments
    })

  } catch (error) {
    console.error("GET meeting note detail error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}

// PUT - Update meeting note
export async function PUT(req, { params }) {
//   const pool = await pool.getConnection()
  
  try {
    const user = await verifyToken()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
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

    // await connection.beginTransaction()

    // Update meeting note
    await pool.query(
      `UPDATE meeting_notes 
      SET meeting_name = ?, meeting_date = ?, meeting_time_start = ?, meeting_time_end = ?, 
          supervisor_id = ?, agenda = ?
      WHERE id = ?`,
      [meeting_name, meeting_date, meeting_time_start, meeting_time_end, supervisor_id, agenda, id]
    )

    // Delete existing participants and insert new ones
    await pool.query(`DELETE FROM meeting_participants WHERE meeting_note_id = ?`, [id])
    if (participants.length > 0) {
      const participantValues = participants.map(userId => [id, userId])
      await pool.query(
        `INSERT INTO meeting_participants (meeting_note_id, user_id) VALUES ?`,
        [participantValues]
      )
    }

    // Delete existing sections and insert new ones
    await pool.query(`DELETE FROM meeting_result_sections WHERE meeting_note_id = ?`, [id])
    if (result_sections.length > 0) {
      for (let i = 0; i < result_sections.length; i++) {
        const section = result_sections[i]
        await pool.query(
          `INSERT INTO meeting_result_sections 
            (meeting_note_id, section_name, section_content, order_index)
          VALUES (?, ?, ?, ?)`,
          [id, section.section_name, section.section_content, i]
        )
      }
    }

    // Update attachments (hanya tambah yang baru, tidak hapus yang lama)
    if (attachments.length > 0) {
      for (const attachment of attachments) {
        if (!attachment.id) { // Only insert new attachments
          await pool.query(
            `INSERT INTO meeting_attachments 
              (meeting_note_id, file_url, file_name, file_type)
            VALUES (?, ?, ?, ?)`,
            [id, attachment.file_url, attachment.file_name, attachment.file_type]
          )
        }
      }
    }

    // await pool.commit()

    return NextResponse.json({ message: "Notulensi berhasil diupdate" })

  } catch (error) {
    await pool.rollback()
    console.error("PUT meeting notes error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  } finally {
    // pool.release()
    console.log("yes")
  }
}

// DELETE - Delete meeting note
export async function DELETE(req, { params }) {
  try {
    const user = await verifyToken()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get attachments sebelum dihapus untuk hapus dari S3
    const [attachments] = await pool.query(
      `SELECT file_url FROM meeting_attachments WHERE meeting_note_id = ?`,
      [id]
    )

    // Delete dari database (akan cascade ke semua related tables)
    await pool.query(`DELETE FROM meeting_notes WHERE id = ?`, [id])

    // Hapus file dari S3
    for (const attachment of attachments) {
      try {
        // Extract key dari URL
        const url = new URL(attachment.file_url)
        const key = url.pathname.substring(1) // Remove leading slash

        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        }))
      } catch (s3Error) {
        console.error("S3 delete error:", s3Error)
        // Continue even if S3 delete fails
      }
    }

    return NextResponse.json({ message: "Notulensi berhasil dihapus" })

  } catch (error) {
    console.error("DELETE meeting notes error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}