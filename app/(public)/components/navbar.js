"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Dancing_Script } from "next/font/google";
import Image from "next/image";

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function NavbarPublic({ user }) {
  const isLoggedIn = !!user;
  const pathname = usePathname(); // ini untuk tahu halaman saat ini

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Tentang", href: "/about" },
    { label: "PPDB", href: "/ppdb" },
    { label: "Kontak", href: "/contact" },
    { label: "Agenda", href: "/agenda" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4 max-w-5xl">
        {/* Logo + Slogan */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-sattnav.png"
            alt="logo-satt"
            width={60}
            height={60}
          />
          <p className={`${dancing.className} text-base text-green-600`}>
            Belajar, Berpetualang dan Bermakna
          </p>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-green-600 transition-colors border-b-4 border-transparent
                ${pathname === item.href ? "border-green-600 font-semibold" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex">
          <Button asChild>
            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              {isLoggedIn ? "Dashboard" : "Login"}
            </Link>
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
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-green-600 transition-colors
                    ${pathname === item.href ? "font-semibold underline underline-offset-4" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild>
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  {isLoggedIn ? "Dashboard" : "Login"}
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
