"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Calendar, Loader2, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@/lib/formatDate';

export default function BendaharaPage() {
  const [dataIjin, setDataIjin] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenisIjin, setFilterJenisIjin] = useState('all');
  const [filterTunjangan, setFilterTunjangan] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 100, // Ambil lebih banyak untuk filter lokal
    offset: 0,
    hasMore: false
  });

  // Fetch data dari API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/ijin-karyawan?limit=100&offset=0`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengambil data');
      }

      setDataIjin(result.data);
      setFilteredData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data saat component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter data
  useEffect(() => {
    let filtered = [...dataIjin];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.nama_karyawan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email_karyawan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alasan_ijin.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by jenis ijin
    if (filterJenisIjin !== 'all') {
      filtered = filtered.filter(item => item.jenis_ijin === filterJenisIjin);
    }

    // Filter by status tunjangan
    if (filterTunjangan !== 'all') {
      const dipotong = Number(filterTunjangan);
      filtered = filtered.filter(item => Number(item.dipotong_tunjangan) === dipotong);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [searchTerm, filterJenisIjin, filterTunjangan, dataIjin]);

  // Handle toggle pemotongan tunjangan
  const handleTogglePotongTunjangan = async (id, currentStatus) => {
    setIsUpdating(id);
    
    try {
      const response = await fetch(`/api/ijin-karyawan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dipotong_tunjangan: !currentStatus 
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal update data');
      }

      // Update state lokal
      setDataIjin(prev => prev.map(item => 
        item.id === id 
          ? { ...item, dipotong_tunjangan: !currentStatus }
          : item
      ));

    } catch (err) {
      console.error('Error updating data:', err);
      alert(err.message || 'Terjadi kesalahan saat update data');
    } finally {
      setIsUpdating(null);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading && dataIjin.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Validasi Ijin Karyawan
            </h1>
            <p className="text-slate-600">
              Kelola dan validasi pemotongan tunjangan untuk ijin karyawan
            </p>
          </div>
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Memuat data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Validasi Ijin Keluar
            </h1>
            <p className="text-slate-600">
              Kelola dan validasi pemotongan tunjangan untuk ijin karyawan
            </p>
          </div>
          <Button 
            onClick={fetchData} 
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Cari nama, email, atau alasan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterJenisIjin} onValueChange={setFilterJenisIjin}>
                <SelectTrigger>
                  <SelectValue placeholder="Jenis Ijin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="keluar">Ijin Keluar</SelectItem>
                  <SelectItem value="tidak_masuk">Ijin Tidak Masuk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTunjangan} onValueChange={setFilterTunjangan}>
                <SelectTrigger>
                  <SelectValue placeholder="Status Tunjangan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="1">Dipotong</SelectItem>
                  <SelectItem value="0">Tidak Dipotong</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Nama Karyawan</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Jenis Ijin</TableHead>
                    <TableHead>Tanggal Ijin</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Alasan</TableHead>
                    <TableHead>Status Tunjangan</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                        Tidak ada data yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentData.map((ijin, index) => (
                      <TableRow key={ijin.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {ijin.nama_karyawan}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {ijin.email_karyawan}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={ijin.jenis_ijin === 'keluar' ? 'default' : 'secondary'}
                          >
                            {ijin.jenis_ijin === 'keluar' ? 'Keluar' : 'Tidak Masuk'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(ijin.tanggal_ijin).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {ijin.jenis_ijin === 'keluar' && ijin.jam_keluar ? (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="whitespace-nowrap">
                                {ijin.jam_keluar} - {ijin.jam_kembali}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-sm text-slate-600 truncate" title={ijin.alasan_ijin}>
                            {ijin.alasan_ijin}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={ijin.dipotong_tunjangan ? 'destructive' : 'outline'}
                            className={ijin.dipotong_tunjangan ? '' : 'border-green-500 text-green-700'}
                          >
                            {ijin.dipotong_tunjangan ? 'Dipotong' : 'Tidak Dipotong'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {isUpdating === ijin.id && (
                              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                            )}
                            <Switch
                              checked={ijin.dipotong_tunjangan}
                              onCheckedChange={() => handleTogglePotongTunjangan(ijin.id, ijin.dipotong_tunjangan)}
                              disabled={isUpdating === ijin.id}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 / halaman</SelectItem>
                  <SelectItem value="10">10 / halaman</SelectItem>
                  <SelectItem value="20">20 / halaman</SelectItem>
                  <SelectItem value="50">50 / halaman</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-9"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}