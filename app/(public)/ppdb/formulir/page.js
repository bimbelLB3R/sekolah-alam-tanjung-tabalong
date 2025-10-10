"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import FormSiswa from "../../components/ppdb/FormSiswa"
import FormAyah from "../../components/ppdb/FormAyah"
import FormIbu from "../../components/ppdb/FormIbu"
import FormKontak from "../../components/ppdb/FormKontak"
import { useRouter } from "next/navigation"


// ================== MAIN PAGE ==================
export default function PendaftaranPage() {
  const [step, setStep] = useState(0)
  const [dataSiswa, setDataSiswa] = useState({})
  const [dataAyah, setDataAyah] = useState({})
  const [dataIbu, setDataIbu] = useState({})
  const [dataKontak, setDataKontak] = useState({})
  const router=useRouter();
  const [loading, setLoading] = useState(false);
  // console.log(dataKontak)

  const handleNext = (values) => {
    if (step === 0) setDataSiswa(values)
    if (step === 1) setDataAyah(values)
    if (step === 2) setDataIbu(values)
    if (step === 3) setDataKontak(values)
    setStep((s) => s + 1)
  }

  const handleBack = () => setStep((s) => s - 1)

  
  const onSubmitData = async (values) => {
    // e.preventDefault();
    const finalData = { ...dataSiswa, ...dataAyah, ...dataIbu, ...values };
    console.log("Kirim ke API:", finalData);
    // return false
    try {
      setLoading(true);
      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await res.json();
      console.log("Respon API:", result);

      if (result.success) {
        // localStorage.removeItem("formSiswa");
        // localStorage.removeItem("formAyah");
        // localStorage.removeItem("formIbu");
        // localStorage.removeItem("formKontak");
        alert("Data Berhasil Dikirim!");
        router.push("/");
      } else {
        alert("Gagal simpan: " + result.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat mengirim data");
    } finally {
      setLoading(false);
    }
  };

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
            <FormKontak onNext={handleNext} onBack={handleBack} onSubmitData={onSubmitData} defaultValues={dataKontak} loading={loading}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


