"use client"

import { Calendar, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AgendaPage() {
  const events = [
    { month: "Juli 2025", title: "Awal Tahun Ajaran Baru", desc: "Pembukaan tahun ajaran baru dan orientasi siswa.", icon: Calendar },
    { month: "Agustus 2025", title: "MPLS (Masa Pengenalan Lingkungan Sekolah)", desc: "Kegiatan pengenalan lingkungan sekolah untuk siswa baru.", icon: Clock },
    { month: "September 2025", title: "Kegiatan Belajar Mengajar", desc: "Mulainya kegiatan belajar reguler sesuai kurikulum.", icon: Calendar },
    { month: "Oktober 2025", title: "Pekan Kreativitas Siswa", desc: "Ajang unjuk bakat seni, olahraga, dan sains.", icon: Calendar },
    { month: "November 2025", title: "Penilaian Tengah Semester (PTS)", desc: "Ujian tengah semester untuk semua jenjang.", icon: Clock },
    { month: "Desember 2025", title: "Penilaian Akhir Semester (PAS)", desc: "Ujian akhir semester ganjil.", icon: Clock },
    { month: "Januari 2026", title: "Liburan Semester & Rapat Evaluasi", desc: "Libur semester ganjil serta rapat guru untuk evaluasi.", icon: Calendar },
    { month: "Februari 2026", title: "Kegiatan Sosial & Bakti Lingkungan", desc: "Pengabdian siswa di masyarakat sekitar.", icon: Calendar },
    { month: "Maret 2026", title: "Penilaian Tengah Semester Genap", desc: "Ujian tengah semester genap.", icon: Clock },
    { month: "April 2026", title: "Ujian Sekolah (US)", desc: "Ujian sekolah untuk siswa akhir jenjang.", icon: Clock },
    { month: "Mei 2026", title: "Pekan Olahraga & Seni", desc: "Lomba olahraga dan seni antar kelas.", icon: Calendar },
    { month: "Juni 2026", title: "Penilaian Akhir Tahun (PAT)", desc: "Penutup kegiatan akademik tahun ajaran.", icon: Clock },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Agenda Sekolah 2025/2026</h1>

      <div className="relative border-l border-gray-300 dark:border-gray-700 pl-6 space-y-8 text-lg">
        {events.map((event, idx) => {
          const Icon = event.icon
          return (
            <div key={idx} className="relative">
              {/* Icon bulat di garis */}
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white">
                <Icon className="w-3 h-3" />
              </span>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {event.title}
                    <Badge variant="secondary">{event.month}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{event.desc}</p>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
