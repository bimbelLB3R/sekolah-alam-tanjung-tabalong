"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, FileText } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    id: 1,
    date: "1 Nov – 23 Feb 2026",
    title: "Pengambilan/Pengisian Formulir Gelombang I",
    icon: FileText,
  },
  {
    id: 2,
    date: "13 Januari – 28 Februari 2026",
    title: "Wawancara Orang Tua, Observasi & Sit In Gelombang I",
    icon: Users,
  },
  {
    id: 3,
    date: "20 Januari – 28 Februari 2026",
    title: "Pengumuman Penerimaan Gelombang I",
    icon: CheckCircle,
  },
  {
    id: 4,
    date: "1 Maret – 25 Mei 2026",
    title: "Pengambilan/Pengisian Formulir Gelombang II",
    icon: FileText,
  },
  {
    id: 5,
    date: "21 April – 29 Mei 2026",
    title: "Wawancara Orang Tua, Observasi & Sit In Gelombang II",
    icon: Users,
  },
  {
    id: 6,
    date: "28 April – 29 Mei 2026",
    title: "Pengumuman Penerimaan Gelombang II",
    icon: CheckCircle,
  },
]

export default function AlurPendaftaran() {
  return (
    <section className="w-full py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Alur Pendaftaran Peserta Didik <br />
          <span className="text-green-500">
            SD Alam Tanjung Tabalong T.A. 2026/2026
          </span>
        </h2> */}

        <div className="relative">
          {/* Garis timeline di kiri */}
          <div className="absolute left-5 top-0 h-full w-1 bg-green-200" />

          <div className="flex flex-col gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  {/* Bulatan step di garis */}
                  <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold">
                    {step.id}
                  </div>

                  {/* Card di kanan angka */}
                  <Card className="flex-1 shadow-md border-green-200">
                        <CardHeader className="flex flex-col sm:flex-row items-center gap-2">
                        <Icon className="w-6 h-6 text-green-500" />
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {step.date}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
