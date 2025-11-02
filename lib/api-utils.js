// lib/api-utils.js
import { NextResponse } from 'next/server';

/**
 * Standard success response
 */
export function successResponse(data, message = null, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message })
    },
    { status }
  );
}

/**
 * Standard error response
 */
export function errorResponse(error, status = 500) {
  console.error('API Error:', error);
  
  return NextResponse.json(
    {
      success: false,
      error: typeof error === 'string' ? error : error.message || 'Internal server error'
    },
    { status }
  );
}

/**
 * Validation error response (untuk Zod)
 */
export function validationErrorResponse(zodError) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validasi gagal',
      details: zodError.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    },
    { status: 400 }
  );
}

/**
 * Not found response
 */
export function notFoundResponse(resource = 'Resource') {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} tidak ditemukan`
    },
    { status: 404 }
  );
}

/**
 * Handle database transaction
 */
export async function withTransaction(pool, callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Parse query parameters with defaults
 */
export function parseQueryParams(searchParams, defaults = {}) {
  const params = {};
  
  for (const [key, defaultValue] of Object.entries(defaults)) {
    const value = searchParams.get(key);
    params[key] = value !== null ? value : defaultValue;
  }
  
  return params;
}

/**
 * Build dynamic WHERE clause
 */
export function buildWhereClause(conditions) {
  const clauses = [];
  const params = [];

  for (const [key, value] of Object.entries(conditions)) {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        clauses.push(`${key} IN (?)`);
        params.push(value);
      } else if (typeof value === 'object' && value.operator) {
        clauses.push(`${key} ${value.operator} ?`);
        params.push(value.value);
      } else {
        clauses.push(`${key} = ?`);
        params.push(value);
      }
    }
  }

  return {
    clause: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params
  };
}

/**
 * Paginate results
 */
export function paginate(query, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return {
    query: `${query} LIMIT ? OFFSET ?`,
    params: [parseInt(limit), parseInt(offset)]
  };
}

/**
 * Format date untuk MySQL
 */
export function formatDateForDB(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Format time untuk MySQL
 */
export function formatTimeForDB(time) {
  if (!time) return null;
  // Ensure format HH:MM:SS
  const parts = time.split(':');
  if (parts.length === 2) {
    return `${parts[0]}:${parts[1]}:00`;
  }
  return time;
}