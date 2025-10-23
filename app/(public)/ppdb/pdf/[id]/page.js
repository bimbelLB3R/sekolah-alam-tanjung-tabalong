// app/pendaftaran/pdf/[id]/page.js
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import FormulirPDF from "@/app/(public)/components/ppdb/FormulirPDF"

export default function PDFGeneratorPage() {
  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pendaftaran/${params.id}/pdf`)
        const result = await res.json()

        if (!result.success) {
          throw new Error(result.message)
        }

        setData(result.data)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Tutup
          </button>
        </div>
      </div>
    )
  }

  const fileName = `Formulir_PPDB_${data.nama_lengkap?.replace(/\s/g, '_')}_${params.id}.pdf`

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Download Button */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Formulir PPDB - {data.nama_lengkap}
            </h1>
            <p className="text-sm text-gray-600">ID: {params.id}</p>
          </div>
          
          <div className="flex gap-3">
            {/* Download Button */}
            <PDFDownloadLink
              document={<FormulirPDF data={data} />}
              fileName={fileName}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {({ blob, url, loading, error }) =>
                loading ? "Menyiapkan PDF..." : "⬇ Download PDF"
              }
            </PDFDownloadLink>

            {/* Close Button */}
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              ✕ Tutup
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto bg-white shadow-lg">
          <PDFViewer width="100%" height="800px" showToolbar={true}>
            <FormulirPDF data={data} />
          </PDFViewer>
        </div>
      </div>
    </div>
  )
}