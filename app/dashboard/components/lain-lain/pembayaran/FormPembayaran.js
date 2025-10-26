// components/pembayaran/FormPembayaran.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';

export default function FormPembayaran() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    siswa_id: '',
    nama_lengkap: '',
    siswa_kelas_id: '',
    kelas_saatini: '',
    tahun_ajaran: '',
    jenis_pembayaran: '',
    jml_bayar: '',
    tgl_bayar: new Date().toISOString().split('T')[0],
    cara_bayar: '',
    penerima: '',
    keterangan: '',
  });

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearchSiswa(searchQuery);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search siswa
  const handleSearchSiswa = async (query) => {
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/pembayaran_siswa/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.success) {
        setSearchResults(data.data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Error searching siswa:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal mencari data siswa',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Get kelas aktif siswa
  const handleSelectSiswa = async (siswa) => {
    setSearchQuery(siswa.nama_lengkap);
    setFormData(prev => ({
      ...prev,
      siswa_id: siswa.siswa_id,
      nama_lengkap: siswa.nama_lengkap,
    }));
    setShowDropdown(false);

    // Get kelas aktif
    try {
      const res = await fetch(`/api/pembayaran_siswa/kelas-aktif?siswa_id=${siswa.siswa_id}`);
      const data = await res.json();
      
      if (data.success) {
        const kelasData = data.data;
        setFormData(prev => ({
          ...prev,
          siswa_kelas_id: kelasData.siswa_kelas_id,
          kelas_saatini: `${kelasData.kelas_lengkap}`,
          tahun_ajaran: kelasData.tahun_ajaran,
        }));
      } else {
        toast({
          variant: 'destructive',
          title: 'Peringatan',
          description: data.message || 'Kelas aktif tidak ditemukan',
        });
      }
    } catch (error) {
      console.error('Error getting kelas aktif:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal mengambil data kelas siswa',
      });
    }
  };

  // Clear siswa selection
  const handleClearSiswa = () => {
    setSearchQuery('');
    setFormData(prev => ({
      ...prev,
      siswa_id: '',
      nama_lengkap: '',
      siswa_kelas_id: '',
      kelas_saatini: '',
      tahun_ajaran: '',
    }));
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Handle form change
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.siswa_id) {
      toast({
        variant: 'destructive',
        title: 'Validasi Error',
        description: 'Pilih siswa terlebih dahulu',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pembayaran_siswa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siswa_id: formData.siswa_id,
          siswa_kelas_id: formData.siswa_kelas_id,
          tahun_ajaran: formData.tahun_ajaran,
          jenis_pembayaran: formData.jenis_pembayaran,
          jml_bayar: parseFloat(formData.jml_bayar),
          tgl_bayar: formData.tgl_bayar,
          cara_bayar: formData.cara_bayar,
          penerima: formData.penerima,
          keterangan: formData.keterangan,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: 'Berhasil',
          description: 'Pembayaran berhasil disimpan',
        });
        
        // Reset form
        setSearchQuery('');
        setFormData({
          siswa_id: '',
          nama_lengkap: '',
          siswa_kelas_id: '',
          kelas_saatini: '',
          tahun_ajaran: '',
          jenis_pembayaran: '',
          jml_bayar: '',
          tgl_bayar: new Date().toISOString().split('T')[0],
          cara_bayar: '',
          penerima: '',
          keterangan: '',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.message || 'Gagal menyimpan pembayaran',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Terjadi kesalahan saat menyimpan data',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Form Pembayaran Siswa</CardTitle>
        <CardDescription>
          Masukkan data pembayaran siswa dengan lengkap
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Autocomplete Siswa */}
          <div className="space-y-2" ref={dropdownRef}>
            <Label htmlFor="siswa">Nama Siswa *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="siswa"
                placeholder="Ketik minimal 2 huruf untuk mencari siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
                disabled={loading}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSiswa}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {searchLoading && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              
              {/* Dropdown Results */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((siswa) => (
                    <button
                      key={siswa.siswa_id}
                      type="button"
                      onClick={() => handleSelectSiswa(siswa)}
                      className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground border-b last:border-b-0 transition-colors"
                    >
                      <div className="font-medium">{siswa.nama_lengkap}</div>
                      <div className="text-sm text-muted-foreground">NIK: {siswa.nik}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {showDropdown && searchResults.length === 0 && searchQuery.length >= 2 && !searchLoading && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg p-4 text-center text-muted-foreground">
                  Tidak ada siswa ditemukan
                </div>
              )}
            </div>
          </div>

          {/* Info Kelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kelas">Kelas Saat Ini</Label>
              <Input
                id="kelas"
                value={formData.kelas_saatini}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
              <Input
                id="tahun_ajaran"
                value={formData.tahun_ajaran}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {/* Jenis Pembayaran */}
          <div className="space-y-2">
            <Label htmlFor="jenis_pembayaran">Jenis Pembayaran *</Label>
            <Select
              value={formData.jenis_pembayaran}
              onValueChange={(value) => handleChange('jenis_pembayaran', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPP">SPP</SelectItem>
                <SelectItem value="Uang Pangkal">Uang Pangkal</SelectItem>
                <SelectItem value="Uang Gedung">Uang Gedung</SelectItem>
                <SelectItem value="Uang Seragam">Uang Seragam</SelectItem>
                <SelectItem value="Uang Buku">Uang Buku</SelectItem>
                <SelectItem value="Uang Kegiatan">Uang Kegiatan</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Jumlah Bayar & Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jml_bayar">Jumlah Bayar (Rp) *</Label>
              <Input
                id="jml_bayar"
                type="number"
                placeholder="0"
                value={formData.jml_bayar}
                onChange={(e) => handleChange('jml_bayar', e.target.value)}
                disabled={loading}
                min="0"
                step="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tgl_bayar">Tanggal Bayar *</Label>
              <Input
                id="tgl_bayar"
                type="date"
                value={formData.tgl_bayar}
                onChange={(e) => handleChange('tgl_bayar', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Cara Bayar & Penerima */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cara_bayar">Cara Bayar *</Label>
              <Select
                value={formData.cara_bayar}
                onValueChange={(value) => handleChange('cara_bayar', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih cara bayar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="penerima">Penerima *</Label>
              <Input
                id="penerima"
                placeholder="Nama penerima pembayaran"
                value={formData.penerima}
                onChange={(e) => handleChange('penerima', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Keterangan */}
          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Keterangan tambahan (opsional)"
              value={formData.keterangan}
              onChange={(e) => handleChange('keterangan', e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !formData.siswa_id}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Menyimpan...' : 'Simpan Pembayaran'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setFormData({
                  siswa_id: '',
                  nama_lengkap: '',
                  siswa_kelas_id: '',
                  kelas_saatini: '',
                  tahun_ajaran: '',
                  jenis_pembayaran: '',
                  jml_bayar: '',
                  tgl_bayar: new Date().toISOString().split('T')[0],
                  cara_bayar: '',
                  penerima: '',
                  keterangan: '',
                });
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}