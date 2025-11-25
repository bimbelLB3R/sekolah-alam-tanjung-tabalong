'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DownloadIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { formatName } from '@/lib/formatName';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatDate } from '@/lib/formatDate';
import { ReceiptDocument } from './KuitansiPdf';
import { pdf } from '@react-pdf/renderer';

export default function ListPembayaran() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    tahun_ajaran: '',
    sort_by: 'tgl_bayar',
    sort_order: 'DESC'
  });

  // Dialog states
  const [detailDialog, setDetailDialog] = useState({ open: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      });
    //   console.log(params)
      if (filters.tahun_ajaran) {
        params.append('tahun_ajaran', filters.tahun_ajaran);
      }

      const res = await fetch(`/api/pembayaran_siswa?${params}`);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Gagal mengambil data',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan saat mengambil data',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, filters.sort_by, filters.sort_order, filters.tahun_ajaran]);

  // View detail
  const handleViewDetail = async (id) => {
    try {
      const res = await fetch(`/api/pembayaran_siswa/${id}`);
      const result = await res.json();

      if (result.success) {
        setDetailDialog({ open: true, data: result.data });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Gagal mengambil detail pembayaran',
        });
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan saat mengambil detail',
      });
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/pembayaran_siswa/${deleteDialog.id}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (result.success) {
        toast({
          title: 'Berhasil',
          description: 'Data pembayaran berhasil dihapus',
        });
        setDeleteDialog({ open: false, id: null });
        fetchData();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Gagal menghapus data',
        });
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan saat menghapus data',
      });
    }
  };

  // Download PDF
  const handleDownloadPDF = async (item) => {
    try {
      const blob = await pdf(<ReceiptDocument data={item} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Kuitansi_${item.nama_lengkap}_${item.jenis_pembayaran}_${formatDate(item.tgl_bayar)}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal mengunduh PDF');
    }
  };



  // Filter by search (client-side)
  const filteredData = data.filter(item => 
    item.nama_lengkap.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Data Pembayaran Siswa</CardTitle>
              <CardDescription>
                Kelola dan pantau pembayaran siswa
              </CardDescription>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Cari Siswa</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari nama siswa..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
              <Select
                value={filters.tahun_ajaran}
                onValueChange={(value) => setFilters(prev => ({ ...prev, tahun_ajaran: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">Semua</SelectItem>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2022/2023">2022/2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort">Urutkan</Label>
              <Select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onValueChange={(value) => {
                  const [sort_by, sort_order] = value.split('-');
                  setFilters(prev => ({ ...prev, sort_by, sort_order }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tgl_bayar-DESC">Terbaru</SelectItem>
                  <SelectItem value="tgl_bayar-ASC">Terlama</SelectItem>
                  <SelectItem value="jml_bayar-DESC">Nominal Terbesar</SelectItem>
                  <SelectItem value="jml_bayar-ASC">Nominal Terkecil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Tahun Ajaran</TableHead>
                  <TableHead>Jenis Pembayaran</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  {/* <TableHead>Cara Bayar</TableHead> */}
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p className="mt-2 text-muted-foreground">Memuat data...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <p className="text-muted-foreground">Tidak ada data pembayaran</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{(pagination.page - 1) * pagination.limit + index + 1}</TableCell>
                      <TableCell className="font-medium">{formatName(item.nama_lengkap)}</TableCell>
                      <TableCell>{item.kelas_lengkap}</TableCell>
                      <TableCell>{item.tahun_ajaran}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.jenis_pembayaran}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(item.jml_bayar)}</TableCell>
                      <TableCell>{formatDate(item.tgl_bayar)}</TableCell>
                      {/* <TableCell>
                        <Badge variant={item.cara_bayar === 'cash' ? 'default' : 'secondary'}>
                          {item.cara_bayar === 'cash' ? 'Cash' : 'Transfer'}
                        </Badge>
                      </TableCell> */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleViewDetail(item.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDownloadPDF(item)}
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteDialog({ open: true, id: item.id })}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                disabled={pagination.page === 1 || loading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 px-3">
                <span className="text-sm font-medium">{pagination.page}</span>
                <span className="text-sm text-muted-foreground">dari</span>
                <span className="text-sm font-medium">{pagination.total_pages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.total_pages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, page: pagination.total_pages }))}
                disabled={pagination.page === pagination.total_pages || loading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} onOpenChange={(open) => setDetailDialog({ open, data: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pembayaran</DialogTitle>
            <DialogDescription>
              Informasi lengkap pembayaran siswa
            </DialogDescription>
          </DialogHeader>
          {detailDialog.data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nama Siswa</Label>
                  <p className="font-medium">{detailDialog.data.nama_lengkap}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">NIK</Label>
                  <p className="font-medium">{detailDialog.data.nik}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Kelas</Label>
                  <p className="font-medium">{detailDialog.data.kelas_lengkap}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tahun Ajaran</Label>
                  <p className="font-medium">{detailDialog.data.tahun_ajaran}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Jenis Pembayaran</Label>
                  <p className="font-medium">{detailDialog.data.jenis_pembayaran}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Jumlah Bayar</Label>
                  <p className="font-bold text-lg">{formatCurrency(detailDialog.data.jml_bayar)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tanggal Bayar</Label>
                  <p className="font-medium">{formatDate(detailDialog.data.tgl_bayar)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cara Bayar</Label>
                  <Badge variant={detailDialog.data.cara_bayar === 'cash' ? 'default' : 'secondary'}>
                    {detailDialog.data.cara_bayar === 'cash' ? 'Cash' : 'Transfer'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Penerima</Label>
                  <p className="font-medium">{detailDialog.data.penerima}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Keterangan</Label>
                  <p className="font-medium">{detailDialog.data.keterangan || '-'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialog({ open: false, data: null })}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pembayaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Data pembayaran yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin menghapus data ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}