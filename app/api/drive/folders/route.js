// app/api/drive/folders/route.js
import { NextResponse } from 'next/server';
import { getFolders, createFolder } from '@/lib/drive/driveDb';
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
 * GET /api/drive/folders
 * List folders
 */
export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    const folders = await getFolders(
      user.id,
      parentId ? parseInt(parentId) : null
    );

    return NextResponse.json({
      success: true,
      folders: folders.map(folder => ({
        id: folder.id,
        name: folder.name,
        parentId: folder.parent_id,
        createdAt: folder.created_at,
        updatedAt: folder.updated_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/drive/folders
 * Create new folder
 */
export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, parentId } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    const folder = await createFolder(
      user.id,
      name.trim(),
      parentId ? parseInt(parentId) : null
    );

    return NextResponse.json({
      success: true,
      folder: {
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
      },
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}