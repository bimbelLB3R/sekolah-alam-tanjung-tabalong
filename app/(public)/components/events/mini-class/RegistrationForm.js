'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { miniClassSchema } from '@/lib/events/mini-class';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import FileUpload from './FileUpload';

export default function RegistrationForm() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(miniClassSchema),
  });

  const handleUploadSuccess = (fileData) => {
    setUploadedFile(fileData);
    toast({
      title: 'File berhasil diupload',
      description: 'Silakan lengkapi form dan submit pendaftaran',
    });
  };

  const handleUploadError = (error) => {
    toast({
      title: 'Upload gagal',
      description: error,
      variant: 'destructive',
    });
  };

  const onSubmit = async (data) => {
    if (!uploadedFile) {
      toast({
        title: 'Bukti transfer diperlukan',
        description: 'Silakan upload bukti transfer terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        bukti_transfer_url: uploadedFile.url,
        bukti_transfer_key: uploadedFile.key,
      };

      const response = await fetch('/api/mini-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Pendaftaran gagal');
      }

      setIsSuccess(true);
      toast({
        title: 'Pendaftaran berhasil! 🎉',
        description: 'Data Anda telah tersimpan dan menunggu verifikasi',
      });

      // Reset form
      reset();
      setUploadedFile(null);

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Pendaftaran gagal',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-green-700 mb-6">
            Terima kasih telah mendaftar. Data Anda sedang dalam proses verifikasi.
            Kami akan menghubungi Anda melalui WhatsApp.
          </p>
          <Button onClick={() => setIsSuccess(false)}>
            Daftar Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pendaftaran Mini Class
        </h1>
        <p className="text-gray-600">
          Isi form di bawah ini dengan data yang benar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <Label htmlFor="nama_lengkap">
            Nama Lengkap <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nama_lengkap"
            placeholder="Contoh: Budi Santoso"
            {...register('nama_lengkap')}
            className={errors.nama_lengkap ? 'border-red-500' : ''}
          />
          {errors.nama_lengkap && (
            <p className="text-sm text-red-500">{errors.nama_lengkap.message}</p>
          )}
        </div>

        {/* Nama Panggilan */}
        <div className="space-y-2">
          <Label htmlFor="nama_panggilan">
            Nama Panggilan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nama_panggilan"
            placeholder="Contoh: Budi"
            {...register('nama_panggilan')}
            className={errors.nama_panggilan ? 'border-red-500' : ''}
          />
          {errors.nama_panggilan && (
            <p className="text-sm text-red-500">{errors.nama_panggilan.message}</p>
          )}
        </div>

        {/* Usia */}
        <div className="space-y-2">
          <Label htmlFor="usia">
            Usia <span className="text-red-500">*</span>
          </Label>
          <Input
            id="usia"
            type="number"
            placeholder="Contoh: 20"
            {...register('usia')}
            className={errors.usia ? 'border-red-500' : ''}
          />
          {errors.usia && (
            <p className="text-sm text-red-500">{errors.usia.message}</p>
          )}
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <Label htmlFor="alamat">
            Alamat Lengkap <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="alamat"
            placeholder="Contoh: Jl. Merdeka No. 123, Jakarta Selatan"
            rows={3}
            {...register('alamat')}
            className={errors.alamat ? 'border-red-500' : ''}
          />
          {errors.alamat && (
            <p className="text-sm text-red-500">{errors.alamat.message}</p>
          )}
        </div>

        {/* Asal Sekolah */}
        <div className="space-y-2">
          <Label htmlFor="asal_sekolah">
            Asal Sekolah <span className="text-red-500">*</span>
          </Label>
          <Input
            id="asal_sekolah"
            placeholder="Contoh: SMA Negeri 1 Jakarta"
            {...register('asal_sekolah')}
            className={errors.asal_sekolah ? 'border-red-500' : ''}
          />
          {errors.asal_sekolah && (
            <p className="text-sm text-red-500">{errors.asal_sekolah.message}</p>
          )}
        </div>

        {/* Kontak WA */}
        <div className="space-y-2">
          <Label htmlFor="kontak_wa">
            Nomor WhatsApp <span className="text-red-500">*</span>
          </Label>
          <Input
            id="kontak_wa"
            placeholder="Contoh: 081234567890"
            {...register('kontak_wa')}
            className={errors.kontak_wa ? 'border-red-500' : ''}
          />
          {errors.kontak_wa && (
            <p className="text-sm text-red-500">{errors.kontak_wa.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Format: 08xxx atau 62xxx (tanpa tanda +, -, atau spasi)
          </p>
        </div>

        {/* Upload Bukti Transfer */}
        <div className="space-y-2">
          <Label>
            Bukti Transfer <span className="text-red-500">*</span>
          </Label>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            currentFile={uploadedFile}
          />
          {uploadedFile && (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              File berhasil diupload
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !uploadedFile}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}