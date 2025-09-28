"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

export default function AddEventsPage() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ title: "", description: "", event_date: "", icon: "Calendar",url:"",url_peserta:"" })
  const [editForm, setEditForm] = useState(null) // untuk data yang sedang di-edit

  const loadEvents = async () => {
    const res = await fetch("/api/events")
    const data = await res.json()
    setEvents(data)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ title: "", description: "", event_date: "", icon: "Calendar",url:"",url_peserta:"" })
    loadEvents()
  }

  const handleDelete = async (id) => {
    await fetch(`/api/events/${id}`, { method: "DELETE" })
    loadEvents()
  }

  const handleUpdate = async () => {
    await fetch(`/api/events/${editForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
    setEditForm(null)
    loadEvents()
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Kelola Event</h1>

      {/* Form Tambah */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input
          placeholder="Judul Event"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <Input
          type="date"
          value={form.event_date}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
          required
        />
        <Input
          placeholder="Icon (Calendar/Clock)"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
        />
        <Input
          type="text"
          placeholder="url form (optional)"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="url peserta (optional)"
          value={form.url_peserta}
          onChange={(e) => setForm({ ...form, url_peserta: e.target.value })}
          required
        />
        <Button type="submit">Tambah Event</Button>
      </form>

      {/* Daftar Event */}
      <div className="space-y-4">
        {events.map((ev) => (
          <Card key={ev.id}>
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-bold">{ev.title}</p>
                <p className="text-sm">{ev.description}</p>
                <p className="text-xs text-gray-500">{new Date(ev.event_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}</p>
                {ev.url_peserta && (
                <Link href={ev.url_peserta} className="text-blue-600 underline">
                    Lihat Peserta
                </Link>
                )}

              </div>
              <div className="flex gap-2">
                {/* Tombol Edit dengan Modal */}
                <Dialog open={!!editForm && editForm.id === ev.id} onOpenChange={(open) => !open && setEditForm(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setEditForm({ ...ev })}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Event</DialogTitle>
                    </DialogHeader>
                    {editForm && (
                      <div className="space-y-4">
                        <Input
                          placeholder="Judul Event"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                        <Textarea
                          placeholder="Deskripsi"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                        <Input
                          type="date"
                          value={editForm.event_date?.split("T")[0]} // pastikan format YYYY-MM-DD
                          onChange={(e) => setEditForm({ ...editForm, event_date: e.target.value })}
                        />
                        <Input
                          placeholder="Icon (Calendar/Clock)"
                          value={editForm.icon}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                        />
                        <Input
                          placeholder="Link Register (Optional)"
                          value={editForm.url||""}
                          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        />
                        <Input
                          placeholder="Link Peserta (Optional)"
                          value={editForm.url_peserta||""}
                          onChange={(e) => setEditForm({ ...editForm, url_peserta: e.target.value })}
                        />
                      </div>
                    )}
                    <DialogFooter>
                      <Button onClick={handleUpdate}>Simpan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Tombol Hapus */}
                <Button variant="destructive" onClick={() => handleDelete(ev.id)}>
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
