

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { formatDate } from "@/lib/formatDate"
import { Loader2 } from "lucide-react"

const initialFormState = {
  title: "",
  description: "",
  start_date:"",
  end_date:"",
  icon: "Calendar",
  url: "",
  url_peserta: ""
}

export default function AddEventsPage() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(initialFormState)
  const [editForm, setEditForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [error, setError] = useState("")

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await fetch("/api/events")
      if (!res.ok) throw new Error("Gagal memuat data events")
      const data = await res.json()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal menambah event")
      }
      
      setForm(initialFormState)
      await loadEvents()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    try {
      setLoading(true)
      setError("")
      const res = await fetch(`/api/events/${deleteId}`, { method: "DELETE" })
      
      if (!res.ok) throw new Error("Gagal menghapus event")
      
      await loadEvents()
      setDeleteId(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await fetch(`/api/events/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Gagal mengupdate event")
      }
      
      setEditForm(null)
      await loadEvents()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Kelola Event</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Tambah */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow">
        <Input
          placeholder="Judul Event"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          disabled={loading}
        />
        <Textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          disabled={loading}
        />
        <p>Tanggal Mulai</p>
        <Input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          required
          disabled={loading}
        />
        <p>Tanggal Berakhir</p>
        <Input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          required
          disabled={loading}
        />
        <Input
          placeholder="Icon (Calendar/Clock)"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          disabled={loading}
        />
        <Input
          type="url"
          placeholder="URL Form Registrasi (opsional)"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          disabled={loading}
        />
        <Input
          type="url"
          placeholder="URL Lihat Peserta (opsional)"
          value={form.url_peserta}
          onChange={(e) => setForm({ ...form, url_peserta: e.target.value })}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Tambah Event"
          )}
        </Button>
      </form>

      {/* Daftar Event */}
      <div className="space-y-4">
        {loading && events.length === 0 ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">Memuat data...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Belum ada event yang ditambahkan</p>
          </div>
        ) : (
          events.map((ev) => (
            <Card key={ev.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
                <div className="flex-1">
                  <p className="font-bold text-lg">{ev.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{ev.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    📅 {formatDate(ev.start_date)} - {formatDate(ev.end_date)}
                  </p>
                  <div className="flex gap-3 mt-2">
                    {ev.url && (
                      <Link
                        href={ev.url}
                        target="_blank"
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                      >
                        Form Registrasi
                      </Link>
                    )}
                    {ev.url_peserta && (
                      <Link
                        href={ev.url_peserta}
                        target="_blank"
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                      >
                        Lihat Peserta
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Tombol Edit dengan Modal */}
                  <Dialog
                    open={!!editForm && editForm.id === ev.id}
                    onOpenChange={(open) => !open && setEditForm(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setEditForm({ ...ev })}
                        disabled={loading}
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
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                            disabled={loading}
                          />
                          <Textarea
                            placeholder="Deskripsi"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({ ...editForm, description: e.target.value })
                            }
                            disabled={loading}
                          />
                          <Input
                            type="date"
                            value={editForm.start_date?.split("T")[0]}
                            onChange={(e) =>
                              setEditForm({ ...editForm, start_date: e.target.value })
                            }
                            disabled={loading}
                          />
                          <Input
                            type="date"
                            value={editForm.end_date?.split("T")[0]}
                            onChange={(e) =>
                              setEditForm({ ...editForm, end_date: e.target.value })
                            }
                            disabled={loading}
                          />
                          <Input
                            placeholder="Icon (Calendar/Clock)"
                            value={editForm.icon}
                            onChange={(e) =>
                              setEditForm({ ...editForm, icon: e.target.value })
                            }
                            disabled={loading}
                          />
                          <Input
                            type="url"
                            placeholder="URL Form Registrasi (opsional)"
                            value={editForm.url || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, url: e.target.value })
                            }
                            disabled={loading}
                          />
                          <Input
                            type="url"
                            placeholder="URL Lihat Peserta (opsional)"
                            value={editForm.url_peserta || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, url_peserta: e.target.value })
                            }
                            disabled={loading}
                          />
                        </div>
                      )}
                      <DialogFooter>
                        <Button onClick={handleUpdate} disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Menyimpan...
                            </>
                          ) : (
                            "Simpan"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Tombol Hapus dengan Konfirmasi */}
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteId(ev.id)}
                    disabled={loading}
                  >
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Alert Dialog untuk Konfirmasi Hapus */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}