// lib/validations.js
import { z } from 'zod';

// Event Schema
export const eventSchema = z.object({
  name: z.string()
    .min(3, 'Nama event minimal 3 karakter')
    .max(255, 'Nama event maksimal 255 karakter'),
  description: z.string().optional().or(z.literal('')),
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  status: z.enum(['planning', 'ongoing', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Status tidak valid' })
  })
}).refine((data) => {
  // Validasi end_date harus >= start_date
  return new Date(data.end_date) >= new Date(data.start_date);
}, {
  message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
  path: ['end_date']
});

// Committee Schema
export const committeeSchema = z.object({
  position_name: z.string()
    .min(2, 'Nama posisi minimal 2 karakter')
    .max(100, 'Nama posisi maksimal 100 karakter'),
  person_name: z.string()
    .min(2, 'Nama orang minimal 2 karakter')
    .max(255, 'Nama orang maksimal 255 karakter'),
  person_email: z.string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  person_phone: z.string()
    .max(50, 'Nomor telepon maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  responsibilities: z.string()
    .optional()
    .or(z.literal(''))
});

// Todo Schema
export const todoSchema = z.object({
  title: z.string()
    .min(3, 'Judul minimal 3 karakter')
    .max(255, 'Judul maksimal 255 karakter'),
  description: z.string()
    .optional()
    .or(z.literal('')),
  assigned_to: z.string()
    .max(255, 'Nama penanggung jawab maksimal 255 karakter')
    .optional()
    .or(z.literal('')),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Status tidak valid' })
  }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'Priority tidak valid' })
  }),
  deadline: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .optional()
    .or(z.literal(''))
});

// Rundown Schema
export const rundownSchema = z.object({
  time_start: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Format waktu tidak valid (HH:MM)'),
  time_end: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Format waktu tidak valid (HH:MM)')
    .optional()
    .or(z.literal('')),
  activity: z.string()
    .min(3, 'Nama aktivitas minimal 3 karakter')
    .max(255, 'Nama aktivitas maksimal 255 karakter'),
  description: z.string()
    .optional()
    .or(z.literal('')),
  person_in_charge: z.string()
    .max(255, 'Nama penanggung jawab maksimal 255 karakter')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(255, 'Lokasi maksimal 255 karakter')
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .optional()
    .or(z.literal(''))
}).refine((data) => {
  // Validasi time_end harus > time_start jika diisi
  if (!data.time_end) return true;
  
  const start = data.time_start.split(':').map(Number);
  const end = data.time_end.split(':').map(Number);
  
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  
  return endMinutes > startMinutes;
}, {
  message: 'Waktu selesai harus lebih besar dari waktu mulai',
  path: ['time_end']
});

// Helper function untuk format error Zod
export function formatZodError(error) {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
}