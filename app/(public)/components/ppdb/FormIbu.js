// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { useEffect } from "react"

// const ibuSchema = z.object({
//   nama_ibu: z.string().min(1, "Nama ibu wajib diisi"),
//   tempat_lahir_ibu: z.string().min(1, "Tempat lahir ibu wajib diisi"),
//   tgl_lahir_ibu: z.string().min(1, "Tanggal lahir ibu wajib diisi"),
//   pendidikan_ibu: z.string().min(1, "Pilih pendidikan terakhir"),
//   alamat_ibu: z.string().min(1, "Alamat ibu wajib diisi"),
//   pekerjaan_ibu: z.string().min(1, "Pekerjaan ibu wajib diisi"),
//   gaji_ibu: z.string().min(1, "Rentang gaji wajib diisi"),
// })

// // ================== FORM IBU ==================
// export default function FormIbu({ onNext, onBack, defaultValues }) {
//   const GAJI_OPTIONS = [
//   "<1 Juta",
//   "1-3 Juta",
//   "3-5 Juta",
//   "5-10 Juta",
//   ">10 Juta",
// ]
//   const LOCAL_KEY = "formIbu"
//   const savedData =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}")
//       : {}
//   const { register, handleSubmit, formState: { errors }, watch} = useForm({
//     resolver: zodResolver(ibuSchema),
//     defaultValues: {
//       ...defaultValues, // dari props parent
//       ...savedData,     // overwrite dengan localStorage
//     },
//   })

//   const values = watch()
//     useEffect(() => {
//       localStorage.setItem(LOCAL_KEY, JSON.stringify(values))
//     }, [values])

//   const submit = (values) => onNext(values)

//   return (
//     <form onSubmit={handleSubmit(submit)} className="space-y-4">
//       <InputField label="Nama Ibu" name="nama_ibu" register={register} error={errors.nama_ibu} />
//       <InputField label="Tempat Lahir Ibu" name="tempat_lahir_ibu" register={register} error={errors.tempat_lahir_ibu} />
//       <InputField label="Tanggal Lahir Ibu" name="tgl_lahir_ibu" type="date" register={register} error={errors.tgl_lahir_ibu} />

//       <SelectField label="Pendidikan Terakhir Ibu" name="pendidikan_ibu" register={register} error={errors.pendidikan_ibu}
//         options={["SD", "SMP", "SMA", "S1", "S2"]} />

//       <TextareaField label="Alamat Ibu" name="alamat_ibu" register={register} error={errors.alamat_ibu} />
//       <InputField label="Pekerjaan Ibu" name="pekerjaan_ibu" register={register} error={errors.pekerjaan_ibu} />
//       <RadioField
//         label="Rentang Gaji Ibu"
//         name="gaji_ibu"
//         options={GAJI_OPTIONS}
//         register={register}
//         error={errors.gaji_ibu}
//       />

//       <div className="flex justify-between">
//         <Button type="button" onClick={onBack} variant="outline">Back</Button>
//         <Button type="submit">Next</Button>
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

// function TextareaField({ label, name, register, error }) {
//   return (
//     <div>
//       <label className="block mb-1">{label}</label>
//       <Textarea {...register(name)} />
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   )
// }

// function SelectField({ label, name, register, error, options }) {
//   return (
//     <div>
//       <label className="block mb-1">{label}</label>
//       <select {...register(name)} className="w-full border rounded p-2">
//         <option value="">-- pilih --</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   )
// }


// function RadioField({ label, name, options, register, error }) {
//   return (
//     <div>
//       <label className="block mb-1">{label}</label>
//       <div className="space-y-2">
//         {options.map((opt) => (
//           <label key={opt} className="flex items-center space-x-2">
//             <input type="radio" value={opt} {...register(name)} />
//             <span>{opt}</span>
//           </label>
//         ))}
//       </div>
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

// ================== ZOD SCHEMA ==================
const ibuSchema = z.object({
  nama_ibu: z.string().min(1, "Nama ibu wajib diisi"),
  tempat_lahir_ibu: z.string().min(1, "Tempat lahir ibu wajib diisi"),
  tgl_lahir_ibu: z.string().min(1, "Tanggal lahir ibu wajib diisi"),
  pendidikan_ibu: z.enum(["SD", "SMP", "SMA", "S1", "S2"], {
    errorMap: () => ({ message: "Pilih pendidikan terakhir" })
  }),
  alamat_ibu: z.string().min(10, "Alamat minimal 10 karakter"),
  pekerjaan_ibu: z.string().min(1, "Pekerjaan ibu wajib diisi"),
  gaji_ibu: z.enum(["<1 Juta", "1-3 Juta", "3-5 Juta", "5-10 Juta", ">10 Juta"], {
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

// ================== FORM IBU ==================
export default function FormIbu({ onNext, onBack, defaultValues = {} }) {
  const LOCAL_KEY = "formIbu"

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
    resolver: zodResolver(ibuSchema),
    defaultValues: {
      nama_ibu: "",
      tempat_lahir_ibu: "",
      tgl_lahir_ibu: "",
      pendidikan_ibu: "",
      alamat_ibu: "",
      pekerjaan_ibu: "",
      gaji_ibu: "",
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
    console.log("Form Ibu submitted:", values)
    onNext(values)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
        Data Ibu
      </h2>

      {/* Nama Ibu */}
      <InputField
        label="Nama Lengkap Ibu"
        name="nama_ibu"
        register={register}
        error={errors.nama_ibu}
        placeholder="Nama lengkap ibu kandung"
        required
      />

      {/* Tempat Lahir */}
      <InputField
        label="Tempat Lahir Ibu"
        name="tempat_lahir_ibu"
        register={register}
        error={errors.tempat_lahir_ibu}
        placeholder="Kota/Kabupaten kelahiran"
        required
      />

      {/* Tanggal Lahir */}
      <InputField
        label="Tanggal Lahir Ibu"
        name="tgl_lahir_ibu"
        type="date"
        register={register}
        error={errors.tgl_lahir_ibu}
        required
      />

      {/* Pendidikan Terakhir */}
      <SelectField
        label="Pendidikan Terakhir Ibu"
        name="pendidikan_ibu"
        register={register}
        error={errors.pendidikan_ibu}
        options={["SD", "SMP", "SMA", "S1", "S2"]}
        required
      />

      {/* Alamat */}
      <TextareaField
        label="Alamat Lengkap Ibu"
        name="alamat_ibu"
        register={register}
        error={errors.alamat_ibu}
        placeholder="Alamat tempat tinggal saat ini"
        required
      />

      {/* Pekerjaan */}
      <InputField
        label="Pekerjaan Ibu"
        name="pekerjaan_ibu"
        register={register}
        error={errors.pekerjaan_ibu}
        placeholder="Contoh: Ibu Rumah Tangga, Wiraswasta, PNS"
        required
      />

      {/* Rentang Gaji */}
      <RadioField
        label="Rentang Gaji Ibu (per bulan)"
        name="gaji_ibu"
        options={GAJI_OPTIONS}
        register={register}
        error={errors.gaji_ibu}
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
          Lanjut ke Kontak & Lampiran →
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