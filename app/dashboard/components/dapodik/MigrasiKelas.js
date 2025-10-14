"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function MigrasiKelas() {
  const [loading, setLoading] = useState(false);
  const [siswaList, setSiswaList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");

  // Ambil data siswa & kelas saat load awal
  
    async function fetchData() {
      setLoading(true);
      const [siswaRes, kelasRes] = await Promise.all([
        fetch("/api/dapodik/migrasi"), // data siswa
        fetch("/api/nama-kelas"), // data kelas
      ]);

      const siswaData = await siswaRes.json();
      const kelasData = await kelasRes.json();

      setSiswaList(siswaData);
      setKelasList(kelasData);
      setLoading(false);
    }
    useEffect(() => {

    fetchData();
  }, []);

  // Toggle pilihan siswa
  const toggleSiswa = (id) => {
    setSelectedSiswa((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Simpan pembagian kelas
  const handleAssign = async () => {
    if (!selectedKelas || selectedSiswa.length === 0) {
      alert("Pilih minimal 1 siswa dan 1 kelas!");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/siswa-kelas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kelas_id: selectedKelas,
        siswa_ids: selectedSiswa,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Siswa berhasil dimasukkan ke kelas.");

      // reset pilihan
      setSelectedSiswa([]);
      setSelectedKelas("");
      // 🆕 Ambil ulang data dari server agar perubahan muncul permanen
    fetchData();
    } else {
      alert(result.error || "Gagal membagi kelas.");
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Pembagian Kelas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              <span>Memuat data...</span>
            </div>
          )}

          {/* Pilih Kelas */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Pilih Kelas
            </label>
            <Select onValueChange={setSelectedKelas} value={selectedKelas}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {kelasList.map((kelas) => (
                  <SelectItem key={kelas.id} value={kelas.id}>
                    {kelas.kelas_lengkap}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pilih Siswa */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Pilih Siswa
            </label>
            <div className="max-h-64 overflow-auto border rounded-md p-2 space-y-1">
              {siswaList.map((siswa) => (
                <div
                  key={siswa.id}
                  className="flex items-center justify-between hover:bg-gray-50 p-1 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSiswa.includes(siswa.id)}
                      onCheckedChange={() => toggleSiswa(siswa.id)}
                    />
                    <span>{siswa.nama_lengkap}</span>
                  </div>
                  {siswa.kelas_lengkap && (
                    <span className="text-xs text-gray-500 italic">
                      {siswa.kelas_lengkap}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedKelas("");
                setSelectedSiswa([]);
              }}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button onClick={handleAssign} disabled={loading}>
              <Check className="mr-2 h-4 w-4" />
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
