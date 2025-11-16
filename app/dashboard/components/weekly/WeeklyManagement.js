

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Plus, Calendar, List, Trash2, Eye, Edit, PlusCircle, Download, FileSpreadsheet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import WeeklyPlanForm from './WeeklyPlanForm';
import DailyTodoList from './DailyTodoList';
import WeeklyPlanPDF from './WeeklyPlansPdf';
import { pdf } from '@react-pdf/renderer';
import { exportWeeklyPlanToExcel } from './WeeklyPlansExcel';

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function WeeklyManagement({ guruData }) {
  const { toast } = useToast();
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [activityMode, setActivityMode] = useState('add'); // 'add' or 'edit'
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [submitting, setSubmitting] = useState(false);
   const [exportingPDF, setExportingPDF] = useState(false);
   const [exportingExcel, setExportingExcel] = useState(false);


  const [activityForm, setActivityForm] = useState({
    hari: 'Senin',
    tanggal: '',
    waktu: '',
    kegiatan: '',
    target_capaian: '',
  });

  useEffect(() => {
    fetchWeeklyPlans();
  }, []);

  const fetchWeeklyPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/weekly-plans?guru_id=${guruData.id}`, {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Gagal memuat weekly plans');

      const data = await res.json();
      setWeeklyPlans(data);
    } catch (err) {
      console.error('Error fetch weekly plans:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat weekly plans',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (planId) => {
    try {
      const res = await fetch(`/api/weekly-plans?id=${planId}`, {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Gagal memuat detail weekly plan');

      const data = await res.json();
      setSelectedPlan(data);
      setOpenDetailDialog(true);
    } catch (err) {
      console.error('Error fetch detail:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat detail weekly plan',
      });
    }
  };

  const handleExportPDF = async (planId) => {
    try {
      setExportingPDF(true);
      
      // Fetch detail plan jika belum ada
      const res = await fetch(`/api/weekly-plans?id=${planId}`, {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Gagal memuat detail weekly plan');

      const planData = await res.json();

      // Generate PDF
      const blob = await pdf(<WeeklyPlanPDF planData={planData} />).toBlob();
      
      // Download PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Weekly-Plan-${planData.kelas_lengkap}-Minggu-${planData.minggu_ke}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: 'Berhasil',
        description: 'PDF berhasil diunduh',
      });
    } catch (err) {
      console.error('Error export PDF:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal export PDF',
      });
    } finally {
      setExportingPDF(false);
    }
  };

  const handleExportExcel = async (planId) => {
  try {
    setExportingExcel(true);
    
    const res = await fetch(`/api/weekly-plans?id=${planId}`);
    if (!res.ok) throw new Error('Gagal memuat data');
    
    const planData = await res.json();
    await exportWeeklyPlanToExcel(planData);
    
    toast({
      title: 'Berhasil',
      description: 'Excel berhasil diunduh',
    });
  } catch (err) {
    console.error('Error export Excel:', err);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Gagal export Excel',
    });
  } finally {
    setExportingExcel(false);
  }
};

  const handleDeletePlan = async (planId) => {
    const confirmed = window.confirm('Yakin ingin menghapus weekly plan ini? Semua kegiatan akan ikut terhapus.');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/weekly-plans?id=${planId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghapus weekly plan');
      }

      toast({
        title: 'Berhasil',
        description: 'Weekly plan berhasil dihapus',
      });

      fetchWeeklyPlans();
    } catch (err) {
      console.error('Error delete:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Gagal menghapus weekly plan',
      });
    }
  };

  const handleOpenAddActivity = (hari, tanggal) => {
    setActivityMode('add');
    setActivityForm({
      hari,
      tanggal,
      waktu: '',
      kegiatan: '',
      target_capaian: '',
    });
    setOpenActivityDialog(true);
  };

  const handleOpenEditActivity = (activity) => {
    setActivityMode('edit');
    setSelectedActivity(activity);
    setActivityForm({
      hari: activity.hari,
      tanggal: activity.tanggal,
      waktu: activity.waktu || '',
      kegiatan: activity.kegiatan,
      target_capaian: activity.target_capaian || '',
    });
    setOpenActivityDialog(true);
  };

  const handleActivityFormChange = (field, value) => {
    setActivityForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveActivity = async () => {
    if (!activityForm.kegiatan.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Kegiatan harus diisi',
      });
      return;
    }

    if (!activityForm.tanggal) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Tanggal harus diisi',
      });
      return;
    }

    try {
      setSubmitting(true);

      if (activityMode === 'add') {
        // Add new activity
        const res = await fetch('/api/weekly-activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weekly_plan_id: selectedPlan.id,
            hari: activityForm.hari,
            tanggal: activityForm.tanggal,
            waktu: activityForm.waktu || null,
            kegiatan: activityForm.kegiatan.trim(),
            target_capaian: activityForm.target_capaian?.trim() || null,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal menambah kegiatan');
        }

        toast({
          title: 'Berhasil',
          description: 'Kegiatan berhasil ditambahkan',
        });
      } else {
        // Update existing activity
        const res = await fetch(`/api/weekly-activities?id=${selectedActivity.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hari: activityForm.hari,
            tanggal: activityForm.tanggal,
            waktu: activityForm.waktu || null,
            kegiatan: activityForm.kegiatan.trim(),
            target_capaian: activityForm.target_capaian?.trim() || null,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal mengupdate kegiatan');
        }

        toast({
          title: 'Berhasil',
          description: 'Kegiatan berhasil diupdate',
        });
      }

      setOpenActivityDialog(false);
      handleViewDetail(selectedPlan.id); // Refresh detail
    } catch (err) {
      console.error('Error save activity:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Gagal menyimpan kegiatan',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    const confirmed = window.confirm('Yakin ingin menghapus kegiatan ini?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/weekly-activities?id=${activityId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghapus kegiatan');
      }

      toast({
        title: 'Berhasil',
        description: 'Kegiatan berhasil dihapus',
      });

      handleViewDetail(selectedPlan.id); // Refresh detail
    } catch (err) {
      console.error('Error delete activity:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Gagal menghapus kegiatan',
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const groupActivitiesByDay = (activities) => {
    const grouped = {};
    HARI.forEach(hari => {
      grouped[hari] = activities.filter(act => act.hari === hari);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="text-gray-500 mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Management</h1>
          <p className="text-gray-500 mt-1">Kelola rencana kegiatan mingguan</p>
        </div>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-20 md:mb-0">
          <TabsTrigger value="today">
            <Calendar className="h-4 w-4 mr-2" />
            Kegiatan Hari Ini
          </TabsTrigger>
          <TabsTrigger value="plans">
            <List className="h-4 w-4 mr-2" />
            Riwayat Weekly Plans
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Buat Weekly Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <DailyTodoList guruData={guruData} />
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardContent className="pt-6">
              {weeklyPlans.length > 0 ? (
                <div className="space-y-3">
                  {weeklyPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {plan.kelas_lengkap}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-600">
                              Minggu ke-{plan.minggu_ke} ({plan.tahun})
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                plan.status === 'published'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {plan.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDate(plan.tanggal_mulai)} - {formatDate(plan.tanggal_selesai)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportExcel(plan.id)}
                            disabled={exportingExcel}
                          >
                            {exportingExcel ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <FileSpreadsheet className="h-4 w-4 mr-1" />
                            )}
                            Excel
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportPDF(plan.id)}
                            disabled={exportingPDF}
                          >
                            {exportingPDF ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            PDF
                          </Button> */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(plan.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                  <List className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Belum ada weekly plan</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Buat weekly plan baru untuk memulai
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <WeeklyPlanForm
            guruData={guruData}
            onSuccess={() => {
              fetchWeeklyPlans();
              const plansTab = document.querySelector('[value="plans"]');
              if (plansTab) plansTab.click();
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detail Weekly Plan - {selectedPlan?.kelas_lengkap}
            </DialogTitle>
            <DialogDescription>
              Minggu ke-{selectedPlan?.minggu_ke} ({selectedPlan?.tahun}) •{' '}
              {selectedPlan?.tanggal_mulai && formatDate(selectedPlan.tanggal_mulai)} -{' '}
              {selectedPlan?.tanggal_selesai && formatDate(selectedPlan.tanggal_selesai)}
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && selectedPlan.activities && (
            <div className="space-y-4">
              {Object.entries(groupActivitiesByDay(selectedPlan.activities)).map(
                ([hari, acts]) => {
                  const firstDate = acts[0]?.tanggal || '';
                  return (
                    <div key={hari} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-gray-900">{hari}</h3>
                          {firstDate && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {formatDate(firstDate)}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAddActivity(hari, firstDate)}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Tambah
                        </Button>
                      </div>

                      {acts.length > 0 ? (
                        <div className="space-y-3">
                          {acts.map((act) => (
                            <div
                              key={act.id}
                              className={`p-3 rounded border ${
                                act.status === 'completed'
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {act.waktu && (
                                      <span className="text-xs text-gray-500">
                                        {act.waktu}
                                      </span>
                                    )}
                                    {act.status === 'completed' && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                        Selesai
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-medium text-gray-900 mb-1">{act.kegiatan}</p>
                                  {act.target_capaian && (
                                    <p className="text-sm text-gray-600 mb-2">
                                      Target: {act.target_capaian}
                                    </p>
                                  )}
                                  {act.evaluasi && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <p className="text-xs font-medium text-gray-700 mb-1">
                                        Evaluasi:
                                      </p>
                                      <p className="text-sm text-gray-700">{act.evaluasi}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenEditActivity(act)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteActivity(act.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500 text-sm">
                          Belum ada kegiatan
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Activity Dialog */}
      <Dialog open={openActivityDialog} onOpenChange={setOpenActivityDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {activityMode === 'add' ? 'Tambah' : 'Edit'} Kegiatan
            </DialogTitle>
            <DialogDescription>
              {activityMode === 'add' ? 'Tambahkan kegiatan baru' : 'Perbarui detail kegiatan'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hari *</Label>
                <Select
                  value={activityForm.hari}
                  onValueChange={(value) => handleActivityFormChange('hari', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HARI.map(hari => (
                      <SelectItem key={hari} value={hari}>{hari}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tanggal *</Label>
                <Input
                  type="date"
                  value={activityForm.tanggal}
                  onChange={(e) => handleActivityFormChange('tanggal', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Waktu</Label>
              <Input
                placeholder="Contoh: 08:00-10:00"
                value={activityForm.waktu}
                onChange={(e) => handleActivityFormChange('waktu', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Kegiatan *</Label>
              <Textarea
                placeholder="Deskripsi kegiatan yang akan dilakukan"
                rows={3}
                value={activityForm.kegiatan}
                onChange={(e) => handleActivityFormChange('kegiatan', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Capaian</Label>
              <Textarea
                placeholder="Target yang ingin dicapai dari kegiatan ini"
                rows={3}
                value={activityForm.target_capaian}
                onChange={(e) => handleActivityFormChange('target_capaian', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenActivityDialog(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button type="button" onClick={handleSaveActivity} disabled={submitting}>
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
    </div>
  );
}