import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;
const CDN_URL = process.env.CDN_URL || `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;

export async function uploadToS3(file, folder = 'blog') {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  return {
    filename,
    url: `${CDN_URL}/${filename}`,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

export async function deleteFromS3(filename) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
  });

  await s3Client.send(command);
}