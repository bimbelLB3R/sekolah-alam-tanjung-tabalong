// app/(dashboard)/events/[id]/rundown/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { RundownTimeline } from '@/app/dashboard/components/allevents/rundown/RundownTimeline';
import { EventAPI } from '@/lib/api-client';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function RundownPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const { toast } = useToast();

  const [event, setEvent] = useState(null);
  const [rundowns, setRundowns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [eventId]);

  async function loadData() {
    try {
      setLoading(true);
      const [eventRes, rundownRes] = await Promise.all([
        EventAPI.getById(eventId),
        EventAPI.getRundown(eventId)
      ]);

      if (eventRes.success) setEvent(eventRes.data);
      if (rundownRes.success) setRundowns(rundownRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddRundown = async (data) => {
    const result = await EventAPI.addRundownItem(eventId, data);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Agenda berhasil ditambahkan",
      });
      setRundowns([...rundowns, result.data]);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleUpdateRundown = async (rundownId, data) => {
    const result = await EventAPI.updateRundownItem(eventId, rundownId, data);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Agenda berhasil diupdate",
      });
      setRundowns(rundowns.map(r => r.id === rundownId ? result.data : r));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteRundown = async (rundownId) => {
    const result = await EventAPI.deleteRundownItem(eventId, rundownId);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Agenda berhasil dihapus",
      });
      setRundowns(rundowns.filter(r => r.id !== rundownId));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      ['Waktu Mulai', 'Waktu Selesai', 'Aktivitas', 'Deskripsi', 'PIC', 'Lokasi', 'Catatan'],
      ...rundowns.map(r => [
        r.time_start,
        r.time_end || '',
        r.activity,
        r.description || '',
        r.person_in_charge || '',
        r.location || '',
        r.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rundown-${event?.name || 'event'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Rundown berhasil diexport",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Event tidak ditemukan</p>
        <Button asChild className="mt-4">
          <Link href="/events">Kembali ke Daftar Event</Link>
        </Button>
      </div>
    );
  }

  const totalDuration = rundowns.reduce((acc, item) => {
    if (!item.time_start || !item.time_end) return acc;
    const [startH, startM] = item.time_start.split(':').map(Number);
    const [endH, endM] = item.time_end.split(':').map(Number);
    const diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    return acc + diffMinutes;
  }, 0);

  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4 no-print">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/allevents/${eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Detail Event
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Rundown Acara</h1>
              <p className="text-muted-foreground">{event.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(event.start_date), 'd MMMM yyyy', { locale: idLocale })}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Print Header (only visible when printing) */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">{event.name}</h1>
        <p className="text-lg text-muted-foreground">Rundown Acara</p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(event.start_date), 'd MMMM yyyy', { locale: idLocale })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 no-print">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-700">{rundowns.length}</div>
          <div className="text-sm text-purple-600">Total Agenda</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">
            {rundowns[0]?.time_start?.slice(0, 5) || '-'}
          </div>
          <div className="text-sm text-blue-600">Waktu Mulai</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">
            {totalDuration > 0 
              ? `${totalHours}j ${totalMinutes}m` 
              : '-'
            }
          </div>
          <div className="text-sm text-green-600">Total Durasi</div>
        </div>
      </div>

      {/* Rundown Timeline */}
      <RundownTimeline
        rundowns={rundowns}
        onAdd={handleAddRundown}
        onUpdate={handleUpdateRundown}
        onDelete={handleDeleteRundown}
      />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .container {
            max-width: 100% !important;
            padding: 20px !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}