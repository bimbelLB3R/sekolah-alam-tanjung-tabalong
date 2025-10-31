"use client"
import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Filter, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const validateJurnal = (data) => {
  const errors = {};
  
  if (!data.tanggal) errors.tanggal = 'Tanggal harus diisi';
  if (!data.kode_transaksi) errors.kode_transaksi = 'Kode transaksi harus diisi';
  if (!data.deskripsi) errors.deskripsi = 'Deskripsi harus diisi';
  if (!data.jenis_transaksi) errors.jenis_transaksi = 'Jenis transaksi harus dipilih';
  if (!data.jumlah || data.jumlah <= 0) errors.jumlah = 'Jumlah harus lebih dari 0';
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

const JurnalHarianKas = () => {
  const { toast } = useToast();
  const [jurnal, setJurnal] = useState([]);
  const [summary, setSummary] = useState({ totalMasuk: 0, totalKeluar: 0, saldo: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('SEMUA');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kode_transaksi: '',
    deskripsi: '',
    kategori: '',
    jenis_transaksi: 'MASUK',
    jumlah: '',
    keterangan: ''
  });
  
  const [errors, setErrors] = useState({});

  // Fetch data dari API
  const fetchJurnal = async () => {
    try {
      setIsRefreshing(true);
      const params = new URLSearchParams();
      if (filterJenis !== 'SEMUA') params.append('jenis', filterJenis);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/jurnal?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setJurnal(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal memuat data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal terhubung ke server",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/jurnal/summary');
      const result = await response.json();
      
      if (result.success) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    fetchJurnal();
    fetchSummary();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchJurnal();
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm, filterJenis]);

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      kode_transaksi: '',
      deskripsi: '',
      kategori: '',
      jenis_transaksi: 'MASUK',
      jumlah: '',
      keterangan: ''
    });
    setErrors({});
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateJurnal(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = isEditing ? '/api/jurnal' : '/api/jurnal';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = isEditing 
        ? { ...formData, id: currentId, jumlah: parseFloat(formData.jumlah) }
        : { ...formData, jumlah: parseFloat(formData.jumlah) };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Berhasil",
          description: isEditing ? "Data berhasil diperbarui" : "Data berhasil ditambahkan",
        });
        
        setIsDialogOpen(false);
        resetForm();
        fetchJurnal();
        fetchSummary();
      } else {
        toast({
          title: "Error",
          description: result.error || "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal terhubung ke server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      tanggal: item.tanggal,
      kode_transaksi: item.kode_transaksi,
      deskripsi: item.deskripsi,
      kategori: item.kategori || '',
      jenis_transaksi: item.jenis_transaksi,
      jumlah: item.jumlah.toString(),
      keterangan: item.keterangan || ''
    });
    setCurrentId(item.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const response = await fetch(`/api/jurnal?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Data berhasil dihapus",
        });
        fetchJurnal();
        fetchSummary();
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal menghapus data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal terhubung ke server",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Jurnal Harian Kas</h1>
            <p className="text-slate-600 mt-1">Bendahara Sekolah</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                fetchJurnal();
                fetchSummary();
              }}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Transaksi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{isEditing ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</DialogTitle>
                  <DialogDescription>
                    Isi form di bawah untuk {isEditing ? 'memperbarui' : 'menambahkan'} transaksi kas
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tanggal">Tanggal *</Label>
                      <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                        className={errors.tanggal ? 'border-red-500' : ''}
                      />
                      {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="kode_transaksi">Kode Transaksi *</Label>
                      <Input
                        id="kode_transaksi"
                        placeholder="KM-001 atau KK-001"
                        value={formData.kode_transaksi}
                        onChange={(e) => setFormData({...formData, kode_transaksi: e.target.value})}
                        className={errors.kode_transaksi ? 'border-red-500' : ''}
                      />
                      {errors.kode_transaksi && <p className="text-red-500 text-sm mt-1">{errors.kode_transaksi}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deskripsi">Deskripsi *</Label>
                    <Input
                      id="deskripsi"
                      placeholder="Contoh: Penerimaan SPP Siswa"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      className={errors.deskripsi ? 'border-red-500' : ''}
                    />
                    {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="kategori">Kategori</Label>
                      <Input
                        id="kategori"
                        placeholder="SPP, Dana BOS, Gaji, ATK, dll"
                        value={formData.kategori}
                        onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="jenis_transaksi">Jenis Transaksi *</Label>
                      <Select
                        value={formData.jenis_transaksi}
                        onValueChange={(value) => setFormData({...formData, jenis_transaksi: value})}
                      >
                        <SelectTrigger className={errors.jenis_transaksi ? 'border-red-500' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MASUK">Kas Masuk</SelectItem>
                          <SelectItem value="KELUAR">Kas Keluar</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.jenis_transaksi && <p className="text-red-500 text-sm mt-1">{errors.jenis_transaksi}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="jumlah">Jumlah (Rp) *</Label>
                    <Input
                      id="jumlah"
                      type="number"
                      placeholder="0"
                      value={formData.jumlah}
                      onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                      className={errors.jumlah ? 'border-red-500' : ''}
                    />
                    {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah}</p>}
                  </div>

                  <div>
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Textarea
                      id="keterangan"
                      placeholder="Catatan tambahan (opsional)"
                      value={formData.keterangan}
                      onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }} disabled={isLoading}>
                      Batal
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Kas Masuk</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalMasuk)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Kas Keluar</CardTitle>
              <TrendingDown className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalKeluar)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Saldo</CardTitle>
              <Wallet className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(summary.saldo)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <CardTitle>Daftar Transaksi</CardTitle>
                <CardDescription>Riwayat transaksi kas masuk dan keluar</CardDescription>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Cari transaksi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterJenis} onValueChange={setFilterJenis}>
                  <SelectTrigger className="w-full md:w-40">
                    <div className="flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMUA">Semua</SelectItem>
                    <SelectItem value="MASUK">Kas Masuk</SelectItem>
                    <SelectItem value="KELUAR">Kas Keluar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
            <CardContent>
            <div className="rounded-md border overflow-x-auto">
                <div className="min-w-full">
                {/* Header — hanya tampil di layar ≥ sm */}
                <div className="bg-slate-50 border-b hidden sm:block">
                    <div className="grid grid-cols-7 gap-4 p-3 text-sm font-medium text-slate-600">
                    <div>Tanggal</div>
                    <div>Kode</div>
                    <div>Deskripsi</div>
                    <div>Kategori</div>
                    <div>Jenis</div>
                    <div className="text-right">Jumlah</div>
                    <div className="text-center">Aksi</div>
                    </div>
                </div>

                <div>
                    {isRefreshing ? (
                    <div className="p-8 text-center text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Memuat data...
                    </div>
                    ) : jurnal.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        Belum ada transaksi
                    </div>
                    ) : (
                    jurnal.map((item) => (
                        <div
                        key={item.id}
                        className="grid grid-cols-2 sm:grid-cols-7 gap-4 p-3 border-b hover:bg-slate-50 items-center text-sm"
                        >
                        {/* Kolom mobile label + value */}
                        <div className="sm:hidden font-medium text-slate-500">Tanggal:</div>
                        <div className="whitespace-nowrap">{formatDate(item.tanggal)}</div>

                        <div className="sm:hidden font-medium text-slate-500">Kode:</div>
                        <div className="font-mono">{item.kode_transaksi}</div>

                        <div className="sm:hidden font-medium text-slate-500">Deskripsi:</div>
                        <div>{item.deskripsi}</div>

                        <div className="sm:hidden font-medium text-slate-500">Kategori:</div>
                        <div>{item.kategori || '-'}</div>

                        <div className="sm:hidden font-medium text-slate-500">Jenis:</div>
                        <div>
                            <Badge
                            variant={item.jenis_transaksi === 'MASUK' ? 'default' : 'destructive'}
                            className="text-xs"
                            >
                            {item.jenis_transaksi}
                            </Badge>
                        </div>

                        <div className="sm:hidden font-medium text-slate-500">Jumlah:</div>
                        <div
                            className={`text-right font-semibold ${
                            item.jenis_transaksi === 'MASUK'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                        >
                            {formatCurrency(item.jumlah)}
                        </div>

                        <div className="sm:hidden font-medium text-slate-500">Aksi:</div>
                        <div className="flex gap-2 justify-start sm:justify-center">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
                            >
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        </div>
                    ))
                    )}
                </div>
                </div>
            </div>
        </CardContent>

        </Card>
      </div>
    </div>
  );
};

export default JurnalHarianKas;