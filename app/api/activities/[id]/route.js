// app/api/activities/[id]/route.js
import { deleteFromS3 } from '@/lib/activities/s3-utils';
import pool from '@/lib/db';
import { getUserFromToken } from '@/lib/getUserFromToken';
import { NextResponse } from 'next/server';


// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}
// GET single activity
export async function GET(request, { params }) {
  try {
    const { id } =await params;
    // const connection = await getConnection();
    const [rows] = await pool.execute(
      'SELECT * FROM activities WHERE id = ?',
      [id]
    );
    // await connection.end();

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}

// PUT - Update activity (with old image deletion)
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } =await params;
    const body = await request.json();
    const { title, description, content, image, is_active} = body;

    const [currentUser] = await pool.execute(
      'SELECT created_by FROM activities WHERE id = ?',
      [id]
    );
    const existUser=currentUser[0].created_by
    // console.log(existUser)
    if(existUser!==user.name){
      return NextResponse.json({ error: 'Bukan Karya Anda, Minta Ijin Dulu ya!' }, { status: 403 });
    }
    
    // Get current activity data to check old image
    const [currentActivity] = await pool.execute(
      'SELECT image FROM activities WHERE id = ?',
      [id]
    );

    if (currentActivity.length === 0) {
    //   await connection.end();
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    const oldImage = currentActivity[0].image;

    // If image is changed and old image exists, delete old image from S3
    if (oldImage && image !== oldImage) {
      console.log('Deleting old image from S3:', oldImage);
      const deleteResult = await deleteFromS3(oldImage);
      
      if (!deleteResult.success) {
        console.error('Failed to delete old image from S3:', deleteResult.error);
        // Continue anyway, don't fail the update
      }
    }

    // Auto-generate slug if title changed
    let slug = generateSlug(title);
    
    // Check if new slug conflicts with other activities
    const [existing] = await pool.execute(
      'SELECT id FROM activities WHERE slug = ? AND id != ?',
      [slug, id]
    );
    
    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // Update activity
    await pool.execute(
      'UPDATE activities SET slug = ?, title = ?, description = ?, content = ?, image = ?, is_active = ?,created_by=? WHERE id = ?',
      [slug, title, description, content, image, is_active ?? true,user.name, id]
    );
    // await connection.end();

    return NextResponse.json({ 
      success: true, 
      message: 'Activity updated successfully',
      data: { id, slug, title, description, content, image },
      deletedOldImage: oldImage && image !== oldImage
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus activity (soft delete + delete image from S3)
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } =await params;
     const [currentUser] = await pool.execute(
      'SELECT created_by FROM activities WHERE id = ?',
      [id]
    );
    const existUser=currentUser[0].created_by
    // console.log(existUser)
    if(existUser!==user.name){
      return NextResponse.json({ error: 'Bukan Karya Anda, Minta Ijin Dulu ya!' }, { status: 403 });
    }
    
    // Get activity data to get image URL
    const [activity] = await pool.execute(
      'SELECT image FROM activities WHERE id = ?',
      [id]
    );

    if (activity.length === 0) {
    //   await connection.end();
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    const imageUrl = activity[0].image;

    //  delete activity
    await pool.execute(
      'DELETE from activities  WHERE id = ?',
      [id]
    );
    // await connection.end();

    // Delete image from S3 if exists
    if (imageUrl) {
      console.log('Deleting image from S3:', imageUrl);
      const deleteResult = await deleteFromS3(imageUrl);
      
      if (!deleteResult.success) {
        console.error('Failed to delete image from S3:', deleteResult.error);
        // Activity is already deleted, just log the error
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Activity and image deleted successfully',
        imageDeleted: deleteResult.success
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}