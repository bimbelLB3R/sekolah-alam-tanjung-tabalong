// app/(dashboard)/events/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import EventCard from '../components/allevents/EventCard';
import { EventAPI } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function EventsPage() {
    const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    year: new Date().getFullYear().toString()
  });

  useEffect(() => {
    loadEvents();
  }, [filters.status, filters.year]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        loadEvents();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  async function loadEvents() {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.year) params.year = filters.year;

      const result = await EventAPI.getAll(params);
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal Memuat Data Event",
        variant: "destructive",
        });
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      year: new Date().getFullYear().toString()
    });
  };

  // Generate year options (current year ± 2 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua event sekolah dalam satu tempat
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/allevents/new">
            <Plus className="mr-2 h-4 w-4" />
            Buat Event Baru
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari event..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select 
          value={filters.status} 
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Semua Status</SelectItem>
            <SelectItem value="planning">Perencanaan</SelectItem>
            <SelectItem value="ongoing">Berlangsung</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select 
          value={filters.year} 
          onValueChange={(value) => handleFilterChange('year', value)}
        >
          <SelectTrigger className="w-full md:w-[120px]">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Semua</SelectItem>
            {yearOptions.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {(filters.search || filters.status || filters.year !== currentYear.toString()) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Reset
          </Button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">
            {events.filter(e => e.status === 'planning').length}
          </div>
          <div className="text-sm text-blue-600">Perencanaan</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">
            {events.filter(e => e.status === 'ongoing').length}
          </div>
          <div className="text-sm text-green-600">Berlangsung</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-700">
            {events.filter(e => e.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Selesai</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-700">
            {events.length}
          </div>
          <div className="text-sm text-purple-600">Total Event</div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {filters.search || filters.status ? (
              <>
                <p className="text-lg font-medium">Tidak ada event ditemukan</p>
                <p className="text-sm mt-1">Coba ubah filter pencarian</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">Belum ada event</p>
                <p className="text-sm mt-1">Mulai dengan membuat event pertama</p>
                <Button asChild className="mt-4">
                  <Link href="/allevents/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Event
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}