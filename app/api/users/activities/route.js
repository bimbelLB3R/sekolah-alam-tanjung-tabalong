// import { NextResponse } from 'next/server';
// import pool from '@/lib/db';
// // import { getUserFromToken } from '@/lib/getUserFromToken';


// export async function GET(request) {
//   try {
//     // Ambil user dari session/auth - sesuaikan dengan sistem auth Anda
//     // Contoh: const session = await getServerSession();
//     // const userId = session?.user?.id;
//     // const data=await getUserFromToken();
//     // const userId=data?.user?.id;
    
    
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId'); // Untuk development, nanti ganti dengan session
//     // console.log(userId)
//     if (!userId) {
//       return NextResponse.json(
//         { error: 'User ID required' },
//         { status: 401 }
//       );
//     }

//     // const connection = await mysql.createConnection(dbConfig);

//     // Query untuk mengambil semua keterlibatan user
//     const query = `
//       SELECT DISTINCT
//         e.id as event_id,
//         e.name as event_name,
//         e.description as event_description,
//         e.start_date,
//         e.end_date,
//         e.status as event_status,
//         'committee' as involvement_type,
//         ec.position_name,
//         ec.responsibilities,
//         NULL as todo_count,
//         NULL as rundown_count
//       FROM allevents e
//       INNER JOIN event_committees ec ON e.id = ec.event_id
//       INNER JOIN users u ON ec.person_email = u.email
//       WHERE u.id = ?
      
//       UNION
      
//       SELECT DISTINCT
//         e.id as event_id,
//         e.name as event_name,
//         e.description as event_description,
//         e.start_date,
//         e.end_date,
//         e.status as event_status,
//         'todo' as involvement_type,
//         NULL as position_name,
//         NULL as responsibilities,
//         COUNT(DISTINCT et.id) as todo_count,
//         NULL as rundown_count
//       FROM allevents e
//       INNER JOIN event_todos et ON e.id = et.event_id
//       INNER JOIN users u ON et.assigned_to = u.name OR et.assigned_to = u.email
//       WHERE u.id = ?
//       GROUP BY e.id, e.name, e.description, e.start_date, e.end_date, e.status
      
//       UNION
      
//       SELECT DISTINCT
//         e.id as event_id,
//         e.name as event_name,
//         e.description as event_description,
//         e.start_date,
//         e.end_date,
//         e.status as event_status,
//         'rundown' as involvement_type,
//         NULL as position_name,
//         NULL as responsibilities,
//         NULL as todo_count,
//         COUNT(DISTINCT er.id) as rundown_count
//       FROM allevents e
//       INNER JOIN event_rundowns er ON e.id = er.event_id
//       INNER JOIN users u ON er.person_in_charge = u.name OR er.person_in_charge = u.email
//       WHERE u.id = ?
//       GROUP BY e.id, e.name, e.description, e.start_date, e.end_date, e.status
      
//       ORDER BY start_date DESC, event_id;
//     `;

//     const [rows] = await pool.execute(query, [userId, userId, userId]);

//     // Kelompokkan berdasarkan event
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
//       } else if (row.involvement_type === 'todo' && row.todo_count > 0) {
//         event.involvements.push({
//           type: 'todo',
//           count: row.todo_count
//         });
//       } else if (row.involvement_type === 'rundown' && row.rundown_count > 0) {
//         event.involvements.push({
//           type: 'rundown',
//           count: row.rundown_count
//         });
//       }
//     });

//     const events = Array.from(eventsMap.values());

//     // await connection.end();

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

// import { NextResponse } from 'next/server';
// import pool from '@/lib/db';


// export async function GET(request) {
//   try {
//     // Ambil user dari session/auth - sesuaikan dengan sistem auth Anda
//     // Contoh: const session = await getServerSession();
//     // const userId = session?.user?.id;
    
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId'); // Untuk development, nanti ganti dengan session
    
//     if (!userId) {
//       return NextResponse.json(
//         { error: 'User ID required' },
//         { status: 401 }
//       );
//     }

//     // const connection = await mysql.createConnection(dbConfig);

//     // Query untuk mengambil committees
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

//     // Query untuk mengambil todos dengan detail
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

//     // Query untuk mengambil rundowns dengan detail
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

//     const [committees] = await pool.execute(committeesQuery, [userId]);
//     const [todos] = await pool.execute(todosQuery, [userId]);
//     const [rundowns] = await pool.execute(rundownsQuery, [userId]);

//     // Kelompokkan berdasarkan event
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
//       } else if (row.involvement_type === 'todo' && row.todo_count > 0) {
//         event.involvements.push({
//           type: 'todo',
//           count: row.todo_count
//         });
//       } else if (row.involvement_type === 'rundown' && row.rundown_count > 0) {
//         event.involvements.push({
//           type: 'rundown',
//           count: row.rundown_count
//         });
//       }
//     });

//     const events = Array.from(eventsMap.values());

//     // await connection.end();

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

    // --- Query committees ---
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
      INNER JOIN users u ON ec.person_email = u.email
      WHERE u.id = ?
    `;
    const [committees] = await pool.execute(committeesQuery, [userId]);

    // --- Query todos ---
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
      INNER JOIN users u ON et.assigned_to = u.name OR et.assigned_to = u.email
      WHERE u.id = ?
      ORDER BY et.deadline ASC
    `;
    const [todos] = await pool.execute(todosQuery, [userId]);

    // --- Query rundowns ---
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
      INNER JOIN users u ON er.person_in_charge = u.name OR er.person_in_charge = u.email
      WHERE u.id = ?
      ORDER BY er.time_start ASC
    `;
    const [rundowns] = await pool.execute(rundownsQuery, [userId]);

    // --- Gabungkan semua hasil jadi satu array rows ---
    const rows = [
      ...committees.map(c => ({ ...c, involvement_type: 'committee' })),
      ...todos.map(t => ({ ...t, involvement_type: 'todo' })),
      ...rundowns.map(r => ({ ...r, involvement_type: 'rundown' })),
    ];

    // --- Kelompokkan berdasarkan event ---
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
      } else if (row.involvement_type === 'todo') {
        event.involvements.push({
          type: 'todo',
          title: row.todo_title,
          description: row.todo_description,
          status: row.todo_status,
          priority: row.todo_priority,
          deadline: row.todo_deadline
        });
      } else if (row.involvement_type === 'rundown') {
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
