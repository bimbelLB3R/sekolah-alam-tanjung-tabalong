"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Search } from "lucide-react";

export default function KelasTable({ data, onEditOpen, onSuccess }) {
  const [search, setSearch] = useState("");

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    await fetch(`/api/nama-kelas?id=${id}`, { method: "DELETE" });
    await onSuccess(); // ✅ langsung refresh data dari parent
  }

  const filtered = data.filter((row) =>
    row.kelas_lengkap.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="mb-3 flex items-center gap-2">
        <Search className="text-gray-500"/>
        <input
          type="text"
          placeholder="Cari kelas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Kelas Lengkap</th>
            <th className="text-left p-2">Wali Kelas</th>
            <th className="text-right p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row) => (
            <tr key={row.id} className="border-b">
              <td className="p-2">{row.kelas_lengkap}</td>
              <td className="p-2">{row.wali_kelas_nama}</td>
              <td className="p-2 text-right flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => onEditOpen(row)}>
                  <Pencil size={16}/>
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(row.id)}>
                  <Trash2 size={16}/>
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4 text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
