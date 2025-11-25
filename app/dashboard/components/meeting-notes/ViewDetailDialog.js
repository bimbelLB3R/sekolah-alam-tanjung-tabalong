import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { formatDateWITA } from '@/lib/meeting-notes/formatDate'

export function ViewDetailDialog({ isOpen, onClose, note }) {
  if (!note) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Notulensi Rapat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{note.meeting_name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📅 {formatDateWITA(note.meeting_date)}</p>
              <p>🕐 {note.meeting_time_start} - {note.meeting_time_end} WITA</p>
              <p>👨‍🏫 Pembimbing: {note.supervisor_name}</p>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Peserta</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {note.participants?.map(p => (
                <div key={p.id} className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Agenda</Label>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">{note.agenda}</p>
          </div>

          <div>
            <Label className="text-base font-semibold">Hasil Evaluasi</Label>
            <div className="mt-2 space-y-3">
              {note.result_sections?.map((section, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                  <h4 className="font-semibold text-sm">{section.section_name}</h4>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                    {section.section_content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {note.attachments && note.attachments.length > 0 && (
            <div>
              <Label className="text-base font-semibold">Lampiran ({note.attachments.length})</Label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                {note.attachments.map((att, idx) => (
                  <a 
                    key={idx}
                    href={att.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img 
                      src={att.file_url} 
                      alt={att.file_name}
                      className="w-full h-32 object-cover rounded border hover:opacity-80 transition"
                    />
                    <p className="text-xs mt-1 truncate">{att.file_name}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-4 border-t">
            Dibuat oleh: {note.creator_name} • {new Date(note.created_at).toLocaleString('id-ID')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}