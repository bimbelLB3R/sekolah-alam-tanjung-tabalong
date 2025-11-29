// app/api/events/[id]/budget/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { budgetSchema } from '@/lib/validations';

// GET - List budget items untuk event
export async function GET(request, { params }) {
  try {
    const { id } =await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // pemasukan / pengeluaran

    let query = 'SELECT * FROM anggaran_kegiatan WHERE event_id = ?';
    const queryParams = [id];

    if (type) {
      query += ' AND type = ?';
      queryParams.push(type);
    }

    query += ' ORDER BY date DESC, id DESC';

    const [budgets] = await pool.query(query, queryParams);

    // Calculate summary
    const [summary] = await pool.query(
      `SELECT 
        SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END) as total_pemasukan,
        SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END) as total_pengeluaran,
        (SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END) - 
         SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END)) as saldo
       FROM anggaran_kegiatan
       WHERE event_id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: budgets,
      summary: summary[0] || {
        total_pemasukan: 0,
        total_pengeluaran: 0,
        saldo: 0
      }
    });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget' },
      { status: 500 }
    );
  }
}

// POST - Add budget item
export async function POST(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();

    // Validasi dengan Zod
    const validatedData = budgetSchema.parse(body);

    const [result] = await pool.query(
      `INSERT INTO anggaran_kegiatan 
       (event_id, type, category, description, amount, date, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        validatedData.type,
        validatedData.category,
        validatedData.description || null,
        validatedData.amount,
        validatedData.date,
        validatedData.notes || null
      ]
    );

    const [newBudget] = await pool.query(
      'SELECT * FROM anggaran_kegiatan WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: newBudget[0],
      message: 'Item anggaran berhasil ditambahkan'
    }, { status: 201 });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating budget:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create budget item' },
      { status: 500 }
    );
  }
}

// PUT - Update budget item
export async function PUT(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();
    const { budget_id, ...updateData } = body;

    if (!budget_id) {
      return NextResponse.json(
        { success: false, error: 'budget_id is required' },
        { status: 400 }
      );
    }

    // Validasi dengan Zod
    const validatedData = budgetSchema.parse(updateData);

    const [result] = await pool.query(
      `UPDATE anggaran_kegiatan 
       SET type = ?, category = ?, description = ?, amount = ?, date = ?, notes = ?
       WHERE id = ? AND event_id = ?`,
      [
        validatedData.type,
        validatedData.category,
        validatedData.description || null,
        validatedData.amount,
        validatedData.date,
        validatedData.notes || null,
        budget_id,
        event_id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Item anggaran tidak ditemukan' },
        { status: 404 }
      );
    }

    const [updated] = await pool.query(
      'SELECT * FROM anggaran_kegiatan WHERE id = ?',
      [budget_id]
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Item anggaran berhasil diupdate'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating budget:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update budget item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove budget item
export async function DELETE(request, { params }) {
  try {
    const { id: event_id } =await params;
    const { searchParams } = new URL(request.url);
    const budget_id = searchParams.get('budget_id');

    if (!budget_id) {
      return NextResponse.json(
        { success: false, error: 'budget_id is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'DELETE FROM anggaran_kegiatan WHERE id = ? AND event_id = ?',
      [budget_id, event_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Item anggaran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item anggaran berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget item' },
      { status: 500 }
    );
  }
}