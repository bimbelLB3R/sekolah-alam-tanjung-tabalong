import PendaftaranClient from "../../components/ppdb/PendaftaranClient";

export const metadata = {
  title: "Formulir Pendaftaran SPMB - Daftar Online SATT",
  description: "Isi formulir pendaftaran online untuk menjadi siswa baru Sekolah Alam Tanjung Tabalong. Proses cepat, mudah, dan aman.",
  keywords: [
    "formulir pendaftaran SATT",
    "daftar online sekolah alam",
    "form SPMB Tabalong",
    "pendaftaran siswa baru online"
  ],
  openGraph: {
    title: "Formulir Pendaftaran SPMB - SATT",
    description: "Lengkapi formulir pendaftaran online untuk menjadi bagian dari keluarga besar SATT. Proses mudah dan cepat!",
    url: "https://sekolahalam-tanjungtabalong.id/ppdb/formulir",
    siteName: "Sekolah Alam Tanjung Tabalong (SATT)",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-formulir.jpg",
        width: 1200,
        height: 630,
        alt: "Formulir Pendaftaran SPMB SATT",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formulir Pendaftaran SPMB - SATT",
    description: "Lengkapi formulir pendaftaran online untuk menjadi bagian dari keluarga besar SATT.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-formulir.jpg"],
  },
  alternates: {
    canonical: "https://sekolahalam-tanjungtabalong.id/ppdb/formulir",
  },
  robots: {
    index: false, // tidak perlu diindex karena halaman form
    follow: true,
  },
};

export default function PendaftaranPage(){
  return <div>
    <PendaftaranClient/>
  </div>
}