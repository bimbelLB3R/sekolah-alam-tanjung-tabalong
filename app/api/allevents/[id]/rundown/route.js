// app/api/events/[id]/rundown/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const rundownSchema = z.object({
  time_start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Format waktu tidak valid'),
  time_end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Format waktu tidak valid').optional().or(z.literal('')),
  activity: z.string().min(3, 'Aktivitas minimal 3 karakter'),
  description: z.string().optional(),
  person_in_charge: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional()
});

// GET - List rundown
export async function GET(request, { params }) {
  try {
    const { id } =await params;

    const [rundowns] = await pool.query(
      'SELECT * FROM event_rundowns WHERE event_id = ? ORDER BY sort_order ASC, time_start ASC',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: rundowns
    });
  } catch (error) {
    console.error('Error fetching rundowns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rundowns' },
      { status: 500 }
    );
  }
}

// POST - Add rundown item
export async function POST(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();

    // Validasi dengan Zod
    const validatedData = rundownSchema.parse(body);

    // Get max sort_order
    const [maxOrder] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) as max_order FROM event_rundowns WHERE event_id = ?',
      [event_id]
    );

    const [result] = await pool.query(
      `INSERT INTO event_rundowns 
       (event_id, time_start, time_end, activity, description, person_in_charge, location, notes, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        validatedData.time_start,
        validatedData.time_end || null,
        validatedData.activity,
        validatedData.description || null,
        validatedData.person_in_charge || null,
        validatedData.location || null,
        validatedData.notes || null,
        maxOrder[0].max_order + 1
      ]
    );

    const [newRundown] = await pool.query(
      'SELECT * FROM event_rundowns WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: newRundown[0],
      message: 'Item rundown berhasil ditambahkan'
    }, { status: 201 });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating rundown:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create rundown item' },
      { status: 500 }
    );
  }
}

// PUT - Update rundown item
export async function PUT(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();
    const { rundown_id, ...updateData } = body;

    if (!rundown_id) {
      return NextResponse.json(
        { success: false, error: 'rundown_id is required' },
        { status: 400 }
      );
    }

    // Validasi dengan Zod
    const validatedData = rundownSchema.parse(updateData);

    const [result] = await pool.query(
      `UPDATE event_rundowns 
       SET time_start = ?, time_end = ?, activity = ?, description = ?,
           person_in_charge = ?, location = ?, notes = ?
       WHERE id = ? AND event_id = ?`,
      [
        validatedData.time_start,
        validatedData.time_end || null,
        validatedData.activity,
        validatedData.description || null,
        validatedData.person_in_charge || null,
        validatedData.location || null,
        validatedData.notes || null,
        rundown_id,
        event_id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Item rundown tidak ditemukan' },
        { status: 404 }
      );
    }

    const [updated] = await pool.query(
      'SELECT * FROM event_rundowns WHERE id = ?',
      [rundown_id]
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Item rundown berhasil diupdate'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating rundown:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update rundown item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove rundown item
export async function DELETE(request, { params }) {
  try {
    const { id: event_id } =await params;
    const { searchParams } = new URL(request.url);
    const rundown_id = searchParams.get('rundown_id');

    if (!rundown_id) {
      return NextResponse.json(
        { success: false, error: 'rundown_id is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'DELETE FROM event_rundowns WHERE id = ? AND event_id = ?',
      [rundown_id, event_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Item rundown tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item rundown berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting rundown:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete rundown item' },
      { status: 500 }
    );
  }
}

// PATCH - Reorder rundown (for drag & drop)
export async function PATCH(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();
    const { orders } = body; // Array of {id, sort_order}

    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { success: false, error: 'orders must be an array' },
        { status: 400 }
      );
    }

    // Update sort_order untuk setiap rundown item
    // const connection = await pool.getConnection();
    // await connection.beginTransaction();

    try {
      for (const item of orders) {
        await pool.query(
          'UPDATE event_rundowns SET sort_order = ? WHERE id = ? AND event_id = ?',
          [item.sort_order, item.id, event_id]
        );
      }

    //   await connection.commit();
    //   connection.release();

      return NextResponse.json({
        success: true,
        message: 'Urutan berhasil diupdate'
      });

    } catch (error) {
    //   await connection.rollback();
    //   connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Error reordering rundown:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder rundown' },
      { status: 500 }
    );
  }
}