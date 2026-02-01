// // app/api/ijin-karyawan/count/[id]/route.js
// import { NextResponse } from 'next/server';
// import pool from '@/lib/db';

// // GET - Hitung jumlah ijin user bulan ini
// export async function GET(request, { params }) {
//   try {
//     const { id } = await params;

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: 'ID tidak valid' },
//         { status: 400 }
//       );
//     }

//     // Query utama: hitung total berbagai jenis ijin (dengan dan tanpa potongan)
//     const [countResult] = await pool.execute(
//       `SELECT 
//         COUNT(*) AS total_ijin,
//         COUNT(CASE WHEN jenis_ijin = 'keluar' THEN 1 END) AS total_ijin_keluar,
//         COUNT(CASE WHEN jenis_ijin = 'tidak_masuk' THEN 1 END) AS total_ijin_tidak_masuk,
//         COUNT(CASE WHEN jenis_ijin = 'keluar' AND dipotong_tunjangan = true THEN 1 END) AS total_ijin_keluar_dipotong,
//         COUNT(CASE WHEN dipotong_tunjangan = true THEN 1 END) AS total_ijin_dipotong
//       FROM ijin_karyawan
//       WHERE user_id = ?
//         AND MONTH(tanggal_ijin) = MONTH(CURRENT_DATE())
//         AND YEAR(tanggal_ijin) = YEAR(CURRENT_DATE())`,
//       [id]
//     );

//     // Ambil detail user
//     const [userResult] = await pool.execute(
//       `SELECT id, name, email FROM users WHERE id = ?`,
//       [id]
//     );

//     if (userResult.length === 0) {
//       return NextResponse.json(
//         { success: false, message: 'User tidak ditemukan' },
//         { status: 404 }
//       );
//     }

//     // Ambil daftar detail ijin bulan ini (tanpa filter potongan, agar lengkap)
//     const [detailIjin] = await pool.execute(
//       `SELECT 
//         id,
//         jenis_ijin,
//         tanggal_ijin,
//         jam_keluar,
//         jam_kembali,
//         alasan_ijin,
//         dipotong_tunjangan,
//         created_at
//       FROM ijin_karyawan
//       WHERE user_id = ?
//         AND MONTH(tanggal_ijin) = MONTH(CURRENT_DATE())
//         AND YEAR(tanggal_ijin) = YEAR(CURRENT_DATE())
//       ORDER BY tanggal_ijin DESC`,
//       [id]
//     );

//     const currentMonth = new Date().toLocaleDateString('id-ID', {
//       month: 'long',
//       year: 'numeric',
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         data: {
//           user: userResult[0],
//           periode: currentMonth,
//           summary: {
//             total_ijin: countResult[0].total_ijin,
//             total_ijin_keluar: countResult[0].total_ijin_keluar,
//             total_ijin_tidak_masuk: countResult[0].total_ijin_tidak_masuk,
//             total_ijin_keluar_dipotong: countResult[0].total_ijin_keluar_dipotong,
//             total_ijin_dipotong: countResult[0].total_ijin_dipotong,
//           },
//           detail_ijin: detailIjin,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error fetching ijin count:', error);

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


// mengamnil data bulan lalu
// app/api/ijin-karyawan/count/[id]/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Hitung jumlah ijin user bulan lalu
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID tidak valid' },
        { status: 400 }
      );
    }

    // Query utama: hitung total berbagai jenis ijin (dengan dan tanpa potongan)
    const [countResult] = await pool.execute(
      `SELECT 
        COUNT(*) AS total_ijin,
        COUNT(CASE WHEN jenis_ijin = 'keluar' THEN 1 END) AS total_ijin_keluar,
        COUNT(CASE WHEN jenis_ijin = 'tidak_masuk' THEN 1 END) AS total_ijin_tidak_masuk,
        COUNT(CASE WHEN jenis_ijin = 'keluar' AND dipotong_tunjangan = true THEN 1 END) AS total_ijin_keluar_dipotong,
        COUNT(CASE WHEN dipotong_tunjangan = true THEN 1 END) AS total_ijin_dipotong
      FROM ijin_karyawan
      WHERE user_id = ?
        AND tanggal_ijin >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        AND tanggal_ijin < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')`,
      [id]
    );

    // Ambil detail user
    const [userResult] = await pool.execute(
      `SELECT id, name, email FROM users WHERE id = ?`,
      [id]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Ambil daftar detail ijin bulan lalu (tanpa filter potongan, agar lengkap)
    const [detailIjin] = await pool.execute(
      `SELECT 
        id,
        jenis_ijin,
        tanggal_ijin,
        jam_keluar,
        jam_kembali,
        alasan_ijin,
        dipotong_tunjangan,
        created_at
      FROM ijin_karyawan
      WHERE user_id = ?
        AND tanggal_ijin >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        AND tanggal_ijin < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      ORDER BY tanggal_ijin DESC`,
      [id]
    );

    // Hitung bulan lalu untuk periode
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const periode = lastMonth.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userResult[0],
          periode: periode,
          summary: {
            total_ijin: countResult[0].total_ijin,
            total_ijin_keluar: countResult[0].total_ijin_keluar,
            total_ijin_tidak_masuk: countResult[0].total_ijin_tidak_masuk,
            total_ijin_keluar_dipotong: countResult[0].total_ijin_keluar_dipotong,
            total_ijin_dipotong: countResult[0].total_ijin_dipotong,
          },
          detail_ijin: detailIjin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching ijin count:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server.',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}