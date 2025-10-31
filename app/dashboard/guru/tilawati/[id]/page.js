"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jilidList } from "@/app/data/jilid";
import { useAuth } from "@/lib/getUserClientSide";

export default function PesertaDetailPage() {
  const { id } = useParams(); //id peserta
  const [data, setData] = useState(null);
  const [perkembangan, setPerkembangan] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log(id);
  const { user} = useAuth();
    const userName=user?.name;

  // pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  // search + filter tanggal
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // modal input/edit
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    tanggal: "",
    jilid: "",
    halaman: "",
    catatan: "",
  });

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/tilawati/${id}`);
        const json = await res.json();
        setData(json.siswa);
        setPerkembangan(json.perkembangan || []);
      } catch (err) {
        console.error("Fetch detail error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Memuat detail...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-center text-gray-500 py-10">
        Peserta tidak ditemukan.
      </p>
    );
  }

  // filter data
  const filteredBySearch = perkembangan.filter((row) =>
    row.jilid.toLowerCase().includes(search.toLowerCase())
  );
  const filteredData = filteredBySearch.filter((row) => {
    if (!startDate && !endDate) return true;
    const tgl = new Date(row.tanggal);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && tgl < start) return false;
    if (end && tgl > end) return false;
    return true;
  });

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // export PDF
  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    const margin = { top: 60, left: 80, right: 30 };

    doc.setFontSize(16);
    doc.text(
      `Laporan Perkembangan Tilawati - ${data.nama_siswa}`,
      margin.left,
      margin.top
    );

    const rows = filteredData.map((p) => [
      p.tanggal,
      p.jilid,
      p.halaman,
      p.catatan,
    ]);

    autoTable(doc, {
      head: [["Tanggal", "Jilid", "Halaman", "Catatan"]],
      body: rows,
      startY: margin.top + 20,
      margin: margin,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      didDrawPage: (d) => {
        const pageCount = doc.internal.getNumberOfPages();
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ?? pageSize.getHeight();

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Halaman ${d.pageNumber} dari ${pageCount}`,
          pageSize.width - margin.right,
          pageHeight - 10,
          { align: "right" }
        );
      },
    });

    doc.save(`perkembangan_Tilawati_${data.nama_siswa}.pdf`);
  };

  // tambah/edit data
  const handleSubmit = async () => {
    const method = editData ? "PUT" : "POST";
    const url = editData
      ? `/api/tilawati/${editData.id}`
      : `/api/tilawati/${id}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, peserta_id: id,nama_pembimbing:userName }),
    });

    if (res.ok) {
      const updated = await res.json();
      if (editData) {
        setPerkembangan((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      } else {
        setPerkembangan((prev) => [updated, ...prev]);
      }
      setOpenModal(false);
      setEditData(null);
      setForm({ tanggal: "", jilid: "", halaman: "", catatan: "" });
    }
  };

  // hapus data perkembangan berdasarkan id perkembangan
const handleDelete = async (perkembanganId) => {
  if (!confirm("Yakin ingin menghapus data ini?")) return;

  const res = await fetch(`/api/tilawati/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ perkembanganId }),
  });

  if (res.ok) {
    setPerkembangan((prev) => prev.filter((p) => p.id !== perkembanganId));
  } else {
    alert("Gagal menghapus data.");
  }
};


  return (
    <div className="p-1">
      <Card className="max-w-4xl mx-auto rounded-2xl shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Detail Peserta</h2>
            <Button
              onClick={() => {
                setOpenModal(true);
                setEditData(null);
                setForm({ tanggal: "", jilid: "", halaman: "", catatan: "" });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Input Data
            </Button>
          </div>

          <p>
            <span className="font-medium">Nama Anak:</span> {data.nama_siswa}
          </p>
          <p>
            <span className="font-medium">Rombel:</span> {data.nama_rombel}
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-4">
            Perkembangan Hafalan
          </h3>

          {/* Search & filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <Input
              type="text"
              placeholder="Cari berdasarkan jilid..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="md:w-1/3"
            />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="md:w-1/4"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="md:w-1/4"
            />
            <Button variant="default" onClick={exportPDF}>
              Export PDF
            </Button>
          </div>

          {filteredData.length > 0 ? (
            <div className="space-y-4">
              {currentData.map((row,index) => (
                <div
                  key={index}
                  className="border rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="flex justify-between items-center bg-gray-100 px-4 py-2 text-sm">
                    <div>
                      <span className="font-medium">Tanggal:</span> {row.tanggal}
                      {" | "}
                      <span className="font-medium">Jilid:</span> {row.jilid}{" "}
                      <span className="font-medium">Halaman:</span> {row.halaman}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditData(row);
                          setForm({
                            tanggal: row.tanggal,
                            jilid: row.jilid,
                            halaman: row.halaman,
                            catatan: row.catatan,
                          });
                          setOpenModal(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(row.id)} //id perkembangan_tilawati
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-sm">
                    <span className="font-medium block mb-1">Catatan:</span>
                    <p className="text-gray-700 whitespace-pre-line">
                      {row.catatan}
                    </p>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">
              Tidak ada data perkembangan yang cocok.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal Input/Edit */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editData ? "Edit Data Perkembangan" : "Input Data Perkembangan"}
            </DialogTitle>
            <DialogDescription>
            Ubah/tambahkan data tilawati {data.nama_siswa} sesuai kebutuhan, lalu klik simpan.
          </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="date"
              value={form.tanggal}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
            />
            <Select
              value={form.jilid}
              onValueChange={(val) => setForm({ ...form, jilid: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Jilid" />
              </SelectTrigger>
              <SelectContent>
                {jilidList.map((s) => (
                  <SelectItem key={s.nomor} value={s.nama}>
                    {s.nomor}. {s.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Halaman"
              value={form.halaman}
              onChange={(e) => setForm({ ...form, halaman: e.target.value })}
            />
            <Input
              placeholder="Catatan"
              value={form.catatan}
              onChange={(e) => setForm({ ...form, catatan: e.target.value })}
            />
            {/* <Input
              type="hidden"
              value={userName}
            /> */}
            <Button className="w-full" onClick={handleSubmit}>
              {editData ? "Update" : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
