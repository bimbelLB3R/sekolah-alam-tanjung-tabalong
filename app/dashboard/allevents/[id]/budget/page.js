// app/(dashboard)/events/[id]/budget/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { BudgetManager } from '@/app/dashboard/components/allevents/budget/BudgetManager';
import { EventAPI } from '@/lib/api-client';
import { formatRupiah } from '@/lib/validations';
import Link from 'next/link';
import { useAuth } from '@/lib/getUserClientSide';

export default function BudgetPage() {
  const {user}=useAuth();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const { toast } = useToast();

  const [event, setEvent] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [eventId]);

  async function loadData() {
    try {
      setLoading(true);
      const [eventRes, budgetRes] = await Promise.all([
        EventAPI.getById(eventId),
        EventAPI.getBudget(eventId)
      ]);

      if (eventRes.success) setEvent(eventRes.data);
      if (budgetRes.success) {
        setBudgets(budgetRes.data);
        setSummary(budgetRes.summary);
      }
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

  const handleAddBudget = async (data) => {
    const result = await EventAPI.addBudgetItem(eventId, data,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Item anggaran berhasil ditambahkan",
      });
      loadData(); // Reload untuk update summary
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleUpdateBudget = async (budgetId, data) => {
    const result = await EventAPI.updateBudgetItem(eventId, budgetId, data,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Item anggaran berhasil diupdate",
      });
      loadData(); // Reload untuk update summary
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    const result = await EventAPI.deleteBudgetItem(eventId, budgetId,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Item anggaran berhasil dihapus",
      });
      loadData(); // Reload untuk update summary
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      ['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Nominal', 'Catatan'],
      ...budgets.map(b => [
        b.date,
        b.type,
        b.category,
        b.description || '',
        b.amount,
        b.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anggaran-${event?.name || 'event'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Anggaran berhasil diexport",
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
          <Link href="/dashboard/allevents">Kembali ke Daftar Event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/allevents/${eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Detail Event
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Rencana Keuangan</h1>
              <p className="text-muted-foreground">{event.name}</p>
            </div>
          </div>

          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Budget Manager */}
      <BudgetManager
        budgets={budgets}
        summary={summary}
        onAdd={handleAddBudget}
        onUpdate={handleUpdateBudget}
        onDelete={handleDeleteBudget}
      />
    </div>
  );
}