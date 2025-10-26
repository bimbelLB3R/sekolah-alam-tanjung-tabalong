"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown, BookOpen, BookText, HandCoins, VectorSquare } from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
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
    href: "/dashboard/manajemen/lainnya/pembayaran",
  },
];

export default function LainLainPage() {
  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-6">Menu Lain-lain</h1> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={item.href}>
                <Card className="cursor-pointer hover:shadow-lg transition rounded-2xl">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <Icon className="w-12 h-12 mb-4 text-orange-500" />
                    <span className="text-lg font-medium text-center">{item.name}</span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
