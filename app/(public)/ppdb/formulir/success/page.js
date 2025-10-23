// // app/pendaftaran/success/page.js
// "use client"

// import { useSearchParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { CheckCircle2, Download, Home, Mail } from "lucide-react"
// import { Suspense } from "react"

// function SuccessContent() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const pendaftaranId = searchParams.get("id")

//   const handleDownloadBukti = () => {
//     // TODO: Implement download bukti pendaftaran
//     alert("Fitur download bukti akan segera tersedia")
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
//       <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
//         {/* Header Success */}
//         <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
//             <CheckCircle2 className="w-12 h-12 text-green-500" />
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Pendaftaran Berhasil!
//           </h1>
//           <p className="text-green-100 text-lg">
//             Data Anda telah berhasil tersimpan
//           </p>
//         </div>

//         {/* Content */}
//         <div className="p-8 space-y-6">
//           {/* ID Pendaftaran */}
//           {pendaftaranId && (
//             <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-1">ID Pendaftaran Anda</p>
//               <p className="text-2xl font-mono font-bold text-blue-600">
//                 {pendaftaranId}
//               </p>
//               <p className="text-xs text-gray-500 mt-2">
//                 Simpan ID ini untuk keperluan verifikasi
//               </p>
//             </div>
//           )}

//           {/* Informasi Selanjutnya */}
//           <div className="space-y-3">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//               <Mail className="w-5 h-5 text-blue-500" />
//               Langkah Selanjutnya
//             </h2>
//             <ul className="space-y-2 text-gray-600">
//               <li className="flex items-start gap-2">
//                 <span className="text-green-500 font-bold">1.</span>
//                 <span>
//                   Anda akan menerima email konfirmasi dalam 1x24 jam
//                 </span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-green-500 font-bold">2.</span>
//                 <span>
//                   Periksa folder spam jika email tidak masuk ke inbox
//                 </span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-green-500 font-bold">3.</span>
//                 <span>
//                   Tunggu jadwal tes/wawancara yang akan diinformasikan via email
//                 </span>
//               </li>
//             </ul>
//           </div>

//           {/* Info Box */}
//           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
//             <p className="text-sm text-yellow-800">
//               <strong>Penting:</strong> Pastikan nomor WhatsApp dan email yang
//               Anda daftarkan aktif untuk menerima notifikasi.
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-4">
//             <Button
//               onClick={handleDownloadBukti}
//               className="flex-1 bg-blue-600 hover:bg-blue-700"
//               size="lg"
//             >
//               <Download className="w-5 h-5 mr-2" />
//               Download Bukti
//             </Button>
//             <Button
//               onClick={() => router.push("/")}
//               variant="outline"
//               className="flex-1"
//               size="lg"
//             >
//               <Home className="w-5 h-5 mr-2" />
//               Kembali ke Beranda
//             </Button>
//           </div>

//           {/* Contact Support */}
//           <div className="text-center pt-4 border-t">
//             <p className="text-sm text-gray-600">
//               Ada pertanyaan? Hubungi kami di{" "}
//               <a
//                 href="https://wa.me/628123456789"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-green-600 hover:underline font-medium"
//               >
//                 WhatsApp
//               </a>{" "}
//               atau{" "}
//               <a
//                 href="mailto:info@sekolah.com"
//                 className="text-blue-600 hover:underline font-medium"
//               >
//                 Email
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function SuccessPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Memuat...</p>
//         </div>
//       </div>
//     }>
//       <SuccessContent />
//     </Suspense>
//   )
// }

// app/pendaftaran/success/page.js
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Home, Mail } from "lucide-react"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pendaftaranId = searchParams.get("id")

  const handleDownloadBukti = async () => {
    if (!pendaftaranId) {
      alert("ID Pendaftaran tidak ditemukan")
      return
    }

    try {
      // Fetch data pendaftaran
      const res = await fetch(`/api/pendaftaran/${pendaftaranId}/pdf`)
      const result = await res.json()

      if (!result.success) {
        alert("Gagal mengambil data: " + result.message)
        return
      }

      // Redirect ke halaman PDF generator
      window.open(`/ppdb/pdf/${pendaftaranId}`, '_blank')
    } catch (error) {
      console.error("Error:", error)
      alert("Gagal mengunduh bukti pendaftaran")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Success */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-green-100 text-lg">
            Data Anda telah berhasil tersimpan
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* ID Pendaftaran */}
          {pendaftaranId && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">ID Pendaftaran Anda</p>
              <p className="text-2xl font-mono font-bold text-blue-600">
                {pendaftaranId}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Simpan ID ini untuk keperluan verifikasi
              </p>
            </div>
          )}

          {/* Informasi Selanjutnya */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Langkah Selanjutnya
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">1.</span>
                <span>
                  Download bukti pendaftaran dan cetak
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">2.</span>
                <span>
                  Serahkan bukti pendaftaran ke pihak sekolah. Jangan lupa bubuhi tanda tangan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">3.</span>
                <span>
                  Tunggu jadwal tes/wawancara yang akan diinformasikan via whatsapp
                </span>
              </li>
            </ul>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Penting:</strong> Pastikan nomor WhatsApp  yang
              Anda daftarkan aktif untuk menerima notifikasi.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleDownloadBukti}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Bukti
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Button>
          </div>

          {/* Contact Support */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Ada pertanyaan? Hubungi kami di{" "}
              <a
                href="https://wa.me/62085752112725"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline font-medium"
              >
                WhatsApp
              </a>{" "}
              atau{" "}
              <a
                href="sa.tanjungtabalong@gmail.com"
                className="text-blue-600 hover:underline font-medium"
              >
                Email
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}