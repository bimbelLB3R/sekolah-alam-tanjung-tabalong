import AgendaClient from "../components/ppdb/AgendaClient";

export const metadata = {
  title: "Agenda & Kegiatan Sekolah - SATT",
  description: "Jadwal kegiatan, acara, dan agenda terbaru Sekolah Alam Tanjung Tabalong. Pantau kegiatan belajar mengajar, event sekolah, dan program khusus.",
  keywords: [
    "agenda SATT TERDEKAT",
    "kegiatan sekolah alam tabalong",
    "jadwal acara SATT",
    "event sekolah alam tanjung",
    "kalender akademik Tabalong"
  ],
  openGraph: {
    title: "Agenda & Kegiatan - Sekolah Alam Tanjung Tabalong",
    description: "📅 Lihat jadwal kegiatan, acara sekolah, dan program-program menarik di SATT. Jangan sampai ketinggalan!",
    url: "https://sekolahalam-tanjungtabalong.id/agenda",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-agenda.jpg",
        width: 1200,
        height: 630,
        alt: "Agenda dan Kegiatan Sekolah Alam Tanjung Tabalong",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenda & Kegiatan - SATT",
    description: "📅 Lihat jadwal kegiatan, acara sekolah, dan program-program menarik di SATT.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-agenda.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/agenda",
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

export default function AgendaPage(){
  return <div>
    <AgendaClient/>
  </div>
}