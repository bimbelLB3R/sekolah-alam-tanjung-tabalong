"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatName } from "@/lib/formatName";

export default function TabelManajemenTahfidz({data,loading,dataSiswa,handleOpenAdd,dataUser,handleOpenEdit,handleSubmit,open,submitting, setOpen,form,setForm}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // // modal state
  // const [open, setOpen] = useState(false);
  // const [form, setForm] = useState({
  //   id: null,
  //   nama_siswa: "",
  //   pembimbing: "",
  //   nama_rombel: "",
  // });
  // const [submitting, setSubmitting] = useState(false);

  const itemsPerPage = 4;


  // filter pencarian
  const filteredData = data?.filter(
    (row) =>
      row.nama_siswa?.toLowerCase().includes(search.toLowerCase()) ||
      row.nama_rombel?.toLowerCase().includes(search.toLowerCase())
  );

  // pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // // buka modal untuk tambah
  // const handleOpenAdd = () => {
  //   setForm({ id: null, nama_siswa: "", pembimbing: "", nama_rombel: "" });
  //   setOpen(true);
  // };

  // // buka modal untuk edit
  // const handleOpenEdit = (row) => {
  //   setForm({
  //     id: row.id,
  //     nama_siswa: row.nama_siswa,
  //     pembimbing: row.pembimbing,
  //     nama_rombel: row.nama_rombel,
  //   });
  //   setOpen(true);
  // };

  // // submit form
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setSubmitting(true);
  //     let res, result;

  //     if (form.id) {
  //       // update
  //       res = await fetch(`/api/tahfidz/peserta/${form.id}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(form),
  //       });
  //     } else {
  //       // insert
  //       res = await fetch("/api/tahfidz", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(form),
  //       });
  //     }

  //     result = await res.json();
  //     if (res.ok) {
  //       // alert(form.id ? "Data berhasil diperbarui" : "Peserta berhasil ditambahkan");
  //       fetchData();
  //       setOpen(false);
  //     } else {
  //       // alert(result.error || "Terjadi kesalahan");
  //       console.log(result.error)
  //     }
  //   } catch (err) {
  //     console.error("Submit error:", err);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  return (
    <Card className="w-full overflow-hidden shadow-md rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Daftar Peserta Tahfidz</h2>
          <Button onClick={handleOpenAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Peserta
          </Button>
        </div>

        {/* input pencarian */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Cari nama atau rombel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          />
        </div>
        {loading && (
        <div className="flex items-center gap-2 mb-3 text-gray-500">
          <Loader2 className="animate-spin h-4 w-4" />
          <span>Menyegarkan data...</span>
        </div>
      )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama Anak</th>
                    <th className="p-2 border">Pembimbing</th>
                    <th className="p-2 border">Rombel</th>
                    <th className="p-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-50 even:bg-gray-50/50">
                        <td className="p-2 border">{startIndex + index + 1}</td>
                        <td className="p-2 border">
                          <Link
                            href={`/dashboard/guru/tahfidz/${row.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {row.nama_siswa}
                          </Link>
                        </td>
                        <td className="p-2 border">{row.pembimbing}</td>
                        <td className="p-2 border">{row.nama_rombel}</td>
                        <td className="p-2 border">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="text-blue-500 hover:underline flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-4 space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-lg disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
        )}

        {/* modal tambah/edit */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit Peserta" : "Tambah Peserta"}
              </DialogTitle>
              <DialogDescription>Form Edit/tambah Data</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <Select
                value={form.nama_siswa}
                onValueChange={(val) => setForm({ ...form, nama_siswa: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Anak" />
                </SelectTrigger>
                <SelectContent>
                  {dataSiswa.map((ds) => (
                    <SelectItem key={ds.id} value={formatName(ds.nama_lengkap)}>
                      {formatName(ds.nama_lengkap)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
              value={form.pembimbing}
              onValueChange={(val) => setForm({ ...form, pembimbing: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Pembimbing" />
              </SelectTrigger>
              <SelectContent>
                {dataUser.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name} 
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              {/* <input
                type="text"
                placeholder="Pembimbing"
                value={form.pembimbing}
                onChange={(e) => setForm({ ...form, pembimbing: e.target.value })}
                className="w-full border p-2 rounded-lg text-sm"
                required
              /> */}
              <input
                type="text"
                placeholder="Rombel"
                value={form.nama_rombel}
                onChange={(e) => setForm({ ...form, nama_rombel: e.target.value })}
                className="w-full border p-2 rounded-lg text-sm"
                required
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Menyimpan..." : form.id ? "Update" : "Tambah"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
