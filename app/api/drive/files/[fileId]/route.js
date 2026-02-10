// app/api/drive/files/[fileId]/route.js
import { NextResponse } from 'next/server';
import { getFileById, updateFileName, deleteFile } from '@/lib/drive/driveDb';
import { getPresignedDownloadUrl, deleteFileFromS3 } from '@/lib/drive/s3';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * GET /api/drive/files/[fileId]
 * Get file download URL
 */
export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;
    const file = await getFileById(parseInt(fileId), user.id);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Generate download URL
    const downloadUrl = await getPresignedDownloadUrl(file.s3_key);

    return NextResponse.json({
      success: true,
      file: {
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        downloadUrl,
        createdAt: file.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/drive/files/[fileId]
 * Update file (rename)
 */
export async function PATCH(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if file exists
    const file = await getFileById(parseInt(fileId), user.id);
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Update file name
    const success = await updateFileName(parseInt(fileId), user.id, name);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File renamed successfully',
    });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/drive/files/[fileId]
 * Delete file
 */
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;

    // Check if file exists
    const file = await getFileById(parseInt(fileId), user.id);
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete from S3
    try {
      await deleteFileFromS3(file.s3_key);
    } catch (s3Error) {
      console.error('Error deleting from S3:', s3Error);
      // Continue anyway, database cleanup is more important
    }

    // Delete from database
    const success = await deleteFile(parseInt(fileId), user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}