"use client"

import { FileSpreadsheet,FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import PesertaPage from "@/app/dashboard/components/events/peserta/PesertaFptInner" // kita pisahkan inner komponen supaya bisa passing props
import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { exportPesertaToExcel } from "@/lib/exportExcel"

export default function PesertaFpt() {
  const [peserta, setPeserta] = useState([])
// console.log(peserta);

  useEffect(() => {
    async function fetchPeserta() {
      const res = await fetch("/api/events/peserta")
      const data = await res.json()
      setPeserta(data)
    }
    fetchPeserta()
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus peserta ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/events/peserta/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Gagal hapus: " + err.error);
        return;
      }

      // update state setelah hapus
      setPeserta((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error hapus peserta:", error);
      alert("Terjadi kesalahan saat hapus peserta");
    }
  };

  const exportPDF = () => {
    // ✅ inisialisasi dengan orientation "landscape"
  const doc = new jsPDF({
    orientation: "landscape", // "p" untuk portrait, "l" untuk landscape
    unit: "pt",
    format: "a4",
  });
  const margin = { top: 60, left: 80, right: 30 };

    doc.setFontSize(16)
    doc.text("Daftar Peserta Events FPT", margin.left, margin.top);

    // Format data siswa jadi string
    const rows = peserta.map((p) => [
      p.guru_pj,
      p.jabatan,
      p.asal_sekolah,
      p.kontak_pj,
      p.siswa.map((s) => s.nama_siswa).join(", "),
    ])

    autoTable(doc, {
      head: [["Guru/PJ", "Jabatan", "Asal Sekolah", "Kontak PJ", "Siswa"]],
      body: rows,
      startY: margin.top + 20,
      margin: margin, // ✅ margin tabel
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },

      // ✅ Footer tiap halaman
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ?? pageSize.getHeight();

      doc.setFontSize(10);
      doc.setTextColor(150);

      doc.text(
        `Halaman ${data.pageNumber} dari ${pageCount}`,
        pageSize.width - margin.right,
        pageHeight - 10,
        { align: "right" }
      );
    },
    })

    

    doc.save("peserta_event.pdf")
  }

  return (
    <div className="p-6">
      {/* Header dengan tombol export */}
      <div className="flex justify-end items-center mb-6 gap-4">
        <Button variant="secondary" onClick={() => exportPesertaToExcel(peserta)}>
        <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
      </Button>
        <Button onClick={exportPDF} className="flex items-center gap-2">
          <FileDown className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
        <h1 className="text-2xl font-bold">Data Peserta Event</h1>

      <PesertaPage peserta={peserta} onDelete={handleDelete}/>
    </div>
  )
}
