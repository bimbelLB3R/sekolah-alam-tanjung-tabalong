import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req) {
  const start = Date.now();
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        status: "unauthenticated",
        message: "Token not found",
        responseTime: `${Date.now() - start}ms`,
      },
      { status: 401 }
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      status: "authenticated",
      userId: payload.id,
      role: payload.role_name,
      responseTime: `${Date.now() - start}ms`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "invalid-token",
        error: error.message,
        responseTime: `${Date.now() - start}ms`,
      },
      { status: 401 }
    );
  }
}
