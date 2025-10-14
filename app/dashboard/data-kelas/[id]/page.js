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
import { useEffect, useState, useCallback } from "react";
import { formatName } from "@/lib/formatName";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";

export default function DataKelas() {
  const params = useParams();
  const { id } = params;
  // console.log(id)

  const [kelasList, setKelasList] = useState([]);
  const [allKelas, setAllKelas] = useState([]); // 🆕 semua kelas
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState([]); // 🆕 checklist
  const [kelasTujuan, setKelasTujuan] = useState(""); // 🆕 kelas yang dipilih
  // console.log(siswaList)

  // --- fetch kelas detail ---
  const fetchKelas = useCallback(async () => {
    const res = await fetch("/api/nama-kelas", { cache: "no-store" });
    const data = await res.json();
    setAllKelas(data);
    const selected = data.find((item) => String(item.id) === String(id));
    setKelasList(selected);
  }, [id]);

  // --- fetch siswa by kelas ---
  const fetchSiswaByKelas = useCallback(async () => {
    if (!id) return;
    const res = await fetch(`/api/siswa-kelas?kelas_id=${id}`, { cache: "no-store" });
    const data = await res.json();
    // const selected = data.find((item) => String(item.kelas_id) === String(id));
    // console.log(data)
    setSiswaList(data);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchKelas();
      fetchSiswaByKelas();
    }
  }, [id, fetchKelas, fetchSiswaByKelas]);

  // --- handle checklist ---
  const toggleSelectSiswa = (siswaId) => {
    setSelectedSiswa((prev) =>
      prev.includes(siswaId) ? prev.filter((id) => id !== siswaId) : [...prev, siswaId]
    );
  };

  // --- pindah kelas ---
  const handlePindahKelas = async () => {
    if (selectedSiswa.length === 0) {
      alert("Pilih minimal satu siswa!");
      return;
    }
    if (!kelasTujuan) {
      alert("Pilih kelas tujuan!");
      return;
    }

    const res = await fetch("/api/siswa-kelas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siswa_ids: selectedSiswa,
        kelas_id_baru: kelasTujuan,
        tahun_ajaran: "2025/2026",
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Siswa berhasil dipindahkan");
      setSelectedSiswa([]);
      setKelasTujuan("");
      fetchSiswaByKelas(); // refresh list
    } else {
      alert("Gagal memindahkan siswa");
    }
  };

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
              <Link href="/dashboard/data-kelas">All Kelas</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{kelasList?.kelas_lengkap}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6 text-center uppercase">
        {kelasList?.kelas_lengkap}
      </h1>

      

      <Tabs defaultValue="data-siswa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data-siswa">Data Siswa</TabsTrigger>
          <TabsTrigger value="inventaris">Inventaris</TabsTrigger>
          <TabsTrigger value="data-wali">Data Wali</TabsTrigger>
          <TabsTrigger value="laporan-keuangan">Laporan Keuangan</TabsTrigger>
        </TabsList>

        <TabsContent value="data-siswa">
          {/* Pilih kelas tujuan + tombol pindah */}
          <div className="flex items-center gap-2 mb-4">
            <Select value={kelasTujuan} onValueChange={setKelasTujuan}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih kelas tujuan" />
              </SelectTrigger>
              <SelectContent>
                {allKelas
                  .filter((kelas) => kelas.id !== id) // tidak tampil kelas yang sama
                  .map((kelas) => (
                    <SelectItem key={kelas.id} value={kelas.id}>
                      {kelas.kelas_lengkap}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={handlePindahKelas} disabled={selectedSiswa.length === 0 || !kelasTujuan}>
              Pindah Kelas
            </Button>
          </div>
          {/* <p className="mb-4">Menampilkan daftar siswa untuk {kelasList?.kelas_lengkap}:</p> */}
          <ul className="space-y-2">
            {siswaList.length > 0 ? (
              siswaList.map((siswa) => (
                <li
                  key={siswa.siswa_id}
                  className="p-2 border rounded-lg flex justify-between items-center"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSiswa.includes(siswa.siswa_id)}
                      onChange={() => toggleSelectSiswa(siswa.siswa_id)}
                    />
                    <span>{formatName(siswa.nama_lengkap)}</span>
                  </label>
                  {/* <span className="text-sm text-gray-500">{siswa.nisn}</span> */}
                </li>
              ))
            ) : (
              <li className="text-gray-500">Belum ada siswa di kelas ini.</li>
            )}
          </ul>
        </TabsContent>

        <TabsContent value="inventaris">
          <p>Menampilkan inventaris {kelasList?.kelas_lengkap}.</p>
        </TabsContent>

        <TabsContent value="data-wali">
          <p>Kelas ini dibimbing oleh {kelasList?.wali_kelas_nama}.</p>
        </TabsContent>

        <TabsContent value="laporan-keuangan">
          <p>Menampilkan laporan keuangan kelas {kelasList?.kelas_lengkap}.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
