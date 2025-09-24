"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, Calendar, Phone, Mail, XCircle } from "lucide-react"

// Skeleton Card Component
function SkeletonCard() {
  return (
    <Card className="shadow-md animate-pulse">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="h-4 w-32 bg-gray-300 rounded" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/3 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  )
}

export default function ReservasiPage() {
  const [reservasi, setReservasi] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
        const res = await fetch("/api/reservasi/list")
        const result = await res.json()
        setReservasi(result.data)   // ambil array-nya saja
        setFilteredData(result.data)

      setFilteredData(result.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  // Filter data berdasarkan search dan tanggal
  useEffect(() => {
    if (!reservasi.length) return
    setLoading(true)

    let data = reservasi

    if (search) {
      data = data.filter(
        (item) =>
          item.nama.toLowerCase().includes(search.toLowerCase()) ||
          item.orangtua.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (dateFilter) {
      data = data.filter(
        (item) => item.tanggal.slice(0, 10) === dateFilter
      )
    }

    setFilteredData(data)
    setCurrentPage(1)
    setLoading(false)
  }, [search, dateFilter, reservasi])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Reset Filter
  const handleReset = () => {
    setSearch("")
    setDateFilter("")
    setFilteredData(reservasi)
    setCurrentPage(1)
  }
console.log(reservasi);
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Daftar Reservasi</h1>

      {/* Search, Filter & Reset */}
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          type="text"
          placeholder="Cari nama siswa/ortu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full md:w-1/4"
        />
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-1"
        >
          <XCircle className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Loading state with Skeleton */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : (
        <>
          {/* Daftar Card */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((item) => (
              <Card key={item.id} className="shadow-md">
                <CardHeader className="flex flex-row items-center gap-2">
                  <User className="w-6 h-6 text-blue-500" />
                  <CardTitle>{item.nama}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    <a
                      href={`https://wa.me/${item.telepon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.telepon}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{item.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
              <span className="px-2 py-1 text-sm">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
