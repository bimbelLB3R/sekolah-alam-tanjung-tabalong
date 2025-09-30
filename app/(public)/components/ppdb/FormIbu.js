import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

const ibuSchema = z.object({
  nama_ibu: z.string().min(1, "Nama ibu wajib diisi"),
  tempat_lahir_ibu: z.string().min(1, "Tempat lahir ibu wajib diisi"),
  tgl_lahir_ibu: z.string().min(1, "Tanggal lahir ibu wajib diisi"),
  pendidikan_ibu: z.string().min(1, "Pilih pendidikan terakhir"),
  alamat_ibu: z.string().min(1, "Alamat ibu wajib diisi"),
  pekerjaan_ibu: z.string().min(1, "Pekerjaan ibu wajib diisi"),
  gaji_ibu: z.string().min(1, "Rentang gaji wajib diisi"),
})

// ================== FORM IBU ==================
export default function FormIbu({ onNext, onBack, defaultValues }) {
  const GAJI_OPTIONS = [
  "<1 Juta",
  "1-3 Juta",
  "3-5 Juta",
  "5-10 Juta",
  ">10 Juta",
]
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
      <InputField label="Nama Ibu" name="nama_ibu" register={register} error={errors.nama_ibu} />
      <InputField label="Tempat Lahir Ibu" name="tempat_lahir_ibu" register={register} error={errors.tempat_lahir_ibu} />
      <InputField label="Tanggal Lahir Ibu" name="tgl_lahir_ibu" type="date" register={register} error={errors.tgl_lahir_ibu} />

      <SelectField label="Pendidikan Terakhir Ibu" name="pendidikan_ibu" register={register} error={errors.pendidikan_ibu}
        options={["SD", "SMP", "SMA", "S1", "S2"]} />

      <TextareaField label="Alamat Ibu" name="alamat_ibu" register={register} error={errors.alamat_ibu} />
      <InputField label="Pekerjaan Ibu" name="pekerjaan_ibu" register={register} error={errors.pekerjaan_ibu} />
      <RadioField
        label="Rentang Gaji Ibu"
        name="gaji_ibu"
        options={GAJI_OPTIONS}
        register={register}
        error={errors.gaji_ibu}
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