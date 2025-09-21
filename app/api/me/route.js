import { cookies } from "next/headers";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore =await cookies();
  const user = await getUserFromCookie(cookieStore);

  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  return NextResponse.json(user);
}
