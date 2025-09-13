// app/(public)/components/navbar.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function NavbarPublic() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          SATT
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            Tentang
          </Link>
          <Link href="/program" className="hover:text-blue-600 transition-colors">
            Program
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">
            Kontak
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-4">
            <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
            <nav className="flex flex-col gap-4">
              <Link href="/">Home</Link>
              <Link href="/about">Tentang</Link>
              <Link href="/program">Program</Link>
              <Link href="/contact">Kontak</Link>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
