"use client";

import { useEffect, useState, useRef } from "react";
import DashboardCard from "./components/DashboardCard";
import { ChevronDown } from "lucide-react";

export default function DashboardPage() {
  const [reservasiCount, setReservasiCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({}); // menyimpan ref untuk tiap dropdown

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
        { title: "Jumlah Siswa", value: 80, href: "/dashboard/siswa" },
        { title: "Reservasi Siswa", value: reservasiCount, href: "/dashboard/reservasi" },
        { title: "Daftar Ulang", value: 10, href: "/dashboard/daftarulang" },
      ],
    },
    {
      key: "guru",
      label: "Guru",
      cards: [
        { title: "Jumlah Guru", value: 15, href: "/dashboard/guru" },
        { title: "Jadwal Mengajar", value: 5, href: "/dashboard/jadwal" },
        { title: "Grafik Kehadiran", value: 1, href: "/dashboard/grafik-hadir" },
      ],
    },
    {
      key: "yayasan",
      label: "Yayasan",
      cards: [
        { title: "Data Inventaris", value: 0, href: "/dashboard/yayasan/inventaris" },
        { title: "Program", value: 0, href: "/dashboard/yayasan/program" },
        { title: "Lainnya", value: 0, href: "/dashboard/yayasan/lainnya" },
      ],
    },
  ];

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isOpen = openDropdown === category.key;

        return (
          <div key={category.key} className="border rounded overflow-hidden">
            {/* Trigger */}
            <button
              onClick={() => toggleDropdown(category.key)}
              className="w-full px-4 py-2 bg-gray-200 flex justify-between items-center"
            >
              {category.label}
              <ChevronDown
                size={16}
                className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Content */}
            <div
              ref={(el) => (dropdownRefs.current[category.key] = el)}
              className="transition-all duration-500 ease-in-out overflow-hidden"
              style={{
                maxHeight: isOpen
                  ? `${dropdownRefs.current[category.key]?.scrollHeight}px`
                  : "0px",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                {category.cards.map((card) => (
                  <DashboardCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    href={card.href}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
