"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import GajiFormModal from "../../components/bendahara/GajiFormModal";
import PDFExportButton from "../../components/bendahara/Gajipdfexport";
import ExcelExportButton from "../../components/bendahara/Gajiexcelexport";
import Link from "next/link";

export default function GajiPage() {
  const [data, setData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [izinData, setIzinData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch semua data sekaligus
  async function fetchAllData() {
    try {
      setLoading(true);
      
      // Fetch parallel menggunakan Promise.all untuk lebih cepat
      const [karyawanRes, attendanceRes, ijinRes] = await Promise.all([
        fetch("/api/bendahara/listkaryawan"),
        fetch("/api/bendahara/attendance"),
        fetch("/api/bendahara/ijin_karyawan")
      ]);

      // Parse semua response
      const [karyawanData, attendanceResult, ijinResult] = await Promise.all([
        karyawanRes.json(),
        attendanceRes.json(),
        ijinRes.json()
      ]);

      // Set semua state
      setData(karyawanData);
      setAttendanceData(attendanceResult.data || attendanceResult); // Handle both formats
      setIzinData(ijinResult.data || ijinResult); // Handle both formats

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal mengambil data. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        const res = await fetch(`/api/bendahara/listkaryawan?id=${id}`, { 
          method: "DELETE" 
        });
        
        if (res.ok) {
          fetchAllData(); // Refresh semua data
        } else {
          alert("Gagal menghapus data");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Terjadi kesalahan saat menghapus data");
      }
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gaji Karyawan</h1>
        <div className="flex gap-2">
          <PDFExportButton 
            data={data}
            attendanceData={attendanceData}
            izinData={izinData}
            disabled={loading || data.length === 0} 
          />
          <ExcelExportButton 
            data={data}
            attendanceData={attendanceData}
            izinData={izinData}
            disabled={loading || data.length === 0} 
          />
          <Button onClick={() => setOpenModal(true)}>
            + Tambah Karyawan
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Belum ada data karyawan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">No</th>
                <th className="p-2 text-left">Nama</th>
                <th className="p-2 text-left">Jabatan</th>
                <th className="p-2 text-left">Departemen</th>
                <th className="p-2 text-right">Gaji Pokok</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">{row.jabatan}</td>
                  <td className="p-2">{row.departemen}</td>
                  <td className="p-2 text-right">
                    Rp {parseInt(row.gaji_pokok).toLocaleString('id-ID')}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => setOpenModal(row)}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleDelete(row.id)}
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        asChild
                        title="Lihat Slip Gaji"
                      >
                        <Link href={`/dashboard/bendahara/slip/${row.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr className="border-t-2">
                <td colSpan="4" className="p-2 text-right">Total:</td>
                <td className="p-2 text-right">
                  Rp {data.reduce((sum, row) => 
                    sum + parseInt(row.gaji_pokok), 0
                  ).toLocaleString('id-ID')}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <GajiFormModal 
        open={openModal} 
        setOpen={setOpenModal} 
        onSuccess={fetchAllData} 
      />
    </div>
  );
}