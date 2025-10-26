"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, FileText, AlertCircle, Mail, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate } from '@/lib/formatDate';
export default function BendaharaPage() {
  const [dataIjin, setDataIjin] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });

  console.log(dataIjin)

  // Fetch data dari API
  const fetchData = async (offset = 0) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/ijin-karyawan?limit=${pagination.limit}&offset=${offset}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengambil data');
      }

      setDataIjin(result.data);
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

  // Handle load more
  const handleLoadMore = () => {
    fetchData(pagination.offset + pagination.limit);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchData(0);
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
            onClick={handleRefresh} 
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {dataIjin.map((ijin) => (
            <Card key={ijin.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">
                      {ijin.nama_karyawan}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3" />
                      {ijin.email_karyawan}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={ijin.jenis_ijin === 'keluar' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {ijin.jenis_ijin === 'keluar' ? 'Ijin Keluar' : 'Ijin Tidak Masuk'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-slate-500 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Tanggal Ijin</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(ijin.tanggal_ijin).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {ijin.jenis_ijin === 'keluar' && ijin.jam_keluar && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-slate-500 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Waktu Keluar/Kembali</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {ijin.jam_keluar} - {ijin.jam_kembali}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-slate-500 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Tanggal dibuat</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {formatDate(ijin.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:col-span-2">
                    <FileText className="w-4 h-4 text-slate-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-medium mb-1">Alasan Ijin</p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {ijin.alasan_ijin}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`w-5 h-5 ${ijin.dipotong_tunjangan ? 'text-red-500' : 'text-green-500'}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Status Tunjangan
                      </p>
                      <p className={`text-xs ${ijin.dipotong_tunjangan ? 'text-red-600' : 'text-green-600'}`}>
                        {ijin.dipotong_tunjangan ? 'Dipotong' : 'Tidak Dipotong'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isUpdating === ijin.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                    )}
                    <label 
                      htmlFor={`switch-${ijin.id}`}
                      className="text-sm font-medium text-slate-700 cursor-pointer"
                    >
                      Potong Tunjangan
                    </label>
                    <Switch
                      id={`switch-${ijin.id}`}
                      checked={ijin.dipotong_tunjangan}
                      onCheckedChange={() => handleTogglePotongTunjangan(ijin.id, ijin.dipotong_tunjangan)}
                      disabled={isUpdating === ijin.id}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {dataIjin.length === 0 && !isLoading && (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              Tidak ada data ijin yang perlu divalidasi
            </p>
          </Card>
        )}

        {pagination.hasMore && (
          <div className="mt-6 text-center">
            <Button 
              onClick={handleLoadMore}
              disabled={isLoading}
              variant="outline"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memuat...
                </>
              ) : (
                'Muat Lebih Banyak'
              )}
            </Button>
            <p className="text-sm text-slate-500 mt-2">
              Menampilkan {dataIjin.length} dari {pagination.total} data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}