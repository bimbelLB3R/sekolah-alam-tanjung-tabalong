"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import AlurPendaftaran from "../components/ppdb/alur-daftar"
import BiayaProgram from "../components/ppdb/biaya-program"

export default function PpdbPage() {
  const sections = [
    { id: "persyaratan", title: "Persyaratan Umum" },
    { id: "waktu", title: "Waktu & Alur Pendaftaran" },
    { id: "tata-cara", title: "Tata Cara Pendaftaran" },
    { id: "biaya-program", title: "Informasi Biaya" },
    { id: "kontak", title: "Kontak Pendaftaran" },
  ]

  const [activeSection, setActiveSection] = useState(sections[0].id)

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      setActiveSection(id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Navigasi Kiri */}
      <ScrollArea className="md:col-span-1 h-[300px] md:h-auto border rounded-xl p-3">
        <h3 className="text-lg font-semibold mb-4">Navigasi PPDB</h3>
        <div className="flex flex-col space-y-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              className="justify-start gap-2 text-lg"
              onClick={() => scrollToSection(section.id)}
            >
              <ChevronRight className="w-4 h-4" />
              {section.title}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Konten Kanan */}
      <div className="md:col-span-3 space-y-12">
        <section id="persyaratan">
          <h2 className="text-2xl font-bold mb-4">Persyaratan Umum</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
            <li>Mengisi formulir pendaftaran.</li>
            <li>Usia Minimal 4 Tahun (KB/TK) dan 6,5 tahun (SD).</li>
            <li>Fotokopi akta kelahiran anak.</li>
            <li>Fotokopi Kartu Keluarga (KK) dan KTP orang tua</li>
            <li>Foto berwarna ukuran 2x3 (3 lembar).</li>
            <li>KIA</li>
            <li>Ijazah sebelumnya (khusus jenjang SD)</li>
          </ul>
        </section>

        <section id="waktu">
          <h2 className="text-2xl font-bold mb-4">Waktu & Alur Pendaftaran</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Berikut alur dan waktu pendaftaran peserta didik baru SATT,
          </p>
          <AlurPendaftaran/>
        </section>

        <section id="tata-cara">
          <h2 className="text-2xl font-bold mb-4">Tata Cara Pendaftaran</h2>
          <ol className="list-decimal ml-6 text-gray-700 space-y-2 text-lg">
            <li>Mengisi formulir pendaftaran online melalui website resmi sekolah.</li>
            <li>Melengkapi persyaratan dokumen yang diminta.</li>
            <li>Melakukan pembayaran biaya pendaftaran (jika ada).</li>
            <li>Mengikuti tes seleksi / wawancara sesuai jenjang.</li>
            <li>Menerima konfirmasi dari pihak sekolah melalui email atau telepon.</li>
          </ol>
        </section>
        <section id="biaya-program">
          <h2 className="text-2xl font-bold mb-4">Informasi Biaya</h2>
          <BiayaProgram/>
        </section>

        <section id="kontak">
          <h2 className="text-2xl font-bold mb-4">Kontak Pendaftaran</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Untuk informasi lebih lanjut, silakan hubungi:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1 text-lg">
            <li>Telepon: +62 857-5211-2725</li>
            <li>Email: sekolahalam.tanjungtabalong@gmail.com</li>
            <li>Alamat: Jalan Tanjung Baru, Maburai RT. 01, Kec. Murung Pudak
Kab. Tabalong, Prov. Kalimantan Selatan 71571.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
