"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin } from "lucide-react"

export default function KontakPendaftaran() {
  return (
    <section id="kontak" className="w-full py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md border border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Kontak Pendaftaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              Untuk informasi lebih lanjut, silakan hubungi:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-green-500 shrink-0" />
                <span className="break-words">
                  +62 857-5211-2725
                </span>
              </li>
              
              <li className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-green-500 shrink-0" />
                <span className="break-words">
                  Jalan Tanjung Baru, Maburai RT. 01, Kec. Murung Pudak,  
                  Kab. Tabalong, Prov. Kalimantan Selatan 71571
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
