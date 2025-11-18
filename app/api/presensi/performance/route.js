import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');

    // Validasi parameter
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Parameter startDate dan endDate wajib diisi' },
        { status: 400 }
      );
    }

    // const connection = await pool.getConnection();

    try {
      // 1. Query Summary Data
      const summaryQuery = `
        SELECT 
          COUNT(DISTINCT tanggal) as totalHari,
          SUM(CASE WHEN keterangan = 'tepat waktu' AND jenis = 'masuk' THEN 1 ELSE 0 END) as tepatWaktu,
          SUM(CASE WHEN keterangan = 'terlambat' AND jenis = 'masuk' THEN 1 ELSE 0 END) as terlambat,
          ROUND(
            (SUM(CASE WHEN keterangan = 'tepat waktu' AND jenis = 'masuk' THEN 1 ELSE 0 END) * 100.0) / 
            NULLIF(COUNT(CASE WHEN jenis = 'masuk' THEN 1 END), 0), 
            2
          ) as persentaseTepatWaktu
        FROM presensi
        WHERE tanggal BETWEEN ? AND ?
        ${userId && userId !== 'all' ? 'AND user_id = ?' : ''}
      `;
      
      const summaryParams = userId && userId !== 'all' 
        ? [startDate, endDate, userId] 
        : [startDate, endDate];
      
      const [summaryResults] = await pool.query(summaryQuery, summaryParams);
      const summary = {
        totalHari: summaryResults[0].totalHari || 0,
        tepatWaktu: summaryResults[0].tepatWaktu || 0,
        terlambat: summaryResults[0].terlambat || 0,
        persentaseTepatWaktu: summaryResults[0].persentaseTepatWaktu || 0
      };

      // 2. Query Daily Data
      const dailyQuery = `
        SELECT 
          DATE_FORMAT(tanggal, '%d %b') as tanggal,
          SUM(CASE WHEN keterangan = 'tepat waktu' AND jenis = 'masuk' THEN 1 ELSE 0 END) as tepatWaktu,
          SUM(CASE WHEN keterangan = 'terlambat' AND jenis = 'masuk' THEN 1 ELSE 0 END) as terlambat
        FROM presensi
        WHERE tanggal BETWEEN ? AND ?
        ${userId && userId !== 'all' ? 'AND user_id = ?' : ''}
        GROUP BY DATE(tanggal)
        ORDER BY tanggal ASC
      `;
      
      const [dailyResults] = await pool.query(dailyQuery, summaryParams);

      // 3. Query Trend Data (per minggu)
      const trendQuery = `
        SELECT 
          CONCAT('Minggu ', WEEK(tanggal, 1) - WEEK(?, 1) + 1) as minggu,
          ROUND(
            (SUM(CASE WHEN keterangan = 'tepat waktu' AND jenis = 'masuk' THEN 1 ELSE 0 END) * 100.0) / 
            NULLIF(COUNT(CASE WHEN jenis = 'masuk' THEN 1 END), 0), 
            2
          ) as persentase
        FROM presensi
        WHERE tanggal BETWEEN ? AND ?
        ${userId && userId !== 'all' ? 'AND user_id = ?' : ''}
        GROUP BY WEEK(tanggal, 1)
        ORDER BY WEEK(tanggal, 1) ASC
      `;
      
      const trendParams = userId && userId !== 'all' 
        ? [startDate, startDate, endDate, userId] 
        : [startDate, startDate, endDate];
      
      const [trendResults] = await pool.query(trendQuery, trendParams);

      // 4. Query Teacher Comparison Data
      const teachersQuery = `
        SELECT 
          u.id,
          u.name,
          u.email,
          r.name as role_name,
          SUM(CASE WHEN p.keterangan = 'tepat waktu' AND p.jenis = 'masuk' THEN 1 ELSE 0 END) as tepatWaktu,
          SUM(CASE WHEN p.keterangan = 'terlambat' AND p.jenis = 'masuk' THEN 1 ELSE 0 END) as terlambat
        FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        LEFT JOIN presensi p ON u.id = p.user_id 
          AND p.tanggal BETWEEN ? AND ?
        WHERE r.name = 'guru'
        ${userId && userId !== 'all' ? 'AND u.id = ?' : ''}
        GROUP BY u.id, u.name, u.email, r.name
        ORDER BY tepatWaktu DESC
        LIMIT 10
      `;
      
      const [teachersResults] = await pool.query(teachersQuery, summaryParams);

      // 5. Format Response
      const responseData = {
        summary,
        dailyData: dailyResults,
        trendData: trendResults,
        teachers: teachersResults
      };

      return NextResponse.json(responseData);

    } finally {
    //   connection.release();
    console.log("yes")
    }

  } catch (error) {
    console.error('Error fetching performance data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint untuk filter lebih kompleks
export async function POST(request) {
  try {
    const body = await request.json();
    const { startDate, endDate, userIds, groupBy } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Parameter startDate dan endDate wajib diisi' },
        { status: 400 }
      );
    }

    // const connection = await pool.getConnection();

    try {
      // Custom query berdasarkan groupBy (daily, weekly, monthly)
      let groupByClause = 'DATE(tanggal)';
      let dateFormat = '%d %b';
      
      if (groupBy === 'weekly') {
        groupByClause = 'YEARWEEK(tanggal, 1)';
        dateFormat = '%Y-W%u';
      } else if (groupBy === 'monthly') {
        groupByClause = 'DATE_FORMAT(tanggal, "%Y-%m")';
        dateFormat = '%b %Y';
      }

      const query = `
        SELECT 
          DATE_FORMAT(tanggal, '${dateFormat}') as periode,
          SUM(CASE WHEN keterangan = 'tepat waktu' AND jenis = 'masuk' THEN 1 ELSE 0 END) as tepatWaktu,
          SUM(CASE WHEN keterangan = 'terlambat' AND jenis = 'masuk' THEN 1 ELSE 0 END) as terlambat
        FROM presensi
        WHERE tanggal BETWEEN ? AND ?
        ${userIds && userIds.length > 0 ? `AND user_id IN (${userIds.map(() => '?').join(',')})` : ''}
        GROUP BY ${groupByClause}
        ORDER BY tanggal ASC
      `;

      const params = userIds && userIds.length > 0 
        ? [startDate, endDate, ...userIds] 
        : [startDate, endDate];

      const [results] = await pool.query(query, params);

      return NextResponse.json({ data: results });

    } finally {
    //   connection.release();
    console.log("yes")
    }

  } catch (error) {
    console.error('Error in POST performance:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}