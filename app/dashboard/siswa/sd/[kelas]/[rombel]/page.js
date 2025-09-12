"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [siswa, setSiswa] = useState([]);

   useEffect(() => {
    fetch(`/api/siswa?kelas=${kelas}&rombel=${rombel}`)
      .then((res) => res.json())
      .then((data) => setSiswa(data))
      .catch(console.error);
  }, [kelas, rombel]);

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
              <Link href="/dashboard/siswa/sd">SD</Link>
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
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">No</th>
              <th className="border px-2 py-1">Nama</th>
              <th className="border px-2 py-1">Alamat</th>
              <th className="border px-2 py-1">Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((row,index) => (
              <tr key={row.id}>
                <td className="border px-2 py-1">{index+1}</td>
                <td className="border px-2 py-1">{row.nama_lengkap}</td>
                <td className="border px-2 py-1">{row.alamat}</td>
                <td className="border px-2 py-1">{row.tanggal_daftar}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
