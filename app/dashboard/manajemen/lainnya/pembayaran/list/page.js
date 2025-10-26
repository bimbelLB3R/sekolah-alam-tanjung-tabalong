// app/pembayaran/list/page.jsx
import ListPembayaran from "@/app/dashboard/components/lain-lain/pembayaran/ListPembayaran";
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCompare, Plus, Warehouse } from "lucide-react";
export default function ListPembayaranPage() {
  const quickLinks = [
      { name: "Input Pembayaran", href: `/dashboard/manajemen/lainnya/pembayaran`,icon:Warehouse },
      { name: "Data Piutang Siswa", href: `/dashboard/data-kelas`,icon:GitCompare },
      // { name: "Raport", href: `/manajemen/dapodik/raport`,icon:BookOpenCheck },
      // { name: "Bakat", href: `/manajemen/dapodik/bakat`,icon:Target },
      // { name: "Pembayaran", href: `/manajemen/dapodik/pembayaran`, icon:Banknote },
    ]
  return   <div>
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50">
        <div className="w-full max-w-4xl">
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
            <div className="container mx-auto py-2">  
              <ListPembayaran/> 
            </div>
        </div>
    </div>
  </div>;
}