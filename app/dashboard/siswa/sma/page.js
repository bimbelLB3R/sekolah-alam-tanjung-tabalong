"use client"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import DashboardCard from "../../components/DashboardCard";

// 👉 Import icon dari lucide-react
import { Users, GraduationCap, BookOpen } from "lucide-react";

export default function SmaPage() {
  const kelasList = ["kelas-10", "kelas-11", "kelas-12"];
  const rombelList = ["rombel-a", "rombel-b", "rombel-c"];
  const colors = [
    "bg-pink-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-purple-200",
    "bg-orange-200",
  ];

  // 👉 daftar icon untuk tiap kelas
  const icons = [Users, BookOpen, GraduationCap];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/siswa">Siswa</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>SMA</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">SMA</h1>
      <p className="mb-6">Detail jumlah siswa per rombel SMA.</p>

      {/* Grid rombel */}
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kelasList.map((kelas, i) =>
          rombelList.map((rombel, j) => (
            <DashboardCard
              key={`${kelas}-${rombel}`}
              title={`${kelas.replace("-", " ").toUpperCase()} - ${rombel.toUpperCase()}`}
              value={Math.floor(Math.random() * 30 + 20)} // contoh jumlah siswa
              href={`/dashboard/siswa/sma/${kelas}/${rombel}`}
              bgColor={colors[(i + j) % colors.length]}
              icon={icons[i % icons.length]} // 👉 icon sesuai kelas
            />
          ))
        )}
      </div>
    </div>
  );
}
