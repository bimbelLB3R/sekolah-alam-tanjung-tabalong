import AboutClient from "../components/about/AboutClient";

export const metadata = {
  title: "Tentang Kami - Profil Sekolah Alam Tanjung Tabalong",
    icons: {
    icon: '/logo-sattico.png', 
  shortcut: "/logo-sattico.png",
  apple: "/logo-sattico.png",
  },
  description: "Sekolah Alam Tanjung Tabalong (SATT) berdiri sejak 2019 sebagai bagian dari JSAN. Menerapkan 4 pilar utama: Akhlak, Logika, Kepemimpinan, dan Kewirausahaan untuk pendidikan karakter anak.",
  keywords: [
    "tentang SATT",
    "profil sekolah alam tabalong",
    "visi misi SATT",
    "sejarah sekolah alam tanjung",
    "JSAN Kalimantan Selatan",
    "pendidikan karakter Tabalong",
    "fitrah based education",
    "talents mapping",
    "Jaringan Sekolah Alam Nasional (JSAN)"
  ],
  openGraph: {
    title: "Tentang Kami - Sekolah Alam Tanjung Tabalong",
    description: "Sekolah alam berbasis 4 pilar: Akhlak, Logika, Kepemimpinan, dan Kewirausahaan. Bagian dari Jaringan Sekolah Alam Nasional sejak 2019.",
    url: "https://sekolahalam-tanjungtabalong.id/about",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-ppdb.jpg",
        width: 1200,
        height: 630,
        alt: "Profil Sekolah Alam Tanjung Tabalong - Belajar, Berpetualang, Bermakna",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Kami - Sekolah Alam Tanjung Tabalong",
    description: "Sekolah alam berbasis 4 pilar: Akhlak, Logika, Kepemimpinan, dan Kewirausahaan.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-ppdb.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/about",
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
export default function AboutPage(){
  return <div>
    <AboutClient/>
  </div>
}