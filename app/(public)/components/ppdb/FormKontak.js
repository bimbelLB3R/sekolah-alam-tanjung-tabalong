// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { useEffect } from "react"

// const kontakSchema = z.object({
//   no_hp_ayah: z.string().min(1, "No HP ayah wajib diisi"),
//   no_hp_ibu: z.string().min(1, "No HP ibu wajib diisi"),
//   email: z.email("Format email tidak valid"),
// })
// // ================== FORM KONTAK ==================
// export default function FormKontak({ loading, onBack, defaultValues,onSubmitData }) {
//   const LOCAL_KEY = "formKontak"
//   const savedData =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
//       : {}
//   const { register, handleSubmit, formState: { errors },watch } = useForm({
//     resolver: zodResolver(kontakSchema),
//     defaultValues: {
//       ...defaultValues, // dari props parent
//       ...savedData,     // overwrite dengan localStorage
//     },
//   })
//   const values = watch()
//       useEffect(() => {
//         localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
//       }, [values])

//   const submit = (values,e) => onSubmitData(values,e)

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-4">
//       <InputField label="No HP Ayah" name="no_hp_ayah" register={register} error={errors.no_hp_ayah} />
//       <InputField label="No HP Ibu" name="no_hp_ibu" register={register} error={errors.no_hp_ibu} />
//       <InputField label="Email" name="email" type="email" register={register} error={errors.email} />

//       <div className="flex justify-between">
//         <Button type="button" onClick={onBack} variant="outline">Back</Button>
//         <Button type="submit" disabled={loading}>
//           {loading?("menyimpan data..."):("Kirim")}
//           </Button>
//       </div>
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

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// ================== SCHEMA ==================
const kontakSchema = z.object({
  no_hp_ayah: z.string().min(1, "No HP ayah wajib diisi"),
  no_hp_ibu: z.string().min(1, "No HP ibu wajib diisi"),
  email: z.email({ message: "Format email tidak valid" }),
})

export default function FormKontak({ loading, onBack, defaultValues, onSubmitData }) {
  const LOCAL_KEY = "formKontak"

  // ================== STATE FILES ==================
  const [buktiBayar, setBuktiBayar] = useState(null)
  const [fotoAnak, setFotoAnak] = useState(null)
  const [fotoKia, setFotoKia] = useState(null)
  const [kkPdf, setKkPdf] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  // ================== FORM ==================
  const savedData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
      : {}

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(kontakSchema),
    defaultValues: {
      ...defaultValues,
      ...savedData,
    },
  })

  const values = watch()
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
  }, [values])

  // ================== HANDLE SUBMIT ==================
  const submit = async (values) => {
    if (!buktiBayar || !fotoAnak || !fotoKia || !kkPdf) {
      alert("Harap lengkapi semua lampiran sebelum mengirim.")
      return
    }

    try {
      setUploading(true)
      setProgress(0)

      // Upload ke S3 lewat API route kita sendiri
      const files = { buktiBayar, fotoAnak, fotoKia, kkPdf }
      const uploadedLinks = {}

      for (const key in files) {
        const formData = new FormData()
        formData.append("file", files[key])

        const res = await fetch("/api/pendaftaran/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) throw new Error("Gagal upload " + key)
        const data = await res.json()
        uploadedLinks[key] = data.url

        // Simulasi progress (atau pakai axios untuk real progress)
        setProgress((prev) => prev + 25)
      }

      const finalDataKontak = { ...values, ...uploadedLinks }
      onSubmitData(finalDataKontak) // Kirim ke API pendaftaran

      // Clear local storage & state
      localStorage.removeItem(LOCAL_KEY)
      setBuktiBayar(null)
      setFotoAnak(null)
      setFotoKia(null)
      setKkPdf(null)
      setUploading(false)
      setProgress(100)
    } catch (err) {
      console.error(err)
      setUploading(false)
      alert("Gagal mengupload lampiran.")
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <InputField label="No HP Ayah" name="no_hp_ayah" register={register} error={errors.no_hp_ayah} />
      <InputField label="No HP Ibu" name="no_hp_ibu" register={register} error={errors.no_hp_ibu} />
      <InputField label="Email" name="email" type="email" register={register} error={errors.email} />

      {/* Upload Files */}
      <div>
        <label className="block mb-1">Foto Bukti Pembayaran</label>
        <Input type="file" accept="image/*" onChange={(e) => setBuktiBayar(e.target.files[0])} />
      </div>
      <div>
        <label className="block mb-1">Foto Anak (2x3 cm latar merah)</label>
        <Input type="file" accept="image/*" onChange={(e) => setFotoAnak(e.target.files[0])} />
      </div>
      <div>
        <label className="block mb-1">Foto KIA</label>
        <Input type="file" accept="image/*" onChange={(e) => setFotoKia(e.target.files[0])} />
      </div>
      <div>
        <label className="block mb-1">Foto Kartu Keluarga</label>
        <Input type="file" accept="image/*" onChange={(e) => setKkPdf(e.target.files[0])} />
      </div>
      {/* <div>
        <label className="block mb-1">Kartu Keluarga (PDF)</label>
        <Input type="file" accept="application/pdf" onChange={(e) => setKkPdf(e.target.files[0])} />
      </div> */}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-sm mt-1 text-gray-600">Mengunggah {progress}%</p>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" onClick={onBack} variant="outline">
          Back
        </Button>
        <Button type="submit" disabled={uploading || loading}>
          {uploading ? "Mengunggah lampiran..." : loading ? "Menyimpan data..." : "Kirim"}
        </Button>
      </div>
    </form>
  )
}

function InputField({ label, name, type = "text", register, error }) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <Input type={type} {...register(name)} />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  )
}
