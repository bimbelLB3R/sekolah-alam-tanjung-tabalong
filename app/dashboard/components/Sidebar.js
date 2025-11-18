
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users, Home, FileText, Settings, Wallet, Cable, Calendar, ChevronLeft, ChevronRight, ScrollText } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/getUserClientSide";
import { rolePermissions } from "@/lib/rolePermissions";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { menuItems } from "@/app/data/menuLainnya";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const userRoleName=user?.role_name;
  // console.log(userRoleName)
  // Accordion state: hanya satu menu utama yang terbuka
  const [openMenu, setOpenMenu] = useState(null); 
  const [userCount, setUserCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false); // State untuk collapsed sidebar
  const eventsCount = 2;
  const infoManaj = menuItems.length;
  // const lainnya=menuItems.length;
  // console.log(lainnya)

  // Load state dari localStorage saat mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpenMenu");
    if (saved) setOpenMenu(saved);
    
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed) setIsCollapsed(savedCollapsed === "true");
  }, []);

  // Simpan state ke localStorage setiap kali berubah
  useEffect(() => {
    if (openMenu) localStorage.setItem("sidebarOpenMenu", openMenu);
    else localStorage.removeItem("sidebarOpenMenu");
  }, [openMenu]);

  // Simpan state collapsed ke localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

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
  const NavLink = ({ href, children, variant, className }) => (
    <Button
      asChild
      variant={variant}
      className={`justify-start w-full ${className || ""}`}
      onClick={() => onClose && onClose()}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );

  // === Array menu dinamis ===
  const menus = [
    { type: "link", label: "Home", href: "/dashboard", icon: <Home /> },
    { type: "link", label: "Kepanitiaan", href: "/dashboard/my-activities", icon: <ScrollText /> },
    {
      type: "collapsible",
      key: "users",
      label: "Users",
      icon: <Users />,
      allowedRoles: ["superadmin"], // ← TAMBAHKAN INI
      badge: userCount,
      items: [
        { label: "List Users", href: "/dashboard/users",badge: userCount },
        { label: "Add User", href: "/dashboard/register" },
        { label: "Roles", href: "/dashboard/roles" },
      ],
    },
    {
      type: "collapsible",
      key: "bendahara",
      label: "Bendahara",
      icon: <Wallet />,
      allowedRoles: ["superadmin","bendahara"], // ← TAMBAHKAN INI
      items: [
        {
          label: "Pemasukan",
          items: [
            { label: "SPP", href: "/dashboard/bendahara/pemasukan/spp" },
            { label: "Uang Pangkal", href: "/dashboard/bendahara/pemasukan/uang-pangkal" },
            { label: "Uang Tahunan", href: "/dashboard/bendahara/pemasukan/tahunan" },
            { label: "Uang Sarpras", href: "/dashboard/bendahara/pemasukan/sarpras" },
            { label: "Uang Seragam", href: "/dashboard/bendahara/pemasukan/seragam" },
            { label: "Uang Komite", href: "/dashboard/bendahara/pemasukan/komite" },
            { label: "Uang Lainnya", href: "/dashboard/bendahara/pemasukan/lainnya" },

          ],
        },
        {
          label: "Monitoring Keuangan",
          items: [
            { label: "Dana Kelas", href: "/dashboard/bendahara/monitoring" },
            { label: "Dana Kegiatan", href: "/dashboard/bendahara/monitoring/events" },
            // { label: "Lainnya", href: "/dashboard/bendahara/pemasukan/lainnya" },
          ],
        },
        {
          label: "Penggajian",
          items: [
            // { label: "Karyawan", href: "/dashboard/bendahara/slip" },
            { label: "Slip Gaji", href: "/dashboard/bendahara/slip" },
            { label: "Lainnya", href: "/dashboard/bendahara" },
          ],
        },
        {
          label: "Data Guru",
          items: [
            { label: "Kehadiran", href: "/dashboard/manajemen/data-presensi" },
            { label: "Validasi Ijin", href: "/dashboard/bendahara/ijin" },
            { label: "Perfoma Kehadiran", href: "/dashboard/bendahara/perfoma" },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      key: "manajemen",
      label: "Manajemen",
      icon: <Cable />,
      allowedRoles: ["superadmin","manajemen"], // ← TAMBAHKAN INI
      badge: infoManaj,
      items: [
        { label: "Data Siswa", href: "/dashboard/manajemen/dapodik" },
        { label: "Data Presensi", href: "/dashboard/manajemen/data-presensi" },
        { label: "Lain-lain", href: "/dashboard/manajemen/lainnya",badge:infoManaj },
      ],
    },
    {
      type: "collapsible",
      key: "events",
      label: "Events",
      icon: <Calendar />,
      allowedRoles: ["superadmin","manajemen"], // ← TAMBAHKAN INI
      badge: eventsCount,
      items: [
        { label: "Kelola Even", href: "/dashboard/events" },
        { label: "Lainnya", href: "/dashboard/events/lainnya" },
      ],
    },
    {
      type: "collapsible",
      key: "guru",
      label: "Administrasi Guru",
      icon: <Cable />,
      badge: infoManaj,
      allowedRoles: ["superadmin","guru","manajemen"], // ← TAMBAHKAN INI
      items: [
        { label: "Tahfidz", href: "/dashboard/guru/tahfidz" },
        { label: "Tilawati", href: "/dashboard/guru/tilawati" },
        { label: "Weekly", href: "/dashboard/guru/weekly" },
        { label: "Data Kehadiran", href: "/dashboard/manajemen/data-presensi" },
      ],
    },
    { type: "link", label: "Settings", href: "/dashboard/settings", icon: <Settings />,allowedRoles: ["superadmin"]}
  ];

  // Fungsi rekursif untuk render submenu multi-level
  const renderMenuItems = (items, level = 1) => {
    return items.map((item) => {
      if (item.items) {
        return (
          <Collapsible key={item.label}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`justify-between w-full pl-${level * 4}`}
              >
                <span>{item.label}</span>
                <ChevronDown className="ml-1 transition-transform" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col pl-4 space-y-1">
                {renderMenuItems(item.items, level + 1)}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      }
      return (
        <NavLink
        key={item.label}
        href={item.href}
        variant={pathname === item.href ? "default" : "ghost"}
        className={`flex justify-between items-center pl-${level * 4}`}
      >
        <span>{item.label}</span>
        {item.badge > 0 && (
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
      );
    });
  };



// Fungsi cek izin -> SAMA dengan middleware
function hasAccess(roleName, href) {
  
  if (!roleName) return false
  if (!href) return false; // guard penting
  const allowed = rolePermissions[roleName] || []
  // console.log(allowed)
  // superadmin
  if (allowed.includes("*")) return true

  // cek root dashboard persis
  if (href === "/dashboard" && allowed.includes("/dashboard")) return true

  // cek child
  return allowed.some(path =>
    path !== "/dashboard" && href.startsWith(path)
  )
}

// Tambahkan fungsi helper ini
function filterMenuItems(items, roleName) {
  return items
    .map(item => {
      // Jika punya nested items, filter rekursif
      if (item.items) {
        const filteredChildren = filterMenuItems(item.items, roleName);
        // Hanya return kalau ada children yang lolos
        return filteredChildren.length > 0 
          ? { ...item, items: filteredChildren } 
          : null;
      }
      // Jika single item, cek akses
      return hasAccess(roleName, item.href) ? item : null;
    })
    .filter(Boolean); // hapus null
}



  return (
    <div className={`fixed inset-0 z-30 md:static md:flex transition-all ${isOpen ? "flex" : "hidden"}`}>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/30 md:hidden" onClick={onClose}></div>

      {/* Sidebar */}
      <div className={`w-64 ${isCollapsed ? 'md:w-20' : 'md:w-20 lg:w-64'} bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <div className="p-4 text-xl font-bold flex justify-between items-center">
          <span className={`block ${isCollapsed ? 'md:hidden' : 'lg:block'}`}>SATT Dashboard</span>
          {/* Tombol close untuk mobile */}
          <Button variant="ghost" size="sm" className="md:hidden flex" onClick={onClose}>X</Button>
          {/* Tombol toggle untuk desktop */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col p-2 space-y-2">
            {menus.map((menu) => {              
              if (menu.type === "link") {
                if (!hasAccess(userRoleName, menu.href)) return null; // sembunyikan
                return (
                  <NavLink
                    key={menu.label}
                    href={menu.href}
                    variant={pathname === menu.href ? "default" : "ghost"}
                  >
                    {menu.icon}
                    <span className={`ml-2 ${isCollapsed ? 'md:hidden' : ''}`}>{menu.label}</span>
                  </NavLink>
                );
              }
              if (menu.type === "collapsible") {
                  // filter items di dalam collapsible
                  // const filteredItems = menu.items.filter(item => hasAccess(userRoleName, item.href));
                  // ✅ CEK ROLE DULU sebelum filter items
                  if (menu.allowedRoles && !menu.allowedRoles.includes(userRoleName)) {
                    return null; // ← role tidak diizinkan, hide menu
                  }
                  const filteredItems = filterMenuItems(menu.items, userRoleName);
                  // console.log(filteredItems)
                  if (filteredItems.length === 0) return null; // kalau kosong, hide collapsible
                  
                  // Hide collapsible ketika collapsed (hanya di desktop md ke atas, bukan mobile)
                  // if (isCollapsed && window.innerWidth >= 768) return null;
                  if (isCollapsed && window.innerWidth >= 768) {
                    return (
                      <Tooltip key={menu.key}>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="justify-start w-full">
                            {menu.icon}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {menu.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  
                return (
                  <Collapsible
                    key={menu.key}
                    open={openMenu === menu.key}
                    onOpenChange={() => toggleMenu(menu.key)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="justify-between w-full"
                      >
                        <div className="flex items-center gap-2">
                          {menu.icon}
                          <span>{menu.label}</span>
                        </div>
                        <span className="ml-auto flex items-center gap-1">
                          {/* {menu.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {menu.badge}
                            </span>
                          )} */}
                          <ChevronDown
                            className={`ml-1 transition-transform duration-200 ${
                              openMenu === menu.key ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col pl-6 space-y-1">
                        {renderMenuItems(filteredItems)}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }
            })}
          </nav>
        </ScrollArea>

        {/* Logo + Text di bawah sidebar */}
        <Link href="/">
        <div className={`mt-auto p-4 flex items-center ${isCollapsed ? 'md:justify-center' : 'space-x-2'} border-t border-gray-200`}>
          <Image
            src="/logo-sattnav.png"
            alt="Logo SATT"
            width={40}
            height={40}
          />
          <div className={`flex flex-col text-sm ${isCollapsed ? 'md:hidden' : ''}`}>
            <span className="font-bold">SATT</span>
            <span className="text-gray-500">member of JSAN</span>
          </div>
        </div>
        </Link>
      </div>
    </div>
  );
}