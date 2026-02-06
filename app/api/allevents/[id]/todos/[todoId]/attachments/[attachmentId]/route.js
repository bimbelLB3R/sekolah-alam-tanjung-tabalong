import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { deleteFromS3 } from '@/lib/allevents/todo_attachment/s3';

// DELETE - Hapus attachment
export async function DELETE(request, { params }) {
  try {
    const { id: event_id, todoId: todo_id, attachmentId } = await params;

    console.log('Delete request:', { event_id, todo_id, attachmentId });

    // Get attachment info
    const [[attachment]] = await pool.query(
      'SELECT s3_key FROM event_todo_attachments WHERE id = ? AND event_id = ? AND todo_id = ?',
      [attachmentId, event_id, todo_id]
    );

    if (!attachment) {
      return NextResponse.json(
        { success: false, error: 'Attachment not found' },
        { status: 404 }
      );
    }

    // Delete from S3
    await deleteFromS3(attachment.s3_key);

    // Delete from database
    await pool.query(
      'DELETE FROM event_todo_attachments WHERE id = ?',
      [attachmentId]
    );

    return NextResponse.json({
      success: true,
      message: 'Attachment deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting attachment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete attachment', details: error.message },
      { status: 500 }
    );
  }
}