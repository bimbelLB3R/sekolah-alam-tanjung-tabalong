// app/api/budget/monitoring/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Monitoring dana semua kegiatan untuk Kepala Sekolah
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const status = searchParams.get('status');

    // Query untuk mendapatkan summary per event
    let query = `
      SELECT 
        e.id,
        e.name,
        e.description,
        e.start_date,
        e.end_date,
        e.status,
        COALESCE(SUM(CASE WHEN a.type = 'pemasukan' THEN a.amount ELSE 0 END), 0) as total_pemasukan,
        COALESCE(SUM(CASE WHEN a.type = 'pengeluaran' THEN a.amount ELSE 0 END), 0) as total_pengeluaran,
        (COALESCE(SUM(CASE WHEN a.type = 'pemasukan' THEN a.amount ELSE 0 END), 0) - 
         COALESCE(SUM(CASE WHEN a.type = 'pengeluaran' THEN a.amount ELSE 0 END), 0)) as saldo,
        COUNT(DISTINCT a.id) as jumlah_transaksi
      FROM allevents e
      LEFT JOIN anggaran_kegiatan a ON e.id = a.event_id
      WHERE 1=1
    `;

    const params = [];

    if (year) {
      query += ' AND YEAR(e.start_date) = ?';
      params.push(year);
    }

    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }

    query += `
      GROUP BY e.id, e.name, e.description, e.start_date, e.end_date, e.status
      ORDER BY e.start_date DESC
    `;

    const [events] = await pool.query(query, params);

    // Calculate grand total
    const grandTotal = events.reduce((acc, event) => ({
      total_pemasukan: acc.total_pemasukan + parseFloat(event.total_pemasukan || 0),
      total_pengeluaran: acc.total_pengeluaran + parseFloat(event.total_pengeluaran || 0),
      saldo: acc.saldo + parseFloat(event.saldo || 0),
      jumlah_event: events.length
    }), {
      total_pemasukan: 0,
      total_pengeluaran: 0,
      saldo: 0,
      jumlah_event: 0
    });

    // Get statistics by status
    const [statusStats] = await pool.query(`
      SELECT 
        e.status,
        COUNT(e.id) as jumlah_event,
        COALESCE(SUM(CASE WHEN a.type = 'pemasukan' THEN a.amount ELSE 0 END), 0) as total_pemasukan,
        COALESCE(SUM(CASE WHEN a.type = 'pengeluaran' THEN a.amount ELSE 0 END), 0) as total_pengeluaran
      FROM allevents e
      LEFT JOIN anggaran_kegiatan a ON e.id = a.event_id
      ${year ? 'WHERE YEAR(e.start_date) = ?' : ''}
      GROUP BY e.status
    `, year ? [year] : []);

    // Get top 5 events by budget
    const [topEvents] = await pool.query(`
      SELECT 
        e.id,
        e.name,
        COALESCE(SUM(CASE WHEN a.type = 'pengeluaran' THEN a.amount ELSE 0 END), 0) as total_pengeluaran
      FROM allevents e
      LEFT JOIN anggaran_kegiatan a ON e.id = a.event_id
      ${year ? 'WHERE YEAR(e.start_date) = ?' : ''}
      GROUP BY e.id, e.name
      ORDER BY total_pengeluaran DESC
      LIMIT 5
    `, year ? [year] : []);

    // Monthly trend (untuk chart)
    const [monthlyTrend] = await pool.query(`
      SELECT 
        MONTH(a.date) as bulan,
        YEAR(a.date) as tahun,
        SUM(CASE WHEN a.type = 'pemasukan' THEN a.amount ELSE 0 END) as pemasukan,
        SUM(CASE WHEN a.type = 'pengeluaran' THEN a.amount ELSE 0 END) as pengeluaran
      FROM anggaran_kegiatan a
      ${year ? 'WHERE YEAR(a.date) = ?' : ''}
      GROUP BY YEAR(a.date), MONTH(a.date)
      ORDER BY tahun DESC, bulan DESC
      LIMIT 12
    `, year ? [year] : []);

    return NextResponse.json({
      success: true,
      data: {
        events,
        grand_total: grandTotal,
        status_stats: statusStats,
        top_events: topEvents,
        monthly_trend: monthlyTrend.reverse() // Reverse untuk ascending order
      }
    });

  } catch (error) {
    console.error('Error fetching budget monitoring:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget monitoring data' },
      { status: 500 }
    );
  }
}