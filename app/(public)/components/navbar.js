"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Dancing_Script } from "next/font/google"

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600"],
})

export default function NavbarPublic() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4 max-w-5xl">
        {/* Logo + Slogan */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold">SATT</span>
          <span className={`${dancing.className} text-base text-green-600`}>
            Belajar, Berpetualang dan Bermakna
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            Tentang
          </Link>
          <Link href="/ppdb" className="hover:text-blue-600 transition-colors">
            PPDB
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">
            Kontak
          </Link>
          <Link href="/agenda" className="hover:text-blue-600 transition-colors">
            Agenda
          </Link>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">
            Blog
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
              <Link href="/ppdb">PPDB</Link>
              <Link href="/contact">Kontak</Link>
              <Link href="/agenda">Agenda</Link>
              <Link href="/blog">Blog</Link>
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
