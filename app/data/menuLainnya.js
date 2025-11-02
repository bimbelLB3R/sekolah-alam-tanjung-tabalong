import { ArrowUpDown, BookOpen, BookText, Cog, HandCoins, TentTree, VectorSquare } from "lucide-react";
export const menuItems = [
  {
    name: "Manajemen Tahfidz",
    icon: BookOpen,
    href: "/dashboard/manajemen/lainnya/tahfidz",
  },
  {
    name: "Manajemen Tilawati",
    icon: BookText,
    href: "/dashboard/manajemen/lainnya/tilawati",
  },
  {
    name: "Manajemen Kelas SATT",
    icon: VectorSquare,
    href: "/dashboard/manajemen/lainnya/kelas",
  },
  {
    name: "Manajemen Pembayaran",
    icon: HandCoins,
    href: "/dashboard/manajemen/lainnya/pembayaran",
  },
  {
    name: "Jurnal Harian/ Kas Masuk-Keluar",
    icon: ArrowUpDown,
    href: "/dashboard/manajemen/lainnya/jurnal-harian",
  },
  {
    name: "Monitoring Kegiatan Kelas",
    icon: TentTree,
    href: "/dashboard/manajemen/monitoring-kegiatan",
  },
  {
    name: "Perencanaan Kegiatan SATT",
    icon: Cog,
    href: "/dashboard/allevents",
  },
];