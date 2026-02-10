// app/api/drive/storage/route.js
import { NextResponse } from 'next/server';
import { getStorageUsage } from '@/lib/drive/driveDb';
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
 * GET /api/drive/storage
 * Get user's storage usage
 */
export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usage = await getStorageUsage(user.id);

    return NextResponse.json({
      success: true,
      totalSize: usage.totalSize,
      fileCount: usage.fileCount,
      maxStorage: 5 * 1024 * 1024 * 1024, // 5GB
    });
  } catch (error) {
    console.error('Error fetching storage usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storage usage' },
      { status: 500 }
    );
  }
}