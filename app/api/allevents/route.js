// app/api/events/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { eventSchema } from '@/lib/validations';

// GET - List semua events
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const year = searchParams.get('year');

    let query = 'SELECT * FROM allevents WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (year) {
      query += ' AND YEAR(start_date) = ?';
      params.push(year);
    }

    query += ' ORDER BY start_date DESC';

    const [events] = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validasi dengan Zod
    const validatedData = eventSchema.parse(body);

    const [result] = await pool.query(
      'INSERT INTO allevents (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [
        validatedData.name,
        validatedData.description || null,
        validatedData.start_date,
        validatedData.end_date,
        validatedData.status || 'planning'
      ]
    );

    const [newEvent] = await pool.query(
      'SELECT * FROM events WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: newEvent[0],
      message: 'Event berhasil dibuat'
    }, { status: 201 });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}