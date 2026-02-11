// app/api/drive/files/route.js
import { NextResponse } from 'next/server';
import { getFiles, createFile, getStorageUsage } from '@/lib/drive/driveDb';
import { generateFileKey, getPresignedUploadUrl } from '@/lib/drive/s3';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_STORAGE_PER_USER = 5 * 1024 * 1024 * 1024; // 5GB

// Get user from token
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
 * GET /api/drive/files
 * List files in a folder
 */
export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    const files = await getFiles(user.id, folderId ? parseInt(folderId) : null);

    return NextResponse.json({
      success: true,
      files: files.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        folderId: file.folder_id,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/drive/files
 * Generate presigned URL for file upload
 */
export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileSize, fileType, folderId } = body;

    console.log('=== UPLOAD REQUEST ===');
    console.log('User ID:', user.id);
    console.log('File Name:', fileName);
    console.log('File Size:', fileSize);
    console.log('File Type:', fileType);
    console.log('Folder ID:', folderId);

    // Validasi
    if (!fileName || !fileSize || !fileType) {
      console.log('❌ Missing required fields');
      console.log('  fileName:', !!fileName);
      console.log('  fileSize:', !!fileSize);
      console.log('  fileType:', !!fileType);
      return NextResponse.json(
        { error: 'Missing required fields: fileName, fileSize, and fileType are required' },
        { status: 400 }
      );
    }

    // Check file size
    if (fileSize > MAX_FILE_SIZE) {
      console.log('❌ File too large:', fileSize, '>', MAX_FILE_SIZE);
      return NextResponse.json(
        { error: `File size exceeds maximum limit (100MB). Your file: ${Math.round(fileSize / 1024 / 1024)}MB` },
        { status: 400 }
      );
    }

    // Check storage quota
    const storageUsage = await getStorageUsage(user.id);
    console.log('Storage check:');
    console.log('  Current usage:', storageUsage.totalSize, 'bytes', `(${Math.round(storageUsage.totalSize / 1024 / 1024 * 100) / 100} MB)`);
    console.log('  New file size:', fileSize, 'bytes', `(${Math.round(fileSize / 1024 / 1024 * 100) / 100} MB)`);
    console.log('  Total after:', storageUsage.totalSize + fileSize, 'bytes');
    console.log('  Max allowed:', MAX_STORAGE_PER_USER, 'bytes', `(${MAX_STORAGE_PER_USER / 1024 / 1024 / 1024} GB)`);
    console.log('  Will exceed?', (storageUsage.totalSize + fileSize) > MAX_STORAGE_PER_USER);
    
    if (storageUsage.totalSize + fileSize > MAX_STORAGE_PER_USER) {
      console.log('❌ Storage quota exceeded');
      const usedGB = Math.round(storageUsage.totalSize / 1024 / 1024 / 1024 * 100) / 100;
      const maxGB = MAX_STORAGE_PER_USER / 1024 / 1024 / 1024;
      return NextResponse.json(
        { error: `Storage quota exceeded. Used: ${usedGB}GB / ${maxGB}GB` },
        { status: 400 }
      );
    }

    // Generate S3 key
    const s3Key = generateFileKey(user.id, fileName, folderId);
    console.log('S3 Key:', s3Key);

    // Generate presigned URL for upload
    const uploadUrl = await getPresignedUploadUrl(s3Key, fileType);
    console.log('Upload url',uploadUrl);
    console.log('✅ Presigned URL generated');

    // Create file record in database
    const file = await createFile(
      user.id,
      fileName,
      fileSize,
      fileType,
      s3Key,
      folderId ? parseInt(folderId) : null
    );
    console.log('✅ File record created, ID:', file.id);

    return NextResponse.json({
      success: true,
      file: {
        id: file.id,
        name: file.name,
        uploadUrl,
        s3Key,
      },
    });
  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    );
  }
}