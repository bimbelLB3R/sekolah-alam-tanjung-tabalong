// app/api/drive/folders/[folderId]/route.js
import { NextResponse } from 'next/server';
import { getFolderById, updateFolderName, deleteFolder, getFolderPath } from '@/lib/drive/driveDb';
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
 * GET /api/drive/folders/[folderId]
 * Get folder details and path
 */
export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderId } = await params;
    const folder = await getFolderById(parseInt(folderId), user.id);

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Get breadcrumb path
    const path = await getFolderPath(parseInt(folderId), user.id);

    return NextResponse.json({
      success: true,
      folder: {
        id: folder.id,
        name: folder.name,
        parentId: folder.parent_id,
        createdAt: folder.created_at,
        path,
      },
    });
  } catch (error) {
    console.error('Error fetching folder:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folder' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/drive/folders/[folderId]
 * Update folder (rename)
 */
export async function PATCH(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if folder exists
    const folder = await getFolderById(parseInt(folderId), user.id);
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Update folder name
    const success = await updateFolderName(
      parseInt(folderId),
      user.id,
      name.trim()
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update folder' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Folder renamed successfully',
    });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/drive/folders/[folderId]
 * Delete folder
 */
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderId } = await params;

    // Check if folder exists
    const folder = await getFolderById(parseInt(folderId), user.id);
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Delete folder (cascade will handle subfolders and files)
    const success = await deleteFolder(parseInt(folderId), user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete folder' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Folder deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}