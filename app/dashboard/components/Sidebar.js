"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users, Home, FileText, Settings, Wallet, Cable } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  // Accordion state: hanya satu menu utama yang terbuka
  const [openMenu, setOpenMenu] = useState(null); // "users", "bendahara", "reports" atau null
  const [userCount, setUserCount] = useState(0);

  // Load state dari localStorage saat mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpenMenu");
    if (saved) setOpenMenu(saved);
  }, []);

  // Simpan state ke localStorage setiap kali berubah
  useEffect(() => {
    if (openMenu) localStorage.setItem("sidebarOpenMenu", openMenu);
    else localStorage.removeItem("sidebarOpenMenu");
  }, [openMenu]);

  // Toggle menu utama (accordion)
  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  // ambil data jml users
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch("/api/users/count");
        const data = await res.json();
        setUserCount(data.count || 0);
      } catch (error) {
        console.error("Gagal ambil user count:", error);
      }
    };
    fetchUserCount();
  }, []);

  // const userCount = 5;
  const reportCount = 2;

  return (
    <div className={`fixed inset-0 z-30 md:static md:flex transition-all ${isOpen ? "flex" : "hidden"}`}>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/30 md:hidden" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="w-64 md:w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="p-4 text-xl font-bold flex justify-between items-center md:block">
          <span className=" md:block lg:block">SATT Dashboard</span>
          <Button variant="ghost" size="sm" className="md:hidden flex " onClick={onClose}>X</Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col p-2 space-y-2">
            {/* Home */}
            <Button
              asChild
              variant={pathname === "/dashboard" ? "default" : "ghost"}
              className={`justify-start ${pathname === "/dashboard" ? "bg-gray-400" : ""}`}
            >
              <Link href="/dashboard">
                <Home className="mr-2" />
                <span className=" md:inline">Home</span>
              </Link>
            </Button>

            {/* Users */}
            <Collapsible open={openMenu === "users"} onOpenChange={() => toggleMenu("users")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`justify-between w-full ${pathname.startsWith("/dashboard/users") ? "bg-gray-100" : ""}`}
                >
                  <Users className="mr-2" />
                  <span className=" md:inline">Users</span>
                  <span className="ml-auto flex items-center">
                    {userCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{userCount}</span>}
                    <ChevronDown className={`ml-1 transition-transform duration-200 ${openMenu === "users" ? "rotate-180" : ""}`} />
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col pl-6 space-y-1">
                  <Button asChild variant={pathname === "/dashboard/users" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/users">List Users</Link>
                  </Button>
                  <Button asChild variant={pathname === "/dashboard/register" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/register">Add User</Link>
                  </Button>
                  <Button asChild variant={pathname === "/dashboard/roles" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/roles">Roles</Link>
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bendahara */}
            <Collapsible open={openMenu === "bendahara"} onOpenChange={() => toggleMenu("bendahara")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`justify-between w-full ${pathname.startsWith("/dashboard/bendahara") ? "bg-gray-100" : ""}`}
                >
                  <Wallet className="mr-2" />
                  <span className=" md:inline">Bendahara</span>
                  <span className="ml-auto flex items-center">
                    {userCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{userCount}</span>}
                    <ChevronDown className={`ml-1 transition-transform duration-200 ${openMenu === "bendahara" ? "rotate-180" : ""}`} />
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col pl-6 space-y-1">
                  <Button asChild variant={pathname === "/dashboard/bendahara/pemasukan" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/bendahara/pemasukan">Pemasukan</Link>
                  </Button>
                  <Button asChild variant={pathname === "/dashboard/bendahara/pengeluaran" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/bendahara/pengeluaran">Pengeluaran</Link>
                  </Button>
                  <Button asChild variant={pathname === "/dashboard/bendahara/piutang" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/bendahara/piutang">Piutang</Link>
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

             {/* Manajemen */}
            <Collapsible open={openMenu === "manajemen"} onOpenChange={() => toggleMenu("manajemen")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`justify-between w-full ${pathname.startsWith("/dashboard/manajemen") ? "bg-gray-100" : ""}`}
                >
                  <Cable className="mr-2" />
                  <span className=" md:inline">Manajemen</span>
                  <span className="ml-auto flex items-center">
                    {userCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{userCount}</span>}
                    <ChevronDown className={`ml-1 transition-transform duration-200 ${openMenu === "manajemen" ? "rotate-180" : ""}`} />
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col pl-6 space-y-1">
                  <Button asChild variant={pathname === "/dashboard/manajemen" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/manajemen">Dapodik</Link>
                  </Button>
                  <Button asChild variant={pathname === "/dashboard/manajemen" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/manajemen">Perijinan</Link>
                  </Button>
                  <Button asChild variant={pathname === "/dashboard/manajemen" ? "default" : "ghost"} className="justify-start">
                    <Link href="/dashboard/manajemen">Lain-lain</Link>
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Reports */}
            <Collapsible open={openMenu === "reports"} onOpenChange={() => toggleMenu("reports")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`justify-between w-full ${pathname.startsWith("/reports") ? "bg-gray-100" : ""}`}
                >
                  <FileText className="mr-2" />
                  <span className=" md:inline">Reports</span>
                  <span className="ml-auto flex items-center">
                    {reportCount > 0 && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{reportCount}</span>}
                    <ChevronDown className={`ml-1 transition-transform duration-200 ${openMenu === "reports" ? "rotate-180" : ""}`} />
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col pl-6 space-y-1">
                  <Button asChild variant={pathname === "/reports/sales" ? "default" : "ghost"} className="justify-start">
                    <Link href="/reports/sales">Sales Report</Link>
                  </Button>
                  <Button asChild variant={pathname === "/reports/users" ? "default" : "ghost"} className="justify-start">
                    <Link href="/reports/users">User Report</Link>
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Settings */}
            <Button asChild variant={pathname === "/settings" ? "default" : "ghost"} className="justify-start">
              <Link href="/settings">
                <Settings className="mr-2" />
                <span className=" md:inline">Settings</span>
              </Link>
            </Button>
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
