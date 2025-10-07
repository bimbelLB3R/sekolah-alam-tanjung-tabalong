"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Dancing_Script } from "next/font/google";
import Image from "next/image";
import { useEffect, useState} from "react";
import { useAuth } from "@/lib/getUserClientSide";
import { toUpperCase } from "zod";

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function NavbarPublic({user}) {
  // console.log(user)
  // const [roleName,setRoleName]=useState();
  // const user=useAuth()  
  const isLoggedIn = !!user;
  // console.log(isLoggedIn)
  // console.log(user)
  // useEffect((user)=>{
  //   // const role=user?.user;
  // // const role_name=role?.role_name;
  // const roleName=user.role;
  // setRoleName(role_name);
  // },[user])


  const pathname = usePathname();
  const [open, setOpen] = useState(false); // kontrol manual

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Tentang", href: "/about" },
    { label: "PPDB", href: "/ppdb" },
    { label: "Kontak", href: "/contact" },
    { label: "Agenda", href: "/agenda" },
    { label: "Blog", href: "/blog" },
    // { label: "Login", href: "/login" },
  ];
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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
          {/* Tambahkan link ke /ortu hanya untuk user role ortu */}
  {user?.role === "ortu" && (
    <Link
      href="/ortu"
      className={`hover:text-green-600 transition-colors border-b-4 border-transparent
        ${pathname.startsWith("/ortu") ? "border-green-600 font-semibold" : ""}`}
    >
      Halaman Ortu
    </Link>
  )}
        </nav>

        {/* CTA Button */}
        
        {pathname !== '/login' && (
          <div className="hidden md:flex">
            <Button asChild onClick={() => setOpen(false)}>
              {!isLoggedIn ? (
                <Link href="/login">Login</Link>
              ) : user.role === "ortu" ? (
                <button type="button" onClick={handleLogout}>
                  Log Out
                </button>
              ) : (
                <Link href="/dashboard">Dashboard</Link>
              )}
            </Button>
          </div>
        )}

          
        

        {/* Mobile Menu */}
        <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-6 flex flex-col">
            <SheetHeader>
              <SheetTitle>WELCOME </SheetTitle>
              <SheetDescription>
                Selamat Datang di Sekolah Alam Tanjung Tabalong {user?user.name:""}
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-4 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)} // sidebar otomatis nutup
                  className={`hover:text-green-600 transition-colors
                    ${pathname === item.href ? "font-semibold underline underline-offset-4" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
              {/* Tambahkan link ke /ortu hanya untuk user role ortu */}
  {user?.role === "ortu" && (
    <Link
      href="/ortu"
      className={`hover:text-green-600 transition-colors border-b-4 border-transparent
        ${pathname.startsWith("/ortu") ? "border-green-600 font-semibold" : ""}`}
    >
      Halaman Ortu
    </Link>
  )}

              {pathname !== '/login' && (
          <div className="flex md:hidden">
            <Button asChild onClick={() => setOpen(false)}>
              {!isLoggedIn ? (
                <Link href="/login">Login</Link>
              ) : user.role === "ortu" ? (
                <button type="button" onClick={handleLogout}>
                  Keluar Sebagai {user?user.name:""}
                </button>
              ) : (
                <Link href="/dashboard">Dashboard</Link>
              )}
            </Button>
          </div>
        )}

            </nav>
            {/* Logo + Text di bawah sidebar */}
            <div className="mt-auto p-4 flex items-center space-x-2 border-t border-gray-200">
              <Image
                src="/logo-sattnav.png"
                alt="Logo SATT"
                width={40}
                height={40}
              />
              <div className="flex flex-col text-sm">
                <span className="font-bold">SATT</span>
                <span className="text-gray-500">member of JSAN</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
