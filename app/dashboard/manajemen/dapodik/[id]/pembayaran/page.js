"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate } from "@/lib/formatDate"

export default function PembayaranSiswaPage() {
  const { id } = useParams()
  const router = useRouter()
  const [siswa, setSiswa] = useState(null)
  const [pembayaran, setPembayaran] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTahun, setFilterTahun] = useState("all")
  const [filterJenis, setFilterJenis] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch data siswa
      const resSiswa = await fetch("/api/dapodik")
      const dataSiswa = await resSiswa.json()
      const selectedSiswa = dataSiswa.find((item) => String(item.id) === String(id))
      setSiswa(selectedSiswa)

      // Fetch data pembayaran siswa
      const resPembayaran = await fetch("/api/pembayaran-siswa/" + id)
      const result = await resPembayaran.json()
      
      if (result.success) {
        setPembayaran(result.data || [])
      } else {
        setPembayaran([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setPembayaran([])
    } finally {
      setLoading(false)
    }
  }

  // Filter dan search
  const filteredPembayaran = pembayaran.filter((item) => {
    const matchSearch = item.jenis_pembayaran
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchTahun = filterTahun === "all" || item.tahun_ajaran === filterTahun
    const matchJenis = filterJenis === "all" || item.jenis_pembayaran === filterJenis

    return matchSearch && matchTahun && matchJenis
  })

  // Get unique tahun ajaran dan jenis pembayaran untuk filter
  const tahunAjaranList = [...new Set(pembayaran.map((p) => p.tahun_ajaran))]
  const jenisPembayaranList = [...new Set(pembayaran.map((p) => p.jenis_pembayaran))]

  // Pagination
  const totalPages = Math.ceil(filteredPembayaran.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredPembayaran.slice(startIndex, endIndex)

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterTahun, filterJenis])

  if (loading) return <p className="text-center py-10">Memuat data...</p>

  if (!siswa)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Data siswa tidak ditemukan</p>
        <Button className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Riwayat Pembayaran</h1>
            <p className="text-gray-600">{siswa.nama_lengkap}</p>
          </div>
        </div>
      </div>

      {/* Filter dan Search */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari jenis pembayaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterTahun} onValueChange={setFilterTahun}>
            <SelectTrigger>
              <SelectValue placeholder="Tahun Ajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {tahunAjaranList.map((tahun) => (
                <SelectItem key={tahun} value={tahun}>
                  {tahun}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterJenis} onValueChange={setFilterJenis}>
            <SelectTrigger>
              <SelectValue placeholder="Jenis Pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              {jenisPembayaranList.map((jenis) => (
                <SelectItem key={jenis} value={jenis}>
                  {jenis}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setFilterTahun("all")
              setFilterJenis("all")
            }}
          >
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Table Pembayaran */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tahun Ajaran</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Jenis Pembayaran</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Cara Bayar</TableHead>
                <TableHead>Penerima</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {loading ? "Memuat data..." : "Belum ada data pembayaran"}
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(item.tgl_bayar)}
                    </TableCell>
                    <TableCell>{item.tahun_ajaran}</TableCell>
                    <TableCell>{item.kelas_lengkap || "-"}</TableCell>
                    <TableCell>{item.jenis_pembayaran}</TableCell>
                    <TableCell className="font-semibold whitespace-nowrap">
                      Rp {parseFloat(item.jml_bayar).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.cara_bayar === "cash" ? "default" : "secondary"}>
                        {item.cara_bayar}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.penerima}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.keterangan || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredPembayaran.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredPembayaran.length)} dari {filteredPembayaran.length} data
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Tampilkan halaman: 1, current-1, current, current+1, last
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-9"
                      >
                        {page}
                      </Button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-1">...</span>
                  }
                  return null
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}