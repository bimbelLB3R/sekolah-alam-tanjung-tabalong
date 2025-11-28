import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Loader2,
  Search,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  Eye,
  Filter,
  BarChart3,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HARI_INDONESIA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function MonitoringKegiatan() {
  const { toast } = useToast();
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
    // console.log(summary)
  // Filters
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterKelas, setFilterKelas] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const today = new Date();
  const hariIni = HARI_INDONESIA[today.getDay()];

  useEffect(() => {
    fetchActivities();
  }, [filterDate, filterKelas, filterStatus]);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchSummary();
    }
  }, [dateRange]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterDate) params.append('tanggal', filterDate);
      if (filterKelas) params.append('kelas_lengkap', filterKelas);
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(`/api/weekly-activities/monitoring?${params.toString()}`, {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Gagal memuat data monitoring');

      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetch activities:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data monitoring',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await fetch('/api/weekly-activities/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: dateRange.start,
          end_date: dateRange.end,
        }),
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Gagal memuat summary');

      const data = await res.json();
      setSummary(data.data || []);
    } catch (err) {
      console.error('Error fetch summary:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat summary',
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleViewDetail = (activity) => {
    setSelectedActivity(activity);
    setOpenDetailDialog(true);
  };

  const clearFilters = () => {
    setFilterDate(new Date().toISOString().split('T')[0]);
    setFilterKelas('');
    setFilterStatus('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const groupByKelas = (activities) => {
    const grouped = {};
    activities.forEach((act) => {
      if (!grouped[act.kelas_lengkap]) {
        grouped[act.kelas_lengkap] = {
          kelas: act.kelas_lengkap,
          guru: act.guru_nama,
          activities: [],
        };
      }
      grouped[act.kelas_lengkap].activities.push(act);
    });
    return Object.values(grouped);
  };

  const stats = {
    total: activities.length,
    completed: activities.filter((a) => a.status === 'completed').length,
    pending: activities.filter((a) => a.status === 'pending').length,
    withEvaluation: activities.filter((a) => a.evaluasi && a.evaluasi.trim() !== '').length,
  };

  const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Kegiatan Harian</h1>
          <p className="text-gray-500 mt-1">Pantau target dan evaluasi kegiatan seluruh kelas</p>
        </div>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">
            <Calendar className="h-4 w-4 mr-2" />
            Monitoring Harian
          </TabsTrigger>
          <TabsTrigger value="summary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Summary Per Kelas
          </TabsTrigger>
        </TabsList>

        {/* Tab: Monitoring Harian */}
        <TabsContent value="daily" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Total Kegiatan</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Selesai</span>
                </div>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
                <p className="text-xs text-green-600 mt-1">{completionRate}% completion</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-orange-700 mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <p className="text-3xl font-bold text-orange-900">{stats.pending}</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-purple-700 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Ada Evaluasi</span>
                </div>
                <p className="text-3xl font-bold text-purple-900">{stats.withEvaluation}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Input
                    placeholder="Contoh: VII A"
                    value={filterKelas}
                    onChange={(e) => setFilterKelas(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    Reset Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Kegiatan - {filterDate ? formatDate(filterDate) : 'Semua Tanggal'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <p className="text-gray-500 mt-2 text-sm">Memuat data...</p>
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-6">
                  {groupByKelas(activities).map((group) => (
                    <div key={group.kelas} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{group.kelas}</h3>
                          <p className="text-sm text-gray-600">Guru: {group.guru}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {group.activities.length} kegiatan
                          </p>
                          <p className="text-xs text-gray-400">
                            {group.activities.filter((a) => a.status === 'completed').length}{' '}
                            selesai
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {group.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className={`p-3 border rounded-lg ${
                              activity.status === 'completed'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-orange-50 border-orange-200'
                            }`}
                          >
                            <div className="md:flex items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-medium text-gray-600">
                                    {activity.hari}
                                  </span>
                                  {activity.waktu && (
                                    <>
                                      <span className="text-xs text-gray-400">•</span>
                                      <span className="text-xs text-gray-600">
                                        {activity.waktu}
                                      </span>
                                    </>
                                  )}
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded ml-auto ${
                                      activity.status === 'completed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }`}
                                  >
                                    {activity.status === 'completed' ? 'Selesai' : 'Pending'}
                                  </span>
                                </div>
                                <p className="font-medium text-gray-900 mb-2">
                                  {activity.kegiatan}
                                </p>
                                {activity.target_capaian && (
                                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                                    <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{activity.target_capaian}</span>
                                  </div>
                                )}
                                {activity.evaluasi ? (
                                  <div className="mt-2 p-2 bg-white border rounded">
                                    <p className="text-xs font-medium text-gray-700 mb-1">
                                      Evaluasi:
                                    </p>
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                      {activity.evaluasi}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-xs text-yellow-700 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" />
                                      Belum ada evaluasi
                                    </p>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(activity)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Detail
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Tidak ada data</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Coba ubah filter atau tanggal
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Summary Per Kelas */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rentang Waktu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Selesai</Label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Per Kelas</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <p className="text-gray-500 mt-2 text-sm">Memuat summary...</p>
                </div>
              ) : summary.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Kelas
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Guru
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Selesai
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Pending
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Ada Evaluasi
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          % Selesai
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {summary.map((item) => {
                        // console.log('summary:'.item)
                        const completionPct =
                          item.total_kegiatan > 0
                            ? ((item.completed / item.total_kegiatan) * 100).toFixed(1)
                            : 0;
                        return (
                          <tr key={item.kelas_lengkap} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {item.kelas_lengkap}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.guru_nama}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">
                              {item.total_kegiatan}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-green-600 font-medium">
                              {item.completed}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-orange-600 font-medium">
                              {item.pending}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-purple-600 font-medium">
                              {item.with_evaluation}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  completionPct >= 80
                                    ? 'bg-green-100 text-green-700'
                                    : completionPct >= 50
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {completionPct}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                  <BarChart3 className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Belum ada data</p>
                  <p className="text-gray-400 text-sm mt-1">Pilih rentang tanggal</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Kegiatan</DialogTitle>
            <DialogDescription>
              {selectedActivity?.kelas_lengkap} • {selectedActivity?.guru_nama}
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Hari</p>
                  <p className="text-base text-gray-900">{selectedActivity.hari}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tanggal</p>
                  <p className="text-base text-gray-900">
                    {formatDate(selectedActivity.tanggal)}
                  </p>
                </div>
                {selectedActivity.waktu && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Waktu</p>
                    <p className="text-base text-gray-900">{selectedActivity.waktu}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedActivity.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {selectedActivity.status === 'completed' ? 'Selesai' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Kegiatan:</p>
                <p className="text-base text-gray-900">{selectedActivity.kegiatan}</p>
              </div>

              {selectedActivity.target_capaian && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Target Capaian:
                  </p>
                  <p className="text-base text-gray-900">{selectedActivity.target_capaian}</p>
                </div>
              )}

              {selectedActivity.evaluasi ? (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Evaluasi:
                  </p>
                  <p className="text-base text-gray-900">{selectedActivity.evaluasi}</p>
                  {selectedActivity.evaluasi_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Dievaluasi: {new Date(selectedActivity.evaluasi_at).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Kegiatan ini belum dievaluasi oleh guru
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}