import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

const kontakSchema = z.object({
  no_hp_ayah: z.string().min(1, "No HP ayah wajib diisi"),
  no_hp_ibu: z.string().min(1, "No HP ibu wajib diisi"),
  email: z.string().email("Format email tidak valid"),
})
// ================== FORM KONTAK ==================
export default function FormKontak({ loading, onBack, defaultValues,onSubmitData }) {
  const LOCAL_KEY = "formKontak"
  const savedData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
      : {}
  const { register, handleSubmit, formState: { errors },watch } = useForm({
    resolver: zodResolver(kontakSchema),
    defaultValues: {
      ...defaultValues, // dari props parent
      ...savedData,     // overwrite dengan localStorage
    },
  })
  const values = watch()
      useEffect(() => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
      }, [values])

  const submit = (values,e) => onSubmitData(values,e)

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <InputField label="No HP Ayah" name="no_hp_ayah" register={register} error={errors.no_hp_ayah} />
      <InputField label="No HP Ibu" name="no_hp_ibu" register={register} error={errors.no_hp_ibu} />
      <InputField label="Email" name="email" type="email" register={register} error={errors.email} />

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline">Back</Button>
        <Button type="submit" disabled={loading}>
          {loading?("menyimpan data..."):("Kirim")}
          </Button>
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
