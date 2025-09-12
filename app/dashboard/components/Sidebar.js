"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Sidebar({ isOpen, onClose }) {
  return (
    // Sidebar overlay untuk mobile
    <div
      className={`fixed inset-0 z-30 md:static md:flex ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      {/* Background overlay di mobile */}
      <div
        className="fixed inset-0 bg-black/30 md:hidden"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col z-40">
        <div className="p-4 text-xl font-bold flex justify-between items-center md:block">
          My Dashboard
          {/* Tombol close hanya di mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onClose}
          >
            X
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col p-2 space-y-2">
            <Button asChild variant="ghost">
            <Link href="/dashboard">Home</Link>
            </Button>
            <Button variant="ghost">Users</Button>
            <Button variant="ghost">Reports</Button>
            <Button variant="ghost">Settings</Button>
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
