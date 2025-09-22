// app/components/NavbarWrapper.jsx untuk ambil data user dari server dilempar ke NavbarPublic
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/lib/getUserFromCookie"
import NavbarPublic from "./navbar"

export default async function NavbarWrapper() {
  const user = await getUserFromCookie(cookies())
  return <NavbarPublic user={user} />
}
