"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Konten utama */}
      <div className="flex-1 flex flex-col">
        {/* Header dengan toggle button */}
        <header className="p-4 border-b border-gray-200 flex items-center">
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Menu
          </Button>
          <h1 className="ml-4 text-xl font-bold">Dashboard</h1>
        </header>

        {/* Konten halaman */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
