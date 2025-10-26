// // app/api/ijin-karyawan/route.js
// import { NextResponse } from 'next/server';
// import pool from '@/lib/db';



// export async function POST(request) {
// //   let connection;
  
//   try {
//     // Parse request body
//     const body = await request.json();
//     const { 
//       user_id, 
//       jenis_ijin, 
//       tanggal_ijin, 
//       jam_keluar, 
//       jam_kembali, 
//       alasan_ijin, 
//       pemberi_ijin_id 
//     } = body;

//     // Validasi input
//     if (!user_id || !jenis_ijin || !tanggal_ijin || !alasan_ijin || !pemberi_ijin_id) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Data tidak lengkap. Mohon isi semua field yang wajib.' 
//         },
//         { status: 400 }
//       );
//     }

//     // Validasi jenis ijin
//     if (!['keluar', 'tidak_masuk'].includes(jenis_ijin)) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Jenis ijin tidak valid. Harus keluar atau tidak_masuk.' 
//         },
//         { status: 400 }
//       );
//     }

//     // Validasi jam untuk ijin keluar
//     if (jenis_ijin === 'keluar' && (!jam_keluar || !jam_kembali)) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Jam keluar dan jam kembali wajib diisi untuk ijin keluar.' 
//         },
//         { status: 400 }
//       );
//     }

//     // Validasi panjang alasan
//     if (alasan_ijin.length < 10) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Alasan ijin minimal 10 karakter.' 
//         },
//         { status: 400 }
//       );
//     }


//     // Cek apakah user_id ada di tabel users
//     const [userCheck] = await pool.execute(
//       'SELECT id, name FROM users WHERE id = ?',
//       [user_id]
//     );

//     if (userCheck.length === 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'User tidak ditemukan.' 
//         },
//         { status: 404 }
//       );
//     }

//     // Cek apakah pemberi_ijin_id ada di tabel users
//     const [pemberiCheck] = await pool.execute(
//       'SELECT id, name FROM users WHERE id = ?',
//       [pemberi_ijin_id]
//     );

//     if (pemberiCheck.length === 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Pemberi ijin tidak ditemukan.' 
//         },
//         { status: 404 }
//       );
//     }

//     // Insert data ke database
//     const [result] = await pool.execute(
//       `INSERT INTO ijin_karyawan 
//         (user_id, jenis_ijin, tanggal_ijin, jam_keluar, jam_kembali, alasan_ijin, pemberi_ijin_id, dipotong_tunjangan) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         user_id,
//         jenis_ijin,
//         tanggal_ijin,
//         jenis_ijin === 'keluar' ? jam_keluar : null,
//         jenis_ijin === 'keluar' ? jam_kembali : null,
//         alasan_ijin,
//         pemberi_ijin_id,
//         false // default tidak dipotong
//       ]
//     );

//     // Ambil data yang baru saja diinsert dengan JOIN
//     const [newData] = await pool.execute(
//       `SELECT 
//         ik.id,
//         ik.user_id,
//         u.name as nama_karyawan,
//         u.email as email_karyawan,
//         ik.jenis_ijin,
//         ik.tanggal_ijin,
//         ik.jam_keluar,
//         ik.jam_kembali,
//         ik.alasan_ijin,
//         ik.pemberi_ijin_id,
//         p.name as nama_pemberi_ijin,
//         ik.dipotong_tunjangan,
//         ik.created_at
//       FROM ijin_karyawan ik
//       INNER JOIN users u ON ik.user_id = u.id
//       INNER JOIN users p ON ik.pemberi_ijin_id = p.id
//       WHERE ik.id = ?`,
//       [result.insertId]
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Ijin berhasil diajukan.',
//         data: newData[0]
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error('Error inserting ijin:', error);
    
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Terjadi kesalahan server.',
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   } finally {
//     console.log("yes")
//   }
// }


// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const user_id = searchParams.get('user_id');
    
//     // Parse dan pastikan integer
//     const limitParam = searchParams.get('limit');
//     const offsetParam = searchParams.get('offset');
//     const limit = limitParam ? parseInt(limitParam, 10) : 10;
//     const offset = offsetParam ? parseInt(offsetParam, 10) : 0;
    
//     // Validasi limit dan offset
//     if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Parameter limit dan offset harus berupa angka positif' 
//         },
//         { status: 400 }
//       );
//     }

//     // Base query
//     let query = `
//       SELECT 
//         ik.id,
//         ik.user_id,
//         u.name AS nama_karyawan,
//         u.email AS email_karyawan,
//         ik.jenis_ijin,
//         ik.tanggal_ijin,
//         ik.jam_keluar,
//         ik.jam_kembali,
//         ik.alasan_ijin,
//         ik.pemberi_ijin_id,
//         p.name AS nama_pemberi_ijin,
//         ik.dipotong_tunjangan,
//         ik.created_at,
//         ik.updated_at
//       FROM ijin_karyawan ik
//       INNER JOIN users u ON ik.user_id = u.id
//       INNER JOIN users p ON ik.pemberi_ijin_id = p.id
//     `;

//     const params = [];
//     const conditions = [];

//     // Tambahkan filter jika ada user_id
//     if (user_id) {
//       conditions.push('ik.user_id = ?');
//       params.push(user_id);
//     }

//     // Tambahkan filter jenis_ijin = 'keluar'
//     conditions.push("ik.jenis_ijin = 'keluar'");

//     // Gabungkan kondisi jika ada
//     if (conditions.length > 0) {
//       query += ' WHERE ' + conditions.join(' AND ');
//     }

//     // Urutan dan paginasi
//     query += ` ORDER BY ik.tanggal_ijin DESC, ik.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

//     const [rows] = await pool.execute(query, params);

//     // Hitung total data untuk pagination
//     let countQuery = `
//       SELECT COUNT(*) AS total
//       FROM ijin_karyawan
//       WHERE jenis_ijin = 'keluar'
//     `;
//     const countParams = [];

//     if (user_id) {
//       countQuery += ' AND user_id = ?';
//       countParams.push(user_id);
//     }

//     const [countResult] = await pool.execute(countQuery, countParams);
//     const total = countResult[0].total;

//     return NextResponse.json(
//       {
//         success: true,
//         data: rows,
//         pagination: {
//           total,
//           limit,
//           offset,
//           hasMore: offset + limit < total,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error fetching ijin:', error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Terjadi kesalahan server.',
//         error:
//           process.env.NODE_ENV === 'development' ? error.message : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }


// app/api/ijin-karyawan/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      user_id, 
      jenis_ijin, 
      tanggal_ijin, 
      jam_keluar, 
      jam_kembali, 
      alasan_ijin
    } = body;

    // Validasi input
    if (!user_id || !jenis_ijin || !tanggal_ijin || !alasan_ijin) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Data tidak lengkap. Mohon isi semua field yang wajib.' 
        },
        { status: 400 }
      );
    }

    // Validasi jenis ijin
    if (!['keluar', 'tidak_masuk'].includes(jenis_ijin)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Jenis ijin tidak valid. Harus keluar atau tidak_masuk.' 
        },
        { status: 400 }
      );
    }

    // Validasi jam untuk ijin keluar
    if (jenis_ijin === 'keluar' && (!jam_keluar || !jam_kembali)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Jam keluar dan jam kembali wajib diisi untuk ijin keluar.' 
        },
        { status: 400 }
      );
    }

    // Validasi panjang alasan
    if (alasan_ijin.length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Alasan ijin minimal 10 karakter.' 
        },
        { status: 400 }
      );
    }

    // Cek apakah user_id ada di tabel users
    const [userCheck] = await pool.execute(
      'SELECT id, name FROM users WHERE id = ?',
      [user_id]
    );

    if (userCheck.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User tidak ditemukan.' 
        },
        { status: 404 }
      );
    }

    // Insert data ke database (TANPA pemberi_ijin_id)
    // Trigger database akan otomatis kirim notifikasi ke superadmin & manajemen
    const [result] = await pool.execute(
      `INSERT INTO ijin_karyawan 
        (user_id, jenis_ijin, tanggal_ijin, jam_keluar, jam_kembali, alasan_ijin, dipotong_tunjangan) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        jenis_ijin,
        tanggal_ijin,
        jenis_ijin === 'keluar' ? jam_keluar : null,
        jenis_ijin === 'keluar' ? jam_kembali : null,
        alasan_ijin,
        false // default tidak dipotong
      ]
    );

    // Ambil data yang baru saja diinsert
    const [newData] = await pool.execute(
      `SELECT 
        ik.id,
        ik.user_id,
        u.name as nama_karyawan,
        u.email as email_karyawan,
        ik.jenis_ijin,
        ik.tanggal_ijin,
        ik.jam_keluar,
        ik.jam_kembali,
        ik.alasan_ijin,
        ik.dipotong_tunjangan,
        ik.created_at
      FROM ijin_karyawan ik
      INNER JOIN users u ON ik.user_id = u.id
      WHERE ik.id = ?`,
      [result.insertId]
    );

    // Hitung berapa notifikasi yang terkirim
    const [notifCount] = await pool.execute(
      `SELECT COUNT(*) as total_notif
       FROM notifikasi
       WHERE ijin_id = ?`,
      [result.insertId]
    );

    return NextResponse.json(
      {
        success: true,
        message: `Ijin berhasil diajukan. Notifikasi telah dikirim ke ${notifCount[0].total_notif} Superadmin/Manajemen.`,
        data: newData[0]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error inserting ijin:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const jenis_ijin = searchParams.get('jenis_ijin'); // Tambahan filter
    
    // Parse dan pastikan integer
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;
    
    // Validasi limit dan offset
    if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Parameter limit dan offset harus berupa angka positif' 
        },
        { status: 400 }
      );
    }

    // Base query (update tanpa pemberi_ijin_id)
    let query = `
      SELECT 
        ik.id,
        ik.user_id,
        u.name AS nama_karyawan,
        u.email AS email_karyawan,
        ik.jenis_ijin,
        ik.tanggal_ijin,
        ik.jam_keluar,
        ik.jam_kembali,
        ik.alasan_ijin,
        ik.dipotong_tunjangan,
        ik.created_at,
        ik.updated_at
      FROM ijin_karyawan ik
      INNER JOIN users u ON ik.user_id = u.id
    `;

    const params = [];
    const conditions = [];

    // Tambahkan filter jika ada user_id
    if (user_id) {
      conditions.push('ik.user_id = ?');
      params.push(user_id);
    }

    // Tambahkan filter jenis_ijin jika ada
    if (jenis_ijin) {
      conditions.push('ik.jenis_ijin = ?');
      params.push(jenis_ijin);
    } else {
      // Default filter keluar (sesuai query asli Anda)
      conditions.push("ik.jenis_ijin = 'keluar'");
    }

    // Gabungkan kondisi jika ada
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Urutan dan paginasi
    query += ` ORDER BY ik.tanggal_ijin DESC, ik.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await pool.execute(query, params);

    // Hitung total data untuk pagination
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM ijin_karyawan
      WHERE 1=1
    `;
    const countParams = [];

    if (user_id) {
      countQuery += ' AND user_id = ?';
      countParams.push(user_id);
    }

    if (jenis_ijin) {
      countQuery += ' AND jenis_ijin = ?';
      countParams.push(jenis_ijin);
    } else {
      countQuery += " AND jenis_ijin = 'keluar'";
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    return NextResponse.json(
      {
        success: true,
        data: rows,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching ijin:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}