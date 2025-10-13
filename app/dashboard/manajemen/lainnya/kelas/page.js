"use client";

import KelasTable from "@/app/dashboard/components/lain-lain/kelas/KelasTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import KelasFormModal from "@/app/dashboard/components/lain-lain/kelas/KelasFormModal";

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

  return (
    <div className="p-4 max-w-5xl mx-auto">
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
