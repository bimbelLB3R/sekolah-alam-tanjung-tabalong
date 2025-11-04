'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Download,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Badge } from '@/components/ui/badge';

export default function ParticipantList() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { toast } = useToast();

  const fetchParticipants = async (page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch('/api/mini-class?' + params.toString());
      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      setParticipants(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: 'Gagal memuat data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants(1);
  }, [statusFilter, searchTerm]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch('/api/mini-class/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_verifikasi: newStatus }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast({
        title: 'Status berhasil diupdate',
        description: 'Status diubah menjadi ' + newStatus,
      });

      fetchParticipants(pagination.page);
      setShowDetail(false);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Gagal update status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteParticipant = async (id) => {
    try {
      const response = await fetch('/api/mini-class/' + id, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      toast({
        title: 'Data berhasil dihapus',
        description: 'Peserta telah dihapus dari database',
      });

      fetchParticipants(pagination.page);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Gagal menghapus data',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const viewDetail = async (id) => {
    try {
      const response = await fetch('/api/mini-class/' + id);
      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      setSelectedParticipant(result.data);
      setShowDetail(true);
    } catch (error) {
      console.error('Fetch detail error:', error);
      toast({
        title: 'Gagal memuat detail',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Nama Lengkap',
      'Nama Panggilan',
      'Usia',
      'Alamat',
      'Asal Sekolah',
      'Kontak WA',
      'Status',
      'Tanggal Daftar',
    ];

    const rows = participants.map((p) => [
      p.id,
      p.nama_lengkap,
      p.nama_panggilan,
      p.usia,
      p.alamat,
      p.asal_sekolah,
      p.kontak_wa,
      p.status_verifikasi,
      new Date(p.created_at).toLocaleString('id-ID'),
    ]);

    const csvRows = rows.map((row) => row.map((cell) => `"${cell}"`).join(','));
    const csvContent = [headers.join(',')].concat(csvRows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mini-class-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status) => {
    if (status === 'verified')
      return (
        <Badge variant="default" className="flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" />
          <span>Verified</span>
        </Badge>
      );

    if (status === 'rejected')
      return (
        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
          <XCircle className="w-3 h-3" />
          <span>Rejected</span>
        </Badge>
      );

    return (
      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
        <Clock className="w-3 h-3" />
        <span>Pending</span>
      </Badge>
    );
  };

  const handlePreviousPage = () => fetchParticipants(pagination.page - 1);
  const handleNextPage = () => fetchParticipants(pagination.page + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daftar Peserta</h2>
          <p className="text-sm text-gray-600">Total: {pagination.total} peserta</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari nama atau asal sekolah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Tidak ada data peserta</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Panggilan</TableHead>
                <TableHead>Usia</TableHead>
                <TableHead>Asal Sekolah</TableHead>
                <TableHead>Kontak WA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Daftar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => {
                const waUrl = 'https://wa.me/' + participant.kontak_wa.replace(/\+/g, '');
                const tanggalDaftar = new Date(participant.created_at).toLocaleDateString('id-ID');

                return (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">{participant.id}</TableCell>
                    <TableCell>{participant.nama_lengkap}</TableCell>
                    <TableCell>{participant.nama_panggilan}</TableCell>
                    <TableCell>{participant.usia}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {participant.asal_sekolah}
                    </TableCell>
                    <TableCell>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 hover:underline"
                      >
                        {participant.kontak_wa}
                      </a>
                    </TableCell>
                    <TableCell>{getStatusBadge(participant.status_verifikasi)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{tanggalDaftar}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => viewDetail(participant.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(participant)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Halaman {pagination.page} dari {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      {showDetail && selectedParticipant && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Peserta</DialogTitle>
              <DialogDescription>Informasi lengkap peserta mini class</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-base font-semibold">{selectedParticipant.nama_lengkap}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Panggilan</label>
                  <p className="text-base">{selectedParticipant.nama_panggilan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Usia</label>
                  <p className="text-base">{selectedParticipant.usia} tahun</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kontak WhatsApp</label>
                  <a
                    href={'https://wa.me/' + selectedParticipant.kontak_wa.replace(/\+/g, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-green-600 hover:underline flex items-center gap-1"
                  >
                    <span>{selectedParticipant.kontak_wa}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Alamat Lengkap</label>
                <p className="text-base">{selectedParticipant.alamat}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Asal Sekolah
                </label>
                <p className="text-base">{selectedParticipant.asal_sekolah}</p>
              </div>

              {selectedParticipant.bukti_transfer_url && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    Bukti Transfer
                  </label>
                  {selectedParticipant.bukti_transfer_url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                    <img
                      src={selectedParticipant.bukti_transfer_url}
                      alt="Bukti Transfer"
                      className="w-full max-h-96 object-contain border rounded-lg"
                    />
                  ) : (
                    <a
                      href={selectedParticipant.bukti_transfer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Lihat Bukti Transfer (PDF)</span>
                    </a>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status Verifikasi</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedParticipant.status_verifikasi)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Daftar</label>
                  <p className="text-base">
                    {new Date(selectedParticipant.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedParticipant.status_verifikasi !== 'verified' && (
                  <Button
                    onClick={() => updateStatus(selectedParticipant.id, 'verified')}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Verifikasi</span>
                  </Button>
                )}
                {selectedParticipant.status_verifikasi !== 'rejected' && (
                  <Button
                    onClick={() => updateStatus(selectedParticipant.id, 'rejected')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    <span>Tolak</span>
                  </Button>
                )}
                {selectedParticipant.status_verifikasi !== 'pending' && (
                  <Button
                    onClick={() => updateStatus(selectedParticipant.id, 'pending')}
                    variant="outline"
                    className="flex-1"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Pending</span>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {deleteConfirm && (
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Peserta?</AlertDialogTitle>
              <AlertDialogDescription>
                Anda yakin ingin menghapus peserta{' '}
                <strong>{deleteConfirm.nama_lengkap}</strong>? Tindakan ini tidak dapat
                dibatalkan dan akan menghapus bukti transfer dari S3.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteParticipant(deleteConfirm.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
