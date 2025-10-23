// "use client"

// import React, { useState } from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import FormSiswa from "../../components/ppdb/FormSiswa"
// import FormAyah from "../../components/ppdb/FormAyah"
// import FormIbu from "../../components/ppdb/FormIbu"
// import FormKontak from "../../components/ppdb/FormKontak"
// import { useRouter } from "next/navigation"


// // ================== MAIN PAGE ==================
// export default function PendaftaranPage() {
//   const [step, setStep] = useState(0)
//   const [dataSiswa, setDataSiswa] = useState({})
//   const [dataAyah, setDataAyah] = useState({})
//   const [dataIbu, setDataIbu] = useState({})
//   const [dataKontak, setDataKontak] = useState({})
//   const router=useRouter();
//   const [loading, setLoading] = useState(false);
//   // console.log(dataKontak)

//   const handleNext = (values) => {
//     if (step === 0) setDataSiswa(values)
//     if (step === 1) setDataAyah(values)
//     if (step === 2) setDataIbu(values)
//     if (step === 3) setDataKontak(values)
//     setStep((s) => s + 1)
//   }

//   const handleBack = () => setStep((s) => s - 1)

  
//   const onSubmitData = async (values) => {
//     // e.preventDefault();
//     const finalData = { ...dataSiswa, ...dataAyah, ...dataIbu, ...values };
//     console.log("Kirim ke API:", finalData);
//     // return false
//     try {
//       setLoading(true);
//       const res = await fetch("/api/pendaftaran", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(finalData),
//       });

//       const result = await res.json();
//       console.log("Respon API:", result);

//       if (result.success) {
//         // localStorage.removeItem("formSiswa");
//         // localStorage.removeItem("formAyah");
//         // localStorage.removeItem("formIbu");
//         // localStorage.removeItem("formKontak");
//         alert("Data Berhasil Dikirim!");
//         router.push("/");
//       } else {
//         alert("Gagal simpan: " + result.message);
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Terjadi kesalahan saat mengirim data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Formulir Pendaftaran</h1>

//       <AnimatePresence mode="wait">
//         {step === 0 && (
//           <motion.div key="siswa" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
//             <FormSiswa onNext={handleNext} defaultValues={dataSiswa} />
//           </motion.div>
//         )}
//         {step === 1 && (
//           <motion.div key="ayah" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
//             <FormAyah onNext={handleNext} onBack={handleBack} defaultValues={dataAyah} />
//           </motion.div>
//         )}
//         {step === 2 && (
//           <motion.div key="ibu" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
//             <FormIbu onNext={handleNext} onBack={handleBack} defaultValues={dataIbu} />
//           </motion.div>
//         )}
//         {step === 3 && (
//           <motion.div key="kontak" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
//             <FormKontak onNext={handleNext} onBack={handleBack} onSubmitData={onSubmitData} defaultValues={dataKontak} loading={loading}/>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }


"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import FormSiswa from "../../components/ppdb/FormSiswa"
import FormAyah from "../../components/ppdb/FormAyah"
import FormIbu from "../../components/ppdb/FormIbu"
import FormKontak from "../../components/ppdb/FormKontak"
import { useRouter } from "next/navigation"

export default function PendaftaranPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  // State untuk menyimpan semua data dari form wizard
  const [allFormData, setAllFormData] = useState({})

  // Handler untuk next step
  const handleNext = (values) => {
    // Gabungkan data baru ke state global
    setAllFormData(prev => ({ ...prev, ...values }))
    setStep(s => s + 1)
  }

  // Handler untuk back step
  const handleBack = () => {
    setStep(s => s - 1)
  }

  // Handler final submit (dipanggil dari FormKontak)
  const handleFinalSubmit = async (finalData) => {
    console.log("✅ Data final yang berhasil dikirim:", finalData)
    
    // Clear all localStorage
    localStorage.removeItem("formSiswa")
    localStorage.removeItem("formAyah")
    localStorage.removeItem("formIbu")
    localStorage.removeItem("formKontak")
    
    // Reset state
    setAllFormData({})
    
    // Redirect ke halaman sukses dengan ID pendaftaran
    if (finalData.id) {
      router.push(`/ppdb/formulir/success?id=${finalData.id}`)
    } else {
      router.push("/ppdb/formulir/success")
    }
  }

  // Step configuration
  const steps = [
    { title: "Data Siswa", component: FormSiswa },
    { title: "Data Ayah", component: FormAyah },
    { title: "Data Ibu", component: FormIbu },
    { title: "Kontak & Lampiran", component: FormKontak },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Formulir Pendaftaran PPDB
          </h1>
          <p className="text-gray-600">
            Silakan lengkapi semua data dengan benar
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white shadow-lg px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      transition-all duration-300
                      ${
                        i < step
                          ? "bg-green-500 text-white"
                          : i === step
                          ? "bg-blue-600 text-white ring-4 ring-blue-200"
                          : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span
                    className={`
                      text-xs mt-2 font-medium hidden sm:block
                      ${i === step ? "text-blue-600" : "text-gray-500"}
                    `}
                  >
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded transition-all duration-300
                      ${i < step ? "bg-green-500" : "bg-gray-200"}
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6 min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="siswa"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <FormSiswa 
                  onNext={handleNext} 
                  defaultValues={allFormData} 
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="ayah"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <FormAyah
                  onNext={handleNext}
                  onBack={handleBack}
                  defaultValues={allFormData}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="ibu"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <FormIbu
                  onNext={handleNext}
                  onBack={handleBack}
                  defaultValues={allFormData}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="kontak"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <FormKontak
                  onBack={handleBack}
                  onSubmitData={handleFinalSubmit}
                  defaultValues={allFormData}
                  loading={loading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Butuh bantuan? Hubungi{" "}
            <a href="https://wa.me/6285752112725" className="text-blue-600 hover:underline">
              085752112725
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}