"use client";

import { useEffect, useState } from "react";
import DashboardCard from "./components/DashboardCard";
import { BookOpen, Users, Calendar } from "lucide-react";

export default function DashboardPage() {
  const [reservasiCount, setReservasiCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/reservasi/count");
        const data = await res.json();
        setReservasiCount(data.total || 0);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchCount();
  }, []);

  const categories = [
    {
      key: "kesiswaan",
      label: "Kesiswaan",
      cards: [
        { title: "Jumlah Siswa", value: 80, href: "/dashboard/siswa", icon: Users },
        { title: "Reservasi Siswa", value: reservasiCount, href: "/dashboard/reservasi", icon: BookOpen },
        { title: "Daftar Ulang", value: 10, href: "/dashboard/daftarulang", icon: Calendar },
      ],
    },
    {
      key: "guru",
      label: "Guru",
      cards: [
        { title: "Jumlah Guru", value: 15, href: "/dashboard/guru", icon: Users },
        { title: "Jadwal Mengajar", value: 5, href: "/dashboard/jadwal", icon: Calendar },
        { title: "Grafik Kehadiran", value: 1, href: "/dashboard/grafik-hadir", icon: BookOpen },
      ],
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {categories.map((category, i) => (
        <div key={category.key}>
          {/* <h2 className="text-xl font-semibold mb-4">{category.label}</h2> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.cards.map((card) => (
              <DashboardCard
                key={card.title}
                title={card.title}
                value={card.value}
                href={card.href}
                icon={card.icon}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
