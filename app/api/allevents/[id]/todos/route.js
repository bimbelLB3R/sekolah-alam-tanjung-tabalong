// app/api/events/[id]/todos/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { todoSchema } from '@/lib/validations';

// GET - List todos
export async function GET(request, { params }) {
  try {
    const { id } =await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let query = 'SELECT * FROM event_todos WHERE event_id = ?';
    const queryParams = [id];

    if (status) {
      query += ' AND status = ?';
      queryParams.push(status);
    }

    if (priority) {
      query += ' AND priority = ?';
      queryParams.push(priority);
    }

    query += ' ORDER BY sort_order ASC, deadline ASC, id DESC';

    const [todos] = await pool.query(query, queryParams);

    return NextResponse.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST - Add todo
export async function POST(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();

    // Validasi dengan Zod
    const validatedData = todoSchema.parse(body);

    // Get max sort_order
    const [maxOrder] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) as max_order FROM event_todos WHERE event_id = ?',
      [event_id]
    );

    const [result] = await pool.query(
      `INSERT INTO event_todos 
       (event_id, title, description, assigned_to, status, priority, deadline, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        validatedData.title,
        validatedData.description || null,
        validatedData.assigned_to || null,
        validatedData.status,
        validatedData.priority,
        validatedData.deadline || null,
        maxOrder[0].max_order + 1
      ]
    );

    const [newTodo] = await pool.query(
      'SELECT * FROM event_todos WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: newTodo[0],
      message: 'Todo berhasil ditambahkan'
    }, { status: 201 });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating todo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

// PUT - Update todo
export async function PUT(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();
    const { todo_id, ...updateData } = body;

    if (!todo_id) {
      return NextResponse.json(
        { success: false, error: 'todo_id is required' },
        { status: 400 }
      );
    }

    // Validasi dengan Zod
    const validatedData = todoSchema.parse(updateData);

    // Set completed_at jika status berubah ke completed
    let completedAt = null;
    if (validatedData.status === 'completed') {
      const [currentTodo] = await pool.query(
        'SELECT status FROM event_todos WHERE id = ?',
        [todo_id]
      );
      if (currentTodo[0] && currentTodo[0].status !== 'completed') {
        completedAt = new Date();
      }
    }

    const [result] = await pool.query(
      `UPDATE event_todos 
       SET title = ?, description = ?, assigned_to = ?, status = ?, 
           priority = ?, deadline = ?, completed_at = COALESCE(?, completed_at)
       WHERE id = ? AND event_id = ?`,
      [
        validatedData.title,
        validatedData.description || null,
        validatedData.assigned_to || null,
        validatedData.status,
        validatedData.priority,
        validatedData.deadline || null,
        completedAt,
        todo_id,
        event_id
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Todo tidak ditemukan' },
        { status: 404 }
      );
    }

    const [updated] = await pool.query(
      'SELECT * FROM event_todos WHERE id = ?',
      [todo_id]
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Todo berhasil diupdate'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating todo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE - Remove todo
export async function DELETE(request, { params }) {
  try {
    const { id: event_id } =await params;
    const { searchParams } = new URL(request.url);
    const todo_id = searchParams.get('todo_id');

    if (!todo_id) {
      return NextResponse.json(
        { success: false, error: 'todo_id is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'DELETE FROM event_todos WHERE id = ? AND event_id = ?',
      [todo_id, event_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Todo tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Todo berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}

// PATCH - Update todo status (quick update)
export async function PATCH(request, { params }) {
  try {
    const { id: event_id } =await params;
    const body = await request.json();
    const { todo_id, status } = body;

    if (!todo_id || !status) {
      return NextResponse.json(
        { success: false, error: 'todo_id and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    let completedAt = null;
    if (status === 'completed') {
      completedAt = new Date();
    }

    const [result] = await pool.query(
      `UPDATE event_todos 
       SET status = ?, completed_at = ?
       WHERE id = ? AND event_id = ?`,
      [status, completedAt, todo_id, event_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Todo tidak ditemukan' },
        { status: 404 }
      );
    }

    const [updated] = await pool.query(
      'SELECT * FROM event_todos WHERE id = ?',
      [todo_id]
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Status berhasil diupdate'
    });

  } catch (error) {
    console.error('Error updating todo status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update status' },
      { status: 500 }
    );
  }
}