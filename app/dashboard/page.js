"use client"
import { useEffect, useState } from "react"
import DashboardCard from "./components/DashboardCard"

export default function DashboardPage() {
  const [reservasiCount, setReservasiCount] = useState(0)

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/reservasi/count")
        const data = await res.json()
        setReservasiCount(data.total || 0)
      } catch (err) {
        console.error("Fetch error:", err)
      }
    }
    fetchCount()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard title="Jumlah Siswa" value="80" href="/dashboard/siswa" />
      <DashboardCard title="Reservasi Siswa" value={reservasiCount} href="/dashboard/reservasi" />
      <DashboardCard title="Daftar Ulang" value="10" href="/dashboard/daftarulang" />
    </div>
  )
}
