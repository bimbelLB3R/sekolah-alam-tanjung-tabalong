"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Camera } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          const err = await res.json();
          console.error("API error:", err);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten utama */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </Button>
          </div>

          {/* Avatar + Dropdown */}
          {mounted ? (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {/* Presensi dengan Link ke /dashboard/presensi */}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/presensi">
                      <Camera className="mr-2 h-4 w-4" />
                      Presensi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="text-gray-400 text-sm">Loading user...</div>
            )
          ) : (
            <div className="text-gray-400 text-sm">Loading user...</div>
          )}
        </header>

        {/* Konten halaman */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
