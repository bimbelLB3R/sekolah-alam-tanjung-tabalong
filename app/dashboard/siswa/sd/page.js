"use client";

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
import { Users, BookOpen, GraduationCap, Calendar, Layers, Star } from "lucide-react";

export default function SdPage() {
  const kelasList = ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"];
  const rombelList = ["A", "B", "C"];
  const colors = ["bg-pink-200","bg-yellow-200","bg-green-200","bg-blue-200","bg-purple-200","bg-orange-200"];
  const icons = [Users, BookOpen, GraduationCap, Calendar, Layers, Star]; // array icon

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
            <BreadcrumbPage>SD</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">SD</h1>
      <p className="mb-6">Detail jumlah siswa per rombel SD.</p>

      {/* Grid rombel */}
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6">
        {kelasList.map((kelas, i) =>
          rombelList.map((rombel, j) => (
            <DashboardCard
              key={`${kelas}-${rombel}`}
              title={`${kelas} - ${rombel}`}
              value={Math.floor(Math.random() * 30 + 20)} // contoh jumlah siswa
              href={`/dashboard/siswa/sd/${kelas.toLowerCase().replace(" ", "-")}/${rombel.toLowerCase()}`}
              bgColor={colors[i % colors.length]}
              index={i}
              icon={icons[i % icons.length]}   // kasih icon sesuai kelas
            />
          ))
        )}
      </div>
    </div>
  );
}
