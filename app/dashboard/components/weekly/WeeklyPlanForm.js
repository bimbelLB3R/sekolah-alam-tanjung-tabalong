

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Calendar, Save, PlusCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function WeeklyPlanForm({ guruData, onSuccess }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [loadingKelas, setLoadingKelas] = useState(true);
  const [isWaliKelas, setIsWaliKelas] = useState(false);
  const [kelasList, setKelasList] = useState([]);
  const [selectedKelasData, setSelectedKelasData] = useState(null);
  
  const [formData, setFormData] = useState({
    kelas_lengkap: '',
    minggu_ke: '',
    tahun: new Date().getFullYear(),
    tanggal_mulai: '',
    tanggal_selesai: '',
  });

  const [activitiesByDay, setActivitiesByDay] = useState({
    'Senin': [{ tanggal: '', waktu: '', kegiatan: '', target_capaian: '' }],
    'Selasa': [{ tanggal: '', waktu: '', kegiatan: '', target_capaian: '' }],
    'Rabu': [{ tanggal: '', waktu: '', kegiatan: '', target_capaian: '' }],
    'Kamis': [{ tanggal: '', waktu: '', kegiatan: '', target_capaian: '' }],
    'Jumat': [{ tanggal: '', waktu: '', kegiatan: '', target_capaian: '' }],
  });

  // Fetch kelas data on mount
  useEffect(() => {
    fetchKelasData();
  }, [guruData.id]);

  const fetchKelasData = async () => {
    try {
      setLoadingKelas(true);
      const res = await fetch(`/api/kelas-by-guru?guru_id=${guruData.id}`, {
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Gagal memuat data kelas');

      const data = await res.json();
      setIsWaliKelas(data.is_wali_kelas);
      setKelasList(data.kelas);

      // Jika wali kelas, auto-fill kelas_lengkap
      if (data.is_wali_kelas && data.kelas.length > 0) {
        const kelasGuru = data.kelas[0];
        setFormData(prev => ({ ...prev, kelas_lengkap: kelasGuru.kelas_lengkap }));
        setSelectedKelasData(kelasGuru);
      }
    } catch (err) {
      console.error('Error fetch kelas:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data kelas',
      });
    } finally {
      setLoadingKelas(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKelasChange = (value) => {
    setFormData(prev => ({ ...prev, kelas_lengkap: value }));
    
    // Find selected kelas data untuk ambil wali_kelas_nama
    const selected = kelasList.find(k => k.kelas_lengkap === value);
    setSelectedKelasData(selected);
  };

  const handleActivityChange = (hari, index, field, value) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [hari]: prev[hari].map((act, i) => 
        i === index ? { ...act, [field]: value } : act
      )
    }));
  };

  const addActivityToDay = (hari) => {
    setActivitiesByDay(prev => ({
      ...prev,
      [hari]: [
        ...prev[hari],
        { 
          tanggal: prev[hari][0]?.tanggal || '', 
          waktu: '', 
          kegiatan: '', 
          target_capaian: '' 
        }
      ]
    }));

    toast({
      title: 'Berhasil',
      description: `Kegiatan baru ditambahkan untuk hari ${hari}`,
    });
  };

  const removeActivityFromDay = (hari, index) => {
    if (activitiesByDay[hari].length === 1) {
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Minimal harus ada satu kegiatan per hari',
      });
      return;
    }

    setActivitiesByDay(prev => ({
      ...prev,
      [hari]: prev[hari].filter((_, i) => i !== index)
    }));
  };

  const autoFillDates = () => {
    if (!formData.tanggal_mulai) {
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Isi tanggal mulai terlebih dahulu',
      });
      return;
    }

    const startDate = new Date(formData.tanggal_mulai);
    const newActivitiesByDay = {};

    HARI.forEach((hari, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];

      newActivitiesByDay[hari] = activitiesByDay[hari].map(act => ({
        ...act,
        tanggal: dateStr
      }));
    });

    setActivitiesByDay(newActivitiesByDay);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4);
    setFormData(prev => ({
      ...prev,
      tanggal_selesai: endDate.toISOString().split('T')[0]
    }));

    toast({
      title: 'Berhasil',
      description: 'Tanggal kegiatan berhasil diisi otomatis',
    });
  };

  const handleSubmit = async () => {
    if (!formData.kelas_lengkap || !formData.minggu_ke || !formData.tanggal_mulai || !formData.tanggal_selesai) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Semua field utama harus diisi',
      });
      return;
    }

    const allActivities = [];
    let hasError = false;

    HARI.forEach(hari => {
      activitiesByDay[hari].forEach(act => {
        if (!act.tanggal || !act.kegiatan.trim()) {
          hasError = true;
        }
        allActivities.push({
          hari,
          ...act
        });
      });
    });

    if (hasError) {
      toast({
        variant: 'destructive',
        title: 'Validasi Gagal',
        description: 'Setiap kegiatan harus memiliki tanggal dan deskripsi kegiatan',
      });
      return;
    }

    try {
      setSubmitting(true);

      // Tentukan guru_id dan guru_nama
      let finalGuruId, finalGuruNama;
      
      if (isWaliKelas) {
        // Jika wali kelas, pakai data dari guruData
        finalGuruId = guruData.id;
        finalGuruNama = guruData.nama;
      } else {
        // Jika bukan wali kelas, pakai data dari kelas yang dipilih
        if (!selectedKelasData || !selectedKelasData.wali_kelas) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Kelas yang dipilih tidak memiliki wali kelas',
          });
          return;
        }
        finalGuruId = selectedKelasData.wali_kelas;
        finalGuruNama = selectedKelasData.wali_kelas_nama;
      }

      const payload = {
        ...formData,
        guru_id: finalGuruId,
        guru_nama: finalGuruNama,
        activities: allActivities.map(act => ({
          hari: act.hari,
          tanggal: act.tanggal,
          waktu: act.waktu?.trim() || null,
          kegiatan: act.kegiatan.trim(),
          target_capaian: act.target_capaian?.trim() || null,
        })),
      };

      const res = await fetch('/api/weekly-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan weekly plan');
      }

      toast({
        title: 'Berhasil',
        description: 'Weekly plan berhasil dibuat',
      });

      if (onSuccess) onSuccess(data.data);
    } catch (err) {
      console.error('Error submit:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Gagal menyimpan weekly plan',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getTotalActivities = () => {
    return Object.values(activitiesByDay).reduce((total, acts) => total + acts.length, 0);
  };

  if (loadingKelas) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-gray-500 mt-2 text-sm">Memuat data kelas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Alert for Non-Wali Kelas */}
      {!isWaliKelas && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Informasi</p>
                <p className="text-sm text-blue-700 mt-1">
                  Anda bukan wali kelas. Silakan pilih kelas yang ingin dibuatkan weekly plan, 
                  dan weekly plan akan dibuat atas nama wali kelas tersebut.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informasi Weekly Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kelas_lengkap">
                Kelas * {isWaliKelas && <span className="text-xs text-gray-500">(Kelas Anda)</span>}
              </Label>
              {isWaliKelas ? (
                <Input
                  id="kelas_lengkap"
                  name="kelas_lengkap"
                  value={formData.kelas_lengkap}
                  disabled
                  className="bg-gray-100"
                />
              ) : (
                <Select value={formData.kelas_lengkap} onValueChange={handleKelasChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {kelasList.map(kelas => (
                      <SelectItem key={kelas.id} value={kelas.kelas_lengkap}>
                        {kelas.kelas_lengkap} 
                        {kelas.wali_kelas_nama && (
                          <span className="text-xs text-gray-500 ml-2">
                            (Wali: {kelas.wali_kelas_nama})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="minggu_ke">Minggu Ke *</Label>
              <Input
                id="minggu_ke"
                name="minggu_ke"
                type="number"
                min="1"
                max="52"
                placeholder="1-52"
                value={formData.minggu_ke}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun *</Label>
              <Input
                id="tahun"
                name="tahun"
                type="number"
                value={formData.tahun}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal_mulai">Tanggal Mulai (Senin) *</Label>
              <Input
                id="tanggal_mulai"
                name="tanggal_mulai"
                type="date"
                value={formData.tanggal_mulai}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggal_selesai">Tanggal Selesai (Jumat) *</Label>
              <Input
                id="tanggal_selesai"
                name="tanggal_selesai"
                type="date"
                value={formData.tanggal_selesai}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <Button onClick={autoFillDates} variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Isi Tanggal Otomatis (Senin-Jumat)
          </Button>

          {/* Display Wali Kelas Info for Non-Wali */}
          {!isWaliKelas && selectedKelasData && (
            <div className="p-3 bg-gray-50 rounded border">
              <p className="text-sm text-gray-600">
                Weekly plan akan dibuat atas nama: 
                <span className="font-medium text-gray-900 ml-1">
                  {selectedKelasData.wali_kelas_nama || 'Belum ada wali kelas'}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Kegiatan Harian</span>
            <span className="text-sm font-normal text-gray-500">
              Total: {getTotalActivities()} kegiatan
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {HARI.map(hari => (
            <div key={hari} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-gray-900">{hari}</h3>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    {activitiesByDay[hari][0]?.tanggal || 'Belum ada tanggal'}
                  </span>
                </div>
                <Button
                  onClick={() => addActivityToDay(hari)}
                  size="sm"
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Kegiatan
                </Button>
              </div>

              <div className="space-y-3">
                {activitiesByDay[hari].map((activity, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        Kegiatan #{index + 1}
                      </span>
                      {activitiesByDay[hari].length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActivityFromDay(hari, index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Hapus
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Tanggal *</Label>
                        <Input
                          type="date"
                          value={activity.tanggal}
                          onChange={(e) => handleActivityChange(hari, index, 'tanggal', e.target.value)}
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Waktu</Label>
                        <Input
                          placeholder="Contoh: 08:00-10:00"
                          value={activity.waktu}
                          onChange={(e) => handleActivityChange(hari, index, 'waktu', e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Kegiatan *</Label>
                      <Textarea
                        placeholder="Deskripsi kegiatan yang akan dilakukan"
                        rows={2}
                        value={activity.kegiatan}
                        onChange={(e) => handleActivityChange(hari, index, 'kegiatan', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Target Capaian</Label>
                      <Textarea
                        placeholder="Target yang ingin dicapai dari kegiatan ini"
                        rows={2}
                        value={activity.target_capaian}
                        onChange={(e) => handleActivityChange(hari, index, 'target_capaian', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSubmit}
          disabled={submitting || !formData.kelas_lengkap}
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Weekly Plan ({getTotalActivities()} kegiatan)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}