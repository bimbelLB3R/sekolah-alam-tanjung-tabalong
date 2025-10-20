"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import GajiFormModal from "../../components/bendahara/GajiFormModal";
import Link from "next/link";

export default function GajiPage() {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  async function fetchData() {
    const res = await fetch("/api/bendahara/listkaryawan");
    setData(await res.json());
  }

  async function handleDelete(id) {
    if (confirm("Yakin ingin menghapus data ini?")) {
      await fetch(`/api/bendahara/listkaryawan?id=${id}`, { method: "DELETE" });
      fetchData();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gaji Karyawan</h1>
        <Button onClick={() => setOpenModal(true)}>+ Tambah Karyawan</Button>
      </div>

      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nama</th>
            <th className="p-2 text-left">Jabatan</th>
            <th className="p-2 text-left">Departemen</th>
            <th className="p-2 text-right">Gaji Pokok</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-2">{row.name}</td>
              <td className="p-2">{row.jabatan}</td>
              <td className="p-2">{row.departemen}</td>
              <td className="p-2 text-right">Rp {parseInt(row.gaji_pokok).toLocaleString()}</td>
              <td className="p-2 text-center flex justify-center gap-2">
                <Button size="icon" variant="outline" onClick={() => setOpenModal(row)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => handleDelete(row.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Button size="icon" variant="outline" asChild>
                  <Link href={`/dashboard/bendahara/slip/${row.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <GajiFormModal open={openModal} setOpen={setOpenModal} onSuccess={fetchData} />
    </div>
  );
}
