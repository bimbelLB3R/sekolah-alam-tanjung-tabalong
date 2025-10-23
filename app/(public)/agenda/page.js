"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AgendaPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true) // 🌀 state loading
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/events")
        if (!res.ok) throw new Error("Gagal memuat data")
        const data = await res.json()
        setEvents(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const icons = { Calendar, Clock }

  // Fungsi bantu untuk menentukan status event
  const getEventStatus = (eventDate) => {
    const today = new Date()
    const eventDay = new Date(eventDate)

    // Normalisasi (hapus jam)
    today.setHours(0, 0, 0, 0)
    eventDay.setHours(0, 0, 0, 0)

    const diffTime = eventDay - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return `Akan dimulai dalam ${diffDays} hari`
    } else if (diffDays === 0) {
      return "Sedang berlangsung hari ini"
    } else {
      return "Sudah selesai"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Agenda Sekolah 2025/2026
      </h1>

      {/* 🌀 Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20 text-gray-600 text-lg animate-pulse">
          Memuat agenda...
        </div>
      )}

      {/* 🚫 Error state */}
      {error && !loading && (
        <div className="text-center text-red-500 py-10">
          Terjadi kesalahan: {error}
        </div>
      )}

      {/* 🚫 Empty state */}
      {!loading && !error && events.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          Tidak ada event yang tersedia saat ini.
        </div>
      )}

      {/* ✅ List event */}
      {!loading && events.length > 0 && (
        <div className="relative border-l border-gray-300 dark:border-gray-700 pl-6 space-y-8 text-lg">
          {events.map((event) => {
            const Icon = icons[event.icon] || Calendar
            const statusText = getEventStatus(event.event_date)
            const eventDate = new Date(event.event_date)

            return (
              <div key={event.id} className="relative">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white">
                  <Icon className="w-3 h-3" />
                </span>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span>{event.title}</span>
                      <Badge variant="secondary" className="w-fit">
                        {eventDate.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-700 mb-2">{event.description}</p>
                    <p className="text-sm text-gray-500 italic">{statusText}</p>

                    {event.url && (
                      <div
                        className={`${
                          statusText === "Sudah selesai"
                            ? "hidden"
                            : "mt-4 flex items-center justify-end"
                        }`}
                      >
                        <Link href={event.url}>
                          <Button className="w-full sm:w-auto">
                            Daftar
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
