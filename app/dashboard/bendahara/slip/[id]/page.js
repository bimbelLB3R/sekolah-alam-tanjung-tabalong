// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Building2, User, Wallet, Download } from "lucide-react";
// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { pdf } from "@react-pdf/renderer";
// import SlipGajiPDF from "@/app/dashboard/components/bendahara/SlipGajiPDF";

// export default function DetailGajiPage() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [tanggalCetak, setTanggalCetak] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);

//   console.log(data)

//   useEffect(() => {
//     async function fetchDetail() {
//       const res = await fetch(`/api/bendahara/listkaryawan/${id}`);
//       const result = await res.json();
//       setData(result);
//     }
//     fetchDetail();

//     const date = new Date();
//     const options = { day: "2-digit", month: "long", year: "numeric" };
//     setTanggalCetak(date.toLocaleDateString("id-ID", options));
//   }, [id]);

//   const handleDownloadPDF = async () => {
//     try {
//       setIsGenerating(true);
      
//       // Generate PDF dari komponen React
//       const blob = await pdf(
//         <SlipGajiPDF data={data} tanggalCetak={tanggalCetak} />
//       ).toBlob();

//       // Download PDF
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Slip_Gaji_${data.name}_${new Date().getTime()}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("Gagal membuat PDF. Silakan coba lagi.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   if (!data) return <div className="p-6">Loading...</div>;

//   const totalGaji =
//     Number(data.gaji_pokok) +
//     Number(data.tunjangan_bpjs) +
//     Number(data.tunjangan_jabatan) +
//     Number(data.tunjangan_makan) +
//     Number(data.tunjangan_kehadiran) +
//     Number(data.tunjangan_sembako) +
//     Number(data.tunjangan_kepala_keluarga);

//   const totalPotongan = Number(data.potongan_makan);
//   const takeHomePay = totalGaji - totalPotongan;

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white">
//       {/* Tombol Export PDF */}
//       <div className="flex justify-end mb-4">
//         <Button 
//           onClick={handleDownloadPDF} 
//           className="flex gap-2"
//           disabled={isGenerating}
//         >
//           <Download className="w-4 h-4" />
//           {isGenerating ? "Membuat PDF..." : "Export PDF"}
//         </Button>
//       </div>

//       {/* Preview Slip Gaji (tetap pakai Tailwind untuk tampilan web) */}
//       <div className="bg-white p-6 border rounded-lg">
//         {/* Header */}
//         <div className="flex justify-between items-start border-b pb-4">
//           <div className="w-20">
//             <img 
//               src="/yamasaka.jpg" 
//               alt="Logo kiri" 
//               className="w-full h-auto object-contain"
//             />
//           </div>
//           <div className="text-center flex-1 px-4">
//             <h1 className="text-xl font-bold uppercase">Slip Gaji Karyawan</h1>
//             <p className="text-sm text-gray-600">
//               Periode: {new Date(data.effective_date).toLocaleDateString("id-ID")}
//             </p>
//           </div>
//           <div className="w-16">
//             <img 
//               src="/logo-sattnav.png" 
//               alt="Logo kanan" 
//               className="w-full h-auto object-contain"
//             />
//           </div>
//         </div>

//         {/* Informasi Karyawan */}
//         <Card className="mt-4 shadow-none border">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="w-5 h-5" />
//               Informasi Karyawan
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-2 gap-4 text-sm">
//             <p><span className="font-semibold">Nama:</span> {data.name}</p>
//             <p><span className="font-semibold">Departemen:</span> {data.departemen}</p>
//             <p><span className="font-semibold">Jabatan:</span> {data.jabatan}</p>
//             <p><span className="font-semibold">Tanggal Efektif:</span> {new Date(data.effective_date).toLocaleDateString("id-ID")}</p>
//           </CardContent>
//         </Card>

//         {/* Rincian Gaji */}
//         <div className="grid grid-cols-2 gap-6 mt-4">
//           {/* Gaji */}
//           <Card className="shadow-none border">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Wallet className="w-5 h-5" /> Rincian Gaji
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2 text-sm">
//               <div className="flex justify-between"><span>Gaji Pokok</span><span>Rp {Number(data.gaji_pokok).toLocaleString()}</span></div>
//               <div className="flex justify-between"><span>Tunjangan BPJS</span><span>Rp {Number(data.tunjangan_bpjs).toLocaleString()}</span></div>
//               <div className="flex justify-between"><span>Tunjangan Jabatan</span><span>Rp {Number(data.tunjangan_jabatan).toLocaleString()}</span></div>
//               <div className="flex justify-between"><span>Tunjangan Makan</span><span>Rp {Number(data.tunjangan_makan).toLocaleString()}</span></div>
//               <div className="flex justify-between"><span>Tunjangan Kehadiran</span><span>Rp {Number(data.tunjangan_kehadiran).toLocaleString()}</span></div>
//               <div className="flex justify-between"><span>Tunjangan Sembako</span><span>Rp {Number(data.tunjangan_sembako).toLocaleString()}</span></div>
//               <div className="flex justify-between"><span>Tunjangan Kepala Keluarga</span><span>Rp {Number(data.tunjangan_kepala_keluarga).toLocaleString()}</span></div>
//               <Separator />
//               <div className="flex justify-between font-semibold"><span>Total Gaji</span><span>Rp {totalGaji.toLocaleString()}</span></div>
//             </CardContent>
//           </Card>

//           {/* Potongan */}
//           <Card className="shadow-none border">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Building2 className="w-5 h-5" /> Potongan
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2 text-sm">
//               <div className="flex justify-between"><span>Potongan Makan</span><span>Rp {Number(data.potongan_makan).toLocaleString()}</span></div>
//               <Separator />
//               <div className="flex justify-between font-semibold"><span>Total Potongan</span><span>Rp {totalPotongan.toLocaleString()}</span></div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Take Home Pay */}
//         <Card className="shadow-none border mt-4">
//           <CardContent className="text-center py-4">
//             <p className="text-lg font-bold">Take Home Pay</p>
//             <p className="text-2xl font-extrabold text-green-600">
//               Rp {takeHomePay.toLocaleString()}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Tanggal Cetak */}
//         <div className="text-right text-sm mt-2">
//           <p>Tabalong, {tanggalCetak}</p>
//         </div>

//         {/* Tanda Tangan */}
//         <div className="flex justify-between mt-12 text-center text-sm">
//           <div>
//             <p>Bendahara</p>
//             <div className="h-16" />
//             <p className="font-semibold border-b border-black inline-block px-8">________________</p>
//           </div>
//           <div>
//             <p>Karyawan</p>
//             <div className="h-16" />
//             <p className="font-semibold border-b border-black inline-block px-8">{data.name}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, User, Wallet, Download, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import SlipGajiPDF from "@/app/dashboard/components/bendahara/SlipGajiPDF";

export default function DetailGajiPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [presensiSummary, setPresensiSummary] = useState(null);
  const [tanggalCetak, setTanggalCetak] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // console.log(data);

  useEffect(() => {
    async function fetchDetail() {
      const res = await fetch(`/api/bendahara/listkaryawan/${id}`);
      const result = await res.json();
      setData(result);
      

      // Fetch presensi summary untuk bulan ini
      if (result?.id) {
        await fetchPresensiSummary(result.user_id);
      }
    }
    fetchDetail();

    const date = new Date();
    const options = { day: "2-digit", month: "long", year: "numeric" };
    setTanggalCetak(date.toLocaleDateString("id-ID", options));
  }, [id]);

  const fetchPresensiSummary = async (userId) => {
    try {
      // Ambil data presensi bulan ini
      const res = await fetch(`/api/presensi/summary?user_id=${userId}`);
      const summary = await res.json();
      console.log(summary)
      
      if (summary.success) {
        setPresensiSummary({
          tepatWaktu: summary.jumlah_tepat_waktu,
          terlambat: summary.jumlah_terlambat,
          totalHadir: summary.total_hadir,
        });
      }
    } catch (error) {
      console.error("Error fetching presensi summary:", error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      
      // Generate PDF dengan data presensi
      const blob = await pdf(
        <SlipGajiPDF 
          data={data} 
          tanggalCetak={tanggalCetak}
          presensiSummary={presensiSummary}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Slip_Gaji_${data.name}_${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!data || !presensiSummary) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Hitung tunjangan kehadiran berdasarkan jumlah tepat waktu
  const tunjanganKehadiranBase = Number(data.tunjangan_kehadiran);
  const tunjanganKehadiranTotal = tunjanganKehadiranBase * presensiSummary.tepatWaktu;

  const totalGaji =
    Number(data.gaji_pokok) +
    Number(data.tunjangan_bpjs) +
    Number(data.tunjangan_jabatan) +
    Number(data.tunjangan_makan) +
    tunjanganKehadiranTotal + // Gunakan yang sudah dikalikan
    Number(data.tunjangan_sembako) +
    Number(data.tunjangan_kepala_keluarga);

  const totalPotongan = Number(data.potongan_makan);
  const takeHomePay = totalGaji - totalPotongan;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white">
      {/* Tombol Export PDF */}
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleDownloadPDF} 
          className="flex gap-2"
          disabled={isGenerating}
        >
          <Download className="w-4 h-4" />
          {isGenerating ? "Membuat PDF..." : "Export PDF"}
        </Button>
      </div>

      {/* Preview Slip Gaji */}
      <div className="bg-white p-6 border rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div className="w-20">
            <img 
              src="/yamasaka.jpg" 
              alt="Logo kiri" 
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="text-center flex-1 px-4">
            <h1 className="text-xl font-bold uppercase">Slip Gaji Karyawan</h1>
            <p className="text-sm text-gray-600">
              Periode: {new Date().toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="w-16">
            <img 
              src="/logo-sattnav.png" 
              alt="Logo kanan" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Informasi Karyawan */}
        <Card className="mt-4 shadow-none border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Karyawan
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <p><span className="font-semibold">Nama:</span> {data.name}</p>
            <p><span className="font-semibold">Departemen:</span> {data.departemen}</p>
            <p><span className="font-semibold">Jabatan:</span> {data.jabatan}</p>
            <p><span className="font-semibold">Tanggal Efektif:</span> {new Date(data.effective_date).toLocaleDateString("id-ID")}</p>
          </CardContent>
        </Card>

        {/* Data Kehadiran Bulan Ini */}
        <Card className="mt-4 shadow-none border bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Calendar className="w-5 h-5" />
              Data Kehadiran Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Tepat Waktu</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {presensiSummary.tepatWaktu}
              </p>
              <p className="text-xs text-gray-500">hari</p>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs text-gray-600">Terlambat</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {presensiSummary.terlambat}
              </p>
              <p className="text-xs text-gray-500">hari</p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Total Hadir</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {presensiSummary.totalHadir}
              </p>
              <p className="text-xs text-gray-500">hari</p>
            </div>
          </CardContent>
        </Card>

        {/* Rincian Gaji */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Gaji */}
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" /> Rincian Gaji
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Gaji Pokok</span>
                <span>Rp {Number(data.gaji_pokok).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tunjangan BPJS</span>
                <span>Rp {Number(data.tunjangan_bpjs).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tunjangan Jabatan</span>
                <span>Rp {Number(data.tunjangan_jabatan).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tunjangan Makan</span>
                <span>Rp {Number(data.tunjangan_makan).toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-green-50 p-2 rounded">
                <div className="flex flex-col">
                  <span>Tunjangan Kehadiran</span>
                  <span className="text-xs text-green-600">
                    Rp {tunjanganKehadiranBase.toLocaleString()} × {presensiSummary.tepatWaktu} hari
                  </span>
                </div>
                <span className="font-semibold text-green-600">
                  Rp {tunjanganKehadiranTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tunjangan Sembako</span>
                <span>Rp {Number(data.tunjangan_sembako).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tunjangan Kepala Keluarga</span>
                <span>Rp {Number(data.tunjangan_kepala_keluarga).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Gaji</span>
                <span>Rp {totalGaji.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Potongan */}
          <Card className="shadow-none border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Potongan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Potongan Makan</span>
                <span>Rp {Number(data.potongan_makan).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Potongan Ijin Pribadi</span>
                <span>Rp {Number(data.potongan_makan).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Potongan</span>
                <span>Rp {totalPotongan.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Take Home Pay */}
        <Card className="shadow-none border mt-4 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="text-center py-4">
            <p className="text-lg font-bold text-gray-700">Take Home Pay</p>
            <p className="text-3xl font-extrabold text-green-600">
              Rp {takeHomePay.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Tanggal Cetak */}
        <div className="text-right text-sm mt-2">
          <p>Tabalong, {tanggalCetak}</p>
        </div>

        {/* Tanda Tangan */}
        <div className="flex justify-between mt-12 text-center text-sm">
          <div>
            <p>Bendahara</p>
            <div className="h-16" />
            <p className="font-semibold border-b border-black inline-block px-8">________________</p>
          </div>
          <div>
            <p>Karyawan</p>
            <div className="h-16" />
            <p className="font-semibold border-b border-black inline-block px-8">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}