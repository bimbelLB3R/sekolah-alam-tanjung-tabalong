import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const ayahSchema = z.object({
  namaAyah: z.string().min(1, "Nama ayah wajib diisi"),
  tempatLahirAyah: z.string().min(1, "Tempat lahir ayah wajib diisi"),
  tglLahirAyah: z.string().min(1, "Tanggal lahir ayah wajib diisi"),
  pendidikanAyah: z.string().min(1, "Pilih pendidikan terakhir"),
  alamatAyah: z.string().min(1, "Alamat ayah wajib diisi"),
  pekerjaanAyah: z.string().min(1, "Pekerjaan ayah wajib diisi"),
  gajiAyah: z.string().min(1, "Rentang gaji wajib diisi"),
})
// ================== FORM AYAH ==================
export default function FormAyah({ onNext, onBack, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ayahSchema),
    defaultValues,
  })

  const submit = (values) => onNext(values)

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <InputField label="Nama Ayah" name="namaAyah" register={register} error={errors.namaAyah} />
      <InputField label="Tempat Lahir Ayah" name="tempatLahirAyah" register={register} error={errors.tempatLahirAyah} />
      <InputField label="Tanggal Lahir Ayah" name="tglLahirAyah" type="date" register={register} error={errors.tglLahirAyah} />

      <SelectField label="Pendidikan Terakhir Ayah" name="pendidikanAyah" register={register} error={errors.pendidikanAyah}
        options={["SD", "SMP", "SMA", "S1", "S2"]} />

      <TextareaField label="Alamat Ayah" name="alamatAyah" register={register} error={errors.alamatAyah} />
      <InputField label="Pekerjaan Ayah" name="pekerjaanAyah" register={register} error={errors.pekerjaanAyah} />
      <InputField label="Rentang Gaji Ayah" name="gajiAyah" register={register} error={errors.gajiAyah} />

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