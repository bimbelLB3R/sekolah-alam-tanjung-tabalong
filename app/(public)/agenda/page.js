"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AgendaPage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  const icons = { Calendar, Clock }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Agenda Sekolah 2025/2026</h1>

      <div className="relative border-l border-gray-300 dark:border-gray-700 pl-6 space-y-8 text-lg">
        {events.map((event) => {
          const Icon = icons[event.icon] || Calendar
          return (
            <div key={event.id} className="relative">
              
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white">
                <Icon className="w-3 h-3" />
              </span>
              <Card className="shadow-md">
                <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span>{event.title}</span>
                  <Badge variant="secondary" className="w-fit">
                    {new Date(event.event_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Badge>
                </CardTitle>
              </CardHeader>

                <CardContent>
                  <p className="text-gray-700">{event.description}</p>
                  {/* Tombol Daftar hanya muncul kalau url_peserta ada */}
                    {event.url && (
                      <div className="mt-4 flex items-center justify-end">
                        <Link href={event.url}>
                          <Button className="w-full">Daftar</Button>
                        </Link>
                      </div>
                    )}
                </CardContent>
              </Card>
              
            </div>
          )
        })}
      </div>
    </div>
  )
}
