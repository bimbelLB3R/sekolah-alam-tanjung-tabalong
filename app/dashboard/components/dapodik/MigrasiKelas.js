

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check, X, Users, Search, AlertCircle } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function MigrasiKelas() {
  const [loading, setLoading] = useState(false);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [siswaList, setSiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, assigned, unassigned
  const [error, setError] = useState("");

  // Ambil data siswa & kelas
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [siswaRes, kelasRes] = await Promise.all([
        fetch("/api/dapodik/migrasi"),
        fetch("/api/nama-kelas"),
      ]);

      if (!siswaRes.ok) {
        throw new Error("Gagal memuat data siswa");
      }

      if (!kelasRes.ok) {
        throw new Error("Gagal memuat data kelas");
      }

      const siswaData = await siswaRes.json();
      const kelasData = await kelasRes.json();

      setSiswaList(siswaData);
      setKelasList(kelasData);
    } catch (err) {
      console.error("Error fetch data:", err);
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter & Search siswa
  const filteredSiswaList = useMemo(() => {
    let filtered = siswaList;

    // Filter by status
    if (filterStatus === "assigned") {
      filtered = filtered.filter((s) => s.kelas_lengkap);
    } else if (filterStatus === "unassigned") {
      filtered = filtered.filter((s) => !s.kelas_lengkap);
    }

    // Search by name
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((s) =>
        s.nama_lengkap.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [siswaList, filterStatus, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = siswaList.length;
    const assigned = siswaList.filter((s) => s.kelas_lengkap).length;
    const unassigned = total - assigned;
    return { total, assigned, unassigned };
  }, [siswaList]);

  // Toggle individual siswa
  const toggleSiswa = (id) => {
    setSelectedSiswa((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Toggle select all (filtered list)
  const toggleSelectAll = () => {
    const unassignedIds = filteredSiswaList
      .filter((s) => !s.kelas_lengkap)
      .map((s) => s.id);

    if (selectedSiswa.length === unassignedIds.length) {
      setSelectedSiswa([]);
    } else {
      setSelectedSiswa(unassignedIds);
    }
  };

  // Handle assign siswa ke kelas
  const handleAssign = async () => {
    if (!selectedKelas) {
      alert("Pilih kelas tujuan terlebih dahulu!");
      return;
    }

    if (selectedSiswa.length === 0) {
      alert("Pilih minimal 1 siswa!");
      return;
    }

    const kelasName = kelasList.find((k) => k.id === selectedKelas)?.kelas_lengkap;
    const confirmed = window.confirm(
      `Masukkan ${selectedSiswa.length} siswa ke kelas ${kelasName}?`
    );

    if (!confirmed) return;

    try {
      setLoadingAssign(true);
      setError("");

      const res = await fetch("/api/siswa-kelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelas_id: selectedKelas,
          siswa_ids: selectedSiswa,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal memasukkan siswa ke kelas");
      }

      alert(`Berhasil memasukkan ${selectedSiswa.length} siswa ke ${kelasName}`);

      // Reset & refresh
      setSelectedSiswa([]);
      setSelectedKelas("");
      await fetchData();
    } catch (err) {
      console.error("Error assign siswa:", err);
      setError(err.message);
      alert(err.message || "Gagal memasukkan siswa ke kelas");
    } finally {
      setLoadingAssign(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setSelectedKelas("");
    setSelectedSiswa([]);
    setSearchTerm("");
    setFilterStatus("all");
  };

  const isAllSelected =
    filteredSiswaList.filter((s) => !s.kelas_lengkap).length > 0 &&
    selectedSiswa.length === filteredSiswaList.filter((s) => !s.kelas_lengkap).length;

  return (
    <div className="p-6">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Pembagian Kelas
          </CardTitle>
          
          {/* Statistics */}
          <div className="flex gap-3 mt-4">
            <Badge variant="outline" className="text-sm">
              Total: {stats.total} siswa
            </Badge>
            <Badge variant="outline" className="text-sm text-green-600 border-green-300">
              Sudah: {stats.assigned}
            </Badge>
            <Badge variant="outline" className="text-sm text-orange-600 border-orange-300">
              Belum: {stats.unassigned}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading Initial */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <Loader2 className="animate-spin h-12 w-12 text-orange-500 mb-3" />
              <span className="text-gray-500">Memuat data...</span>
            </div>
          ) : (
            <>
              {/* Pilih Kelas */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  1. Pilih Kelas Tujuan
                </label>
                <Select 
                  onValueChange={setSelectedKelas} 
                  value={selectedKelas}
                  disabled={loadingAssign}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kelas tujuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {kelasList.map((kelas) => (
                      <SelectItem key={kelas.id} value={kelas.id}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{kelas.kelas_lengkap}</span>
                          {kelas.jumlah_siswa !== undefined && (
                            <span className="text-xs text-gray-500">
                              ({kelas.jumlah_siswa} siswa)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filters & Search */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  2. Pilih Siswa
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari nama siswa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                      disabled={loadingAssign}
                    />
                  </div>

                  {/* Filter Status */}
                  <Select 
                    value={filterStatus} 
                    onValueChange={setFilterStatus}
                    disabled={loadingAssign}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Siswa</SelectItem>
                      <SelectItem value="unassigned">Belum Ada Kelas</SelectItem>
                      <SelectItem value="assigned">Sudah Ada Kelas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select All Checkbox */}
                {filteredSiswaList.some((s) => !s.kelas_lengkap) && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                      id="select-all"
                      disabled={loadingAssign}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Pilih Semua ({selectedSiswa.length}/
                      {filteredSiswaList.filter((s) => !s.kelas_lengkap).length})
                    </label>
                  </div>
                )}

                {/* Siswa List */}
                <div className="max-h-96 overflow-auto border rounded-md p-3 space-y-2">
                  {filteredSiswaList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm 
                        ? `Tidak ada siswa dengan nama "${searchTerm}"`
                        : "Tidak ada data siswa"
                      }
                    </div>
                  ) : (
                    filteredSiswaList.map((siswa, index) => {
                      const hasKelas = !!siswa.kelas_lengkap;
                      const isSelected = selectedSiswa.includes(siswa.id);

                      return (
                        <div
                          key={siswa.id}
                          className={`
                            flex items-center justify-between p-3 rounded-lg
                            transition-all duration-200
                            ${hasKelas 
                              ? 'bg-gray-50 opacity-60' 
                              : isSelected 
                                ? 'bg-orange-50 border border-orange-300' 
                                : 'hover:bg-gray-50 border border-transparent'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSiswa(siswa.id)}
                              disabled={hasKelas || loadingAssign}
                              id={`siswa-${siswa.id}`}
                            />
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 font-mono w-6">
                                {(index + 1).toString().padStart(2, "0")}
                              </span>
                              <label
                                htmlFor={`siswa-${siswa.id}`}
                                className={`font-medium ${hasKelas ? 'text-gray-500' : 'cursor-pointer'}`}
                              >
                                {siswa.nama_lengkap}
                              </label>
                            </div>
                          </div>

                          {hasKelas && (
                            <Badge variant="secondary" className="text-xs">
                              {siswa.kelas_lengkap}
                            </Badge>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {selectedSiswa.length > 0 && (
                    <span className="font-medium text-orange-600">
                      {selectedSiswa.length} siswa dipilih
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={loadingAssign}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleAssign}
                    disabled={
                      loadingAssign || 
                      !selectedKelas || 
                      selectedSiswa.length === 0
                    }
                  >
                    {loadingAssign ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Simpan ({selectedSiswa.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}