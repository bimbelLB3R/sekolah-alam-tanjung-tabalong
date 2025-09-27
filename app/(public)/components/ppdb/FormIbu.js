import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

const ibuSchema = z.object({
  namaIbu: z.string().min(1, "Nama ibu wajib diisi"),
  tempatLahirIbu: z.string().min(1, "Tempat lahir ibu wajib diisi"),
  tglLahirIbu: z.string().min(1, "Tanggal lahir ibu wajib diisi"),
  pendidikanIbu: z.string().min(1, "Pilih pendidikan terakhir"),
  alamatIbu: z.string().min(1, "Alamat ibu wajib diisi"),
  pekerjaanIbu: z.string().min(1, "Pekerjaan ibu wajib diisi"),
  gajiIbu: z.string().min(1, "Rentang gaji wajib diisi"),
})

// ================== FORM IBU ==================
export default function FormIbu({ onNext, onBack, defaultValues }) {
  const LOCAL_KEY = "formIbu"
  const savedData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
      : {}
  const { register, handleSubmit, formState: { errors }, watch} = useForm({
    resolver: zodResolver(ibuSchema),
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
      <InputField label="Nama Ibu" name="namaIbu" register={register} error={errors.namaIbu} />
      <InputField label="Tempat Lahir Ibu" name="tempatLahirIbu" register={register} error={errors.tempatLahirIbu} />
      <InputField label="Tanggal Lahir Ibu" name="tglLahirIbu" type="date" register={register} error={errors.tglLahirIbu} />

      <SelectField label="Pendidikan Terakhir Ibu" name="pendidikanIbu" register={register} error={errors.pendidikanIbu}
        options={["SD", "SMP", "SMA", "S1", "S2"]} />

      <TextareaField label="Alamat Ibu" name="alamatIbu" register={register} error={errors.alamatIbu} />
      <InputField label="Pekerjaan Ibu" name="pekerjaanIbu" register={register} error={errors.pekerjaanIbu} />
      <InputField label="Rentang Gaji Ibu" name="gajiIbu" register={register} error={errors.gajiIbu} />

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