import { NextResponse } from 'next/server';
import { query } from '@/lib/events/db';
import { miniClassUpdateSchema } from '@/lib/events/mini-class';
import { deleteFromS3 } from '@/lib/events/s3';

// GET - Detail peserta by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const result = await query(
      'SELECT * FROM mini_class WHERE id = ?',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    }, { status: 200 });

  } catch (error) {
    console.error('GET mini-class detail error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update peserta
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validasi dengan Zod
    const validatedData = miniClassUpdateSchema.parse(body);

    // Build dynamic update query
    const updates = [];
    const values = [];

    Object.keys(validatedData).forEach(key => {
      if (validatedData[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(validatedData[key]);
      }
    });

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data yang diupdate' },
        { status: 400 }
      );
    }

    values.push(id);
    const queryText = `
      UPDATE mini_class 
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    await query(queryText, values);

    // Get updated data
    const result = await query('SELECT * FROM mini_class WHERE id = ?', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Data berhasil diupdate',
    }, { status: 200 });

  } catch (error) {
    console.error('PATCH mini-class error:', error);

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
      { error: 'Gagal update data', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Hapus peserta (sama seperti sebelumnya, hanya ganti query)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Get current data untuk hapus file dari S3
    const currentData = await query(
      'SELECT bukti_transfer_key FROM mini_class WHERE id = ?',
      [id]
    );

    if (currentData.rows.length === 0) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    // Delete from S3 if exists
    if (currentData.rows[0].bukti_transfer_key) {
      try {
        await deleteFromS3(currentData.rows[0].bukti_transfer_key);
      } catch (s3Error) {
        console.error('Error deleting from S3:', s3Error);
      }
    }

    // Delete from database
    await query('DELETE FROM mini_class WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Data berhasil dihapus',
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE mini-class error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data', details: error.message },
      { status: 500 }
    );
  }
}