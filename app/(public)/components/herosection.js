"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "Selamat Datang di Sekolah Alam Tanjung Tabalong",
    desc: "Sekolah ramah anak dengan lingkungan asri",
    img: "/galeri/foto1.jpeg",
  },
  {
    id: 2,
    title: "Telah terakreditasi oleh BAN PDM",
    desc: "Berdiri tahun 2019 dan telah terakreditasi B",
    img: "/galeri/foto2.jpeg",
  },
  {
    id: 3,
    title: "Gabung Bersama Kami!",
    desc: "Bersama mencetak generasi unggul yang peduli lingkungan dan masyarakat.",
    img: "/galeri/literasi.jpg",
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  // Auto play setiap 6 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={slides[current].img}
            alt="Hero Background"
            fill
            className="object-cover"
             priority={current === 0} // hanya slide pertama yang priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Teks dan tombol */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <motion.div
          key={slides[current].title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {slides[current].title}
          </h1>
          <p className="text-lg mb-6 max-w-2xl mx-auto drop-shadow-md">
            {slides[current].desc}
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/ppdb/reservasi">
              Coba Kelas Yuk...! <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
