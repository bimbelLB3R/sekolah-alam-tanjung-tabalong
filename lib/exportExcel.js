import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportPesertaToExcel = (peserta) => {
  // Data diubah supaya rapi (gabungkan siswa dalam 1 kolom)
  const data = peserta.map((p) => ({
    "Nama Guru/PJ": p.guru_pj,
    "Jabatan": p.jabatan,
    "Asal Sekolah": p.asal_sekolah,
    "Kontak PJ": p.kontak_pj,
    "Daftar Siswa": p.siswa.map((s) => s.nama_siswa).join(", "),
  }));

  // Buat worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Buat workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Peserta");

  // Simpan ke file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "peserta_events.xlsx");
};
