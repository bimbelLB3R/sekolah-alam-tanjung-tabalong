import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { z } from "zod"

// ================== ZOD SCHEMAS ==================
const siswaSchema = z.object({
  jenisPendaftaran: z.string().min(1, "Pilih jenis pendaftaran"),
  jenjang: z.string().min(1, "Pilih jenjang"),
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  namaPanggilan: z.string().min(1, "Nama panggilan wajib diisi"),
  nik: z.string().min(1, "NIK wajib diisi"),
  nomorKk: z.string().min(1, "Nomor KK wajib diisi"),
  jenisKelamin: z.string().min(1, "Pilih jenis kelamin"),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tglLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  kebKhusus: z.string().min(1, "Pilih salah satu"),
  sekolahAsal: z.string().min(1, "Sekolah asal wajib diisi"),
  agama: z.string().min(1, "Pilih agama"),
  anakKe: z.string().min(1, "Isi anak ke-berapa"),
  jmlSaudara: z.string().min(1, "Isi jumlah saudara kandung"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  kelasDitujukan: z.string().optional(), // wajib kalau pindahan
})

// ================== FORM SISWA ==================
export default function FormSiswa({ onNext, defaultValues }) {
  const LOCAL_KEY = "formSiswa"
  // 1. Ambil data dari localStorage kalau ada
  const savedData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
      : {}
  const form = useForm({
    resolver: zodResolver(
      siswaSchema.refine(
        (data) => {
          if (data.jenisPendaftaran === "pindahan" && !data.kelasDitujukan) {
            return false
          }
          return true
        },
        { message: "Kelas yang dituju wajib diisi untuk siswa pindahan", path: ["kelasDitujukan"] }
      )
    ),
    defaultValues: {
      ...defaultValues, // dari props parent
      ...savedData,     // overwrite dengan localStorage
    },
  })
  const { register, handleSubmit, formState: { errors }, watch } = form
  const values = watch()
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
  }, [values])
  
  
  const jenisPendaftaran = watch("jenisPendaftaran")
  const submit = (values) => onNext(values)

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Jenis Pendaftaran */}
      <div>
        <label className="block mb-1">Jenis Pendaftaran</label>
        <select {...register("jenisPendaftaran")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="baru">Siswa Baru</option>
          <option value="pindahan">Pindahan</option>
        </select>
        {errors.jenisPendaftaran && <p className="text-red-500 text-sm">{errors.jenisPendaftaran.message}</p>}
      </div>

      {jenisPendaftaran === "pindahan" && (
        <div>
          <label className="block mb-1">Kelas yang dituju</label>
          <Input {...register("kelasDitujukan")} />
          {errors.kelasDitujukan && <p className="text-red-500 text-sm">{errors.kelasDitujukan.message}</p>}
        </div>
      )}

      <div>
        <label className="block mb-1">Jenjang</label>
        <select {...register("jenjang")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="KB">KB</option>
          <option value="TK">TK</option>
          <option value="SD">SD</option>
        </select>
        {errors.jenjang && <p className="text-red-500 text-sm">{errors.jenjang.message}</p>}
      </div>

      <InputField label="Nama Lengkap" name="namaLengkap" register={register} error={errors.namaLengkap} />
      <InputField label="Nama Panggilan" name="namaPanggilan" register={register} error={errors.namaPanggilan} />
      <InputField label="NIK" name="nik" register={register} error={errors.nik} />
      <InputField label="Nomor KK" name="nomorKk" register={register} error={errors.nomorKk} />

      <div>
        <label className="block mb-1">Jenis Kelamin</label>
        <select {...register("jenisKelamin")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
        {errors.jenisKelamin && <p className="text-red-500 text-sm">{errors.jenisKelamin.message}</p>}
      </div>

      <InputField label="Tempat Lahir" name="tempatLahir" register={register} error={errors.tempatLahir} />
      <InputField label="Tanggal Lahir" name="tglLahir" type="date" register={register} error={errors.tglLahir} />

      <div>
        <label className="block mb-1">Kebutuhan Khusus</label>
        <select {...register("kebKhusus")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="ya">Ya</option>
          <option value="tidak">Tidak</option>
        </select>
        {errors.kebKhusus && <p className="text-red-500 text-sm">{errors.kebKhusus.message}</p>}
      </div>

      <InputField label="Sekolah Asal" name="sekolahAsal" register={register} error={errors.sekolahAsal} />

      <div>
        <label className="block mb-1">Agama</label>
        <select {...register("agama")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="Islam">Islam</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        {errors.agama && <p className="text-red-500 text-sm">{errors.agama.message}</p>}
      </div>

      <InputField label="Anak Ke-" name="anakKe" type="number" register={register} error={errors.anakKe} />
      <InputField label="Jumlah Saudara Kandung" name="jmlSaudara" type="number" register={register} error={errors.jmlSaudara} />

      <div>
        <label className="block mb-1">Alamat</label>
        <Textarea {...register("alamat")} />
        {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat.message}</p>}
      </div>

      <Button type="submit">Next</Button>
    </form>
  )
}



// ============= HELPER INPUT COMPONENTS ==========
function InputField({ label, name, type = "text", register, error }) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <Input type={type} {...register(name)} />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}

function TextareaField({ label, name, register, error }) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <Textarea {...register(name)} />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}

function SelectField({ label, name, register, error, options }) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <select {...register(name)} className="w-full border rounded p-2">
        <option value="">-- pilih --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}