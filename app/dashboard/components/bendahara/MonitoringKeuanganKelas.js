import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  Eye,
  RefreshCw,
  ArrowUpDown,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function MonitoringKeuanganDirektur() {
  const { toast } = useToast();
  const [dataKeuangan, setDataKeuangan] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [detailTransaksi, setDetailTransaksi] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'kelas_lengkap', direction: 'asc' });

  useEffect(() => {
    fetchKeuanganSummary();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, dataKeuangan]);

  const fetchKeuanganSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/keuangan-kelas/summary', {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Gagal memuat data keuangan');

      const data = await res.json();
      setDataKeuangan(data);
      setFilteredData(data);
    } catch (err) {
      console.error('Error fetch keuangan summary:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data keuangan',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailTransaksi = async (kelasLengkap) => {
    try {
      setLoadingDetail(true);
      const res = await fetch(
        `/api/keuangan-kelas?kelas_lengkap=${encodeURIComponent(kelasLengkap)}`,
        { cache: 'no-store' }
      );

      if (!res.ok) throw new Error('Gagal memuat detail transaksi');

      const data = await res.json();
      setDetailTransaksi(data);
    } catch (err) {
      console.error('Error fetch detail:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat detail transaksi',
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredData(dataKeuangan);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = dataKeuangan.filter(
      (item) =>
        item.kelas_lengkap?.toLowerCase().includes(query) ||
        item.wali_kelas?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[key] || 0;
      const bVal = b[key] || 0;

      if (key === 'kelas_lengkap' || key === 'wali_kelas') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    setFilteredData(sorted);
    setSortConfig({ key, direction });
  };

  const handleViewDetail = (kelas) => {
    setSelectedKelas(kelas);
    setOpenDialog(true);
    fetchDetailTransaksi(kelas.kelas_lengkap);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate grand totals
  const grandTotalMasuk = dataKeuangan.reduce((sum, item) => sum + (parseFloat(item.total_masuk) || 0), 0);
  const grandTotalKeluar = dataKeuangan.reduce((sum, item) => sum + (parseFloat(item.total_keluar) || 0), 0);
  const grandSaldo = grandTotalMasuk - grandTotalKeluar;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="text-gray-500 mt-4">Memuat data keuangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Keuangan Kelas</h1>
          <p className="text-gray-500 mt-1">Pantau keuangan seluruh kelas secara real-time</p>
        </div>
        <Button onClick={fetchKeuanganSummary} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Grand Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">Total Kelas</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{dataKeuangan.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Total Kas Masuk</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(grandTotalMasuk)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">Total Kas Keluar</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(grandTotalKeluar)}</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${
          grandSaldo >= 0
            ? 'from-blue-50 to-blue-100 border-blue-200'
            : 'from-orange-50 to-orange-100 border-orange-200'
        }`}>
          <CardContent className="pt-6">
            <div className={`flex items-center gap-2 mb-1 ${
              grandSaldo >= 0 ? 'text-blue-700' : 'text-orange-700'
            }`}>
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium">Total Saldo</span>
            </div>
            <p className={`text-2xl font-bold ${
              grandSaldo >= 0 ? 'text-blue-900' : 'text-orange-900'
            }`}>
              {formatCurrency(grandSaldo)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari kelas atau wali kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Keuangan Per Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('kelas_lengkap')}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Kelas
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('wali_kelas')}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          Wali Kelas
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleSort('total_transaksi')}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 mx-auto"
                        >
                          Transaksi
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSort('total_masuk')}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                        >
                          Kas Masuk
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSort('total_keluar')}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                        >
                          Kas Keluar
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSort('saldo')}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 ml-auto"
                        >
                          Saldo
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => {
                      const saldo = (parseFloat(item.total_masuk) || 0) - (parseFloat(item.total_keluar) || 0);
                      return (
                        <tr key={item.kelas_lengkap} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {item.kelas_lengkap}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.wali_kelas || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-900">
                            {item.total_transaksi || 0}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                            {formatCurrency(item.total_masuk || 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                            {formatCurrency(item.total_keluar || 0)}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-bold ${
                            saldo >= 0 ? 'text-blue-600' : 'text-orange-600'
                          }`}>
                            {formatCurrency(saldo)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(item)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Detail
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
              <Wallet className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Tidak ada data keuangan</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery ? 'Coba kata kunci lain' : 'Belum ada transaksi keuangan'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Transaksi - {selectedKelas?.kelas_lengkap}</DialogTitle>
            <DialogDescription>
              Wali Kelas: {selectedKelas?.wali_kelas || '-'}
            </DialogDescription>
          </DialogHeader>

          {loadingDetail ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">Memuat detail transaksi...</p>
            </div>
          ) : detailTransaksi.length > 0 ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Kas Masuk</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(
                      detailTransaksi.reduce((sum, t) => sum + (parseFloat(t.kas_masuk) || 0), 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Kas Keluar</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(
                      detailTransaksi.reduce((sum, t) => sum + (parseFloat(t.kas_keluar) || 0), 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Saldo</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(
                      detailTransaksi.reduce((sum, t) => sum + (parseFloat(t.kas_masuk) || 0) - (parseFloat(t.kas_keluar) || 0), 0)
                    )}
                  </p>
                </div>
              </div>

              {/* Transactions */}
              <div className="space-y-2">
                {detailTransaksi.map((transaksi) => (
                  <div
                    key={transaksi.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{transaksi.keterangan}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(transaksi.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        {transaksi.kas_masuk > 0 && (
                          <p className="text-lg font-bold text-green-600">
                            +{formatCurrency(transaksi.kas_masuk)}
                          </p>
                        )}
                        {transaksi.kas_keluar > 0 && (
                          <p className="text-lg font-bold text-red-600">
                            -{formatCurrency(transaksi.kas_keluar)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Belum ada transaksi</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}