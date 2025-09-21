"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { Button } from "@/components/ui/button";

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
        setUser(null); // reset state user
        window.location.href = "/login"; // redirect ke login
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
              ☰ Menu
            </Button>
            <h1 className="ml-4 text-xl font-bold">Dashboard</h1>
          </div>

          {/* User Info + Logout */}
          {mounted ? (
            user ? (
              <div className="text-right">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="text-right text-gray-400 text-sm">
                Loading user...
              </div>
            )
          ) : (
            <div className="text-right text-gray-400 text-sm">
              Loading user...
            </div>
          )}
        </header>

        {/* Konten halaman */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
