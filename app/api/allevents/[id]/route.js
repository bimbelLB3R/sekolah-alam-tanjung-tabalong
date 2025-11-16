// app/api/events/[id]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { eventSchema } from '@/lib/validations';
import { dateInputToIsoUTC } from '@/lib/formatDateInputToIso';

// GET - Detail event by ID
export async function GET(request, { params }) {
  try {
    const { id } =await params;

    const [events] = await pool.query(
      'SELECT * FROM allevents WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    // Get related data counts
    const [committeeCount] = await pool.query(
      'SELECT COUNT(*) as count FROM event_committees WHERE event_id = ?',
      [id]
    );

    const [todoStats] = await pool.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress
       FROM event_todos 
       WHERE event_id = ?`,
      [id]
    );

    const [rundownCount] = await pool.query(
      'SELECT COUNT(*) as count FROM event_rundowns WHERE event_id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...events[0],
        stats: {
          committee_count: committeeCount[0].count,
          todo_total: todoStats[0].total || 0,
          todo_completed: todoStats[0].completed || 0,
          todo_pending: todoStats[0].pending || 0,
          todo_in_progress: todoStats[0].in_progress || 0,
          rundown_count: rundownCount[0].count
        }
      }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(request, { params }) {
  try {
    const { id } =await params;
    const body = await request.json();

    // Validasi dengan Zod
    const validatedData = eventSchema.parse(body);
        const [result] = await pool.query(
      `UPDATE allevents 
       SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?
       WHERE id = ?`,
      [
        validatedData.name,
        validatedData.description || null,
        validatedData.start_date,
        validatedData.end_date,
        validatedData.status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    const [updatedEvent] = await pool.query(
      'SELECT * FROM allevents WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedEvent[0],
      message: 'Event berhasil diupdate'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus event
export async function DELETE(request, { params }) {
  try {
    const { id } =await params;

    // Check if event exists
    const [events] = await pool.query(
      'SELECT * FROM allevents WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Event tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete event (cascade akan otomatis hapus committee, todos, rundown)
    await pool.query('DELETE FROM allevents WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Event berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}