import Link from "next/link"
import { Citrus } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="max-w-md">
        {/* Icon Citrus */}
        <Citrus className="mx-auto text-yellow-400 w-32 h-32" />

        <h1 className="mt-6 text-4xl font-bold text-gray-800">Akses Ditolak</h1>
        <p className="mt-4 text-gray-600">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
