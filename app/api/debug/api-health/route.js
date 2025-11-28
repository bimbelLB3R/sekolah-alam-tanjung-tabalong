import { NextResponse } from "next/server";

export async function GET() {
  try {
    const memory = process.memoryUsage();

    return NextResponse.json({
      status: "ok",
      serverTime: new Date().toISOString(),
      uptime: process.uptime(), // detik
      memory: {
        rss: Math.round(memory.rss / 1024 / 1024) + " MB",
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + " MB",
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + " MB",
      },
      environment: process.env.NODE_ENV || "unknown",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
