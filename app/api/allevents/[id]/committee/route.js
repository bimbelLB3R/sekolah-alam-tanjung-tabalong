// app/api/events/[id]/committee/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { committeeSchema } from '@/lib/validations';

// GET - List committee members
export async function GET(request, { params }) {
  try {
    const { id } =await params;

    const [committees] = await pool.query(
      'SELECT * FROM event_committees WHERE event_id = ? ORDER BY sort_order ASC, id ASC',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: committees
    });
  } catch (error) {
    console.error('Error fetching committees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch committees' },
      { status: 500 }
    );
  }
}

// POST - Add committee member
export async function POST(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();

    // Validasi dengan Zod
    const validatedData = committeeSchema.parse(body);

    // Get max sort_order
    const [maxOrder] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) as max_order FROM event_committees WHERE event_id = ?',
      [event_id]
    );

    const [result] = await pool.query(
      `INSERT INTO event_committees 
       (event_id, position_name, person_name, person_email, person_phone, responsibilities, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        validatedData.position_name,
        validatedData.person_name,
        validatedData.person_email || null,
        validatedData.person_phone || null,
        validatedData.responsibilities || null,
        maxOrder[0].max_order + 1
      ]
    );

    const [newCommittee] = await pool.query(
      'SELECT * FROM event_committees WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: newCommittee[0],
      message: 'Anggota panitia berhasil ditambahkan'
    }, { status: 201 });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating committee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create committee member' },
      { status: 500 }
    );
  }
}

// PUT - Update committee member
export async function PUT(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();
    const { committee_id, ...updateData } = body;

    if (!committee_id) {
      return NextResponse.json(
        { success: false, error: 'committee_id is required' },
        { status: 400 }
      );
    }

    // Validasi dengan Zod
    const validatedData = committeeSchema.parse(updateData);

    const [result] = await pool.query(
      `UPDATE event_committees 
       SET position_name = ?, person_name = ?, person_email = ?, 
           person_phone = ?, responsibilities = ?
       WHERE id = ? AND event_id = ?`,
      [
        validatedData.position_name,
        validatedData.person_name,
        validatedData.person_email || null,
        validatedData.person_phone || null,
        validatedData.responsibilities || null,
        committee_id,
        event_id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Committee member tidak ditemukan' },
        { status: 404 }
      );
    }

    const [updated] = await pool.query(
      'SELECT * FROM event_committees WHERE id = ?',
      [committee_id]
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Anggota panitia berhasil diupdate'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating committee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update committee member' },
      { status: 500 }
    );
  }
}

// DELETE - Remove committee member
export async function DELETE(request, { params }) {
  try {
    const { id: event_id } =await params;
    const { searchParams } = new URL(request.url);
    const committee_id = searchParams.get('committee_id');

    if (!committee_id) {
      return NextResponse.json(
        { success: false, error: 'committee_id is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'DELETE FROM event_committees WHERE id = ? AND event_id = ?',
      [committee_id, event_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Committee member tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Anggota panitia berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting committee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete committee member' },
      { status: 500 }
    );
  }
}

// app/api/events/[id]/committee/reorder/route.js
// PATCH - Reorder committee (for drag & drop)
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

    // Update sort_order untuk setiap committee
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const item of orders) {
        await connection.query(
          'UPDATE event_committees SET sort_order = ? WHERE id = ? AND event_id = ?',
          [item.sort_order, item.id, event_id]
        );
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({
        success: true,
        message: 'Urutan berhasil diupdate'
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Error reordering committee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder committee' },
      { status: 500 }
    );
  }
}