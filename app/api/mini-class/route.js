import { NextResponse } from 'next/server';
import { query } from '@/lib/events/db';
import { miniClassSchema } from '@/lib/events/mini-class';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // pastikan integer dan fallback ke nilai valid
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let baseQuery = "FROM mini_class WHERE 1=1";
    const queryParams = [];

    if (status && ["pending", "verified", "rejected"].includes(status)) {
      baseQuery += " AND status_verifikasi = ?";
      queryParams.push(status);
    }

    if (search) {
      baseQuery += " AND (nama_lengkap LIKE ? OR asal_sekolah LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // === Hitung total ===
    const countSQL = `SELECT COUNT(*) as total ${baseQuery}`;
    const { rows: countRows } = await query(countSQL, queryParams);
    const total = countRows[0]?.total || 0;
// pastikan parameter numeric valid
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    // === Ambil data paginated ===
    const dataSQL = `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offsetNum}`;

    
    console.log("DEBUG FINAL QUERY:", dataSQL);
const { rows } = await query(dataSQL, queryParams);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("GET mini-class error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create peserta baru
export async function POST(request) {
  try {
    const body = await request.json();

    // Validasi dengan Zod
    const validatedData = miniClassSchema.parse(body);

    // Insert ke database
    const queryText = `
      INSERT INTO mini_class 
      (nama_lengkap, nama_panggilan, usia, alamat, asal_sekolah, kontak_wa, bukti_transfer_url, bukti_transfer_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      validatedData.nama_lengkap,
      validatedData.nama_panggilan,
      validatedData.usia,
      validatedData.alamat,
      validatedData.asal_sekolah,
      validatedData.kontak_wa,
      body.bukti_transfer_url || null,
      body.bukti_transfer_key || null,
    ];

    const result = await query(queryText, values);

    // Get inserted data
    const insertedId = result.rows.insertId;
    const insertedData = await query(
      'SELECT * FROM mini_class WHERE id = ?',
      [insertedId]
    );

    return NextResponse.json({
      success: true,
      data: insertedData.rows[0],
      message: 'Pendaftaran berhasil!',
    }, { status: 201 });

  } catch (error) {
    console.error('POST mini-class error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: 'Validasi gagal', 
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Gagal menyimpan data', details: error.message },
      { status: 500 }
    );
  }
}