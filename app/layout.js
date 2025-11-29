import { Geist, Geist_Mono,Dancing_Script } from "next/font/google";
import "./globals.css";
import Head from "next/head";
// import { UserProvider } from "./context/UserContext";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload:false
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload:false
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // bisa pilih ketebalan
  preload:false
})

export const metadata = {
  title: "Sekolah Alam Tanjung Tabalong (SATT)",
  icons: {
    icon: '/logo-sattico.png', // <-- path dari /public
  shortcut: "/favicon.ico",
  apple: "/logo-sattico.png",
  },
  description: "Sekolah Alam Tanjung Tabalong (SATT) merupakan salah satu sekolah alam bagian dari JSAN (Jaringan Sekolah Alam Nasional). SATT berdiri sejak 2019 di kabupaten Tabalong. Sekolah ini menerapkan empat pilar utama, yaitu Pilar Akhlak, Pilar Logika, Pilar Kepemimpinan, dan Pilar Kewirausahaan.",
  openGraph: {
    title: "SATT - Belajar, Berpetualang, Bermakna",
    description: "Merupakan sekolah alam yang menerapkan empat pilar utama, yaitu Pilar Akhlak, Pilar Logika, Pilar Kepemimpinan, dan Pilar Kewirausahaan.",
    url: "https://sekolahalam-tanjungtabalong.id",
    siteName: "SATT",
    images: [
      {
        url: "https://sekolahalam-tanjungtabalong.id/og-imagenew-satt.jpg", // ganti dengan path gambarmu
        width: 1200,
        height: 630,
        alt: "SATT - Belajar, Berpetualang, Bermakna",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SATT - Belajar, Berpetualang, Bermakna",
    description: "Merupakan sekolah alam yang menerapkan empat pilar utama, yaitu Pilar Akhlak, Pilar Logika, Pilar Kepemimpinan, dan Pilar Kewirausahaan.",
    images: ["https://sekolahalam-tanjungtabalong.id/og-imagenew-satt.jpg"], // gambar untuk Twitter
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Tambahan manual OG tags biar WA/Telegram/FB lebih yakin */}
        <meta
          property="og:image"
          content="https://sekolahalam-tanjungtabalong.id/og-imagenew-satt.jpg"
        />
        <meta
          name="twitter:image"
          content="https://sekolahalam-tanjungtabalong.id/og-imagenew-satt.jpg"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >     
        {children}
        <Analytics/>
        <Toaster/>
      </body>
    </html>
  );
}
