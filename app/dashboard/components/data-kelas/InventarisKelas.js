import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Loader2, Plus, MoreVertical, Pencil, Trash2, Package, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const KATEGORI = [
  'Furniture',
  'Elektronik',
  'Alat Tulis',
  'Buku',
  'Olahraga',
  'Kebersihan',
  'Lainnya',
];

const KONDISI = ['Baik', 'Rusak Ringan', 'Rusak Berat'];

const KONDISI_COLORS = {
  'Baik': 'bg-green-100 text-green-700 border-green-200',
  'Rusak Ringan': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Rusak Berat': 'bg-red-100 text-red-700 border-red-200',
};

export default function InventarisKelasTab({ kelasList }) {
  const { toast } = useToast();
  const [inventaris, setInventaris] = useState([]);
  const [filteredInventaris, setFilteredInventaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [filterKategori, setFilterKategori] = useState('all');

  const [formData, setFormData] = useState({
    nama_barang: '',
    kategori: 'Furniture',
    jumlah: '1',
    satuan: 'unit',
    kondisi: 'Baik',
    keterangan: '',
    lokasi: '',
  });

  useEffect(() => {
    fetchInventaris();
  }, [kelasList]);

  useEffect(() => {
    handleFilter();
  }, [filterKategori, inventaris]);

  const fetchInventaris = async () => {
    if (!kelasList?.kelas_lengkap) return;

    try {
      setLoading(true);
      const res = await fetch(
        `/api/inventaris-kelas?kelas_lengkap=${encodeURIComponent(kelasList.kelas_lengkap)}`,
        { cache: 'no-store' }
      );

      if (!res.ok) throw new Error('Gagal memuat data inventaris');

      const data = await res.json();
      setInventaris(data);
      setFilteredInventaris(data);
    } catch (err) {
      console.error('Error fetch inventaris:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data inventaris',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (filterKategori === 'all') {
      setFilteredInventaris(inventaris);
    } else {
      setFilteredInventaris(inventaris.filter(item => item.kategori === filterKategori));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      nama_barang: '',
      kategori: 'Furniture',
      jumlah: '1',
      satuan: 'unit',
      kondisi: 'Baik',
      keterangan: '',
      lokasi: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (item) => {
    setEditMode(true);
    setCurrentId(item.id);
    setFormData({
      nama_barang: item.nama_barang,
      kategori: item.kategori,
      jumlah: String(item.jumlah),
      satuan: item.satuan,
      kondisi: item.kondisi,
      keterangan: item.keterangan || '',
      lokasi: item.lokasi || '',
    });
    setOpenDialog(true);
    setOpenPopover(null);
  };

  const handleSubmit = async () => {
    if (!formData.nama_barang.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Nama barang harus diisi',
      });
      return;
    }

    if (parseInt(formData.jumlah) < 1) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Jumlah harus lebih dari 0',
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        kelas_lengkap: kelasList.kelas_lengkap,
        nama_barang: formData.nama_barang.trim(),
        kategori: formData.kategori,
        jumlah: parseInt(formData.jumlah),
        satuan: formData.satuan.trim(),
        kondisi: formData.kondisi,
        keterangan: formData.keterangan.trim() || null,
        lokasi: formData.lokasi.trim() || null,
      };

      const url = editMode ? `/api/inventaris-kelas?id=${currentId}` : '/api/inventaris-kelas';
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
      fetchInventaris();
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

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Yakin ingin menghapus inventaris ini?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/inventaris-kelas?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghapus data');
      }

      toast({
        title: 'Berhasil',
        description: 'Inventaris berhasil dihapus',
      });

      setOpenPopover(null);
      fetchInventaris();
    } catch (err) {
      console.error('Error delete:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Gagal menghapus data',
      });
    }
  };

  const groupByKategori = (items) => {
    const grouped = {};
    items.forEach((item) => {
      if (!grouped[item.kategori]) {
        grouped[item.kategori] = [];
      }
      grouped[item.kategori].push(item);
    });
    return grouped;
  };

  const getTotalByKondisi = () => {
    const totals = { Baik: 0, 'Rusak Ringan': 0, 'Rusak Berat': 0 };
    inventaris.forEach((item) => {
      totals[item.kondisi] = (totals[item.kondisi] || 0) + parseInt(item.jumlah);
    });
    return totals;
  };

  const kondisiTotals = getTotalByKondisi();
  const groupedInventaris = groupByKategori(filteredInventaris);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-500 mt-2 text-sm">Memuat data inventaris...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">Total Item</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">{inventaris.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-green-700 mb-1">Kondisi Baik</div>
              <p className="text-3xl font-bold text-green-900">{kondisiTotals.Baik}</p>
              <p className="text-xs text-green-600 mt-1">unit</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-yellow-700 mb-1">Rusak Ringan</div>
              <p className="text-3xl font-bold text-yellow-900">{kondisiTotals['Rusak Ringan']}</p>
              <p className="text-xs text-yellow-600 mt-1">unit</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-red-700 mb-1">Rusak Berat</div>
              <p className="text-3xl font-bold text-red-900">{kondisiTotals['Rusak Berat']}</p>
              <p className="text-xs text-red-600 mt-1">unit</p>
            </CardContent>
          </Card>
        </div>

        {/* Header with Filter and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={filterKategori} onValueChange={setFilterKategori}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {KATEGORI.map((kat) => (
                  <SelectItem key={kat} value={kat}>
                    {kat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Inventaris
          </Button>
        </div>

        {/* Inventaris List */}
        {filteredInventaris.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedInventaris).map(([kategori, items]) => (
              <div key={kategori} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">{kategori}</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{item.nama_barang}</h4>
                            <span
                              className={`text-xs px-2 py-1 rounded border ${
                                KONDISI_COLORS[item.kondisi]
                              }`}
                            >
                              {item.kondisi}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                            <span>
                              Jumlah: <span className="font-medium">{item.jumlah} {item.satuan}</span>
                            </span>
                            {item.lokasi && (
                              <span>Lokasi: <span className="font-medium">{item.lokasi}</span></span>
                            )}
                          </div>
                          {item.keterangan && (
                            <p className="text-sm text-gray-500 mt-1">{item.keterangan}</p>
                          )}
                        </div>
                        <Popover
                          open={openPopover === item.id}
                          onOpenChange={(open) => setOpenPopover(open ? item.id : null)}
                        >
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">
              {filterKategori === 'all' ? 'Belum ada inventaris' : `Tidak ada inventaris kategori ${filterKategori}`}
            </p>
            <p className="text-gray-400 text-sm mt-1">Klik tombol Tambah Inventaris untuk memulai</p>
          </div>
        )}

        {/* Dialog Form */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editMode ? 'Edit' : 'Tambah'} Inventaris
              </DialogTitle>
              <DialogDescription>
                {editMode ? 'Perbarui' : 'Tambahkan'} data inventaris kelas {kelasList?.kelas_lengkap}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="nama_barang">Nama Barang *</Label>
                  <Input
                    id="nama_barang"
                    name="nama_barang"
                    placeholder="Contoh: Meja Guru"
                    value={formData.nama_barang}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kategori *</Label>
                  <Select value={formData.kategori} onValueChange={(val) => handleSelectChange('kategori', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KATEGORI.map((kat) => (
                        <SelectItem key={kat} value={kat}>
                          {kat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kondisi *</Label>
                  <Select value={formData.kondisi} onValueChange={(val) => handleSelectChange('kondisi', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KONDISI.map((kond) => (
                        <SelectItem key={kond} value={kond}>
                          {kond}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jumlah">Jumlah *</Label>
                  <Input
                    id="jumlah"
                    name="jumlah"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.jumlah}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="satuan">Satuan</Label>
                  <Input
                    id="satuan"
                    name="satuan"
                    placeholder="unit, buah, set, dll"
                    value={formData.satuan}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="lokasi">Lokasi</Label>
                  <Input
                    id="lokasi"
                    name="lokasi"
                    placeholder="Contoh: Pojok kanan depan"
                    value={formData.lokasi}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <Textarea
                    id="keterangan"
                    name="keterangan"
                    placeholder="Informasi tambahan (opsional)"
                    rows={3}
                    value={formData.keterangan}
                    onChange={handleChange}
                  />
                </div>
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
              <Button type="button" onClick={handleSubmit} disabled={submitting}>
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
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}