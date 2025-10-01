"use client"
import { Book } from "lucide-react";  // ganti BookIcon jadi Book
import DashboardCard from "../components/DashboardCard";

export default function SiswaPage() {
  const jenjangs = [
    { name: "PAUD", value: "120", href: "/dashboard/siswa/paud", bgColor: "bg-pink-200", icon: Book },
    { name: "TK", value: "200", href: "/dashboard/siswa/tk", bgColor: "bg-yellow-200", icon: Book },
    { name: "SD", value: "450", href: "/dashboard/siswa/sd", bgColor: "bg-green-200", icon: Book },
    { name: "SMP", value: "300", href: "/dashboard/siswa/smp", bgColor: "bg-blue-200", icon: Book },
    { name: "SMA", value: "150", href: "/dashboard/siswa/sma", bgColor: "bg-purple-200", icon: Book },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Base Siswa</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {jenjangs.map((jenjang, index) => (
          <DashboardCard
            key={jenjang.name}
            title={jenjang.name}
            value={jenjang.value}
            href={jenjang.href}
            bgColor={jenjang.bgColor}
            icon={jenjang.icon}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
