import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const kontakSchema = z.object({
  noHpAyah: z.string().min(1, "No HP ayah wajib diisi"),
  noHpIbu: z.string().min(1, "No HP ibu wajib diisi"),
  email: z.string().email("Format email tidak valid"),
})
// ================== FORM KONTAK ==================
export default function FormKontak({ onNext, onBack, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(kontakSchema),
    defaultValues,
  })

  const submit = (values) => onNext(values)

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <InputField label="No HP Ayah" name="noHpAyah" register={register} error={errors.noHpAyah} />
      <InputField label="No HP Ibu" name="noHpIbu" register={register} error={errors.noHpIbu} />
      <InputField label="Email" name="email" type="email" register={register} error={errors.email} />

      <div className="flex justify-between">
        <Button type="button" onClick={onBack} variant="outline">Back</Button>
        <Button type="submit">Submit</Button>
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
