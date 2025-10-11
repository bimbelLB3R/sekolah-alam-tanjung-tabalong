"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatName } from "@/lib/formatName"

export default function DataSiswa({ userRoleName }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const perPage = 4

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dapodik")
        const result = await res.json()
        setData(result)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredData = data.filter((row) =>
    row.nama_lengkap.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => setPage(1), [search])

  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const currentData = filteredData.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredData.length / perPage)

  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Daftar Biodata Siswa</h2>

        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Cari nama siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border px-3 py-2">No</th>
                    <th className="border px-3 py-2">Nama Lengkap</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">
                          {startIndex + index + 1}
                        </td>
                        <td className="border px-3 py-2 font-medium text-blue-600 hover:underline">
                          <Link href={`dapodik/${row.id}`}>
                            {formatName(row.nama_lengkap)}
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        {search ? "Data tidak ditemukan" : "Belum ada data"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>

                <span className="text-sm text-gray-600">
                  Halaman {page} dari {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
