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
import {
  School,
  Users,
  Wallet,
  GraduationCap,
  Package,
  TentTree,
} from "lucide-react"
import HeroSection from "./components/herosection"

export default function Home() {
   const photos = [
    "/galeri/foto1.jpeg",
    "/galeri/foto2.jpeg",
    "/galeri/foto3.jpeg",
  ]
  const articles = [
  {
    id: 1,
    title: "Peran Orang Tua Dalam Tumbuh Kembang Anak",
    excerpt: "Orang tua memiliki peran utama dalam proses tumbuh kembang anak...",
    date: "12 Sept 2025",
    link: "/blog/peran-ortu"
  },
  {
    id: 2,
    title: "Apa itu BBA (Belajar Bersama Alam)?",
    excerpt: "Dengan memahami konsep Belajar Bersama Alam, guru menjadikan alam sebagai...",
    date: "10 Sept 2025",
    link: "/blog/apa-bba"
  },
  {
    id: 3,
    title: "Suka Duka Menjadi Fasilitator Sekolah Alam",
    excerpt: "Di sekolah alam, fasilitator memegang peran yang sangat vital...",
    date: "8 Sept 2025",
    link: "/blog/suka-duka"
  },
]

const fiturList = [
    { title: "Profil Sekolah", desc: "Informasi sekolah dan yayasan.", icon: School,href:"/about" },
    { title: "Data Siswa", desc: "Pantau perkembangan akademik siswa.", icon: Users,href:"/data-siswa"  },
    { title: "Keuangan", desc: "Kelola pembayaran dan laporan bendahara.", icon: Wallet,href:"/login"  },
    { title: "Guru & Staff", desc: "Profil guru, wali kelas, dan karyawan.", icon: GraduationCap,href:"/profile-guru"  },
    { title: "Inventaris", desc: "Aset sarana prasarana sekolah.", icon: Package,href:"/login"  },
    { title: "Aktivitas Anak", desc: "Berbagai aktivitas 3B khas SATT", icon: TentTree,href:"/activities"  },
  ]
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <HeroSection/>

      {/* Galeri + Deskripsi */}
<section className="p-3">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-5xl mx-auto">
    {/* Deskripsi */}
    <div className="space-y-4">
      <h3 className="text-4xl font-bold">Mengapa Sekolah Alam?</h3>
      <p className="text-gray-600 leading-relaxed text-lg">
        Sekolah Alam Tanjung Tabalong (SATT) menghadirkan konsep pembelajaran yang dekat 
        dengan alam, menumbuhkan rasa ingin tahu, kreativitas, serta karakter 
        positif pada anak. Siswa tidak hanya belajar di kelas, tetapi juga 
        mengeksplorasi lingkungan sekitar sebagai laboratorium kehidupan.
      </p>
      <p className="text-gray-600 leading-relaxed text-lg">
        Dengan pendekatan ini, anak-anak tumbuh menjadi pribadi mandiri, 
        peduli lingkungan, dan siap menghadapi tantangan masa depan.
      </p>
    </div>

    {/* Carousel */}
    <div className="relative">
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
  </div>
</section>


      {/* Fitur Utama */}
      <section className="p-3">
        <h2 className="text-4xl font-semibold text-center mb-8">Fitur Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {fiturList.map((fitur, i) => {
          const Icon = fitur.icon
          return (
            <Link key={i} href={fitur.href} className="block">
            <Card  className="hover:shadow-lg transition">
              <CardHeader>
                <div className="flex items-start gap-3">
                  {/* Icon di kiri */}
                  <Icon className="w-10 h-10 text-primary shrink-0" />

                  {/* Teks di kanan */}
                  <div>
                    <CardTitle className="text-lg">{fitur.title}</CardTitle>
                    <CardContent className="p-0 mt-1">
                      <p className="text-muted-foreground text-lg">{fitur.desc}</p>
                    </CardContent>
                  </div>
                </div>
              </CardHeader>
            </Card>
            </Link>
          )
        })}
      </div>
      </section>

      {/* Testimoni */}
      <section className="p-3">
        <h2 className="text-4xl font-semibold text-center mb-8">Apa Kata Mereka?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-lg">
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
        <h2 className="text-4xl font-semibold text-center mb-8">Artikel Terbaru</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {articles.map((article) => (
            <Card key={article.id} className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{article.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{article.excerpt}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={article.link}>Baca Selengkapnya</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className=" mx-auto p-3 bg-green-100">
        <h2 className="text-4xl font-semibold text-center mb-8">Pertanyaan Umum</h2>
        <Accordion type="single" collapsible className="max-w-5xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg">Bagaimana cara mendaftar sekolah?</AccordionTrigger>
            <AccordionContent className="text-lg">
              Pendaftaran bisa dilakukan online melalui halaman pendaftaran di website ini
              atau langsung datang ke sekolah.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg">Apakah ada biaya pendaftaran?</AccordionTrigger>
            <AccordionContent className="text-lg">
              Ya, biaya pendaftaran disesuaikan dengan jenjang pendidikan yang dipilih.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg">Bagaimana jika saya lupa password login?</AccordionTrigger>
            <AccordionContent className="text-lg">
              Anda bisa melakukan reset password melalui menu lupa password di halaman login.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

     
    </div>
  )
}
