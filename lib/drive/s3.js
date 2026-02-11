// lib/s3.js
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Disable automatic checksums to avoid CORS preflight issues
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

/**
 * Generate unique file key for S3
 */
export function generateFileKey(userId, fileName, folderId = null) {
  const timestamp = Date.now();
  const uuid = uuidv4().split('-')[0];
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  if (folderId) {
    return `users/${userId}/folders/${folderId}/${timestamp}_${uuid}_${sanitizedFileName}`;
  }
  return `users/${userId}/files/${timestamp}_${uuid}_${sanitizedFileName}`;
}

/**
 * Upload file to S3
 */
export async function uploadFileToS3(fileBuffer, fileKey, contentType, metadata = {}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: contentType,
    Metadata: metadata,
  });

  await s3Client.send(command);
  return fileKey;
}

/**
 * Get presigned URL for file download (valid for 1 hour)
 */
export async function getPresignedDownloadUrl(fileKey, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Get presigned URL for direct upload from client (valid for 5 minutes)
 */
export async function getPresignedUploadUrl(fileKey, contentType, expiresIn = 300) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Delete file from S3
 */
export async function deleteFileFromS3(fileKey) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await s3Client.send(command);
}

/**
 * Check if file exists in S3
 */
export async function fileExistsInS3(fileKey) {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * Get file metadata from S3
 */
export async function getFileMetadata(fileKey) {
  const command = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const response = await s3Client.send(command);
  return {
    size: response.ContentLength,
    contentType: response.ContentType,
    lastModified: response.LastModified,
    metadata: response.Metadata,
  };
}