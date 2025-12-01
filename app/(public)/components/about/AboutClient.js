"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"


export default function AboutCLient() {
  const sections = [
    { id: "sejarah", title: "Sejarah Berdirinya " },
    { id: "visi-misi", title: "Visi & Misi " },
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
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6 ">
      {/* Navigasi Kiri */}
      <ScrollArea className="md:col-span-1 h-[300px] md:h-auto border rounded-xl p-3">
        <h3 className="text-lg font-semibold mb-4">Navigasi</h3>
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
        <section id="sejarah">
          <h2 className="text-2xl font-bold mb-4">Tentang Sekolah Alam SATT</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Sekolah Alam Tanjung Tabalong (SATT) didirikan pada tahun 2019 dengan tujuan untuk memberikan pendidikan yang menyatu dengan alam dan menumbuhkan kreativitas, rasa ingin tahu, serta karakter positif pada anak-anak sejak dini.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Konsep ini mengutamakan pengalaman belajar langsung di alam, memanfaatkan lingkungan sebagai laboratorium kehidupan, dan melibatkan orang tua dalam proses pembelajaran.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            SATT menerapkan empat pilar utama, yaitu Pilar Akhlak, Pilar Logika, Pilar Kepemimpinan dan Pilar Kewirausahaan. Pilar logika merupakan cara kita belajar mengelola alam semesta. Pilar kepemimpinan merupakan cara kita memimpin, sedangkan pilar kewirausahaan merupakan cara kita memberi rahmat bagi alam semesta. (Lendo Novo). 
          </p>
        </section>

        <section id="visi-misi">
          <h2 className="text-2xl font-bold mb-4">Visi & Misi Sekolah Alam</h2>
          <h3 className="text-xl font-semibold mt-2">Visi</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            Terciptanya generasi peradaban yang menjadi rahmat bagi semesta alam
          </p>

          <h3 className="text-xl font-semibold mt-4">Misi Jenjang TK & KB</h3>
          <h3 className="text-lg  mt-4 text-gray-700">TK & KB SATT berkomitmen untuk bermitra dengan orang tua dalam mendidik anak menyongsong usia pre aqil baligh (usia 7 tahun) dengan cara :</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
              <li>Mengenalkan anak pada Allah SWT, Tuhan Pencipta Alam Semesta, lewat ciptaan-Nya dengan alat indera penglihatan, pendengaran, dan peraba.</li>
              <li>Menumbuhkan antusiasme anak dalam beribadah dan berdoa kepada Sang Pencipta.</li>
              <li>Mengenalkan anak pada sosok teladan kebaikan, Rasulullah SAW.</li>
              <li>Mengenalkan kegiatan yang mengasah logika berpikir dan kreativitas anak dengan cara menyenangkan.</li>
              <li>Menumbuhkan antusiasme kebersihan dan keindahan.</li>
              <li>Menumbuhkan antusiasme dalam memilih makanan sehat dan halal.</li>
              <li>Melatih motorik kasar dan halus anak agar siap berkepribadian di lingkungan sekitarnya.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4">Misi Jenjang Sekolah Dasar</h3>
          <h3 className="text-lg  mt-4 text-gray-700">SATT berkomitmen untuk bermitra dengan orang tua dalam mendidik anak menyongsong aqil baligh dengan cara :</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
              <li>Membangun pondasi iman yang kokoh anak</li>
              <li>Membangun adab dan akhlaq mulia anak</li>
              <li>Mengembangkan logika berpikir dan kreativitas anak</li>
              <li>Melatih kepemimpinan, kemandirian, dan kewirausahaan anak</li>
              <li>Menggali bakat dan potensi kekuatan anak</li>
              <li>Membangun komunitas pembelajar pada guru, orang tua, pengelola, dan masyarakat sekitar</li>
          </ul>
        </section>

        <section id="sejarah">
          <h2 className="text-2xl font-bold mb-4">Legalitas Lembaga</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
              <li>Ijin Operasional</li>
              <li>Terakreditasi B</li>
              <li>Sekolah Ramah Anak</li>
              <li>SK Kemenkumham</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
