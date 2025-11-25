"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, Edit, FileDown, Eye } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatDateWITA, isoToDateInputWITA} from '@/lib/meeting-notes/formatDate'
// import { dateInputToIsoUTC } from '@/lib/formatDateInputToIso'
import { MeetingNoteFormDialog } from '../components/meeting-notes/MeetingNoteFormDialog'
import { ViewDetailDialog } from '../components/meeting-notes/ViewDetailDialog'
import { FilterSection } from '../components/meeting-notes/FilterSection'

export default function MeetingNotesPage() {
  const [meetingNotes, setMeetingNotes] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingNote, setViewingNote] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const { toast } = useToast()

//   console.log(meetingNotes)

  // Pagination & Filter states
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filterSupervisor, setFilterSupervisor] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    meeting_name: '',
    meeting_date: '',
    meeting_time_start: '',
    meeting_time_end: '',
    supervisor_id: '',
    agenda: '',
    participants: [],
    result_sections: [{ section_name: 'Konsumsi', section_content: '' }],
    attachments: []
  })

//   console.log(formData)

  useEffect(() => {
    fetchMeetingNotes()
    fetchUsers()
  }, [page, search, filterSupervisor, filterDateFrom, filterDateTo])

  const fetchMeetingNotes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(filterSupervisor && { supervisor: filterSupervisor }),
        ...(filterDateFrom && { dateFrom: filterDateFrom }),
        ...(filterDateTo && { dateTo: filterDateTo })
      })

      const res = await fetch(`/api/meeting-notes?${params}`)
      const data = await res.json()
      
      if (res.ok) {
        setMeetingNotes(data.data)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/meeting-notes/users/list')
      const data = await res.json()
      if (res.ok) setUsers(data.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchDetailForEdit = async (id) => {
    try {
      const res = await fetch(`/api/meeting-notes/${id}`)
      const data = await res.json()
      
      if (res.ok) {
        setFormData({
          meeting_name: data.meeting_name,
          meeting_date: isoToDateInputWITA(data.meeting_date),
          meeting_time_start: data.meeting_time_start,
          meeting_time_end: data.meeting_time_end,
          supervisor_id: data.supervisor_id,
          agenda: data.agenda,
          participants: data.participants.map(p => p.id),
          result_sections: data.result_sections.length > 0 
            ? data.result_sections 
            : [{ section_name: 'Konsumsi', section_content: '' }],
          attachments: data.attachments || []
        })
        setEditingId(id)
        setIsDialogOpen(true)
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat detail', variant: 'destructive' })
    }
  }

  const fetchDetailForView = async (id) => {
    try {
      const res = await fetch(`/api/meeting-notes/${id}`)
      const data = await res.json()
      
      if (res.ok) {
        setViewingNote(data)
        setIsViewDialogOpen(true)
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat detail', variant: 'destructive' })
    }
  }

  const handleSubmit = async () => {
    // Validasi form
    if (!formData.meeting_name || !formData.meeting_date || !formData.meeting_time_start || 
        !formData.meeting_time_end || !formData.supervisor_id || !formData.agenda) {
      toast({ title: 'Error', description: 'Mohon lengkapi semua field yang wajib diisi', variant: 'destructive' })
      return
    }

    setLoading(true)

    try {
      const url = editingId ? `/api/meeting-notes/${editingId}` : '/api/meeting-notes'
      const method = editingId ? 'PUT' : 'POST'

      const submitData = {
        ...formData,
        meeting_date: formData.meeting_date
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const data = await res.json()

      if (res.ok) {
        toast({ title: 'Sukses', description: data.message })
        setIsDialogOpen(false)
        resetForm()
        fetchMeetingNotes()
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/meeting-notes/${deleteId}`, { method: 'DELETE' })
      const data = await res.json()

      if (res.ok) {
        toast({ title: 'Sukses', description: data.message })
        setDeleteId(null)
        fetchMeetingNotes()
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Terjadi kesalahan', variant: 'destructive' })
    }
  }

  const resetForm = () => {
    setFormData({
      meeting_name: '',
      meeting_date: '',
      meeting_time_start: '',
      meeting_time_end: '',
      supervisor_id: '',
      agenda: '',
      participants: [],
      result_sections: [{ section_name: 'Konsumsi', section_content: '' }],
      attachments: []
    })
    setEditingId(null)
  }

  const exportToPDF = async (id) => {
    try {
      const res = await fetch(`/api/meeting-notes/${id}`)
      const data = await res.json()

      if (!res.ok) {
        toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' })
        return
      }

      const doc = new jsPDF()
      
      // Header
      doc.setFontSize(18)
      doc.setFont(undefined, 'bold')
      doc.text('NOTULENSI RAPAT', 105, 20, { align: 'center' })
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'normal')
      let y = 35
      
      // Info rapat
      doc.text(`Nama Rapat: ${data.meeting_name}`, 20, y)
      y += 7
      doc.text(`Tanggal: ${formatDateWITA(data.meeting_date)}`, 20, y)
      y += 7
      doc.text(`Waktu: ${data.meeting_time_start} - ${data.meeting_time_end} WITA`, 20, y)
      y += 7
      doc.text(`Pembimbing: ${data.supervisor_name}`, 20, y)
      y += 10
      
      // Peserta
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Peserta:', 20, y)
      y += 7
      doc.setFontSize(11)
      doc.setFont(undefined, 'normal')
      
      if (data.participants && data.participants.length > 0) {
        data.participants.forEach((p, i) => {
          if (y > 270) {
            doc.addPage()
            y = 20
          }
          doc.text(`${i + 1}. ${p.name}`, 25, y)
          y += 6
        })
      } else {
        doc.text('Tidak ada peserta', 25, y)
        y += 6
      }
      y += 5
      
      // Agenda
      if (y > 250) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Agenda:', 20, y)
      y += 7
      doc.setFontSize(11)
      doc.setFont(undefined, 'normal')
      const agendaLines = doc.splitTextToSize(data.agenda, 170)
      doc.text(agendaLines, 20, y)
      y += (agendaLines.length * 6) + 10
      
      // Hasil Evaluasi
      if (y > 250) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Hasil Evaluasi:', 20, y)
      y += 7
      doc.setFontSize(11)
      
      if (data.result_sections && data.result_sections.length > 0) {
        data.result_sections.forEach(section => {
          if (y > 250) {
            doc.addPage()
            y = 20
          }
          doc.setFont(undefined, 'bold')
          doc.text(`${section.section_name}:`, 25, y)
          y += 6
          doc.setFont(undefined, 'normal')
          const contentLines = doc.splitTextToSize(section.section_content, 165)
          doc.text(contentLines, 25, y)
          y += (contentLines.length * 6) + 5
        })
      }
      
      // Lampiran
      if (data.attachments && data.attachments.length > 0) {
        y += 5
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        doc.setFontSize(14)
        doc.setFont(undefined, 'bold')
        doc.text('Lampiran:', 20, y)
        y += 7
        doc.setFontSize(11)
        doc.setFont(undefined, 'normal')
        doc.text(`Terdapat ${data.attachments.length} file lampiran`, 25, y)
      }
      
      // Save PDF
      const fileName = `Notulensi_${data.meeting_name.replace(/\s+/g, '_')}_${formatDateWITA(data.meeting_date).replace(/\s+/g, '_')}.pdf`
      doc.save(fileName)
      toast({ title: 'Sukses', description: 'PDF berhasil diunduh' })
      
    } catch (error) {
      console.error('Export PDF error:', error)
      toast({ title: 'Error', description: 'Gagal export PDF', variant: 'destructive' })
    }
  }

  const clearFilters = () => {
    setSearch('')
    setFilterSupervisor('')
    setFilterDateFrom('')
    setFilterDateTo('')
    setPage(1)
  }

  const handleDialogClose = (open) => {
    setIsDialogOpen(open)
    if (!open) resetForm()
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notulensi Rapat</h1>
          <p className="text-gray-600 mt-1">Kelola catatan dan dokumentasi rapat</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" /> Tambah Notulensi
        </Button>
      </div>

      {/* Filter Section */}
      <FilterSection 
        search={search}
        setSearch={setSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filterSupervisor={filterSupervisor}
        setFilterSupervisor={setFilterSupervisor}
        filterDateFrom={filterDateFrom}
        setFilterDateFrom={setFilterDateFrom}
        filterDateTo={filterDateTo}
        setFilterDateTo={setFilterDateTo}
        users={users}
        clearFilters={clearFilters}
        setPage={setPage}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Rapat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pembimbing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peserta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat Oleh
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : meetingNotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <p className="text-lg font-medium">Tidak ada data notulensi</p>
                      <p className="text-sm mt-1">Klik tombol Tambah Notulensi untuk membuat catatan rapat baru</p>
                    </div>
                  </td>
                </tr>
              ) : (
                meetingNotes.map(note => (
                  <tr key={note.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{note.meeting_name}</div>
                      {note.section_count > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {note.section_count} seksi evaluasi
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDateWITA(note.meeting_date)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {note.meeting_time_start} - {note.meeting_time_end}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{note.supervisor_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {note.participant_count} orang
                        </span>
                        {note.attachment_count > 0 && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {note.attachment_count} lampiran
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {note.creator_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchDetailForView(note.id)}
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportToPDF(note.id)}
                          title="Export PDF"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchDetailForEdit(note.id)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(note.id)}
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Halaman <span className="font-medium">{page}</span> dari{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-r-none"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-l-none"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <MeetingNoteFormDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        users={users}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {/* View Detail Dialog */}
      <ViewDetailDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        note={viewingNote}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Notulensi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data termasuk peserta, hasil evaluasi, dan lampiran akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}