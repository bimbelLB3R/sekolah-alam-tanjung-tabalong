

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

// ================== ZOD SCHEMA ==================
const ayahSchema = z.object({
  nama_ayah: z.string().min(1, "Nama ayah wajib diisi"),
  tempat_lahir_ayah: z.string().min(1, "Tempat lahir ayah wajib diisi"),
  tgl_lahir_ayah: z.string().min(1, "Tanggal lahir ayah wajib diisi"),
  pendidikan_ayah: z.enum(["SD", "SMP", "SMA", "S1", "S2"], {
    errorMap: () => ({ message: "Pilih pendidikan terakhir" })
  }),
  alamat_ayah: z.string().min(10, "Alamat minimal 10 karakter"),
  pekerjaan_ayah: z.string().min(1, "Pekerjaan ayah wajib diisi"),
  gaji_ayah: z.enum(["<1 Juta", "1-3 Juta", "3-5 Juta", "5-10 Juta", ">10 Juta"], {
    errorMap: () => ({ message: "Pilih rentang gaji" })
  }),
})

const GAJI_OPTIONS = [
  "<1 Juta",
  "1-3 Juta",
  "3-5 Juta",
  "5-10 Juta",
  ">10 Juta",
]

// ================== FORM AYAH ==================
export default function FormAyah({ onNext, onBack, defaultValues = {} }) {
  const LOCAL_KEY = "formAyah"

  // Ambil data dari localStorage
  const savedData = typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}") 
    : {}

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(ayahSchema),
    defaultValues: {
      nama_ayah: "",
      tempat_lahir_ayah: "",
      tgl_lahir_ayah: "",
      pendidikan_ayah: "",
      alamat_ayah: "",
      pekerjaan_ayah: "",
      gaji_ayah: "",
      ...defaultValues, // dari props parent
      ...savedData,     // overwrite dengan localStorage
    },
  })

  const values = watch()

  // Auto-save ke localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
  }, [values])

  const submit = (values) => {
    console.log("Form Ayah submitted:", values)
    onNext(values)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
        Data Ayah
      </h2>

      {/* Nama Ayah */}
      <InputField
        label="Nama Lengkap Ayah"
        name="nama_ayah"
        register={register}
        error={errors.nama_ayah}
        placeholder="Nama lengkap ayah kandung"
        required
      />

      {/* Tempat Lahir */}
      <InputField
        label="Tempat Lahir Ayah"
        name="tempat_lahir_ayah"
        register={register}
        error={errors.tempat_lahir_ayah}
        placeholder="Kota/Kabupaten kelahiran"
        required
      />

      {/* Tanggal Lahir */}
      <InputField
        label="Tanggal Lahir Ayah"
        name="tgl_lahir_ayah"
        type="date"
        register={register}
        error={errors.tgl_lahir_ayah}
        required
      />

      {/* Pendidikan Terakhir */}
      <SelectField
        label="Pendidikan Terakhir Ayah"
        name="pendidikan_ayah"
        register={register}
        error={errors.pendidikan_ayah}
        options={["SD", "SMP", "SMA", "S1", "S2"]}
        required
      />

      {/* Alamat */}
      <TextareaField
        label="Alamat Lengkap Ayah"
        name="alamat_ayah"
        register={register}
        error={errors.alamat_ayah}
        placeholder="Alamat tempat tinggal saat ini"
        required
      />

      {/* Pekerjaan */}
      <InputField
        label="Pekerjaan Ayah"
        name="pekerjaan_ayah"
        register={register}
        error={errors.pekerjaan_ayah}
        placeholder="Contoh: Wiraswasta, Karyawan Swasta, PNS"
        required
      />

      {/* Rentang Gaji */}
      <RadioField
        label="Rentang Gaji Ayah (per bulan)"
        name="gaji_ayah"
        options={GAJI_OPTIONS}
        register={register}
        error={errors.gaji_ayah}
        required
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button 
          type="button" 
          onClick={onBack} 
          variant="outline"
        >
          ← Kembali
        </Button>
        <Button type="submit">
          Lanjut ke Data Ibu →
        </Button>
      </div>
    </form>
  )
}

// ============= HELPER COMPONENTS ==========
function InputField({ 
  label, 
  name, 
  type = "text", 
  register, 
  error, 
  placeholder = "", 
  required = false 
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
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}

function TextareaField({ 
  label, 
  name, 
  register, 
  error, 
  placeholder = "", 
  required = false 
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Textarea 
        {...register(name)} 
        placeholder={placeholder}
        rows={3}
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}

function SelectField({ 
  label, 
  name, 
  register, 
  error, 
  options, 
  required = false 
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select 
        {...register(name)} 
        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">-- Pilih {label} --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}

function RadioField({ 
  label, 
  name, 
  options, 
  register, 
  error, 
  required = false 
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-2 pl-1">
        {options.map((opt) => (
          <label 
            key={opt} 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <input 
              type="radio" 
              value={opt} 
              {...register(name)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}