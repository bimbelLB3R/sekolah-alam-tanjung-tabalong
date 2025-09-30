import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

const ayahSchema = z.object({
  nama_ayah: z.string().min(1, "Nama ayah wajib diisi"),
  tempat_lahir_ayah: z.string().min(1, "Tempat lahir ayah wajib diisi"),
  tgl_lahir_ayah: z.string().min(1, "Tanggal lahir ayah wajib diisi"),
  pendidikan_ayah: z.string().min(1, "Pilih pendidikan terakhir"),
  alamat_ayah: z.string().min(1, "Alamat ayah wajib diisi"),
  pekerjaan_ayah: z.string().min(1, "Pekerjaan ayah wajib diisi"),
  gaji_ayah: z.string().min(1, "Rentang gaji wajib diisi"),
})
// ================== FORM AYAH ==================
export default function FormAyah({ onNext, onBack, defaultValues }) {
  const GAJI_OPTIONS = [
  "<1 Juta",
  "1-3 Juta",
  "3-5 Juta",
  "5-10 Juta",
  ">10 Juta",
]
  const LOCAL_KEY = "formAyah"
  // 1. Ambil data dari localStorage kalau ada
  const savedData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
      : {}
  const { register, handleSubmit, formState: { errors },watch } = useForm({
    resolver: zodResolver(ayahSchema),
    defaultValues: {
      ...defaultValues, // dari props parent
      ...savedData,     // overwrite dengan localStorage
    },
  })
  const values = watch()
    useEffect(() => {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
    }, [values])

  const submit = (values) => onNext(values)

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <InputField label="Nama Ayah" name="nama_ayah" register={register} error={errors.nama_ayah} />
      <InputField label="Tempat Lahir Ayah" name="tempat_lahir_ayah" register={register} error={errors.tempat_lahir_ayah} />
      <InputField label="Tanggal Lahir Ayah" name="tgl_lahir_ayah" type="date" register={register} error={errors.tgl_lahir_ayah} />

      <SelectField label="Pendidikan Terakhir Ayah" name="pendidikan_ayah" register={register} error={errors.pendidikan_ayah}
        options={["SD", "SMP", "SMA", "S1", "S2"]} />

      <TextareaField label="Alamat Ayah" name="alamat_ayah" register={register} error={errors.alamat_ayah} />
      <InputField label="Pekerjaan Ayah" name="pekerjaan_ayah" register={register} error={errors.pekerjaan_ayah} />
      <RadioField
        label="Rentang Gaji Ayah"
        name="gaji_ayah"
        options={GAJI_OPTIONS}
        register={register}
        error={errors.gaji_ayah}
      />

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline">Back</Button>
        <Button type="submit">Next</Button>
      </div>
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

function RadioField({ label, name, options, register, error }) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center space-x-2">
            <input type="radio" value={opt} {...register(name)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}