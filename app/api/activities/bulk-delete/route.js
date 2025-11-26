// app/api/activities/bulk-delete/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/getUserFromToken';
import { deleteMultipleFromS3 } from '@/lib/s3-utils';



// POST - Bulk delete activities
export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ids } = body; // Array of activity IDs

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No activity IDs provided' },
        { status: 400 }
      );
    }

    // const connection = await getConnection();
    
    // Get all images URLs before deleting
    const placeholders = ids.map(() => '?').join(',');
    const [activities] = await pool.execute(
      `SELECT id, image FROM activities WHERE id IN (${placeholders})`,
      ids
    );

    if (activities.length === 0) {
    //   await connection.end();
      return NextResponse.json(
        { success: false, error: 'No activities found' },
        { status: 404 }
      );
    }

    // Soft delete all activities
    await pool.execute(
      `UPDATE activities SET is_active = FALSE WHERE id IN (${placeholders})`,
      ids
    );
    // await connection.end();

    // Collect all image URLs
    const imageUrls = activities
      .map(act => act.image)
      .filter(url => url && url.trim() !== '');

    // Delete all images from S3
    let s3DeleteResult = { success: true, totalProcessed: 0, failed: 0 };
    if (imageUrls.length > 0) {
      console.log(`Deleting ${imageUrls.length} images from S3...`);
      s3DeleteResult = await deleteMultipleFromS3(imageUrls);
    }

    return NextResponse.json({
      success: true,
      message: `${activities.length} activities deleted successfully`,
      activitiesDeleted: activities.length,
      imagesDeleted: s3DeleteResult.totalProcessed,
      imagesFailed: s3DeleteResult.failed,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete activities' },
      { status: 500 }
    );
  }
}