"use client"

import { Card } from "@/components/ui/card"
import { CircleDot } from "lucide-react"

const biayaData = [
  {
    jenjang: "TK & KB",
    items: [
      "Uang Pangkal Rp3.500.000 (Diskon 500.000 minimal DP 2jt sebelum Desember 2025)",
      "Uang Tahunan Rp2.000.000",
      "Sarpras Rp500.000",
      "Seragam Akhwat Rp480.000",
      "Seragam Ikhwan Rp400.000",
      "SPP Bulanan Rp 600.000",
      "Komite 1 Tahun Rp 180.000",
    ],
  },
  {
    jenjang: "Sekolah Dasar",
    items: [
      "Uang Pangkal Rp8.500.000 (Diskon 1jt minimal DP 5jt sebelum Desember 2025)",
      "Uang Tahunan Rp2.000.000",
      "Sarpras Rp850.000",
      "Seragam Akhwat Rp480.000",
      "Seragam Ikhwan Rp400.000",
      "SPP Bulanan Rp850.000",
      "Komite 1 Tahun Rp180.000",
    ],
  },
  {
    jenjang: "Info Tambahan",
    items: [
      "Biaya Pendaftaran Rp200.000 (Pembayaran melalui Rek BSI 7236336349 a.n Sekolah Alam Tanjung Tabalong)",
      "Pembayaran biaya masuk sekolah (Uang Pangkal, Uang Tahunan, Sarpras, Seragam, SPP, dan Komite) melalui rekening BSI 7127377337 a.n. Yayasan Mutiara Insan Saraba Kawa",
      "ABK wajib melampirkan surat keterangan psikolog atau yang berkepentingan",
      "Khusus ABK yang direkomendasikan menggunakan Guru Pendamping, membayar tambahan Rp1.500.000 /bulan di luar SPP atau menyediakan Guru Pendamping sendiri dengan ketentuan berlaku",
      "Kuota ABK terbatas di setiap kelasnya",
    ],
  },
]

export default function BiayaProgram() {
  return (
    <section className="w-full py-10">
      <div className="max-w-4xl mx-auto px-4">
        

        <div className="flex flex-col gap-6">
          {biayaData.map((biaya, idx) => (
            <Card
              key={idx}
              className="flex flex-col md:flex-row border shadow-sm"
            >
              {/* Kiri - Jenjang */}
              <div className="md:w-1/3 w-full border-b md:border-b-0 md:border-r p-4 flex items-center justify-center bg-green-50 ">
                <h3 className="text-lg font-semibold text-center">
                  {biaya.jenjang}
                </h3>
              </div>

              {/* Kanan - Detail */}
              <div className="md:w-2/3 w-full p-4 ">
                <ul className="space-y-2">
                  {biaya.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CircleDot className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
