"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import FormSiswa from "../../components/ppdb/FormSiswa"
import FormAyah from "../../components/ppdb/FormAyah"
import FormIbu from "../../components/ppdb/FormIbu"
import FormKontak from "../../components/ppdb/FormKontak"


// ================== MAIN PAGE ==================
export default function PendaftaranPage() {
  const [step, setStep] = useState(0)
  const [dataSiswa, setDataSiswa] = useState({})
  const [dataAyah, setDataAyah] = useState({})
  const [dataIbu, setDataIbu] = useState({})
  const [dataKontak, setDataKontak] = useState({})
  // console.log(dataKontak)

  const handleNext = (values) => {
    if (step === 0) setDataSiswa(values)
    if (step === 1) setDataAyah(values)
    if (step === 2) setDataIbu(values)
    if (step === 3) setDataKontak(values)
    setStep((s) => s + 1)
  }

  const handleBack = () => setStep((s) => s - 1)

  
  const onSubmitData=(values) => {
  const finalData = { ...dataSiswa, ...dataAyah, ...dataIbu, ...values }
    console.log("Kirim ke API:", finalData)
     // TODO: fetch("/api/pendaftaran", { method: "POST", body: JSON.stringify(finalData) })
     localStorage.removeItem("formSiswa")
    localStorage.removeItem("formAyah")
    localStorage.removeItem("formIbu")
    localStorage.removeItem("formKontak")
}

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Formulir Pendaftaran</h1>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="siswa" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <FormSiswa onNext={handleNext} defaultValues={dataSiswa} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="ayah" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <FormAyah onNext={handleNext} onBack={handleBack} defaultValues={dataAyah} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="ibu" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <FormIbu onNext={handleNext} onBack={handleBack} defaultValues={dataIbu} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="kontak" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <FormKontak onNext={handleNext} onBack={handleBack} onSubmitData={onSubmitData} defaultValues={dataKontak} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


