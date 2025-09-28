"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, School, Phone, Users } from "lucide-react";

export default function PesertaPage() {
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(peserta)

  useEffect(() => {
    async function fetchPeserta() {
      try {
        const res = await fetch("/api/events/peserta");
        const data = await res.json();
        setPeserta(data);
      } catch (error) {
        console.error("Gagal mengambil data peserta:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPeserta();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading data peserta...</p>;
  }

  if (peserta.length === 0) {
    return <p className="text-center mt-10">Belum ada data peserta event.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {peserta.map((p) => (
        <Card key={p.id} className="shadow-md border rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {p.guru_pj}
            </CardTitle>
            <p className="text-sm text-gray-500">{p.jabatan}</p>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <School className="w-4 h-4 text-green-600" />
              <span>{p.asal_sekolah}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-purple-600" />
              <span>{p.kontak_pj}</span>
            </div>

            <div className="mt-3">
              <h4 className="flex items-center gap-2 font-semibold">
                <Users className="w-4 h-4 text-orange-600" />
                Daftar Siswa
              </h4>
              <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                {p.siswa.length > 0 ? (
                  p.siswa.map((s) => (
                    <li key={s.id} className="text-gray-700">
                      {s.nama_siswa}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">Belum ada siswa</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
