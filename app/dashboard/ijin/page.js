"use client"
import { useState,useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock, FileText, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FormIjinKaryawan() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '', // Akan diisi dari session/auth user yang login
    jenis_ijin: 'keluar',
    tanggal_ijin: '',
    jam_keluar: '',
    jam_kembali: '',
    alasan_ijin: '',
    pemberi_ijin_id: '' // Akan diisi dari session/auth user yang login (atasan)
  });
  
    
    // console.log(user)
    useEffect(() => {
      setMounted(true);
  
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/me", {
            credentials: "include",
            cache: "no-store",
          });
  
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            const err = await res.json();
            console.error("API error:", err);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        }
      };
  
      fetchUser();
    }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset jam jika ganti ke tidak_masuk
    if (name === 'jenis_ijin' && value === 'tidak_masuk') {
      setFormData(prev => ({
        ...prev,
        jam_keluar: '',
        jam_kembali: ''
      }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowSuccess(false);

    try {
      // TODO: Ganti USER_ID dan PEMBERI_IJIN_ID dengan data dari session/auth
      // Contoh: const session = await getSession();
      const response = await fetch('/api/ijin-karyawan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user.id, // Ganti dengan session.user.id
          pemberi_ijin_id: user.id // Ganti dengan atasan dari session
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Gagal submit data');
      }

      console.log('Success:', result);
    //   alert("Sukses : Berhasil mengajukan ijin!")
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        user_id: user.id,
        jenis_ijin: 'keluar',
        tanggal_ijin: '',
        jam_keluar: '',
        jam_kembali: '',
        alasan_ijin: '',
        pemberi_ijin_id: ''
      });

      // Hide success message setelah 3 detik
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Terjadi kesalahan saat mengajukan ijin');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (!formData.tanggal_ijin || !formData.alasan_ijin || formData.alasan_ijin.length < 10) {
      return false;
    }
    if (formData.jenis_ijin === 'keluar' && (!formData.jam_keluar || !formData.jam_kembali)) {
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Pengajuan Ijin Karyawan
          </h1>
          <p className="text-slate-600">
            Isi formulir di bawah untuk mengajukan ijin keluar atau tidak masuk
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Ijin berhasil diajukan! Data telah tersimpan di sistem.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Form Ijin</CardTitle>
            <CardDescription>
              Pastikan semua data terisi dengan benar sebelum submit
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Jenis Ijin */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Jenis Ijin</Label>
                <RadioGroup 
                  value={formData.jenis_ijin}
                  onValueChange={(value) => handleChange('jenis_ijin', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4 flex-1 cursor-pointer hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="keluar" id="keluar" />
                    <Label htmlFor="keluar" className="cursor-pointer flex-1">
                      <div className="font-medium">Ijin Keluar</div>
                      <div className="text-xs text-slate-500">Keluar saat jam kerja</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 flex-1 cursor-pointer hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="tidak_masuk" id="tidak_masuk" />
                    <Label htmlFor="tidak_masuk" className="cursor-pointer flex-1">
                      <div className="font-medium">Ijin Tidak Masuk</div>
                      <div className="text-xs text-slate-500">Tidak masuk kerja</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Tanggal Ijin */}
              <div className="space-y-2">
                <Label htmlFor="tanggal_ijin" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Ijin
                </Label>
                <Input
                  id="tanggal_ijin"
                  type="date"
                  value={formData.tanggal_ijin}
                  onChange={(e) => handleChange('tanggal_ijin', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Jam Keluar dan Kembali (hanya untuk ijin keluar) */}
              {formData.jenis_ijin === 'keluar' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jam_keluar" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Jam Keluar
                    </Label>
                    <Input
                      id="jam_keluar"
                      type="time"
                      value={formData.jam_keluar}
                      onChange={(e) => handleChange('jam_keluar', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jam_kembali" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Jam Kembali
                    </Label>
                    <Input
                      id="jam_kembali"
                      type="time"
                      value={formData.jam_kembali}
                      onChange={(e) => handleChange('jam_kembali', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Alasan Ijin */}
              <div className="space-y-2">
                <Label htmlFor="alasan_ijin" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Alasan Ijin
                </Label>
                <Textarea
                  id="alasan_ijin"
                  value={formData.alasan_ijin}
                  onChange={(e) => handleChange('alasan_ijin', e.target.value)}
                  placeholder="Jelaskan alasan mengajukan ijin..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-slate-500">
                  Minimum 10 karakter (saat ini: {formData.alasan_ijin.length})
                </p>
              </div>

              {/* Info Tambahan */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> Pengajuan ijin akan dicatat atas nama Anda yang sedang login. 
                  Pastikan data sudah benar sebelum submit.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !isFormValid()}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Ajukan Ijin
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFormData({
                    user_id: '',
                    jenis_ijin: 'keluar',
                    tanggal_ijin: '',
                    jam_keluar: '',
                    jam_kembali: '',
                    alasan_ijin: '',
                    pemberi_ijin_id: ''
                  })}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-800 mb-2">Informasi Penting</h3>
            <ul className="space-y-1.5 text-sm text-slate-600">
              <li>• Ijin keluar: Harus mengisi jam keluar dan jam kembali</li>
              <li>• Ijin tidak masuk: Tidak perlu mengisi jam keluar/kembali</li>
              <li>• Status pemotongan tunjangan akan ditentukan oleh bendahara</li>
              <li>• Default status: Tidak dipotong tunjangan</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}