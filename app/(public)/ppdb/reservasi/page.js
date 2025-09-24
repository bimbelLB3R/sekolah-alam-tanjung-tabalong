"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { User, Phone, Mail, Calendar, Loader2 } from "lucide-react"

export default function ReservasiPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: "",
    orangtua: "",
    telepon: "",
    email: "",
    tanggal: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/reservasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        alert("Reservasi berhasil dikirim! 🎉")
        setFormData({ nama: "", orangtua: "", telepon: "", email: "", tanggal: "" })
        router.push("/") // alihkan ke halaman utama
      } else {
        alert("Gagal mengirim reservasi!")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan server!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Reservasi Pendaftaran Siswa Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Siswa */}
            <div className="space-y-2">
              <Label htmlFor="nama" className="flex items-center gap-2 ">
                <User className="w-4 h-4 text-lg" /> Nama Calon Siswa
              </Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            {/* Nama Orang Tua */}
            <div className="space-y-2">
              <Label htmlFor="orangtua" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Nama Orang Tua / Wali
              </Label>
              <Input
                id="orangtua"
                name="orangtua"
                placeholder="Masukkan nama orang tua/wali"
                value={formData.orangtua}
                onChange={handleChange}
                required
              />
            </div>

            {/* Telepon */}
            <div className="space-y-2">
              <Label htmlFor="telepon" className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Nomor Telepon
              </Label>
              <Input
                id="telepon"
                name="telepon"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={formData.telepon}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tanggal Reservasi */}
            <div className="space-y-2">
              <Label htmlFor="tanggal" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Tanggal Reservasi
              </Label>
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tombol Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengirim...
                </span>
              ) : (
                "Kirim Reservasi"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
