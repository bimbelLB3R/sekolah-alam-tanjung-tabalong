"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import AlurPendaftaran from "../components/ppdb/alur-daftar"
import BiayaProgram from "../components/ppdb/biaya-program"
import KontakPendaftaran from "../components/ppdb/kontak-daftar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "SPMB - Penerimaan Peserta Didik Baru SATT",
  description: "Daftar sekarang! Pendaftaran siswa baru Sekolah Alam Tanjung Tabalong . Info syarat, jadwal, biaya, dan cara pendaftaran lengkap.",
  keywords: [
    "PPDB SATT",
    "pendaftaran sekolah alam tabalong",
    "daftar sekolah alam tanjung",
    "biaya sekolah alam tabalong",
    "syarat masuk SATT",
    "sekolah alam Kalimantan Selatan"
  ],
  openGraph: {
    title: "SPMB - Daftar Sekarang di SATT!",
    description: "🎓 Pendaftaran dibuka! Sekolah Alam Tanjung Tabalong menerima siswa baru . Pendidikan berbasis alam dengan 4 pilar karakter.",
    url: "https://sekolahalam-tanjungtabalong.id/ppdb",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-ppdb.jpg",
        width: 1200,
        height: 630,
        alt: "PPDB SATT 2025/2026 - Pendaftaran Siswa Baru",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPMB - Daftar Sekarang di SATT!",
    description: "🎓 Pendaftaran siswa baru dibuka! Info lengkap syarat, jadwal, dan biaya.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-ppdb.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/ppdb",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

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
            <li> <Link
          href="/ppdb/formulir"
          className="flex items-center   text-green-600 hover:underline"
        >
          <span>Mengisi formulir pendaftaran</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
            </li>
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
        <KontakPendaftaran/>        
      </div>
    </div>
  )
}
