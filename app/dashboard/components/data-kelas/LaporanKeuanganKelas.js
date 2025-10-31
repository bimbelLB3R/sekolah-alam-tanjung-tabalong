import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, MoreVertical, Pencil, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LaporanKeuanganTab({ kelasList }) {
  const { toast } = useToast();
  const [dataKeuangan, setDataKeuangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    kas_masuk: '',
    kas_keluar: '',
    keterangan: '',
  });

  // Fetch data keuangan
  useEffect(() => {
    fetchKeuangan();
  }, [kelasList]);

  const fetchKeuangan = async () => {
    if (!kelasList?.kelas_lengkap) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/keuangan-kelas?kelas_lengkap=${encodeURIComponent(kelasList.kelas_lengkap)}`,
        { cache: 'no-store' }
      );

      if (!res.ok) throw new Error('Gagal memuat data keuangan');

      const data = await res.json();
      setDataKeuangan(data);
    } catch (err) {
      console.error('Error fetch keuangan:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data keuangan',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open dialog for add
  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({ kas_masuk: '', kas_keluar: '', keterangan: '' });
    setOpenDialog(true);
  };

  // Open dialog for edit
  const handleOpenEdit = (item) => {
    setEditMode(true);
    setCurrentId(item.id);
    setFormData({
      kas_masuk: item.kas_masuk || '',
      kas_keluar: item.kas_keluar || '',
      keterangan: item.keterangan || '',
    });
    setOpenDialog(true);
    setOpenPopover(null);
  };

  // Submit form (add/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const kasMasuk = parseFloat(formData.kas_masuk) || 0;
    const kasKeluar = parseFloat(formData.kas_keluar) || 0;

    if (kasMasuk === 0 && kasKeluar === 0) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Kas masuk atau kas keluar harus diisi',
      });
      return;
    }

    if (!formData.keterangan.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Keterangan harus diisi',
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        kelas_lengkap: kelasList.kelas_lengkap,
        wali_kelas: kelasList.wali_kelas_nama,
        kas_masuk: kasMasuk,
        kas_keluar: kasKeluar,
        keterangan: formData.keterangan.trim(),
      };

      const url = editMode ? `/api/keuangan-kelas?id=${currentId}` : '/api/keuangan-kelas';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan data');
      }

      toast({
        title: 'Berhasil',
        description: editMode ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan',
      });

      setOpenDialog(false);
      fetchKeuangan();
    } catch (err) {
      console.error('Error submit:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Gagal menyimpan data',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Yakin ingin menghapus data ini?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/keuangan-kelas?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghapus data');
      }

      toast({
        title: 'Berhasil',
        description: 'Data berhasil dihapus',
      });

      setOpenPopover(null);
      fetchKeuangan();
    } catch (err) {
      console.error('Error delete:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Gagal menghapus data',
      });
    }
  };

  // Calculate total
  const totalMasuk = dataKeuangan.reduce((sum, item) => sum + (parseFloat(item.kas_masuk) || 0), 0);
  const totalKeluar = dataKeuangan.reduce((sum, item) => sum + (parseFloat(item.kas_keluar) || 0), 0);
  const saldo = totalMasuk - totalKeluar;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-500 mt-2 text-sm">Memuat data keuangan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Total Kas Masuk</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(totalMasuk)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">Total Kas Keluar</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(totalKeluar)}</p>
          </div>

          <div className={`bg-gradient-to-br p-4 rounded-lg border ${
            saldo >= 0 
              ? 'from-blue-50 to-blue-100 border-blue-200' 
              : 'from-orange-50 to-orange-100 border-orange-200'
          }`}>
            <div className={`flex items-center gap-2 mb-1 ${saldo >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium">Saldo</span>
            </div>
            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              {formatCurrency(saldo)}
            </p>
          </div>
        </div>

        {/* Header with Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Riwayat Transaksi</h3>
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Input Data
          </Button>
        </div>

        {/* Table */}
        {dataKeuangan.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kas Masuk
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kas Keluar
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataKeuangan.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.keterangan}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                        {item.kas_masuk > 0 ? formatCurrency(item.kas_masuk) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                        {item.kas_keluar > 0 ? formatCurrency(item.kas_keluar) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <Popover open={openPopover === item.id} onOpenChange={(open) => setOpenPopover(open ? item.id : null)}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-40 p-2" align="end">
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start"
                                onClick={() => handleOpenEdit(item)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <Wallet className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Belum ada data keuangan</p>
            <p className="text-gray-400 text-sm mt-1">Klik tombol Input Data untuk memulai</p>
          </div>
        )}

        {/* Dialog Form */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Data Keuangan' : 'Input Data Keuangan'}</DialogTitle>
              <DialogDescription>
                Masukkan data transaksi keuangan kelas {kelasList?.kelas_lengkap}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="kas_masuk">Kas Masuk (Rp)</Label>
                  <Input
                    id="kas_masuk"
                    name="kas_masuk"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.kas_masuk}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kas_keluar">Kas Keluar (Rp)</Label>
                  <Input
                    id="kas_keluar"
                    name="kas_keluar"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.kas_keluar}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keterangan">Keterangan *</Label>
                  <Textarea
                    id="keterangan"
                    name="keterangan"
                    placeholder="Contoh: Iuran kelas bulan Januari"
                    rows={3}
                    value={formData.keterangan}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}