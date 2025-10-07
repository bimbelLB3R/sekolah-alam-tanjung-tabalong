// app/components/NavbarWrapper.jsx untuk ambil data user dari server dilempar ke NavbarPublic

import { cookies } from "next/headers"
// import { getUserFromCookie } from "@/lib/getUserFromCookie"
import NavbarPublic from "./navbar"
// import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
// import { rolePermissions } from "@/lib/rolePermissions"
import { getUserFromToken } from "@/lib/getUserFromToken"

export default async function NavbarWrapper() {
  const user = await getUserFromToken();
  // const token = cookies().get("token")?.value
  // let user = null;
  // if (token) {
  //   try {
  //     const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  //     const { payload } = await jwtVerify(token, secret)
  //     // const userRole = payload.role_name
  //     user = { id: payload.id, name: payload.name, role: payload.role_name };

  //   } catch (err) {
  //     console.error("JWT verify error:", err.message)
  //   }
  // }
  // const user = await getUserFromCookie(cookies())
  return <NavbarPublic user={user} />
}
