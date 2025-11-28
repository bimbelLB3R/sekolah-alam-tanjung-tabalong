// "use client"

// import { useEffect, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { ArrowRight } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"

// const slides = [
//   {
//     id: 1,
//     title: "Selamat Datang di Sekolah Alam Tanjung Tabalong",
//     desc: "Sekolah ramah anak dengan lingkungan asri",
//     img: "/galeri/foto1.jpeg",
//   },
//   {
//     id: 2,
//     title: "Telah terakreditasi oleh BAN PDM",
//     desc: "Berdiri tahun 2019 dan telah terakreditasi B",
//     img: "/galeri/foto2.jpeg",
//   },
//   {
//     id: 3,
//     title: "Gabung Bersama Kami!",
//     desc: "Bersama mencetak generasi unggul yang peduli lingkungan dan masyarakat.",
//     img: "/galeri/literasi.jpg",
//   },
// ]

// export default function HeroSection() {
//   const [current, setCurrent] = useState(0)

//   // Auto play setiap 6 detik
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % slides.length)
//     }, 6000)
//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <section className="relative h-screen w-full overflow-hidden">
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={slides[current].id}
//           className="absolute inset-0"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 1 }}
//         >
//           <Image
//             src={slides[current].img}
//             alt="Hero Background"
//             fill
//             className="object-cover"
//              priority={current === 0} // hanya slide pertama yang priority
//           />
//           <div className="absolute inset-0 bg-black/50" />
//         </motion.div>
//       </AnimatePresence>

//       {/* Teks dan tombol */}
//       <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
//         <motion.div
//           key={slides[current].title}
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -30 }}
//           transition={{ duration: 1 }}
//         >
//           <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
//             {slides[current].title}
//           </h1>
//           <p className="text-lg mb-6 max-w-2xl mx-auto drop-shadow-md">
//             {slides[current].desc}
//           </p>
//           <Button asChild size="lg" variant="secondary" className="gap-2">
//             <Link href="/ppdb/reservasi">
//               Coba Kelas Yuk...! <ArrowRight className="w-4 h-4" />
//             </Link>
//           </Button>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// Optimasi
"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// ✅ Dynamic import framer-motion (lebih ringan di initial load)
const MotionDiv = dynamic(() => import("framer-motion").then(res => res.motion.div), { ssr: false })
const AnimatePresence = dynamic(() => import("framer-motion").then(res => res.AnimatePresence), { ssr: false })

// ✅ useMemo agar tidak dibuat ulang setiap render
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

  // ✅ Callback supaya tidak recreate function terus
  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length)
  }, [])

  // ✅ Interval lebih aman dan stabil
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide])

  const activeSlide = useMemo(() => slides[current], [current])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeSlide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={activeSlide.img}
            alt={activeSlide.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            loading="eager"
            quality={80} // ✅ tekan ukuran file
          />
          <div className="absolute inset-0 bg-black/50" />
        </MotionDiv>
      </AnimatePresence>

      {/* ✅ Teks & CTA */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <MotionDiv
          key={activeSlide.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {activeSlide.title}
          </h1>

          <p className="text-lg mb-6 max-w-2xl mx-auto drop-shadow-md">
            {activeSlide.desc}
          </p>

          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/ppdb/reservasi" prefetch>
              Coba Kelas Yuk...! <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </MotionDiv>
      </div>
    </section>
  )
}
