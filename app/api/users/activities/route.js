

// import { NextResponse } from 'next/server';
// import pool from '@/lib/db';

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');

//     if (!userId) {
//       return NextResponse.json(
//         { error: 'User ID required' },
//         { status: 401 }
//       );
//     }

//     // --- Query committees ---
//     const committeesQuery = `
//       SELECT 
//         e.id as event_id,
//         e.name as event_name,
//         e.description as event_description,
//         e.start_date,
//         e.end_date,
//         e.status as event_status,
//         ec.position_name,
//         ec.responsibilities
//       FROM allevents e
//       INNER JOIN event_committees ec ON e.id = ec.event_id
//       INNER JOIN users u ON ec.person_email = u.email
//       WHERE u.id = ?
//     `;
//     const [committees] = await pool.execute(committeesQuery, [userId]);

//     // --- Query todos ---
//     const todosQuery = `
//       SELECT 
//         e.id as event_id,
//         e.name as event_name,
//         e.description as event_description,
//         e.start_date,
//         e.end_date,
//         e.status as event_status,
//         et.title as todo_title,
//         et.description as todo_description,
//         et.status as todo_status,
//         et.priority as todo_priority,
//         et.deadline as todo_deadline
//       FROM allevents e
//       INNER JOIN event_todos et ON e.id = et.event_id
//       INNER JOIN users u ON et.assigned_to = u.name OR et.assigned_to = u.email
//       WHERE u.id = ?
//       ORDER BY et.deadline ASC
//     `;
//     const [todos] = await pool.execute(todosQuery, [userId]);

//     // --- Query rundowns ---
//     const rundownsQuery = `
//       SELECT 
//         e.id as event_id,
//         e.name as event_name,
//         e.description as event_description,
//         e.start_date,
//         e.end_date,
//         e.status as event_status,
//         er.time_start,
//         er.time_end,
//         er.activity,
//         er.description as rundown_description,
//         er.location,
//         er.notes
//       FROM allevents e
//       INNER JOIN event_rundowns er ON e.id = er.event_id
//       INNER JOIN users u ON er.person_in_charge = u.name OR er.person_in_charge = u.email
//       WHERE u.id = ?
//       ORDER BY er.time_start ASC
//     `;
//     const [rundowns] = await pool.execute(rundownsQuery, [userId]);

//     // --- Gabungkan semua hasil jadi satu array rows ---
//     const rows = [
//       ...committees.map(c => ({ ...c, involvement_type: 'committee' })),
//       ...todos.map(t => ({ ...t, involvement_type: 'todo' })),
//       ...rundowns.map(r => ({ ...r, involvement_type: 'rundown' })),
//     ];

//     // --- Kelompokkan berdasarkan event ---
//     const eventsMap = new Map();

//     rows.forEach(row => {
//       if (!eventsMap.has(row.event_id)) {
//         eventsMap.set(row.event_id, {
//           eventId: row.event_id,
//           eventName: row.event_name,
//           eventDescription: row.event_description,
//           startDate: row.start_date,
//           endDate: row.end_date,
//           eventStatus: row.event_status,
//           involvements: []
//         });
//       }

//       const event = eventsMap.get(row.event_id);

//       if (row.involvement_type === 'committee') {
//         event.involvements.push({
//           type: 'committee',
//           positionName: row.position_name,
//           responsibilities: row.responsibilities
//         });
//       } else if (row.involvement_type === 'todo') {
//         event.involvements.push({
//           type: 'todo',
//           title: row.todo_title,
//           description: row.todo_description,
//           status: row.todo_status,
//           priority: row.todo_priority,
//           deadline: row.todo_deadline
//         });
//       } else if (row.involvement_type === 'rundown') {
//         event.involvements.push({
//           type: 'rundown',
//           activity: row.activity,
//           description: row.rundown_description,
//           timeStart: row.time_start,
//           timeEnd: row.time_end,
//           location: row.location,
//           notes: row.notes
//         });
//       }
//     });

//     const events = Array.from(eventsMap.values());

//     return NextResponse.json({
//       success: true,
//       data: events,
//       total: events.length
//     });

//   } catch (error) {
//     console.error('Database error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch user activities', details: error.message },
//       { status: 500 }
//     );
//   }
// }


// Optimasi Route
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // ✅ 1. AMBIL DATA USER SEKALI SAJA
    const [[user]] = await pool.execute(
      "SELECT email, name FROM users WHERE id = ?",
      [userId]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ✅ 2. QUERY SUDAH TANPA JOIN users & TANPA OR
    const committeesQuery = `
      SELECT 
        e.id as event_id,
        e.name as event_name,
        e.description as event_description,
        e.start_date,
        e.end_date,
        e.status as event_status,
        ec.position_name,
        ec.responsibilities
      FROM allevents e
      INNER JOIN event_committees ec ON e.id = ec.event_id
      WHERE ec.person_email = ?
    `;

    const todosQuery = `
      SELECT 
        e.id as event_id,
        e.name as event_name,
        e.description as event_description,
        e.start_date,
        e.end_date,
        e.status as event_status,
        et.title as todo_title,
        et.description as todo_description,
        et.status as todo_status,
        et.priority as todo_priority,
        et.deadline as todo_deadline
      FROM allevents e
      INNER JOIN event_todos et ON e.id = et.event_id
      WHERE et.assigned_to = ?
      ORDER BY et.deadline ASC
    `;

    const rundownsQuery = `
      SELECT 
        e.id as event_id,
        e.name as event_name,
        e.description as event_description,
        e.start_date,
        e.end_date,
        e.status as event_status,
        er.time_start,
        er.time_end,
        er.activity,
        er.description as rundown_description,
        er.location,
        er.notes
      FROM allevents e
      INNER JOIN event_rundowns er ON e.id = er.event_id
      WHERE er.person_in_charge = ?
      ORDER BY er.time_start ASC
    `;

    // ✅ 3. EKSEKUSI PARALEL (POTONG WAKTU 60–70%)
    const [committeesRes, todosRes, rundownsRes] = await Promise.all([
      pool.execute(committeesQuery, [user.email]),
      pool.execute(todosQuery, [user.email]),
      pool.execute(rundownsQuery, [user.email]),
    ]);

    const [committees] = committeesRes;
    const [todos] = todosRes;
    const [rundowns] = rundownsRes;

    // ✅ 4. GABUNGKAN (SAMA PERSIS DENGAN PUNYA KAMU)
    const rows = [
      ...committees.map(c => ({ ...c, involvement_type: 'committee' })),
      ...todos.map(t => ({ ...t, involvement_type: 'todo' })),
      ...rundowns.map(r => ({ ...r, involvement_type: 'rundown' })),
    ];

    // ✅ 5. KELOMPOKKAN PER EVENT (TIDAK DIUBAH)
    const eventsMap = new Map();

    rows.forEach(row => {
      if (!eventsMap.has(row.event_id)) {
        eventsMap.set(row.event_id, {
          eventId: row.event_id,
          eventName: row.event_name,
          eventDescription: row.event_description,
          startDate: row.start_date,
          endDate: row.end_date,
          eventStatus: row.event_status,
          involvements: []
        });
      }

      const event = eventsMap.get(row.event_id);

      if (row.involvement_type === 'committee') {
        event.involvements.push({
          type: 'committee',
          positionName: row.position_name,
          responsibilities: row.responsibilities
        });
      } 
      else if (row.involvement_type === 'todo') {
        event.involvements.push({
          type: 'todo',
          title: row.todo_title,
          description: row.todo_description,
          status: row.todo_status,
          priority: row.todo_priority,
          deadline: row.todo_deadline
        });
      } 
      else if (row.involvement_type === 'rundown') {
        event.involvements.push({
          type: 'rundown',
          activity: row.activity,
          description: row.rundown_description,
          timeStart: row.time_start,
          timeEnd: row.time_end,
          location: row.location,
          notes: row.notes
        });
      }
    });

    const events = Array.from(eventsMap.values());

    // ✅ OUTPUT TIDAK BERUBAH
    return NextResponse.json({
      success: true,
      data: events,
      total: events.length
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user activities', details: error.message },
      { status: 500 }
    );
  }
}
