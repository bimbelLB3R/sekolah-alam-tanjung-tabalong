import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { uploadToS3, deleteFromS3, getPresignedUrl, generateTodoAttachmentKey } from '@/lib/allevents/todo_attachment/s3';

// GET - Ambil semua attachments untuk todo tertentu
export async function GET(request, { params }) {
  try {
    const { id: event_id, todoId: todo_id } = await params;

    console.log('Fetching attachments for event:', event_id, 'todo:', todo_id);

    const [attachments] = await pool.query(
      `SELECT 
        id,
        event_id,
        todo_id,
        user_id,
        file_name,
        file_original_name,
        file_type,
        file_size,
        s3_key,
        uploaded_at,
        uploaded_by_name,
        uploaded_by_email
      FROM event_todo_attachments
      WHERE event_id = ? AND todo_id = ?
      ORDER BY uploaded_at DESC`,
      [event_id, todo_id]
    );

    console.log('Found attachments:', attachments.length);

    // Generate presigned URLs untuk setiap file (untuk keamanan)
    const attachmentsWithUrls = await Promise.all(
      attachments.map(async (att) => {
        try {
          const viewUrl = await getPresignedUrl(att.s3_key);
          return {
            ...att,
            viewUrl,
          };
        } catch (error) {
          console.error('Error generating presigned URL for:', att.s3_key, error);
          return {
            ...att,
            viewUrl: att.s3_url, // Fallback ke URL biasa
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: attachmentsWithUrls,
    });

  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attachments', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Upload multiple files (bulk upload)
export async function POST(request, { params }) {
  try {
    const { id: event_id, todoId: todo_id } = await params;
    
    const formData = await request.formData();
    const files = formData.getAll('files');
    const userId = formData.get('userId');
    const userName = formData.get('userName');
    const userEmail = formData.get('userEmail');

    console.log('Upload request:', { event_id, todo_id, filesCount: files.length });

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!userId || !userName || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'User information required' },
        { status: 400 }
      );
    }

    // Validasi tipe file yang diizinkan
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    // Validasi ukuran maksimal per file (10MB)
    const maxSize = 10 * 1024 * 1024;

    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validasi tipe file
        if (!allowedTypes.includes(file.type)) {
          errors.push({
            fileName: file.name,
            error: 'File type not allowed',
          });
          continue;
        }

        // Validasi ukuran file
        if (file.size > maxSize) {
          errors.push({
            fileName: file.name,
            error: 'File size exceeds 10MB',
          });
          continue;
        }

        // Generate S3 key
        const s3Key = generateTodoAttachmentKey(event_id, todo_id, file.name);

        // Upload to S3
        const { key, url } = await uploadToS3(file, s3Key);

        // Generate file name
        const fileName = s3Key.split('/').pop();

        // Save to database
        const [result] = await pool.query(
          `INSERT INTO event_todo_attachments 
          (event_id, todo_id, user_id, file_name, file_original_name, 
           file_type, file_size, s3_key, s3_url, uploaded_by_name, uploaded_by_email)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            event_id,
            todo_id,
            userId,
            fileName,
            file.name,
            file.type,
            file.size,
            key,
            url,
            userName,
            userEmail,
          ]
        );

        uploadedFiles.push({
          id: result.insertId,
          fileName: file.name,
          size: file.size,
          type: file.type,
        });

      } catch (fileError) {
        console.error(`Error uploading ${file.name}:`, fileError);
        errors.push({
          fileName: file.name,
          error: fileError.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        uploaded: uploadedFiles,
        errors: errors.length > 0 ? errors : null,
      },
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files', details: error.message },
      { status: 500 }
    );
  }
}