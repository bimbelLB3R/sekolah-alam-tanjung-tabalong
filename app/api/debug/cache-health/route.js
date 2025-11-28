import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();

  const res = NextResponse.json({
    status: "ok",
    message: "Cache test response",
    timestamp: new Date().toISOString(),
    responseTime: `${Date.now() - start}ms`,
    cacheRule: "public, s-maxage=60, stale-while-revalidate=300",
  });

  // Simulasikan header cache seperti API publik kamu
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  return res;
}
