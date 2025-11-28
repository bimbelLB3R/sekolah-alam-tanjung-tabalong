import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, CheckCircle2, Circle, Clock, Target, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HARI_INDONESIA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function DailyTodoList({ guruData }) {
  const { toast } = useToast();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [evaluasi, setEvaluasi] = useState('');
  const [submitting, setSubmitting] = useState(false);

//   const today = new Date();
//   const todayStr = today.toISOString();
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const todayStr = `${year}-${month}-${day}`;
  const hariIni = HARI_INDONESIA[today.getDay()];

  // console.log(activities)

  useEffect(() => {
    fetchTodayActivities();
  }, []);

  const fetchTodayActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/weekly-activities?tanggal=${todayStr}&guru_id=${guruData.id}`,
        { cache: 'no-store' }
      );

      if (!res.ok) throw new Error('Gagal memuat kegiatan hari ini');

      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetch activities:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat kegiatan hari ini',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEvaluasi = (activity) => {
    setSelectedActivity(activity);
    setEvaluasi(activity.evaluasi || '');
    setOpenDialog(true);
  };

  const handleSubmitEvaluasi = async () => {
    if (!evaluasi.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Evaluasi harus diisi',
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`/api/weekly-activities?id=${selectedActivity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluasi: evaluasi.trim(),
          status: 'completed',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan evaluasi');
      }

      toast({
        title: 'Berhasil',
        description: 'Evaluasi berhasil disimpan',
      });

      setOpenDialog(false);
      fetchTodayActivities();
    } catch (err) {
      console.error('Error submit evaluasi:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Gagal menyimpan evaluasi',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-500 mt-2 text-sm">Memuat kegiatan hari ini...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{hariIni}</h2>
              <p className="text-gray-600">{formatDate(todayStr)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Total Kegiatan</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Selesai</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              {activities.filter(a => a.status === 'completed').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-700 mb-1">
              <Circle className="h-4 w-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {activities.filter(a => a.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Kegiatan Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-4 border rounded-lg transition-all ${
                    activity.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {activity.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="md:flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {activity.kelas_lengkap}
                            </span>
                            {activity.waktu && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.waktu}
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-gray-900 mb-2">
                            {activity.kegiatan}
                          </p>
                          {activity.target_capaian && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{activity.target_capaian}</span>
                            </div>
                          )}
                          {activity.evaluasi && (
                            <div className="mt-3 p-3 bg-white border border-green-200 rounded">
                              <p className="text-xs font-medium text-green-700 mb-1">Evaluasi:</p>
                              <p className="text-sm text-gray-700">{activity.evaluasi}</p>
                              {activity.tanggal_evaluasi && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Dievaluasi: {new Date(activity.tanggal_evaluasi).toLocaleString('id-ID')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleOpenEvaluasi(activity)}
                          variant={activity.status === 'completed' ? 'outline' : 'default'}
                        >
                          {activity.status === 'completed' ? 'Edit Evaluasi' : 'Beri Evaluasi'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Tidak ada kegiatan hari ini</p>
              <p className="text-gray-400 text-sm mt-1">Buat weekly plan untuk menambahkan kegiatan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Evaluasi */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Evaluasi Kegiatan</DialogTitle>
            <DialogDescription>
              Berikan evaluasi untuk kegiatan yang telah dilaksanakan
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                    {selectedActivity.kelas_lengkap}
                  </span>
                  {selectedActivity.waktu && (
                    <span className="text-xs text-gray-500">• {selectedActivity.waktu}</span>
                  )}
                </div>
                <p className="font-medium text-gray-900">{selectedActivity.kegiatan}</p>
                {selectedActivity.target_capaian && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedActivity.target_capaian}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluasi">Evaluasi *</Label>
                <Textarea
                  id="evaluasi"
                  placeholder="Tuliskan hasil evaluasi kegiatan ini..."
                  rows={6}
                  value={evaluasi}
                  onChange={(e) => setEvaluasi(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDialog(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button type="button" onClick={handleSubmitEvaluasi} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Evaluasi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}