"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Skema validasi Zod
const schema = z.object({
  guru_pj: z.string().min(1, "Nama Guru/PJ wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
  asal_sekolah: z.string().min(1, "Asal sekolah wajib diisi"),
  kontak_pj: z
    .string()
    .min(1, "Kontak PJ wajib diisi")
    .regex(/^[0-9]+$/, "Kontak PJ harus berupa angka"),
  siswa: z.array(z.string().min(1, "Nama siswa wajib diisi")).min(1),
})

export default function FormEventFpt() {
  const router=useRouter();
  const [siswa, setSiswa] = useState([""])
  const [loading, setLoading] = useState(false) // 🔄 state loading

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      guru_pj: "",
      jabatan: "",
      asal_sekolah: "",
      kontak_pj: "",
      siswa: [""],
    },
  })

  const handleAddSiswa = () => {
    if (siswa.length >= 5) return // ✅ Batasi maksimal 5 siswa
    setSiswa([...siswa, ""])
    setValue("siswa", [...siswa, ""])
  }

  const handleSiswaChange = (index, value) => {
    const newSiswa = [...siswa]
    newSiswa[index] = value
    setSiswa(newSiswa)
    setValue("siswa", newSiswa)
  }

  const handleRemoveSiswa = (index) => {
    const newSiswa = [...siswa]
    newSiswa.splice(index, 1)
    setSiswa(newSiswa)
    setValue("siswa", newSiswa)
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true) // mulai loading
    //   console.log("Submit:", data)

      await fetch("/api/events/peserta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      reset()
      setSiswa([""])
      router.push("/")
    } catch (err) {
      console.error("Gagal submit:", err)
    } finally {
      setLoading(false) // selesai loading
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Form Pendaftaran Peserta Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Nama Guru / PJ" {...register("guru_pj")} />
            {errors.guru_pj && (
              <p className="text-red-500 text-sm">{errors.guru_pj.message}</p>
            )}
          </div>

          <div>
            <Input placeholder="Jabatan" {...register("jabatan")} />
            {errors.jabatan && (
              <p className="text-red-500 text-sm">{errors.jabatan.message}</p>
            )}
          </div>

          <div>
            <Input placeholder="Asal Sekolah" {...register("asal_sekolah")} />
            {errors.asal_sekolah && (
              <p className="text-red-500 text-sm">{errors.asal_sekolah.message}</p>
            )}
          </div>

          <div>
            <Input placeholder="Kontak PJ (HP/WA)" {...register("kontak_pj")} />
            {errors.kontak_pj && (
              <p className="text-red-500 text-sm">{errors.kontak_pj.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Nama Lengkap Siswa</Label>
            {siswa.map((val, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  placeholder={`Nama siswa ${idx + 1}`}
                  value={val}
                  onChange={(e) => handleSiswaChange(idx, e.target.value)}
                />
                {siswa.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveSiswa(idx)}
                  >
                    Hapus
                  </Button>
                )}
              </div>
            ))}
            {errors.siswa && (
              <p className="text-red-500 text-sm">{errors.siswa.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSiswa}
              className="mt-2"
              disabled={siswa.length >= 5} // ✅ disable kalau sudah 5
            >
              + Tambah Siswa
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
