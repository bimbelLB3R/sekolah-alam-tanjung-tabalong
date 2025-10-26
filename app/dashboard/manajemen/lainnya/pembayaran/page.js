


// app/pembayaran/page.jsx
import FormPembayaran from "@/app/dashboard/components/lain-lain/pembayaran/FormPembayaran";
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCompare, Plus, Warehouse } from "lucide-react";
export default function PembayaranPage() {
  const quickLinks = [
      { name: "Data Pembayaran", href: `/dashboard/manajemen/lainnya/pembayaran/list`,icon:Warehouse },
      { name: "Data Piutang Siswa", href: `/dashboard/data-kelas`,icon:GitCompare },
      // { name: "Raport", href: `/manajemen/dapodik/raport`,icon:BookOpenCheck },
      // { name: "Bakat", href: `/manajemen/dapodik/bakat`,icon:Target },
      // { name: "Pembayaran", href: `/manajemen/dapodik/pembayaran`, icon:Banknote },
    ]
  return (
       <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
          <div className="w-full max-w-3xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {quickLinks.map((link) => {
                      const Icon = link.icon
                      return (
                      <Link key={link.name} href={link.href}>
                          <Card className="cursor-pointer hover:shadow-md transition p-3 text-center">
                          <CardContent className="p-2 flex flex-col items-center justify-center text-green-600">
                              <Icon className="w-6 h-6 mb-1" />
                              <span className="text-sm font-semibold">{link.name}</span>
                          </CardContent>
                          </Card>
                      </Link>
                      )
                  })}
                </div>
                <div className="container mx-auto py-10">     
                  <FormPembayaran />
                </div>
          </div>
    </div>
  );
}