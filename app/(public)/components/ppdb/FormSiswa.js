// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { useEffect } from "react"
// import { z } from "zod"

// // ================== ZOD SCHEMAS ==================
// const siswaSchema = z.object({
//   jenis_pendaftaran: z.string().min(1, "Pilih jenis pendaftaran"),
//   jenjang: z.string().min(1, "Pilih jenjang"),
//   nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),
//   nama_panggilan: z.string().min(1, "Nama panggilan wajib diisi"),
//   nik: z.string()
//     .min(16, "NIK harus 16 digit")
//     .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
//   nomor_kk: z.string()
//     .min(16, "Nomor KK harus 16 digit")
//     .regex(/^\d+$/, "Nomor KK hanya boleh berisi angka"),
//   jenis_kelamin: z.string().min(1, "Pilih jenis kelamin"),
//   tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),
//   tgl_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
//   keb_khusus: z.string().min(1, "Pilih salah satu"),
//   sekolah_asal: z.string().min(1, "Sekolah asal wajib diisi"),
//   agama: z.string().min(1, "Pilih agama"),
//   anak_ke: z.number().min(1, "Isi anak ke-berapa").max(10, "Terlalu besar"),
//   jml_saudara: z.coerce.number({
//   required_error: "Isi jumlah saudara kandung",
//   invalid_type_error: "Jumlah saudara kandung harus berupa angka",
// }).min(0, "Jumlah saudara kandung tidak boleh negatif"),
//   alamat: z.string().min(1, "Alamat wajib diisi"),
//   kelas_ditujukan: z.string().optional(), // wajib kalau pindahan
//   jenis_kebkus: z.string().optional(), // wajib kalau Ya
// }).refine(
//     (data) => !(data.jenis_pendaftaran === "pindahan" && !data.kelas_ditujukan),
//     {
//       message: "Kelas yang dituju wajib diisi untuk siswa pindahan",
//       path: ["kelas_ditujukan"],
//     }
//   )
//   .refine(
//     (data) => !(data.keb_khusus === "Ya" && !data.jenis_kebkus),
//     {
//       message: "Jenis Kebutuhan Khusus wajib diisi",
//       path: ["jenis_kebkus"],
//     }
//   )

// // ================== FORM SISWA ==================
// export default function FormSiswa({ onNext, defaultValues }) {
//   const LOCAL_KEY = "formSiswa"
//   // 1. Ambil data dari localStorage kalau ada
//   const savedData =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
//       : {}
//   const form = useForm({
//     resolver: zodResolver(
//       siswaSchema
//     ),
//     defaultValues: {
//       ...defaultValues, // dari props parent
//       ...savedData,     // overwrite dengan localStorage
//     },
//   })
//   const { register, handleSubmit, formState: { errors }, watch } = form
//   const values = watch()
//   useEffect(() => {
//     localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
//   }, [values])
  
  
//   const jenis_pendaftaran = watch("jenis_pendaftaran")
//   const keb_khusus = watch("keb_khusus")
//   const submit = (values) => onNext(values)

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-4">
//       {/* Jenis Pendaftaran */}
//       <div>
//         <label className="block mb-1">Jenis Pendaftaran</label>
//         <select {...register("jenis_pendaftaran")} className="w-full border rounded p-2">
//           <option value="">-- pilih --</option>
//           <option value="baru">Siswa Baru</option>
//           <option value="pindahan">Pindahan</option>
//         </select>
//         {errors.jenis_pendaftaran && <p className="text-red-500 text-sm">{errors.jenis_pendaftaran.message}</p>}
//       </div>

//       {jenis_pendaftaran === "pindahan" && (
//         <div>
//           <label className="block mb-1">Kelas yang dituju</label>
//           <Input {...register("kelas_ditujukan")} />
//           {errors.kelas_ditujukan && <p className="text-red-500 text-sm">{errors.kelas_ditujukan.message}</p>}
//         </div>
//       )}

//       <div>
//         <label className="block mb-1">Jenjang</label>
//         <select {...register("jenjang")} className="w-full border rounded p-2">
//           <option value="">-- pilih --</option>
//           <option value="KB">KB</option>
//           <option value="TK">TK</option>
//           <option value="SD">SD</option>
//         </select>
//         {errors.jenjang && <p className="text-red-500 text-sm">{errors.jenjang.message}</p>}
//       </div>

//       <InputField label="Nama Lengkap" name="nama_lengkap" register={register} error={errors.nama_lengkap} />
//       <InputField label="Nama Panggilan" name="nama_panggilan" register={register} error={errors.nama_panggilan} />
//       <InputField label="NIK" name="nik" register={register} error={errors.nik} />
//       <InputField label="Nomor KK" name="nomor_kk" register={register} error={errors.nomor_kk} />

//       <div>
//         <label className="block mb-1">Jenis Kelamin</label>
//         <select {...register("jenis_kelamin")} className="w-full border rounded p-2">
//           <option value="">-- pilih --</option>
//           <option value="L">Laki-laki</option>
//           <option value="P">Perempuan</option>
//         </select>
//         {errors.jenis_kelamin && <p className="text-red-500 text-sm">{errors.jenis_kelamin.message}</p>}
//       </div>

//       <InputField label="Tempat Lahir" name="tempat_lahir" register={register} error={errors.tempat_lahir} />
//       <InputField label="Tanggal Lahir" name="tgl_lahir" type="date" register={register} error={errors.tgl_lahir} />

//       <div>
//         <label className="block mb-1">Kebutuhan Khusus</label>
//         <select {...register("keb_khusus")} className="w-full border rounded p-2">
//           <option value="">-- pilih --</option>
//           <option value="Ya">Ya</option>
//           <option value="Tidak">Tidak</option>
//         </select>
//         {errors.keb_khusus && <p className="text-red-500 text-sm">{errors.keb_khusus.message}</p>}
//       </div>
//       {keb_khusus === "Ya" && (
//         <div>
//           <label className="block mb-1">Jenis Kebutuhan Khusus</label>
//           <Input {...register("jenis_kebkus")} />
//           {errors.jenis_kebkus && <p className="text-red-500 text-sm">{errors.jenis_kebkus.message}</p>}
//         </div>
//       )}

//       <InputField label="Sekolah Asal" name="sekolah_asal" register={register} error={errors.sekolah_asal} />

//       <div>
//         <label className="block mb-1">Agama</label>
//         <select {...register("agama")} className="w-full border rounded p-2">
//           <option value="">-- pilih --</option>
//           <option value="Islam">Islam</option>
//           <option value="Lainnya">Lainnya</option>
//         </select>
//         {errors.agama && <p className="text-red-500 text-sm">{errors.agama.message}</p>}
//       </div>

//        <div>
//         <label className="block mb-1">Anak Ke-</label>
//         <Input
//           type="number"
//           {...register("anak_ke", { valueAsNumber: true })}
//         />
//         {errors.anak_ke && (
//           <p className="text-red-500 text-sm">{errors.anak_ke.message}</p>
//         )}
//       </div>
//       <div>
//         <label className="block mb-1">Jumlah Saudara Kandung</label>
//         <Input
//           type="number"
//           {...register("jml_saudara", { valueAsNumber: true })}
//         />
//         {errors.jml_saudara && (
//           <p className="text-red-500 text-sm">{errors.jml_saudara.message}</p>
//         )}
//       </div>

//       <div>
//         <label className="block mb-1">Alamat</label>
//         <Textarea {...register("alamat")} />
//         {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat.message}</p>}
//       </div>

//       <Button type="submit">Next</Button>
//     </form>
//   )
// }



// // ============= HELPER INPUT COMPONENTS ==========
// function InputField({ label, name, type = "text", register, error }) {
//   return (
//     <div>
//       <label className="block mb-1">{label}</label>
//       <Input type={type} {...register(name)} />
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   )
// }

// function TextareaField({ label, name, register, error }) {
//   return (
//     <div>
//       <label className="block mb-1">{label}</label>
//       <Textarea {...register(name)} />
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   )
// }

// function SelectField({ label, name, register, error, options }) {
//   return (
//     <div>
//       <label className="block mb-1">{label}</label>
//       <select {...register(name)} className="w-full border rounded p-2">
//         <option value="">-- pilih --</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { z } from "zod"

// ================== ZOD SCHEMA ==================
const siswaSchema = z.object({
  jenis_pendaftaran: z.string().min(1, "Pilih jenis pendaftaran"),
  jenjang: z.string().min(1, "Pilih jenjang"),
  nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  nama_panggilan: z.string().min(1, "Nama panggilan wajib diisi"),
  nik: z.string()
    .min(16, "NIK harus 16 digit")
    .max(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  nomor_kk: z.string()
    .min(16, "Nomor KK harus 16 digit")
    .max(16, "Nomor KK harus 16 digit")
    .regex(/^\d+$/, "Nomor KK hanya boleh berisi angka"),
  jenis_kelamin: z.enum(["L", "P"], {
    errorMap: () => ({ message: "Pilih jenis kelamin" })
  }),
  tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tgl_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  keb_khusus: z.enum(["Ya", "Tidak"], {
    errorMap: () => ({ message: "Pilih salah satu" })
  }),
  jenis_kebkus: z.string().optional(),
  sekolah_asal: z.string().min(1, "Sekolah asal wajib diisi"),
  agama: z.string().min(1, "Pilih agama"),
  anak_ke: z.coerce.number({
    required_error: "Isi anak ke-berapa",
    invalid_type_error: "Harus berupa angka",
  }).int("Harus bilangan bulat")
    .min(1, "Minimal 1")
    .max(20, "Maksimal 20"),
  jml_saudara: z.number({
    required_error: "Jumlah saudara wajib diisi",
    invalid_type_error: "Jumlah saudara harus berupa angka",
  })
  .min(0, { message: "Jumlah saudara minimal 0" }),

  alamat: z.string().min(10, "Alamat minimal 10 karakter"),
  kelas_ditujukan: z.string().optional(),
})
.refine(
  (data) => {
    if (data.jenis_pendaftaran === "pindahan") {
      return data.kelas_ditujukan && data.kelas_ditujukan.trim() !== ""
    }
    return true
  },
  {
    message: "Kelas yang dituju wajib diisi untuk siswa pindahan",
    path: ["kelas_ditujukan"],
  }
)
.refine(
  (data) => {
    if (data.keb_khusus === "Ya") {
      return data.jenis_kebkus && data.jenis_kebkus.trim() !== ""
    }
    return true
  },
  {
    message: "Jenis Kebutuhan Khusus wajib diisi",
    path: ["jenis_kebkus"],
  }
)

// ================== FORM SISWA ==================
export default function FormSiswa({ onNext, defaultValues = {} }) {
  const LOCAL_KEY = "formSiswa"

  // Ambil data dari localStorage
  const savedData = typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}") 
    : {}

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(siswaSchema),
    defaultValues: {
      jenis_pendaftaran: "",
      jenjang: "",
      nama_lengkap: "",
      nama_panggilan: "",
      nik: "",
      nomor_kk: "",
      jenis_kelamin: "",
      tempat_lahir: "",
      tgl_lahir: "",
      keb_khusus: "",
      jenis_kebkus: "",
      sekolah_asal: "",
      agama: "",
      anak_ke: 1,
      jml_saudara: "",
      alamat: "",
      kelas_ditujukan: "",
      ...defaultValues, // dari props parent
      ...savedData,     // overwrite dengan localStorage
    },
  })

  const values = watch()
  const jenis_pendaftaran = watch("jenis_pendaftaran")
  const keb_khusus = watch("keb_khusus")

  // Auto-save ke localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
  }, [values])

  // Clear conditional fields ketika parent berubah
  useEffect(() => {
    if (jenis_pendaftaran !== "pindahan") {
      setValue("kelas_ditujukan", "")
    }
  }, [jenis_pendaftaran, setValue])

  useEffect(() => {
    if (keb_khusus !== "Ya") {
      setValue("jenis_kebkus", "")
    }
  }, [keb_khusus, setValue])

  const submit = (values) => {
    console.log("Form Siswa submitted:", values)
    onNext(values)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
        Data Siswa
      </h2>

      {/* Jenis Pendaftaran */}
      <div>
        <label className="block mb-1 font-medium text-sm">
          Jenis Pendaftaran <span className="text-red-500">*</span>
        </label>
        <select 
          {...register("jenis_pendaftaran")} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Jenis Pendaftaran --</option>
          <option value="baru">Siswa Baru</option>
          <option value="pindahan">Pindahan</option>
        </select>
        {errors.jenis_pendaftaran && (
          <p className="text-red-500 text-sm mt-1">{errors.jenis_pendaftaran.message}</p>
        )}
      </div>

      {/* Kelas Dituju (conditional) */}
      {jenis_pendaftaran === "pindahan" && (
        <div>
          <label className="block mb-1 font-medium text-sm">
            Kelas yang Dituju <span className="text-red-500">*</span>
          </label>
          <Input 
            {...register("kelas_ditujukan")} 
            placeholder="Contoh: Kelas 3 SD"
          />
          {errors.kelas_ditujukan && (
            <p className="text-red-500 text-sm mt-1">{errors.kelas_ditujukan.message}</p>
          )}
        </div>
      )}

      {/* Jenjang */}
      <div>
        <label className="block mb-1 font-medium text-sm">
          Jenjang <span className="text-red-500">*</span>
        </label>
        <select 
          {...register("jenjang")} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Jenjang --</option>
          <option value="KB">KB (Kelompok Bermain)</option>
          <option value="TK">TK (Taman Kanak-kanak)</option>
          <option value="SD">SD (Sekolah Dasar)</option>
        </select>
        {errors.jenjang && (
          <p className="text-red-500 text-sm mt-1">{errors.jenjang.message}</p>
        )}
      </div>

      {/* Nama Lengkap */}
      <InputField
        label="Nama Lengkap"
        name="nama_lengkap"
        register={register}
        error={errors.nama_lengkap}
        placeholder="Nama lengkap sesuai akta kelahiran"
        required
      />

      {/* Nama Panggilan */}
      <InputField
        label="Nama Panggilan"
        name="nama_panggilan"
        register={register}
        error={errors.nama_panggilan}
        placeholder="Nama panggilan sehari-hari"
        required
      />

      {/* NIK */}
      <InputField
        label="NIK (Nomor Induk Kependudukan)"
        name="nik"
        register={register}
        error={errors.nik}
        placeholder="16 digit angka"
        maxLength={16}
        required
      />

      {/* Nomor KK */}
      <InputField
        label="Nomor Kartu Keluarga (KK)"
        name="nomor_kk"
        register={register}
        error={errors.nomor_kk}
        placeholder="16 digit angka"
        maxLength={16}
        required
      />

      {/* Jenis Kelamin */}
      <div>
        <label className="block mb-1 font-medium text-sm">
          Jenis Kelamin <span className="text-red-500">*</span>
        </label>
        <select 
          {...register("jenis_kelamin")} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Jenis Kelamin --</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        {errors.jenis_kelamin && (
          <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin.message}</p>
        )}
      </div>

      {/* Tempat Lahir */}
      <InputField
        label="Tempat Lahir"
        name="tempat_lahir"
        register={register}
        error={errors.tempat_lahir}
        placeholder="Kota/Kabupaten kelahiran"
        required
      />

      {/* Tanggal Lahir */}
      <InputField
        label="Tanggal Lahir"
        name="tgl_lahir"
        type="date"
        register={register}
        error={errors.tgl_lahir}
        required
      />

      {/* Kebutuhan Khusus */}
      <div>
        <label className="block mb-1 font-medium text-sm">
          Kebutuhan Khusus <span className="text-red-500">*</span>
        </label>
        <select 
          {...register("keb_khusus")} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih --</option>
          <option value="Ya">Ya</option>
          <option value="Tidak">Tidak</option>
        </select>
        {errors.keb_khusus && (
          <p className="text-red-500 text-sm mt-1">{errors.keb_khusus.message}</p>
        )}
      </div>

      {/* Jenis Kebutuhan Khusus (conditional) */}
      {keb_khusus === "Ya" && (
        <div>
          <label className="block mb-1 font-medium text-sm">
            Jenis Kebutuhan Khusus <span className="text-red-500">*</span>
          </label>
          <Input 
            {...register("jenis_kebkus")} 
            placeholder="Sebutkan jenis kebutuhan khusus"
          />
          {errors.jenis_kebkus && (
            <p className="text-red-500 text-sm mt-1">{errors.jenis_kebkus.message}</p>
          )}
        </div>
      )}

      {/* Sekolah Asal */}
      <InputField
        label="Sekolah Asal"
        name="sekolah_asal"
        register={register}
        error={errors.sekolah_asal}
        placeholder="Nama sekolah sebelumnya (isi '-' jika tidak ada)"
        required
      />

      {/* Agama */}
      <div>
        <label className="block mb-1 font-medium text-sm">
          Agama <span className="text-red-500">*</span>
        </label>
        <select 
          {...register("agama")} 
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Pilih Agama --</option>
          <option value="Islam">Islam</option>
          <option value="Kristen">Kristen</option>
          <option value="Katolik">Katolik</option>
          <option value="Hindu">Hindu</option>
          <option value="Buddha">Buddha</option>
          <option value="Konghucu">Konghucu</option>
        </select>
        {errors.agama && (
          <p className="text-red-500 text-sm mt-1">{errors.agama.message}</p>
        )}
      </div>

      {/* Anak Ke */}
      <div>
        <label className="block mb-1 font-medium text-sm">
          Anak Ke- <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          {...register("anak_ke")}
          placeholder="Urutan anak dalam keluarga"
          min="1"
          max="20"
        />
        {errors.anak_ke && (
          <p className="text-red-500 text-sm mt-1">{errors.anak_ke.message}</p>
        )}
      </div>

      {/* Jumlah Saudara */}
      <div>
        <label className="block mb-1 font-medium text-sm">
          Jumlah Saudara Kandung <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          {...register("jml_saudara", { valueAsNumber: true })}
          placeholder="Jumlah saudara kandung (isi 0 jika anak tunggal)"
          min="0"
          max="20"
        />
        {errors.jml_saudara && (
          <p className="text-red-500 text-sm mt-1">{errors.jml_saudara.message}</p>
        )}
      </div>

      {/* Alamat */}
      <div>
        <label className="block mb-1 font-medium text-sm">
          Alamat Lengkap <span className="text-red-500">*</span>
        </label>
        <Textarea 
          {...register("alamat")} 
          placeholder="Alamat lengkap tempat tinggal saat ini"
          rows={3}
        />
        {errors.alamat && (
          <p className="text-red-500 text-sm mt-1">{errors.alamat.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit" className="w-full sm:w-auto">
          Lanjut ke Data Orang Tua →
        </Button>
      </div>
    </form>
  )
}

// ============= HELPER COMPONENT ==========
function InputField({ 
  label, 
  name, 
  type = "text", 
  register, 
  error, 
  placeholder = "", 
  required = false,
  maxLength 
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input 
        type={type} 
        {...register(name)} 
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}