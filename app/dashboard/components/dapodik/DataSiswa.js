"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ChevronLeft, ChevronRight, Search, Download, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatName } from "@/lib/formatName"

export default function DataSiswa({ userRoleName, data, loading, onFilterChange }) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState(null)
  const [localData, setLocalData] = useState(data)
  const [jenjangFilter, setJenjangFilter] = useState("all")
  const [kelasFilter, setKelasFilter] = useState("all")
  
  const perPage = 12

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const filteredData = localData.filter((row) =>
    row.nama_lengkap.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => setPage(1), [search])

  const handleJenjangChange = (value) => {
    setJenjangFilter(value)
    setKelasFilter("all") // Reset kelas filter saat jenjang berubah
    onFilterChange({ jenjang: value, kelas: "all" })
  }

  const handleKelasChange = (value) => {
    setKelasFilter(value)
    onFilterChange({ jenjang: jenjangFilter, kelas: value })
  }

  const handleDelete = async (id, nama) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data ${nama}?`)) {
      return
    }

    setDeleting(id)
    try {
      const response = await fetch(`/api/dapodik?id=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        setLocalData(prevData => prevData.filter(item => item.id !== id))
        alert("Data berhasil dihapus")
      } else {
        alert(result.error || "Gagal menghapus data")
      }
    } catch (error) {
      console.error("Error deleting:", error)
      alert("Terjadi kesalahan saat menghapus data")
    } finally {
      setDeleting(null)
    }
  }

  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const currentData = filteredData.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredData.length / perPage)

  // Opsi kelas berdasarkan jenjang yang dipilih
  const getKelasOptions = () => {
    if (jenjangFilter === "TK" || jenjangFilter === "KB") {
      return [{ value: "0", label: "Kelas 0" }]
    } else if (jenjangFilter === "SD") {
      return [
        { value: "1", label: "Kelas 1" },
        { value: "2", label: "Kelas 2" },
        { value: "3", label: "Kelas 3" },
        { value: "4", label: "Kelas 4" },
        { value: "5", label: "Kelas 5" },
        { value: "6", label: "Kelas 6" }
      ]
    } else if (jenjangFilter === "SMP") {
      return [
        { value: "7", label: "Kelas 7" },
        { value: "8", label: "Kelas 8" },
        { value: "9", label: "Kelas 9" }
      ]
    } else if (jenjangFilter === "SMA") {
      return [
        { value: "10", label: "Kelas 10" },
        { value: "11", label: "Kelas 11" },
        { value: "12", label: "Kelas 12" }
      ]
    }
    return []
  }

  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Daftar Biodata Siswa</h2>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={jenjangFilter} onValueChange={handleJenjangChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jenjang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenjang</SelectItem>
                <SelectItem value="KB">KB</SelectItem>
                <SelectItem value="TK">TK</SelectItem>
                <SelectItem value="SD">SD</SelectItem>
                <SelectItem value="SMP">SMP</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select 
              value={kelasFilter} 
              onValueChange={handleKelasChange}
              disabled={jenjangFilter === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {getKelasOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                    <th className="border px-3 py-2">Jenjang</th>
                    <th className="border px-3 py-2">Kelas</th>
                    <th className="border px-3 py-2 text-center">Aksi</th>
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
                        <td className="border px-3 py-2">
                          {row.jenjang_kelas || row.jenjang || "-"}
                        </td>
                        <td className="border px-3 py-2">
                          {row.kelas_lengkap || "-"}
                        </td>
                        <td className="border px-3 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/ppdb/pdf/${row.id}`} target="_blank">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(row.id, row.nama_lengkap)}
                              disabled={deleting === row.id}
                            >
                              {deleting === row.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
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