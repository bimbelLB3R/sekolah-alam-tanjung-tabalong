

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// // ================== SCHEMA ==================
// const kontakSchema = z.object({
//   no_hp_ayah: z.string().min(1, "No HP ayah wajib diisi"),
//   no_hp_ibu: z.string().min(1, "No HP ibu wajib diisi"),
//   email: z.email({ message: "Format email tidak valid" }),
// })

// export default function FormKontak({ loading, onBack, defaultValues, onSubmitData }) {
//   const LOCAL_KEY = "formKontak"

//   // ================== STATE FILES ==================
//   const [buktiBayar, setBuktiBayar] = useState(null)
//   const [fotoAnak, setFotoAnak] = useState(null)
//   const [fotoKia, setFotoKia] = useState(null)
//   const [kkPdf, setKkPdf] = useState(null)
//   const [uploading, setUploading] = useState(false)
//   const [progress, setProgress] = useState(0)

//   // ================== FORM ==================
//   const savedData =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
//       : {}

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm({
//     resolver: zodResolver(kontakSchema),
//     defaultValues: {
//       ...defaultValues,
//       ...savedData,
//     },
//   })

//   const values = watch()
//   useEffect(() => {
//     localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
//   }, [values])

//   // ================== HANDLE SUBMIT ==================
//   const submit = async (values) => {
//     if (!buktiBayar || !fotoAnak || !fotoKia || !kkPdf) {
//       alert("Harap lengkapi semua lampiran sebelum mengirim.")
//       return
//     }

//     try {
//       setUploading(true)
//       setProgress(0)

//       // Upload ke S3 lewat API route kita sendiri
//       const files = { buktiBayar, fotoAnak, fotoKia, kkPdf }
//       const uploadedLinks = {}

//       for (const key in files) {
//         const formData = new FormData()
//         formData.append("file", files[key])

//         const res = await fetch("/api/pendaftaran/upload", {
//           method: "POST",
//           body: formData,
//         })

//         if (!res.ok) throw new Error("Gagal upload " + key)
//         const data = await res.json()
//         uploadedLinks[key] = data.url

//         // Simulasi progress (atau pakai axios untuk real progress)
//         setProgress((prev) => prev + 25)
//       }

//       const finalDataKontak = { ...values, ...uploadedLinks }
//       onSubmitData(finalDataKontak) // Kirim ke API pendaftaran

//       // Clear local storage & state
//       localStorage.removeItem(LOCAL_KEY)
//       setBuktiBayar(null)
//       setFotoAnak(null)
//       setFotoKia(null)
//       setKkPdf(null)
//       setUploading(false)
//       setProgress(100)
//     } catch (err) {
//       console.error(err)
//       setUploading(false)
//       alert("Gagal mengupload lampiran.")
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-4">
//       <InputField label="No HP Ayah" name="no_hp_ayah" register={register} error={errors.no_hp_ayah} />
//       <InputField label="No HP Ibu" name="no_hp_ibu" register={register} error={errors.no_hp_ibu} />
//       <InputField label="Email" name="email" type="email" register={register} error={errors.email} />

//       {/* Upload Files */}
//       <div>
//         <label className="block mb-1">Foto Bukti Pembayaran</label>
//         <Input type="file" accept="image/*" onChange={(e) => setBuktiBayar(e.target.files[0])} />
//       </div>
//       <div>
//         <label className="block mb-1">Foto Anak (2x3 cm latar merah)</label>
//         <Input type="file" accept="image/*" onChange={(e) => setFotoAnak(e.target.files[0])} />
//       </div>
//       <div>
//         <label className="block mb-1">Foto KIA</label>
//         <Input type="file" accept="image/*" onChange={(e) => setFotoKia(e.target.files[0])} />
//       </div>
//       <div>
//         <label className="block mb-1">Foto Kartu Keluarga</label>
//         <Input type="file" accept="image/*" onChange={(e) => setKkPdf(e.target.files[0])} />
//       </div>
//       {/* <div>
//         <label className="block mb-1">Kartu Keluarga (PDF)</label>
//         <Input type="file" accept="application/pdf" onChange={(e) => setKkPdf(e.target.files[0])} />
//       </div> */}

//       {uploading && (
//         <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//           <div
//             className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           ></div>
//           <p className="text-sm mt-1 text-gray-600">Mengunggah {progress}%</p>
//         </div>
//       )}

//       <div className="flex justify-between pt-2">
//         <Button type="button" onClick={onBack} variant="outline">
//           Back
//         </Button>
//         <Button type="submit" disabled={uploading || loading}>
//           {uploading ? "Mengunggah lampiran..." : loading ? "Menyimpan data..." : "Kirim"}
//         </Button>
//       </div>
//     </form>
//   )
// }

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
  email: z.string().email({ message: "Format email tidak valid" }),
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
  const [uploadStatus, setUploadStatus] = useState("")

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

  // ================== HANDLE SUBMIT (REFACTORED) ==================
  const submit = async (values) => {
    // Validasi file wajib diisi
    if (!buktiBayar || !fotoAnak || !fotoKia || !kkPdf) {
      alert("Harap lengkapi semua lampiran sebelum mengirim.")
      return
    }

    // Validasi ukuran file (max 5MB per file)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const files = { buktiBayar, fotoAnak, fotoKia, kkPdf }
    
    for (const [key, file] of Object.entries(files)) {
      if (file.size > maxSize) {
        alert(`File ${key} terlalu besar. Maksimal 5MB per file.`)
        return
      }
    }

    let pendaftaranId = null

    try {
      setUploading(true)
      setProgress(0)
      setUploadStatus("Menyimpan data pendaftaran...")

      // STEP 1: Gabungkan semua data dari form wizard
      const allFormData = {
        ...defaultValues, // Data dari form sebelumnya
        ...values,        // Data dari form kontak ini
      }

      console.log("Data yang akan dikirim:", allFormData)

      // STEP 2: Simpan data pendaftaran dulu (tanpa file)
      const pendaftaranRes = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allFormData),
      })
      
      if (!pendaftaranRes.ok) {
        const errorData = await pendaftaranRes.json()
        throw new Error(errorData.message || "Gagal menyimpan data pendaftaran")
      }

      const { id } = await pendaftaranRes.json()
      pendaftaranId = id
      setProgress(10)
      console.log(pendaftaranId)
      // STEP 3: Upload files dengan pendaftaran ID
      setUploadStatus("Mengunggah lampiran...")
      const uploadedLinks = {}
      const fileKeys = Object.keys(files)
      const progressPerFile = 70 / fileKeys.length // 70% untuk upload (10-80%)

      for (let i = 0; i < fileKeys.length; i++) {
        const key = fileKeys[i]
        const file = files[key]
        
        setUploadStatus(`Mengunggah ${getLabelFile(key)}... (${i + 1}/${fileKeys.length})`)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("pendaftaranId", pendaftaranId)

        const uploadRes = await fetch("/api/pendaftaran/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json()
          throw new Error(errorData.error || `Gagal upload ${getLabelFile(key)}`)
        }

        const data = await uploadRes.json()
        uploadedLinks[key] = data.url
        setProgress(10 + (i + 1) * progressPerFile)
      }

      setProgress(80)

      // STEP 4: Update pendaftaran dengan file URLs
      setUploadStatus("Menyelesaikan pendaftaran...")
      const updateRes = await fetch(`/api/pendaftaran/${pendaftaranId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: uploadedLinks }),
      })

      if (!updateRes.ok) {
        throw new Error("Gagal update data pendaftaran")
      }

      setProgress(100)
      setUploadStatus("Berhasil! Pendaftaran telah tersimpan.")

      // STEP 5: Cleanup & callback
      const finalData = { 
        ...allFormData, 
        ...uploadedLinks, 
        id: pendaftaranId 
      }
      
      // Clear localStorage untuk semua form
      localStorage.removeItem(LOCAL_KEY)
      localStorage.removeItem("formBiodata")
      localStorage.removeItem("formOrtu")
      
      // Reset file states
      setBuktiBayar(null)
      setFotoAnak(null)
      setFotoKia(null)
      setKkPdf(null)

      // Callback ke parent component
      setTimeout(() => {
        onSubmitData(finalData)
      }, 1000)

    } catch (err) {
      console.error("Error submit:", err)
      setUploadStatus("❌ Gagal: " + err.message)

      // ROLLBACK: Hapus pendaftaran jika sudah tersimpan
      if (pendaftaranId) {
        setUploadStatus("Membatalkan pendaftaran...")
        try {
          await fetch(`/api/pendaftaran/${pendaftaranId}`, {
            method: "DELETE",
          })
          console.log("✅ Rollback berhasil, pendaftaran dihapus")
          setUploadStatus("❌ Pendaftaran dibatalkan")
        } catch (rollbackErr) {
          console.error("❌ Gagal rollback:", rollbackErr)
          setUploadStatus("❌ Gagal membatalkan, hubungi admin")
        }
      }

      alert("Gagal mengirim data: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  // Helper untuk label file
  function getLabelFile(key) {
    const labels = {
      buktiBayar: "Bukti Pembayaran",
      fotoAnak: "Foto Anak",
      fotoKia: "Foto KIA",
      kkPdf: "Kartu Keluarga"
    }
    return labels[key] || key
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <InputField 
        label="No HP Ayah" 
        name="no_hp_ayah" 
        register={register} 
        error={errors.no_hp_ayah}
        disabled={uploading}
      />
      <InputField 
        label="No HP Ibu" 
        name="no_hp_ibu" 
        register={register} 
        error={errors.no_hp_ibu}
        disabled={uploading}
      />
      <InputField 
        label="Email" 
        name="email" 
        type="email" 
        register={register} 
        error={errors.email}
        disabled={uploading}
      />

      {/* Upload Files */}
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-3">Lampiran Dokumen</h3>
        
        <div className="space-y-3">
          <FileInput
            label="Foto Bukti Pembayaran"
            file={buktiBayar}
            onChange={(e) => setBuktiBayar(e.target.files[0])}
            disabled={uploading}
            required
          />

          <FileInput
            label="Foto Anak (2x3 cm latar merah)"
            file={fotoAnak}
            onChange={(e) => setFotoAnak(e.target.files[0])}
            disabled={uploading}
            required
          />

          <FileInput
            label="Foto KIA"
            file={fotoKia}
            onChange={(e) => setFotoKia(e.target.files[0])}
            disabled={uploading}
            required
          />

          <FileInput
            label="Foto Kartu Keluarga"
            file={kkPdf}
            onChange={(e) => setKkPdf(e.target.files[0])}
            disabled={uploading}
            required
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          * Format: JPG, JPEG, PNG | Maksimal 5MB per file
        </p>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 flex items-center justify-center"
              style={{ width: `${progress}%` }}
            >
              {progress > 15 && (
                <span className="text-xs text-white font-semibold">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-blue-700 font-medium text-center">
            {uploadStatus}
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <Button 
          type="button" 
          onClick={onBack} 
          variant="outline"
          disabled={uploading}
        >
          ← Kembali
        </Button>
        <Button 
          type="submit" 
          disabled={uploading || loading}
          className="min-w-[120px]"
        >
          {uploading ? "Mengunggah..." : loading ? "Menyimpan..." : "Kirim Pendaftaran"}
        </Button>
      </div>
    </form>
  )
}

// Component untuk input field biasa
function InputField({ label, name, type = "text", register, error, disabled }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">
        {label} <span className="text-red-500">*</span>
      </label>
      <Input 
        type={type} 
        {...register(name)} 
        disabled={disabled}
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
}

// Component untuk file input
function FileInput({ label, file, onChange, disabled, required }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={onChange}
        disabled={disabled}
        className="w-full"
      />
      {file && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-green-600 text-sm">✓</span>
          <span className="text-sm text-gray-600 truncate">{file.name}</span>
          <span className="text-xs text-gray-400">
            ({(file.size / 1024).toFixed(0)} KB)
          </span>
        </div>
      )}
    </div>
  )
}