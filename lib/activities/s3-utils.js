// lib/s3-utils.js
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Extract S3 key from full URL
 * Example: https://bucket-name.s3.region.amazonaws.com/activities/123-image.jpg
 * Returns: activities/123-image.jpg
 */
export function extractS3KeyFromUrl(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // Remove leading slash
    return pathname.startsWith('/') ? pathname.substring(1) : pathname;
  } catch (error) {
    console.error('Invalid URL:', url);
    return null;
  }
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(imageUrl) {
  if (!imageUrl) return { success: true };

  try {
    const key = extractS3KeyFromUrl(imageUrl);
    
    if (!key) {
      console.log('No valid S3 key found in URL:', imageUrl);
      return { success: false, error: 'Invalid S3 URL' };
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });

    await s3Client.send(command);
    console.log('Successfully deleted from S3:', key);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete multiple files from S3
 */
export async function deleteMultipleFromS3(imageUrls) {
  if (!imageUrls || imageUrls.length === 0) return { success: true };

  const results = await Promise.allSettled(
    imageUrls.map(url => deleteFromS3(url))
  );

  const failed = results.filter(r => r.status === 'rejected' || !r.value.success);
  
  return {
    success: failed.length === 0,
    totalProcessed: results.length,
    failed: failed.length,
  };
}