"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users, Home, FileText, Settings, Wallet, Cable } from "lucide-react";
import Image from "next/image";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  // Accordion state: hanya satu menu utama yang terbuka
  const [openMenu, setOpenMenu] = useState(null); 
  const [userCount, setUserCount] = useState(0);
  const reportCount = 2;
  const infoBundum=1;
  const infoManaj=7;

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

  // Ambil data jumlah users
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

  // === NavLink helper ===
  const NavLink = ({ href, children, variant }) => (
    <Button
      asChild
      variant={variant}
      className="justify-start"
      onClick={() => onClose && onClose()}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );

  return (
    <div className={`fixed inset-0 z-30 md:static md:flex transition-all ${isOpen ? "flex" : "hidden"}`}>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/30 md:hidden" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="w-64 md:w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="p-4 text-xl font-bold flex justify-between items-center md:block">
          <span className="md:block lg:block">SATT Dashboard</span>
          <Button variant="ghost" size="sm" className="md:hidden flex" onClick={onClose}>X</Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col p-2 space-y-2">
            {/* Home */}
            <NavLink href="/dashboard" variant={pathname === "/dashboard" ? "default" : "ghost"}>
              <Home className="mr-2" />
              <span className="md:inline">Home</span>
            </NavLink>

            {/* Users */}
            <Collapsible open={openMenu === "users"} onOpenChange={() => toggleMenu("users")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`justify-between w-full ${pathname.startsWith("/dashboard/users") ? "bg-gray-100" : ""}`}
                >
                  <Users className="mr-2" />
                  <span className="md:inline">Users</span>
                  <span className="ml-auto flex items-center">
                    {userCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{userCount}</span>}
                    <ChevronDown className={`ml-1 transition-transform duration-200 ${openMenu === "users" ? "rotate-180" : ""}`} />
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col pl-6 space-y-1">
                  <NavLink href="/dashboard/users" variant={pathname === "/dashboard/users" ? "default" : "ghost"}>List Users</NavLink>
                  <NavLink href="/dashboard/register" variant={pathname === "/dashboard/register" ? "default" : "ghost"}>Add User</NavLink>
                  <NavLink href="/dashboard/roles" variant={pathname === "/dashboard/roles" ? "default" : "ghost"}>Roles</NavLink>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Bendahara */}
            <Collapsible open={openMenu === "bendahara"} onOpenChange={() => toggleMenu("bendahara")}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`justify-start w-full ${pathname.startsWith("/dashboard/bendahara") ? "bg-gray-100" : ""}`}
                >
                  <Wallet className="mr-2" />
                  <span className="flex-1 text-left">Bendahara</span>
                  <ChevronDown className={`ml-1 transition-transform duration-200 ${openMenu === "bendahara" ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col pl-10 space-y-1">
                  
                  {/* Pemasukan (punya submenu lagi) */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="justify-between w-full">
                        <span>Pemasukan</span>
                        <ChevronDown className="ml-1 transition-transform" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col pl-6 space-y-1">
                        <NavLink href="/dashboard/bendahara/pemasukan/spp" variant={pathname === "/dashboard/bendahara/pemasukan/spp" ? "default" : "ghost"}>
                          SPP
                        </NavLink>
                        <NavLink href="/dashboard/bendahara/pemasukan/donasi" variant={pathname === "/dashboard/bendahara/pemasukan/donasi" ? "default" : "ghost"}>
                          Donasi
                        </NavLink>
                        <NavLink href="/dashboard/bendahara/pemasukan/lainnya" variant={pathname === "/dashboard/bendahara/pemasukan/lainnya" ? "default" : "ghost"}>
                          Lainnya
                        </NavLink>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Payroll (punya submenu lagi) */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="justify-between w-full">
                        <span>Penggajian</span>
                        <ChevronDown className="ml-1 transition-transform" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col pl-6 space-y-1">
                        <NavLink href="/dashboard/bendahara/pemasukan/spp" variant={pathname === "/dashboard/bendahara/pemasukan/spp" ? "default" : "ghost"}>
                          Karyawan
                        </NavLink>
                        <NavLink href="/dashboard/bendahara/pemasukan/donasi" variant={pathname === "/dashboard/bendahara/pemasukan/donasi" ? "default" : "ghost"}>
                          Guru
                        </NavLink>
                        <NavLink href="/dashboard/bendahara/pemasukan/lainnya" variant={pathname === "/dashboard/bendahara/pemasukan/lainnya" ? "default" : "ghost"}>
                          Lainnya
                        </NavLink>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Bonus (punya submenu lagi) */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="justify-between w-full">
                        <span>Bonus</span>
                        <ChevronDown className="ml-1 transition-transform" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col pl-6 space-y-1">
                        <NavLink href="/dashboard/bendahara/pemasukan/spp" variant={pathname === "/dashboard/bendahara/pemasukan/spp" ? "default" : "ghost"}>
                          Kehadiran
                        </NavLink>
                        <NavLink href="/dashboard/bendahara/pemasukan/donasi" variant={pathname === "/dashboard/bendahara/pemasukan/donasi" ? "default" : "ghost"}>
                          Administrasi
                        </NavLink>
                        <NavLink href="/dashboard/bendahara/pemasukan/lainnya" variant={pathname === "/dashboard/bendahara/pemasukan/lainnya" ? "default" : "ghost"}>
                          Lainnya
                        </NavLink>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
                  <span className="md:inline">Manajemen</span>
                  <span className="ml-auto flex items-center">
                    {infoManaj > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{infoManaj}</span>}
                    <ChevronDown className={`ml-1 transition-transform duration-200 ${openMenu === "manajemen" ? "rotate-180" : ""}`} />
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col pl-6 space-y-1">
                  <NavLink href="/dashboard/manajemen/dapodik" variant={pathname === "/dashboard/manajemen/dapodik" ? "default" : "ghost"}>Dapodik</NavLink>
                  <NavLink href="/dashboard/manajemen/data-presensi" variant={pathname === "/dashboard/manajemen/data-presensi" ? "default" : "ghost"}>Data Presensi</NavLink>
                  <NavLink href="/dashboard/manajemen/lain-lain" variant={pathname === "/dashboard/manajemen/lain-lain" ? "default" : "ghost"}>Lain-lain</NavLink>
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
                  <span className="md:inline">Reports</span>
                  <span className="ml-auto flex items-center">
                    {reportCount > 0 && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{reportCount}</span>}
                    <ChevronDown className={`ml-1 transition-transform duration-200 ${openMenu === "reports" ? "rotate-180" : ""}`} />
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col pl-6 space-y-1">
                  <NavLink href="/reports/sales" variant={pathname === "/reports/sales" ? "default" : "ghost"}>Sales Report</NavLink>
                  <NavLink href="/reports/users" variant={pathname === "/reports/users" ? "default" : "ghost"}>User Report</NavLink>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Settings */}
            <NavLink href="/settings" variant={pathname === "/settings" ? "default" : "ghost"}>
              <Settings className="mr-2" />
              <span className="md:inline">Settings</span>
            </NavLink>
          </nav>
        </ScrollArea>

        {/* Logo + Text di bawah sidebar */}
  <div className="mt-auto p-4 flex items-center space-x-2 border-t border-gray-200">
    <Image
      src="/logo-sattnav.png"  // path dari /public/logo/
      alt="Logo SATT"
      width={40}
      height={40}
    />
    <div className="flex flex-col text-sm">
      <span className="font-bold">SATT</span>
      <span className="text-gray-500">member of JSAN</span>
    </div>
  </div>
      </div>
    </div>
  );
}
