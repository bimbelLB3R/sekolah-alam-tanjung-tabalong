"use client";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function RombelPage() {
  const params = useParams();
  const { kelas, rombel } = params;

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
            <BreadcrumbLink asChild>
              <Link href="/dashboard/siswa/sma">SMA</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>
              {kelas.replace("-", " ").toUpperCase()} - {rombel.toUpperCase()}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Konten */}
      {/* Header */}
      <h1 className="text-2xl font-bold mt-4 mb-6">
        {kelas.replace("-", " ").toUpperCase()} - {rombel.toUpperCase()}
      </h1>

      {/* Tabs */}
      <Tabs defaultValue="data-siswa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data-siswa">Data Siswa</TabsTrigger>
          <TabsTrigger value="inventaris">Inventaris</TabsTrigger>
          <TabsTrigger value="data-wali">Data Wali</TabsTrigger>
          <TabsTrigger value="laporan-keuangan">Laporan Keuangan</TabsTrigger>
        </TabsList>

        <TabsContent value="data-siswa">
          <p>Menampilkan daftar siswa untuk {kelas.replace("-", " ")} {rombel.toUpperCase()}.</p>
        </TabsContent>

        <TabsContent value="inventaris">
          <p>Menampilkan inventaris kelas {kelas.replace("-", " ")} {rombel.toUpperCase()}.</p>
        </TabsContent>

        <TabsContent value="data-wali">
          <p>Menampilkan data wali siswa {kelas.replace("-", " ")} {rombel.toUpperCase()}.</p>
        </TabsContent>

        <TabsContent value="laporan-keuangan">
          <p>Menampilkan laporan keuangan kelas {kelas.replace("-", " ")} {rombel.toUpperCase()}.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
