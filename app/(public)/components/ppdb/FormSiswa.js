import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { z } from "zod"

// ================== ZOD SCHEMAS ==================
const siswaSchema = z.object({
  jenis_pendaftaran: z.string().min(1, "Pilih jenis pendaftaran"),
  jenjang: z.string().min(1, "Pilih jenjang"),
  nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  nama_panggilan: z.string().min(1, "Nama panggilan wajib diisi"),
  nik: z.string()
    .min(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  nomor_kk: z.string()
    .min(16, "Nomor KK harus 16 digit")
    .regex(/^\d+$/, "Nomor KK hanya boleh berisi angka"),
  jenis_kelamin: z.string().min(1, "Pilih jenis kelamin"),
  tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tgl_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  keb_khusus: z.string().min(1, "Pilih salah satu"),
  sekolah_asal: z.string().min(1, "Sekolah asal wajib diisi"),
  agama: z.string().min(1, "Pilih agama"),
  anak_ke: z.number().min(1, "Isi anak ke-berapa").max(10, "Terlalu besar"),
  jml_saudara: z.coerce.number().min(0, "Isi jumlah saudara kandung"), //ubah string jadi angka
  alamat: z.string().min(1, "Alamat wajib diisi"),
  kelas_ditujukan: z.string().optional(), // wajib kalau pindahan
  jenis_kebkus: z.string().optional(), // wajib kalau Ya
}).refine(
    (data) => !(data.jenis_pendaftaran === "pindahan" && !data.kelas_ditujukan),
    {
      message: "Kelas yang dituju wajib diisi untuk siswa pindahan",
      path: ["kelas_ditujukan"],
    }
  )
  .refine(
    (data) => !(data.keb_khusus === "Ya" && !data.jenis_kebkus),
    {
      message: "Jenis Kebutuhan Khusus wajib diisi",
      path: ["jenis_kebkus"],
    }
  )

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
      siswaSchema
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
  
  
  const jenis_pendaftaran = watch("jenis_pendaftaran")
  const keb_khusus = watch("keb_khusus")
  const submit = (values) => onNext(values)

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Jenis Pendaftaran */}
      <div>
        <label className="block mb-1">Jenis Pendaftaran</label>
        <select {...register("jenis_pendaftaran")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="baru">Siswa Baru</option>
          <option value="pindahan">Pindahan</option>
        </select>
        {errors.jenis_pendaftaran && <p className="text-red-500 text-sm">{errors.jenis_pendaftaran.message}</p>}
      </div>

      {jenis_pendaftaran === "pindahan" && (
        <div>
          <label className="block mb-1">Kelas yang dituju</label>
          <Input {...register("kelas_ditujukan")} />
          {errors.kelas_ditujukan && <p className="text-red-500 text-sm">{errors.kelas_ditujukan.message}</p>}
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

      <InputField label="Nama Lengkap" name="nama_lengkap" register={register} error={errors.nama_lengkap} />
      <InputField label="Nama Panggilan" name="nama_panggilan" register={register} error={errors.nama_panggilan} />
      <InputField label="NIK" name="nik" register={register} error={errors.nik} />
      <InputField label="Nomor KK" name="nomor_kk" register={register} error={errors.nomor_kk} />

      <div>
        <label className="block mb-1">Jenis Kelamin</label>
        <select {...register("jenis_kelamin")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        {errors.jenis_kelamin && <p className="text-red-500 text-sm">{errors.jenis_kelamin.message}</p>}
      </div>

      <InputField label="Tempat Lahir" name="tempat_lahir" register={register} error={errors.tempat_lahir} />
      <InputField label="Tanggal Lahir" name="tgl_lahir" type="date" register={register} error={errors.tgl_lahir} />

      <div>
        <label className="block mb-1">Kebutuhan Khusus</label>
        <select {...register("keb_khusus")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="Ya">Ya</option>
          <option value="Tidak">Tidak</option>
        </select>
        {errors.keb_khusus && <p className="text-red-500 text-sm">{errors.keb_khusus.message}</p>}
      </div>
      {keb_khusus === "Ya" && (
        <div>
          <label className="block mb-1">Jenis Kebutuhan Khusus</label>
          <Input {...register("jenis_kebkus")} />
          {errors.jenis_kebkus && <p className="text-red-500 text-sm">{errors.jenis_kebkus.message}</p>}
        </div>
      )}

      <InputField label="Sekolah Asal" name="sekolah_asal" register={register} error={errors.sekolah_asal} />

      <div>
        <label className="block mb-1">Agama</label>
        <select {...register("agama")} className="w-full border rounded p-2">
          <option value="">-- pilih --</option>
          <option value="Islam">Islam</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        {errors.agama && <p className="text-red-500 text-sm">{errors.agama.message}</p>}
      </div>

       <div>
        <label className="block mb-1">Anak Ke-</label>
        <Input
          type="number"
          {...register("anak_ke", { valueAsNumber: true })}
        />
        {errors.anak_ke && (
          <p className="text-red-500 text-sm">{errors.anak_ke.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Jumlah Saudara Kandung</label>
        <Input
          type="number"
          {...register("jml_saudara", { valueAsNumber: true })}
        />
        {errors.jml_saudara && (
          <p className="text-red-500 text-sm">{errors.jml_saudara.message}</p>
        )}
      </div>

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