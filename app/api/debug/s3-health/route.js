import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function GET() {
  const start = Date.now();

  try {
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET,
      MaxKeys: 1,
    });

    await s3.send(command);

    return NextResponse.json({
      status: "healthy",
      service: "S3",
      responseTime: `${Date.now() - start}ms`,
      bucket: process.env.AWS_S3_BUCKET,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        service: "S3",
        error: error.message,
        responseTime: `${Date.now() - start}ms`,
      },
      { status: 500 }
    );
  }
}
