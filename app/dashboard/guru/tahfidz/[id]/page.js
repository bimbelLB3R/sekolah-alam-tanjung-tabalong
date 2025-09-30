"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PesertaDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);       // untuk info siswa
  const [perkembangan, setPerkembangan] = useState([]); // untuk tabel perkembangan
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/tahfidz/${id}`);
        const json = await res.json();
        console.log (json)
        setData(json.siswa);
        setPerkembangan(json.perkembangan || []);
      } catch (err) {
        console.error("Fetch detail error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Memuat detail...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-center text-gray-500 py-10">
        Peserta tidak ditemukan.
      </p>
    );
  }

  return (
    <div className="p-4">
      <Card className="max-w-3xl mx-auto rounded-2xl shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Detail Peserta</h2>

          <p>
            <span className="font-medium">Nama Anak:</span> {data.nama_siswa}
          </p>
          <p>
            <span className="font-medium">Rombel:</span> {data.nama_rombel}
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">
            Perkembangan Hafalan
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Tanggal</th>
                  <th className="p-2 border">Surah</th>
                  <th className="p-2 border">Ayat</th>
                  <th className="p-2 border">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {perkembangan.length > 0 ? (
                  perkembangan.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 even:bg-gray-50/50"
                    >
                      <td className="p-2 border">{row.tanggal}</td>
                      <td className="p-2 border">{row.surah}</td>
                      <td className="p-2 border">{row.ayat}</td>
                      <td className="p-2 border">{row.catatan}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-4 text-gray-500"
                    >
                      Belum ada data perkembangan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
