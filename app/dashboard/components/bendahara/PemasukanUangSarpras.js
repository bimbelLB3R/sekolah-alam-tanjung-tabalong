import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PemasukanUangSarpras = () => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    siswaKelasId: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0
  });
  const [summary, setSummary] = useState({
    totalPembayaran: 0
  });

  useEffect(() => {
    loadKelasList();
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.limit]);

  const loadKelasList = async () => {
    try {
      // SOLUSI 1: Gunakan endpoint terpisah (Recommended)
      const response = await fetch('/api/pemasukan-spp/kelas-list');
      
      // SOLUSI 2: Atau tetap gunakan POST ke /api/pemasukan-spp
      // const response = await fetch('/api/pemasukan-spp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ action: 'get_kelas' })
      // });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setKelasList(result.data);
      } else {
        throw new Error(result.error || 'Failed to load kelas');
      }
    } catch (error) {
      console.error('Error loading kelas:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data kelas',
        variant: 'destructive'
      });
    }
  };

  const loadData = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.siswaKelasId && filters.siswaKelasId !== 'all' && { siswaKelasId: filters.siswaKelasId }),
        ...(filters.search && { search: filters.search })
      });
      
      const response = await fetch(`/api/pemasukan/sarpras?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setPagination(prev => ({
          ...prev,
          totalRecords: result.pagination.totalRecords,
          totalPages: result.pagination.totalPages
        }));
        setSummary(result.summary);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data pembayaran',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadData();
  };

  const handleResetFilter = () => {
    setFilters({
      startDate: '',
      endDate: '',
      siswaKelasId: 'all',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => loadData(), 100);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const exportToCSV = () => {
    const headers = ['Tanggal', 'Nama Siswa', 'NIK', 'Kelas', 'Tahun Ajaran', 'Jumlah', 'Cara Bayar', 'Penerima'];
    const csvData = data.map(row => [
      formatDate(row.tgl_bayar),
      row.nama_lengkap,
      row.nik,
      row.kelas_lengkap || '-',
      row.tahun_ajaran,
      row.jml_bayar,
      row.cara_bayar,
      row.penerima
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pemasukan-sarpras-${new Date().getTime()}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Berhasil',
      description: 'Data berhasil diekspor ke CSV'
    });
  };
  // console.log(data)

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pemasukan Sarpras</h1>
          <p className="text-muted-foreground">Kelola dan pantau pembayaran Sarpras siswa</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Pemasukan</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(summary.totalPembayaran)}</p>
              <p className="text-blue-100 text-sm mt-1">{pagination.totalRecords} transaksi</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <DollarSign size={32} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filter Data
          </CardTitle>
          <CardDescription>Filter pembayaran berdasarkan tanggal, kelas, atau nama siswa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Mulai</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Akhir</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kelas</label>
              <Select
                value={filters.siswaKelasId}
                onValueChange={(value) => handleFilterChange('siswaKelasId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {kelasList.map((kelas) => (
                    <SelectItem key={kelas.id} value={kelas.id}>
                      {kelas.nama_kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cari Siswa</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nama atau NIK..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApplyFilter} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Filter className="mr-2 h-4 w-4" />
                  Terapkan Filter
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleResetFilter}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportToCSV} disabled={data.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Data Pembayaran Sarpras</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per halaman:</span>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) => setPagination(prev => ({ ...prev, limit: parseInt(value), page: 1 }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada data pembayaran</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">No</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Tahun Ajaran</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead>Cara Bayar</TableHead>
                      <TableHead>Penerima</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </TableCell>
                        <TableCell>{formatDate(row.tgl_bayar)}</TableCell>
                        <TableCell className="font-medium">{row.nama_lengkap}</TableCell>
                        <TableCell className="text-muted-foreground">{row.nik}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.kelas_lengkap || '-'}</Badge>
                        </TableCell>
                        <TableCell>{row.tahun_ajaran}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(row.jml_bayar)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.cara_bayar === 'cash' ? 'default' : 'secondary'}>
                            {row.cara_bayar === 'cash' ? 'Tunai' : 'Transfer'}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.penerima}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalRecords)} dari {pagination.totalRecords} data
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">Halaman</span>
                    <span className="text-sm font-semibold">{pagination.page}</span>
                    <span className="text-sm">dari</span>
                    <span className="text-sm font-semibold">{pagination.totalPages || 1}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PemasukanUangSarpras;