import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, X, Upload } from 'lucide-react'
import { dateInputToIsoUTC } from '@/lib/formatDateInputToIso'

export function MeetingNoteFormDialog({ 
  isOpen, 
  onClose, 
  editingId, 
  formData, 
  setFormData, 
  users, 
  onSubmit, 
  loading 
}) {
  const { toast } = useToast()
  const [uploadingImage, setUploadingImage] = useState(false)

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      result_sections: [...prev.result_sections, { section_name: '', section_content: '' }]
    }))
  }

  const removeSection = (index) => {
    setFormData(prev => ({
      ...prev,
      result_sections: prev.result_sections.filter((_, i) => i !== index)
    }))
  }

  const updateSection = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      result_sections: prev.result_sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/meeting-notes/upload-image', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              file_url: data.url,
              file_name: data.fileName,
              file_type: 'image',
              key: data.key
            }
          ]
        }))
        toast({ title: 'Sukses', description: 'Gambar berhasil diupload' })
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Upload gagal', variant: 'destructive' })
    } finally {
      setUploadingImage(false)
    }
  }

  const removeAttachment = async (index, key) => {
    try {
      if (key) {
        await fetch(`/api/meeting-notes/upload-image?key=${key}`, { method: 'DELETE' })
      }
      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index)
      }))
    } catch (error) {
      console.error('Error removing attachment:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit' : 'Tambah'} Notulensi Rapat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nama Rapat *</Label>
            <Input
              value={formData.meeting_name}
              onChange={(e) => setFormData({ ...formData, meeting_name: e.target.value })}
              placeholder="Contoh: Rapat Evaluasi Proyek Q4"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Tanggal *</Label>
              <Input
                type="date"
                value={formData.meeting_date}
                onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Waktu Mulai *</Label>
              <Input
                type="time"
                value={formData.meeting_time_start}
                onChange={(e) => setFormData({ ...formData, meeting_time_start: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Waktu Selesai *</Label>
              <Input
                type="time"
                value={formData.meeting_time_end}
                onChange={(e) => setFormData({ ...formData, meeting_time_end: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Pembimbing *</Label>
            <Select
              value={formData.supervisor_id}
              onValueChange={(value) => setFormData({ ...formData, supervisor_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih pembimbing" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Peserta</Label>
            <Select
              value=""
              onValueChange={(value) => {
                if (!formData.participants.includes(value)) {
                  setFormData({ ...formData, participants: [...formData.participants, value] })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tambah peserta" />
              </SelectTrigger>
              <SelectContent>
                {users.filter(u => !formData.participants.includes(u.id) && u.id !== formData.supervisor_id).map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.participants.map(pId => {
                const user = users.find(u => u.id === pId)
                return (
                  <div key={pId} className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-sm">{user?.name}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        participants: formData.participants.filter(id => id !== pId) 
                      })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <Label>Agenda *</Label>
            <Textarea
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              rows={4}
              placeholder="Tulis agenda rapat..."
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Hasil Evaluasi (Seksi)</Label>
              <Button type="button" onClick={addSection} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Tambah Seksi
              </Button>
            </div>
            {formData.result_sections.map((section, index) => (
              <div key={index} className="border p-3 rounded mb-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2 gap-2">
                  <Input
                    placeholder="Nama Seksi (contoh: Konsumsi, Dokumentasi, Acara)"
                    value={section.section_name}
                    onChange={(e) => updateSection(index, 'section_name', e.target.value)}
                    className="flex-1"
                  />
                  {formData.result_sections.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeSection(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder="Isi hasil evaluasi untuk seksi ini..."
                  value={section.section_content}
                  onChange={(e) => updateSection(index, 'section_content', e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </div>

          <div>
            <Label>Lampiran Gambar</Label>
            <div className="mt-2">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {uploadingImage ? 'Uploading...' : 'Klik untuk upload gambar'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {formData.attachments.map((att, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={att.file_url} 
                      alt={att.file_name}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttachment(index, att.key)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-xs mt-1 truncate">{att.file_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="button" onClick={onSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}