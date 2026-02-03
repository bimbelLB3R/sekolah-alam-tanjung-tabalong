import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateGajiPDF =async (data, attendanceData, izinData) => {
    const loadImageAsBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = src;
  });
};

  // Validasi data
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diekspor');
    return;
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Kotak untuk logo (sementara sebagai placeholder)
//   doc.setDrawColor(200);
//   doc.rect(14, 10, 25, 25);
//   doc.setFontSize(8);
//   doc.text('LOGO', 26.5, 23, { align: 'center' });
const logoBase64 = await loadImageAsBase64('/logo-sattnav.png');

// Tambahkan logo
doc.addImage(
  logoBase64,
  'PNG',
  14,   // x
  10,   // y
  25,   // width
  25    // height
);

  
  // Header Text di sebelah kanan logo
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('REKAP GAJI KARYAWAN', 45, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sekolah Alam Tanjung Tabalong(SATT)', 45, 24);
  doc.text('Jalan Tanjung Baru, Maburai Kecamatan Murung Pudak, Kabupaten Tabalong, Kalsel 71571', 45, 29);
  doc.text('MAIL: sa.tanjungtabalong@gmail.com  Telp/WA: 0857 5211 2725', 45, 34);

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(14, 38, pageWidth - 14, 38);

  // Periode dan tanggal cetak info
  const today = new Date();
  const printDate = today.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.setFontSize(9);
  doc.text(`Periode: ${izinData?.periode || '-'}`, 14, 44);
  doc.text(`Dicetak pada: ${printDate}`, pageWidth - 14, 44, { align: 'right' });

  // Helper function: hitung kehadiran per karyawan
  const getAttendanceStats = (userId) => {
    if (!attendanceData || !Array.isArray(attendanceData)) {
      return { tepatWaktu: 0, terlambat: 0, totalKehadiran: 0 };
    }

    const userAttendance = attendanceData.filter(att => att.user_id === userId);
    const tepatWaktu = userAttendance.filter(att => att.status === 'tepat waktu').length;
    const terlambat = userAttendance.filter(att => att.status === 'terlambat').length;
    const totalKehadiran = tepatWaktu + terlambat;
    
    return { tepatWaktu, terlambat, totalKehadiran };
  };

  // Helper function: hitung ijin keperluan pribadi per karyawan
  const getIjinCount = (userId) => {
    if (!izinData || !izinData.rekap_per_karyawan) {
      return 0;
    }

    const userIjin = izinData.rekap_per_karyawan.find(r => r.id === userId);
    return userIjin?.total_ijin_keluar_dipotong || 0;
  };

  // Hitung total gaji dengan aturan baru
  const calculateTotalGaji = (row) => {
    const gajiPokok = parseFloat(row.gaji_pokok) || 0;
    const tunjanganMakan = parseFloat(row.tunjangan_makan) || 0;
    const tunjanganKehadiran = parseFloat(row.tunjangan_kehadiran) || 0;
    const jabatan = (row.jabatan || '').toLowerCase();
    
    // Gunakan user_id
    const userId = row.user_id;
    
    // Dapatkan data kehadiran
    const { tepatWaktu, totalKehadiran, terlambat } = getAttendanceStats(userId);
    
    // Hitung tunjangan makan = total kehadiran × tunjangan_makan
    const totalTunjanganMakan = totalKehadiran * tunjanganMakan;
    
    // Hitung tunjangan kehadiran
    let totalTunjanganKehadiran = 0;
    if (jabatan === 'staf dapur' || jabatan === 'magang') {
      totalTunjanganKehadiran = totalKehadiran * tunjanganKehadiran;
    } else {
      totalTunjanganKehadiran = tepatWaktu * tunjanganKehadiran;
    }
    
    // Tunjangan lainnya
    const tunjanganLainnya = [
      row.tunjangan_bpjs,
      row.tunjangan_jabatan,
      row.tunjangan_sembako,
      row.tunjangan_kepala_keluarga,
      row.tunjangan_pendidikan,
      row.tunjangan_pensiun,
      row.tunjangan_jamlebur || row.tunjangan_jamlebih,
      row.tunjangan_anak,
      row.tunjangan_nikah
    ].reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    const totalTunjangan = totalTunjanganMakan + totalTunjanganKehadiran + tunjanganLainnya;
    
    // Hitung potongan
    const potonganMakan = totalTunjanganMakan;
    const potonganPensiun = parseFloat(row.potongan_pensiun) || 0;
    
    // Potongan ijin
    const jumlahIjin = getIjinCount(userId);
    const potonganIjin = jumlahIjin * (tunjanganKehadiran * 0.5);
    const potonganLain=parseFloat(row.potongan_makan);
    
    const totalPotongan = potonganMakan + potonganPensiun + potonganIjin+potonganLain;
    
    return {
      totalTunjanganMakan,
      totalTunjanganKehadiran,
      tunjanganLainnya,
      totalTunjangan,
      potonganMakan,
      potonganPensiun,
      potonganIjin,
      totalPotongan,
      totalGaji: gajiPokok + totalTunjangan - totalPotongan,
      tepatWaktu,
      terlambat,
      totalKehadiran,
      jumlahIjin
    };
  };

  // Prepare table data
  const tableData = data.map((row, index) => {
    const calculated = calculateTotalGaji(row);

    return [
      index + 1,
      row.name || '-',
      row.jabatan || '-',
      `${calculated.tepatWaktu}/${calculated.terlambat}`,
      calculated.jumlahIjin,
      `Rp ${parseInt(row.gaji_pokok).toLocaleString('id-ID')}`,
      `Rp ${calculated.totalTunjangan.toLocaleString('id-ID')}`,
      `Rp ${calculated.potonganMakan.toLocaleString('id-ID')}`,
      `Rp ${calculated.totalPotongan.toLocaleString('id-ID')}`,
      `Rp ${calculated.totalGaji.toLocaleString('id-ID')}`
    ];
  });

  // Calculate grand totals
  const grandTotals = data.reduce((acc, row) => {
    const calc = calculateTotalGaji(row);
    return {
      gajiPokok: acc.gajiPokok + (parseFloat(row.gaji_pokok) || 0),
      totalTunjangan: acc.totalTunjangan + calc.totalTunjangan,
      totalPotongan: acc.totalPotongan + calc.totalPotongan,
      totalGaji: acc.totalGaji + calc.totalGaji,
      tepatWaktu: acc.tepatWaktu + calc.tepatWaktu,
      terlambat: acc.terlambat + calc.terlambat,
      totalKehadiran: acc.totalKehadiran + calc.totalKehadiran,
      totalIjin: acc.totalIjin + calc.jumlahIjin,
      potonganMakan: acc.potonganMakan + calc.potonganMakan
    };
  }, {
    gajiPokok: 0,
    totalTunjangan: 0,
    totalPotongan: 0,
    totalGaji: 0,
    tepatWaktu: 0,
    terlambat: 0,
    totalKehadiran: 0,
    totalIjin: 0,
    potonganMakan:0
  });

  // Add total row
  tableData.push([
    { content: 'TOTAL', colSpan: 3, styles: { fontStyle: 'bold', halign: 'center' } },
    { content: `${grandTotals.tepatWaktu}/${grandTotals.terlambat}`, styles: { fontStyle: 'bold', halign: 'center' } },
    { content: grandTotals.totalIjin.toString(), styles: { fontStyle: 'bold', halign: 'center' } },
    { content: `Rp ${grandTotals.gajiPokok.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } },
    { content: `Rp ${grandTotals.totalTunjangan.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } },
    { content: `Rp ${grandTotals.potonganMakan.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } },
    { content: `Rp ${grandTotals.totalPotongan.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } },
    { content: `Rp ${grandTotals.totalGaji.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } }
  ]);

  // Generate table
  autoTable(doc, {
    head: [[
      'No',
      'Nama Karyawan',
      'Jabatan',
      'Hadir\n(TW/TL)',
      'Ijin',
      'Gaji Pokok',
      'Total\nTunjangan',
      'Potongan\nMakan',
      'Total\nPotongan',
      'Total Gaji\nBersih'
    ]],
    body: tableData,
    startY: 48,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 1.5
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },      // No
      1: { halign: 'left', cellWidth: 40 },       // Nama
      2: { halign: 'left', cellWidth: 28 },       // Jabatan
      3: { halign: 'center', cellWidth: 15 },     // Hadir
      4: { halign: 'center', cellWidth: 10 },     // Ijin
      5: { halign: 'right', cellWidth: 30 },      // Gaji Pokok
      6: { halign: 'right', cellWidth: 30 },      // Total Tunjangan
      7: { halign: 'right', cellWidth: 30 },      // Potongan Makan
      8: { halign: 'right', cellWidth: 30 },      // Total Potongan
      9: { halign: 'right', cellWidth: 35 }       // Total Gaji
    },
    margin: { left: 14, right: 14 },
    didDrawPage: function (data) {
      // Footer
      const footerY = pageHeight - 10;
      doc.setFontSize(8);
      doc.setTextColor(100);
      
      // Tanggal cetak di footer
      const printDateTime = today.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Dicetak: ${printDateTime}`, 14, footerY);
      
      // Page number
      const pageCount = doc.internal.getNumberOfPages();
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageCount}`,
        pageWidth - 14,
        footerY,
        { align: 'right' }
      );
    }
  });

  // Add summary page (optional - untuk detail lengkap)
  doc.addPage();
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RINGKASAN PERHITUNGAN GAJI', 14, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const summaryY = 30;
  const summaryData = [
    ['Total Karyawan', `: ${data.length} orang`],
    ['Periode Data', `: ${izinData?.periode || '-'}`],
    ['', ''],
    ['Total Kehadiran Tepat Waktu', `: ${grandTotals.tepatWaktu} hari`],
    ['Total Kehadiran Terlambat', `: ${grandTotals.terlambat} hari`],
    ['Total Kehadiran', `: ${grandTotals.totalKehadiran} hari`],
    ['Total Ijin Keperluan Pribadi', `: ${grandTotals.totalIjin} kali`],
    ['', ''],
    ['Total Gaji Pokok', `: Rp ${grandTotals.gajiPokok.toLocaleString('id-ID')}`],
    ['Total Tunjangan', `: Rp ${grandTotals.totalTunjangan.toLocaleString('id-ID')}`],
    ['Potongan Makan', `: Rp ${grandTotals.potonganMakan.toLocaleString('id-ID')}`],
    ['Total Potongan', `: Rp ${grandTotals.totalPotongan.toLocaleString('id-ID')}`],
    ['Total Gaji Bersih', `: Rp ${grandTotals.totalGaji.toLocaleString('id-ID')}`],
    ['', ''],
    ['Catatan:', ''],
    ['- Tunjangan Makan = Total Kehadiran × Tunjangan Makan/Hari', ''],
    ['- Tunjangan Kehadiran (Umum) = Kehadiran Tepat Waktu × Tunjangan Kehadiran/Hari', ''],
    ['- Tunjangan Kehadiran (Staf Dapur/Magang) = Total Kehadiran × Tunjangan Kehadiran/Hari', ''],
    ['- Potongan Makan = Total Tunjangan Makan', ''],
    ['- Potongan Ijin = Jumlah Ijin × (50% × Tunjangan Kehadiran)', '']
  ];

  let currentY = summaryY;
  summaryData.forEach(([label, value]) => {
    if (label === '') {
      currentY += 3;
    } else {
      doc.text(label, 14, currentY);
      if (value) {
        doc.text(value, 80, currentY);
      }
      currentY += 6;
    }
  });

  // Save PDF
  const fileName = `Rekap_Gaji_Karyawan_${today.toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Komponen button untuk export PDF
export default function PDFExportButton({ data, attendanceData, izinData, disabled }) {
  const handleExport =async () => {
    await generateGajiPDF(data, attendanceData, izinData);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
      </svg>
      Export PDF
    </button>
  );
}