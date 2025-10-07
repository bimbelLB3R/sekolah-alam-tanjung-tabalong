"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { User, School, Phone, Users, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function PesertaPage({ peserta = [],onDelete }) {
  

  if (!peserta || peserta.length === 0) {
    return <p className="text-center mt-10">Belum ada data peserta event.</p>;
  }

  return (
    <div className="grid md:grid-cols-2  gap-6 p-6">
      {peserta.map((p) => (
        <Card key={p.id} className="shadow-md border rounded-2xl relative">
          {/* Tombol hapus kanan atas */}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-50"
             onClick={() => onDelete(p.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <CardHeader>
            <CardTitle className=" items-center gap-2">
              <p>Pendamping :</p>
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
  )
}
