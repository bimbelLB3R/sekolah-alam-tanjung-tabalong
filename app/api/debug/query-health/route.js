import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const start = Date.now();

  try {
    const q1Start = Date.now();
    const [posts] = await pool.query("SELECT COUNT(*) as total FROM posts");
    const q1Time = Date.now() - q1Start;

    const q2Start = Date.now();
    await pool.query(`
      SELECT p.id, p.title, u.name, c.name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LIMIT 5
    `);
    const q2Time = Date.now() - q2Start;

    return NextResponse.json({
      status: "healthy",
      totalTime: `${Date.now() - start}ms`,
      queries: {
        countPosts: `${q1Time}ms`,
        joinSample: `${q2Time}ms`,
      },
      posts: posts[0].total,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
