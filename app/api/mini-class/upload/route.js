import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/events/s3';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    // Validasi ukuran file
    const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880');
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar (maksimal 5MB)' },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung (hanya JPG, PNG, WEBP, PDF)' },
        { status: 400 }
      );
    }

    // Upload ke S3
    const result = await uploadToS3(file, 'mini_class_data');

    return NextResponse.json({
      success: true,
      data: result,
      message: 'File berhasil diupload',
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Gagal upload file', details: error.message },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};