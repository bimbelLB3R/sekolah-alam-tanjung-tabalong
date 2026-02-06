import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload file ke S3
 * @param {File} file - File object dari form
 * @param {string} s3Key - Full S3 key/path (contoh: events/12/todos/15/filename.pdf)
 * @returns {Object} - { key, url }
 */
export async function uploadToS3(file, s3Key) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    return {
      key: s3Key,
      url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Gagal upload file ke S3');
  }
}

/**
 * Delete file dari S3
 * @param {string} key - S3 key/path file yang akan dihapus
 * @returns {boolean}
 */
export async function deleteFromS3(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Gagal hapus file dari S3');
  }
}

/**
 * Generate signed URL untuk akses file private
 * @param {string} key - S3 key/path file
 * @param {number} expiresIn - Waktu expire dalam detik (default: 1 jam)
 * @returns {string} - Signed URL
 */
export async function getPresignedUrl(key, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('S3 signed URL error:', error);
    throw new Error('Gagal generate signed URL');
  }
}

/**
 * Generate S3 key untuk todo attachments
 * Struktur: event_todo_attachments/{event_id}/todos/{todo_id}/{timestamp}-{random}-{filename}
 */
export function generateTodoAttachmentKey(eventId, todoId, originalFileName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const fileExtension = originalFileName.split('.').pop();
  const sanitizedName = originalFileName
    .replace(/\.[^/.]+$/, '') // hapus extension
    .replace(/[^a-zA-Z0-9.-]/g, '_') // sanitize
    .substring(0, 50); // limit panjang
  
  const fileName = `${timestamp}-${randomString}-${sanitizedName}.${fileExtension}`;
  
  return `event_todo_attachments/${eventId}/todos/${todoId}/${fileName}`;
}

export { s3Client };