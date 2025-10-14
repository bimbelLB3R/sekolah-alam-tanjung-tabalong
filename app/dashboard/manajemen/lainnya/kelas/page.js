"use client";

import KelasTable from "@/app/dashboard/components/lain-lain/kelas/KelasTable";
import { Button } from "@/components/ui/button";
import { GitCompare, Plus, Warehouse } from "lucide-react";
import { useState, useEffect } from "react";
import KelasFormModal from "@/app/dashboard/components/lain-lain/kelas/KelasFormModal";
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Check, X, User, AlarmClockCheck, BookOpenCheck, Target, Banknote} from "lucide-react"

export default function Page() {
  const [open, setOpen] = useState(false);
  const [kelasList, setKelasList] = useState([]);

  async function fetchKelas() {
    const res = await fetch("/api/nama-kelas", { cache: "no-store" });
    const data = await res.json();
    setKelasList(data);
  }

  useEffect(() => {
    fetchKelas();
  }, []);

  const quickLinks = [
      { name: "Bagi Kelas", href: `/dashboard/manajemen/dapodik/migrasi`,icon:Warehouse },
      { name: "Migrasi Siswa", href: `/dashboard/data-kelas`,icon:GitCompare },
      // { name: "Raport", href: `/manajemen/dapodik/raport`,icon:BookOpenCheck },
      // { name: "Bakat", href: `/manajemen/dapodik/bakat`,icon:Target },
      // { name: "Pembayaran", href: `/manajemen/dapodik/pembayaran`, icon:Banknote },
    ]

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Quick Links */}
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manajemen Kelas</h1>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus size={18}/> Tambah Kelas
        </Button>
      </div>

      

      {/* ✅ KelasTable terima data dari parent */}
      <KelasTable data={kelasList} onEditOpen={setOpen} onSuccess={fetchKelas} />

      {/* ✅ Modal panggil fetchKelas setelah submit */}
      <KelasFormModal open={open} setOpen={setOpen} onSuccess={fetchKelas}/>
    </div>
  );
}
