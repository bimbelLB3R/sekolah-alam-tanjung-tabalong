// app/(dashboard)/monitoring/budget/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar,
  Eye,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { BudgetMonitoringAPI } from '@/lib/api-client';
import { formatRupiah } from '@/lib/validations';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusConfig = {
  planning: { label: 'Perencanaan', color: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Berlangsung', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Selesai', color: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' }
};

export default function BudgetMonitoringPage() {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    status: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  async function loadData() {
    try {
      setLoading(true);
      const result = await BudgetMonitoringAPI.getMonitoring(filters);
      
      if (result.success) {
        setData(result.data);
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data monitoring",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleExport = () => {
    if (!data || !data.events) return;

    const csvContent = [
      ['Nama Event', 'Status', 'Tanggal Mulai', 'Pemasukan', 'Pengeluaran', 'Saldo'],
      ...data.events.map(event => [
        event.name,
        event.status,
        event.start_date,
        event.total_pemasukan,
        event.total_pengeluaran,
        event.saldo
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-budget-${filters.year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil!",
      description: "Data berhasil diexport",
    });
  };

  const clearFilters = () => {
    setFilters({
      year: new Date().getFullYear().toString(),
      status: ''
    });
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const grandTotal = data?.grand_total || {};
  const events = data?.events || [];
  const statusStats = data?.status_stats || [];
  const topEvents = data?.top_events || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring Dana Kegiatan</h1>
          <p className="text-muted-foreground mt-1">
            Dashboard monitoring pembiayaan seluruh kegiatan sekolah
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select 
          value={filters.year} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
        >
          <SelectTrigger className="w-full md:w-[120px]">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            {yearOptions.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.status} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="planning">Perencanaan</SelectItem>
            <SelectItem value="ongoing">Berlangsung</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>

        {(filters.status || filters.year !== currentYear.toString()) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Reset
          </Button>
        )}
      </div>

      {/* Grand Total Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Event</p>
                <p className="text-3xl font-bold text-blue-700">
                  {grandTotal.jumlah_event || 0}
                </p>
              </div>
              <div className="h-14 w-14 bg-blue-200 rounded-full flex items-center justify-center">
                <Calendar className="h-7 w-7 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatRupiah(grandTotal.total_pemasukan || 0)}
                </p>
              </div>
              <div className="h-14 w-14 bg-green-200 rounded-full flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatRupiah(grandTotal.total_pengeluaran || 0)}
                </p>
              </div>
              <div className="h-14 w-14 bg-red-200 rounded-full flex items-center justify-center">
                <TrendingDown className="h-7 w-7 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "border-2",
          (grandTotal.saldo || 0) >= 0 
            ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" 
            : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-sm font-medium",
                  (grandTotal.saldo || 0) >= 0 ? "text-purple-600" : "text-orange-600"
                )}>
                  Saldo Total
                </p>
                <p className={cn(
                  "text-2xl font-bold",
                  (grandTotal.saldo || 0) >= 0 ? "text-purple-700" : "text-orange-700"
                )}>
                  {formatRupiah(grandTotal.saldo || 0)}
                </p>
              </div>
              <div className={cn(
                "h-14 w-14 rounded-full flex items-center justify-center",
                (grandTotal.saldo || 0) >= 0 ? "bg-purple-200" : "bg-orange-200"
              )}>
                <Wallet className={cn(
                  "h-7 w-7",
                  (grandTotal.saldo || 0) >= 0 ? "text-purple-700" : "text-orange-700"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Events */}
      {topEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Kegiatan dengan Pengeluaran Terbesar</CardTitle>
            <CardDescription>Ranking kegiatan berdasarkan total pengeluaran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topEvents.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center font-bold",
                      index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-gray-100 text-gray-700" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{event.name}</span>
                  </div>
                  <span className="font-bold text-red-700">
                    {formatRupiah(event.total_pengeluaran)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Pembiayaan Per Kegiatan</CardTitle>
          <CardDescription>
            Menampilkan {events.length} kegiatan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Tidak ada data kegiatan</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kegiatan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Pemasukan</TableHead>
                    <TableHead className="text-right">Pengeluaran</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium max-w-[300px]">
                        <div>
                          <p className="line-clamp-1">{event.name}</p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[event.status].color}>
                          {statusConfig[event.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(event.start_date), 'd MMM yyyy', { locale: idLocale })}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-700 font-medium">
                        {formatRupiah(event.total_pemasukan)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-red-700 font-medium">
                        {formatRupiah(event.total_pengeluaran)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        <span className={cn(
                          parseFloat(event.saldo) >= 0 ? "text-blue-700" : "text-orange-700"
                        )}>
                          {formatRupiah(event.saldo)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/allevents/${event.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Statistics */}
      {statusStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistik Berdasarkan Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statusStats.map((stat) => (
                <div key={stat.status} className="border rounded-lg p-4">
                  <Badge className={statusConfig[stat.status].color + ' mb-2'}>
                    {statusConfig[stat.status].label}
                  </Badge>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Jumlah: <span className="font-bold">{stat.jumlah_event}</span>
                    </p>
                    <p className="text-green-600">
                      Pemasukan: <span className="font-bold">{formatRupiah(stat.total_pemasukan)}</span>
                    </p>
                    <p className="text-red-600">
                      Pengeluaran: <span className="font-bold">{formatRupiah(stat.total_pengeluaran)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}