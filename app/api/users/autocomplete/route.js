// // app/api/users/autocomplete/route.js
// import { NextResponse } from 'next/server';
// import pool from '@/lib/db';

// // GET - Search users by name
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const search = searchParams.get('search') || '';
//     const limit = parseInt(searchParams.get('limit') || '10');

//     let query = 'SELECT id, name, email FROM users WHERE 1=1';
//     const params = [];

//     if (search) {
//       query += ' AND (name LIKE ? OR email LIKE ?)';
//       params.push(`%${search}%`, `%${search}%`);
//     }

//     query += ' ORDER BY name ASC LIMIT ?';
//     params.push(limit);

//     const [users] = await pool.query(query, params);

//     return NextResponse.json({
//       success: true,
//       data: users
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch users' },
//       { status: 500 }
//     );
//   }
// }

// app/api/users/autocomplete/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Search users by name, only for roles guru and manajemen
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        r.name AS role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE r.name IN ('guru', 'manajemen')
    `;
    const params = [];

    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY u.name ASC LIMIT ?';
    params.push(limit);

    const [users] = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
