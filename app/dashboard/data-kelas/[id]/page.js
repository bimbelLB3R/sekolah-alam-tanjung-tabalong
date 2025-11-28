

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
import { useEffect, useState } from "react";
import { formatName } from "@/lib/formatName";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, Users, CheckSquare, Square, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import LaporanKeuanganTab from "../../components/data-kelas/LaporanKeuanganKelas";
import InventarisKelasTab from "../../components/data-kelas/InventarisKelas";

export default function DataKelas() {
  const params = useParams();
  const { id } = params;

  // States
  const [kelasList, setKelasList] = useState(null);
  const [allKelas, setAllKelas] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [kelasTujuan, setKelasTujuan] = useState("");

  // console.log(siswaList)
  
  // Loading & Error states
  const [loadingKelas, setLoadingKelas] = useState(true);
  const [loadingSiswa, setLoadingSiswa] = useState(true);
  const [loadingPindah, setLoadingPindah] = useState(false);
  const [error, setError] = useState("");

  // Fetch kelas detail & all kelas
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        setLoadingKelas(true);
        setError("");

        const res = await fetch("/api/nama-kelas", { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal memuat data kelas");

        const data = await res.json();
        setAllKelas(data);

        const selected = data.find((item) => String(item.id) === String(id));
        if (!selected) {
          throw new Error("Kelas tidak ditemukan");
        }
        setKelasList(selected);
      } catch (err) {
        console.error("Error fetch kelas:", err);
        setError(err.message);
      } finally {
        setLoadingKelas(false);
      }
    };

    if (id) fetchKelas();
  }, [id]);

  // Fetch siswa by kelas
  useEffect(() => {
    const fetchSiswaByKelas = async () => {
      try {
        setLoadingSiswa(true);

        const res = await fetch(`/api/siswa-kelas?kelas_id=${id}`, { 
          cache: "no-store" 
        });
        if (!res.ok) throw new Error("Gagal memuat data siswa");

        const data = await res.json();
        setSiswaList(data);
      } catch (err) {
        console.error("Error fetch siswa:", err);
        // Error siswa tidak perlu tampilkan alert, cukup empty state
      } finally {
        setLoadingSiswa(false);
      }
    };

    if (id) fetchSiswaByKelas();
  }, [id]);

  // Toggle individual siswa
  const toggleSelectSiswa = (siswaId) => {
    setSelectedSiswa((prev) =>
      prev.includes(siswaId) 
        ? prev.filter((id) => id !== siswaId) 
        : [...prev, siswaId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedSiswa.length === siswaList.length) {
      setSelectedSiswa([]);
    } else {
      setSelectedSiswa(siswaList.map((s) => s.siswa_id));
    }
  };

  // Handle pindah kelas
  const handlePindahKelas = async () => {
    if (selectedSiswa.length === 0) {
      alert("Pilih minimal satu siswa!");
      return;
    }
    if (!kelasTujuan) {
      alert("Pilih kelas tujuan!");
      return;
    }

    const kelasTujuanNama = allKelas.find((k) => k.id === kelasTujuan)?.kelas_lengkap;
    const confirmed = window.confirm(
      `Pindahkan ${selectedSiswa.length} siswa ke ${kelasTujuanNama}?`
    );
    if (!confirmed) return;

    try {
      setLoadingPindah(true);
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
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memindahkan siswa");
      }

      alert(`Berhasil memindahkan ${selectedSiswa.length} siswa`);
      
      // Reset & refresh
      setSelectedSiswa([]);
      setKelasTujuan("");
      
      // Refresh siswa list
      const resSiswa = await fetch(`/api/siswa-kelas?kelas_id=${id}`, { 
        cache: "no-store" 
      });
      const dataSiswa = await resSiswa.json();
      setSiswaList(dataSiswa);
    } catch (err) {
      console.error("Error pindah kelas:", err);
      alert(err.message || "Gagal memindahkan siswa");
    } finally {
      setLoadingPindah(false);
    }
  };

  // Loading state
  if (loadingKelas) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="text-gray-500 mt-4">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/dashboard/data-kelas">Kembali ke Data Kelas</Link>
        </Button>
      </div>
    );
  }

  const isAllSelected = siswaList.length > 0 && selectedSiswa.length === siswaList.length;

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/data-kelas">Data Kelas</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{kelasList?.kelas_lengkap}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center uppercase">
          {kelasList?.kelas_lengkap}
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
          <Users className="h-4 w-4" />
          <span className="text-sm">
            {siswaList.length} siswa
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="data-siswa" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-siswa">Data Siswa</TabsTrigger>
          <TabsTrigger value="inventaris">Inventaris</TabsTrigger>
          <TabsTrigger value="data-wali">Data Wali</TabsTrigger>
          <TabsTrigger value="laporan-keuangan">Laporan Keuangan</TabsTrigger>
        </TabsList>

        {/* Tab: Data Siswa */}
        <TabsContent value="data-siswa">
          <Card>
            <CardContent className="pt-6">
              {/* Toolbar: Pindah Kelas */}
              {siswaList.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                      id="select-all"
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Pilih Semua ({selectedSiswa.length}/{siswaList.length})
                    </label>
                  </div>

                  <div className="flex items-center gap-2 flex-1 sm:ml-auto">
                    <Select 
                      value={kelasTujuan} 
                      onValueChange={setKelasTujuan}
                      disabled={selectedSiswa.length === 0}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Pilih kelas tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {allKelas
                          .filter((kelas) => String(kelas.id) !== String(id))
                          .map((kelas) => (
                            <SelectItem key={kelas.id} value={kelas.id}>
                              {kelas.kelas_lengkap}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={handlePindahKelas}
                      disabled={selectedSiswa.length === 0 || !kelasTujuan || loadingPindah}
                    >
                      {loadingPindah ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memindahkan...
                        </>
                      ) : (
                        `Pindah Kelas (${selectedSiswa.length})`
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Loading Siswa */}
              {loadingSiswa ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <p className="text-gray-500 mt-2 text-sm">Memuat data siswa...</p>
                </div>
              ) : siswaList.length > 0 ? (
                /* Daftar Siswa */
                <div className="space-y-2">
                  {siswaList.map((siswa, index) => {
                    const isSelected = selectedSiswa.includes(siswa.siswa_id);
                    return (
                      <div
                        key={siswa.siswa_id}
                        className={`
                          p-4 border rounded-lg flex items-center justify-between
                          transition-all duration-200
                          ${isSelected 
                            ? 'bg-orange-50 border-orange-300' 
                            : 'hover:bg-gray-50'
                          }
                        `}
                      >
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelectSiswa(siswa.siswa_id)}
                            id={`siswa-${siswa.siswa_id}`}
                          />
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 font-mono w-6">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="font-medium">
                              {formatName(siswa.nama_lengkap)}
                            </span>
                          </div>
                        </label>
                        {siswa.siswa_id && (
                          <Link href={`/dashboard/manajemen/dapodik/${siswa.siswa_id}`} className="text-sm text-gray-500 font-mono flex items-center justify-center space-x-2">
                            <Eye/>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">
                    Belum ada siswa di kelas ini
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Tambahkan siswa untuk memulai
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Inventaris */}
        {/* // Ganti TabsContent inventaris dengan: */}
<TabsContent value="inventaris">
  <InventarisKelasTab kelasList={kelasList} />
</TabsContent>

        {/* Tab: Data Wali */}
        <TabsContent value="data-wali">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Wali Kelas:</p>
                <p className="text-lg font-semibold">
                  {kelasList?.wali_kelas_nama || "Belum ditentukan"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Laporan Keuangan */}
        {/* <TabsContent value="laporan-keuangan">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500">
                Fitur laporan keuangan untuk {kelasList?.kelas_lengkap} akan segera hadir.
              </p>
            </CardContent>
          </Card>
        </TabsContent> */}
        <TabsContent value="laporan-keuangan">
          <LaporanKeuanganTab kelasList={kelasList} />
        </TabsContent>
      </Tabs>
    </div>
  );
}