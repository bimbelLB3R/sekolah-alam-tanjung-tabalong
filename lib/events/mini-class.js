import { z } from 'zod';

export const miniClassSchema = z.object({
  nama_lengkap: z.string()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(255, 'Nama lengkap maksimal 255 karakter'),
  
  nama_panggilan: z.string()
    .min(2, 'Nama panggilan minimal 2 karakter')
    .max(100, 'Nama panggilan maksimal 100 karakter'),
  
  usia: z.number()
    .int('Usia harus berupa bilangan bulat')
    .min(2, 'Usia minimal 2 tahun')
    .max(100, 'Usia maksimal 100 tahun')
    .or(z.string().regex(/^\d+$/).transform(Number)),
  
  alamat: z.string()
    .min(10, 'Alamat minimal 10 karakter')
    .max(500, 'Alamat maksimal 500 karakter'),
  
  asal_sekolah: z.string()
    .min(3, 'Asal sekolah minimal 3 karakter')
    .max(255, 'Asal sekolah maksimal 255 karakter'),
  
  kontak_wa: z.string()
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, 'Format nomor WhatsApp tidak valid (contoh: 081234567890)')
    .transform(val => {
      // Normalisasi ke format +62
      if (val.startsWith('0')) {
        return '+62' + val.slice(1);
      }
      if (val.startsWith('62')) {
        return '+' + val;
      }
      return val;
    }),
});

export const miniClassFileSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Ukuran file maksimal 5MB')
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      'Format file harus JPG, PNG, WEBP, atau PDF'
    ),
});

export const miniClassUpdateSchema = miniClassSchema.partial().extend({
  status_verifikasi: z.enum(['pending', 'verified', 'rejected']).optional(),
});