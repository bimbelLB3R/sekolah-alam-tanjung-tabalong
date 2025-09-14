"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function AboutPage() {
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
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <h2 className="text-2xl font-bold mb-4">Sejarah Berdirinya Sekolah Alam</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Sekolah Alam Nusantara didirikan pada tahun ... dengan tujuan untuk memberikan
            pendidikan yang menyatu dengan alam dan menumbuhkan kreativitas, rasa ingin tahu,
            serta karakter positif pada anak-anak sejak dini.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Konsep ini mengutamakan pengalaman belajar langsung di alam, memanfaatkan lingkungan
            sebagai laboratorium kehidupan, dan melibatkan orang tua dalam proses pembelajaran.
          </p>
        </section>

        <section id="visi-misi">
          <h2 className="text-2xl font-bold mb-4">Visi & Misi Sekolah Alam</h2>
          <h3 className="text-xl font-semibold mt-2">Visi</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            Menjadi sekolah yang mencetak generasi mandiri, kreatif, peduli lingkungan, dan
            siap menghadapi tantangan masa depan.
          </p>

          <h3 className="text-xl font-semibold mt-4">Misi</h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-2 text-lg">
            <li>Menyediakan pembelajaran berbasis alam dan pengalaman langsung.</li>
            <li>Menumbuhkan karakter positif melalui kegiatan sosial dan lingkungan.</li>
            <li>Mengintegrasikan kreativitas, sains, dan seni dalam kurikulum.</li>
            <li>Melibatkan orang tua dan masyarakat dalam pendidikan anak.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
