"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
   const photos = [
    "/galeri/foto1.jpeg",
    "/galeri/foto2.jpeg",
    "/galeri/foto3.jpeg",
  ]
  const articles = [
  {
    id: 1,
    title: "Tips Belajar Efektif untuk UTBK",
    excerpt: "Pelajari strategi belajar yang bisa meningkatkan peluang lolos UTBK...",
    date: "12 Sept 2025",
    link: "/blog/tips-belajar-utbk"
  },
  {
    id: 2,
    title: "Kenapa Memilih Jurusan Itu Penting?",
    excerpt: "Jurusan kuliah menentukan masa depan kariermu. Simak panduan memilih jurusan...",
    date: "10 Sept 2025",
    link: "/blog/memilih-jurusan"
  },
  {
    id: 3,
    title: "Rahasia Sukses SNBT",
    excerpt: "Bagaimana mengatur waktu belajar, manajemen stres, dan strategi ujian SNBT...",
    date: "8 Sept 2025",
    link: "/blog/rahasia-sukses-snbt"
  },
]
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white  shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di Sekolah Alam Tanjung Tabalong</h1>
        <p className="text-lg mb-6">
          Digitalisasi sekolah untuk manajemen guru, siswa, keuangan, dan sarpras
        </p>
        <Button size="lg" variant="secondary">Pesan Tempat</Button>
      </section>

      {/* Galeri Carousel */}
      <section className="p-3">
        <h2 className="text-2xl font-semibold text-center mb-8">Galeri Sekolah</h2>
        <div className="max-w-2xl mx-auto">
          <Carousel className="w-full">
        <CarouselContent>
          {photos.map((src, i) => (
            <CarouselItem key={i}>
              <Image
                src={src}
                alt={`Galeri ${i + 1}`}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Panah kiri */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow-md" />

        {/* Panah kanan */}
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow-md" />
      </Carousel>
        </div>
      </section>

      {/* Fitur Utama */}
      <section className="p-3">
        <h2 className="text-2xl font-semibold text-center mb-8">Fitur Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Profil Sekolah", desc: "Informasi sekolah dan yayasan." },
            { title: "Data Siswa", desc: "Pantau perkembangan akademik siswa." },
            { title: "Keuangan", desc: "Kelola pembayaran dan laporan bendahara." },
            { title: "Guru & Staff", desc: "Data guru, wali kelas, dan karyawan." },
            { title: "Inventaris", desc: "Aset sarana prasarana sekolah." },
            { title: "Prestasi", desc: "Dokumentasi prestasi sekolah & siswa." },
          ].map((fitur, i) => (
            <Card key={i} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>{fitur.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{fitur.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimoni */}
      <section className="p-3">
        <h2 className="text-2xl font-semibold text-center mb-8">Apa Kata Mereka?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <p>
                  “Web ini membantu sekolah kami lebih terorganisir. Sangat mudah digunakan.”
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/100?img=${i}`} />
                    <AvatarFallback>GU</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Guru {i}</p>
                    <p className="text-sm text-muted-foreground">Sekolah Mitra</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

       {/* Blog Section */}
      <section className="space-y-6 p-3">
        <h2 className="text-2xl font-semibold text-center mb-8">Artikel Terbaru</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{article.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{article.excerpt}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={article.link}>Baca Selengkapnya</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-2xl mx-auto p-3">
        <h2 className="text-2xl font-semibold text-center mb-8">Pertanyaan Umum</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Bagaimana cara mendaftar sekolah?</AccordionTrigger>
            <AccordionContent>
              Pendaftaran bisa dilakukan online melalui halaman pendaftaran di website ini
              atau langsung datang ke sekolah.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Apakah ada biaya pendaftaran?</AccordionTrigger>
            <AccordionContent>
              Ya, biaya pendaftaran disesuaikan dengan jenjang pendidikan yang dipilih.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Bagaimana jika saya lupa password login?</AccordionTrigger>
            <AccordionContent>
              Anda bisa melakukan reset password melalui menu lupa password di halaman login.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sekolah Alam Nusantara. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
