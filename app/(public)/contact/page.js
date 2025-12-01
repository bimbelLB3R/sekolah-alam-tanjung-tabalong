import ContactClient from "../components/ppdb/ContactClient";

export const metadata = {
  title: "Hubungi Kami - Kontak Sekolah Alam Tanjung Tabalong",
    icons: {
    icon: '/logo-sattico.png', 
  shortcut: "/logo-sattico.png",
  apple: "/logo-sattico.png",
  },
  description: "Hubungi SATT untuk informasi lebih lanjut. Alamat: Tanjung, Tabalong, Kalimantan Selatan. Telepon, WhatsApp, email, dan media sosial kami tersedia.",
  keywords: [
    "kontak SATT",
    "alamat sekolah alam tabalong",
    "telepon SATT",
    "WhatsApp sekolah alam tanjung",
    "email SATT",
    "lokasi sekolah alam Tabalong"
  ],
  openGraph: {
    title: "Hubungi Kami - Sekolah Alam Tanjung Tabalong",
    description: "📞 Ada pertanyaan? Hubungi kami melalui telepon, WhatsApp, email, atau kunjungi langsung sekolah kami di Tanjung, Tabalong.",
    url: "https://sekolahalam-tanjungtabalong.id/contact",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Hubungi Sekolah Alam Tanjung Tabalong",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hubungi Kami - SATT",
    description: "📞 Ada pertanyaan? Hubungi kami melalui telepon, WhatsApp, atau email.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-contact.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/contact",
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


export default function ContactPage(){
  return <div>
    <ContactClient/>
  </div>
}