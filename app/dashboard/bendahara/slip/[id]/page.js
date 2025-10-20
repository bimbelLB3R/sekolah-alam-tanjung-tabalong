// "use client";

// import { useEffect, useState, useRef } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Building2, User, Wallet, Download } from "lucide-react";
// // import Image from "next/image";
// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";

// export default function DetailGajiPage() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [tanggalCetak, setTanggalCetak] = useState("");
//   const printRef = useRef(null);

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
//   const htmlContent = printRef.current.innerHTML;
//   const baseUrl =
//   process.env.NEXT_PUBLIC_APP_URL
//     ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
//     : "http://localhost:3000";

//   const fullHTML = `
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//         <style>
//           @page { size: A4; margin: 20mm; }
//           body { font-family: Arial, sans-serif; }
//           img { object-fit: contain; }
//         </style>
//       </head>
//       <body class="p-6 bg-white">
//         ${htmlContent.replaceAll('src="/', `src="${baseUrl}/`)}
//       </body>
//     </html>
//   `;

//   const res = await fetch("/api/bendahara/export-pdf", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       html: fullHTML,
//       filename: `Slip_Gaji_${data.name}`,
//     }),
//   });

//   const blob = await res.blob();
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `Slip_Gaji_${data.name}.pdf`;
//   a.click();
//   URL.revokeObjectURL(url);
// };


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
//         <Button onClick={handleDownloadPDF} className="flex gap-2">
//           <Download className="w-4 h-4" />
//           Export PDF
//         </Button>
//       </div>

//       {/* Konten Slip Gaji */}
//       <div ref={printRef} className="bg-white p-6">
//         {/* Header */}
//         <div className="flex justify-between items-start border-b pb-4">
//           <div className="w-20">
//             <img src="http://localhost:3000/yamasaka.jpg" alt="Logo kiri" width="180" height="180" />
//           </div>
//           <div className="text-center">
//             <h1 className="text-xl font-bold uppercase">Slip Gaji Karyawan</h1>
//             <p className="text-sm text-gray-600">
//               Periode: {new Date(data.effective_date).toLocaleDateString("id-ID")}
//             </p>
//           </div>
//           <div className="text-right text-sm">
//             <img src="http://localhost:3000/logo-sattnav.png" alt="Logo kanan" width="60" height="60" />
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
//             <p className="font-semibold underline">________________</p>
//           </div>
//           <div>
//             <p>Karyawan</p>
//             <div className="h-16" />
//             <p className="font-semibold underline">{data.name}</p>
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
import { Building2, User, Wallet, Download } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { pdf } from "@react-pdf/renderer";
import SlipGajiPDF from "@/app/dashboard/components/bendahara/SlipGajiPDF";

export default function DetailGajiPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [tanggalCetak, setTanggalCetak] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      const res = await fetch(`/api/bendahara/listkaryawan/${id}`);
      const result = await res.json();
      setData(result);
    }
    fetchDetail();

    const date = new Date();
    const options = { day: "2-digit", month: "long", year: "numeric" };
    setTanggalCetak(date.toLocaleDateString("id-ID", options));
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      
      // Generate PDF dari komponen React
      const blob = await pdf(
        <SlipGajiPDF data={data} tanggalCetak={tanggalCetak} />
      ).toBlob();

      // Download PDF
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

  if (!data) return <div className="p-6">Loading...</div>;

  const totalGaji =
    Number(data.gaji_pokok) +
    Number(data.tunjangan_bpjs) +
    Number(data.tunjangan_jabatan) +
    Number(data.tunjangan_makan) +
    Number(data.tunjangan_kehadiran) +
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

      {/* Preview Slip Gaji (tetap pakai Tailwind untuk tampilan web) */}
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
              Periode: {new Date(data.effective_date).toLocaleDateString("id-ID")}
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
              <div className="flex justify-between"><span>Gaji Pokok</span><span>Rp {Number(data.gaji_pokok).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tunjangan BPJS</span><span>Rp {Number(data.tunjangan_bpjs).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tunjangan Jabatan</span><span>Rp {Number(data.tunjangan_jabatan).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tunjangan Makan</span><span>Rp {Number(data.tunjangan_makan).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tunjangan Kehadiran</span><span>Rp {Number(data.tunjangan_kehadiran).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tunjangan Sembako</span><span>Rp {Number(data.tunjangan_sembako).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tunjangan Kepala Keluarga</span><span>Rp {Number(data.tunjangan_kepala_keluarga).toLocaleString()}</span></div>
              <Separator />
              <div className="flex justify-between font-semibold"><span>Total Gaji</span><span>Rp {totalGaji.toLocaleString()}</span></div>
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
              <div className="flex justify-between"><span>Potongan Makan</span><span>Rp {Number(data.potongan_makan).toLocaleString()}</span></div>
              <Separator />
              <div className="flex justify-between font-semibold"><span>Total Potongan</span><span>Rp {totalPotongan.toLocaleString()}</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Take Home Pay */}
        <Card className="shadow-none border mt-4">
          <CardContent className="text-center py-4">
            <p className="text-lg font-bold">Take Home Pay</p>
            <p className="text-2xl font-extrabold text-green-600">
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