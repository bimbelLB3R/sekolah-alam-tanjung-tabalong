import { Geist, Geist_Mono,Dancing_Script } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { UserProvider } from "./context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // bisa pilih ketebalan
})

export const metadata = {
  title: "SATT",
  icons: {
    icon: '/logo-sattico.png', // <-- path dari /public
  },
  description: "Sekolah Alam Tanjung Tabalong (SATT) merupakan salah satu sekolah alam bagian dari JSAN (Jaringan Sekolah Alam Nasional). SATT berdiri sejak 2019 di kabupaten Tabalong. Sekolah ini menerapkan empat pilar utama, yaitu Pilar Akhlak, Pilar Logika, Pilar Kepemimpinan, dan Pilar Kewirausahaan.",
  openGraph: {
    title: "SATT - Belajar, Berpetualang, Bermakna",
    description: "Merupakan sekolah alam yang menerapkan empat pilar utama, yaitu Pilar Akhlak, Pilar Logika, Pilar Kepemimpinan, dan Pilar Kewirausahaan.",
    url: "https://sekolah-alam-tanjung-tabalong.vercel.app",
    siteName: "SATT",
    images: [
      {
        url: "https://sekolah-alam-tanjung-tabalong.vercel.app/og-imagenew-satt.jpg", // ganti dengan path gambarmu
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
    images: ["https://sekolah-alam-tanjung-tabalong.vercel.app/og-imagenew-satt.jpg"], // gambar untuk Twitter
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Tambahan manual OG tags biar WA/Telegram/FB lebih yakin */}
        <meta
          property="og:image"
          content="https://sekolah-alam-tanjung-tabalong.vercel.app/og-imagenew-satt.jpg"
        />
        <meta
          name="twitter:image"
          content="https://sekolah-alam-tanjung-tabalong.vercel.app/og-imagenew-satt.jpg"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          
        {children}
       
        </UserProvider>
      </body>
    </html>
  );
}
