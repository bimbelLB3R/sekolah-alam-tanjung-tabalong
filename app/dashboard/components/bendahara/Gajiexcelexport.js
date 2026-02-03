import * as XLSX from 'xlsx';

export const generateGajiExcel = (data, attendanceData, izinData) => {
  // DEBUG
  console.log('Excel - Data:', data);
  console.log('Excel - Attendance:', attendanceData);
  console.log('Excel - Ijin:', izinData);

  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diekspor');
    return;
  }

  // Helper function: hitung kehadiran per karyawan
  const getAttendanceStats = (userId) => {
    if (!attendanceData || !Array.isArray(attendanceData)) {
      console.warn('Attendance data tidak valid');
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
      console.warn('Ijin data tidak valid');
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
    
    // PENTING: Gunakan user_id, bukan id
    const userId = row.user_id;
    
    // Dapatkan data kehadiran
    const { tepatWaktu, totalKehadiran } = getAttendanceStats(userId);
    
    // Hitung tunjangan makan = total kehadiran × tunjangan_makan
    const totalTunjanganMakan = totalKehadiran * tunjanganMakan;
    
    // Hitung tunjangan kehadiran
    let totalTunjanganKehadiran = 0;
    if (jabatan === 'staf dapur' || jabatan === 'magang') {
      // Untuk staf dapur & magang: semua kehadiran dihitung
      totalTunjanganKehadiran = totalKehadiran * tunjanganKehadiran;
    } else {
      // Untuk jabatan lain: hanya kehadiran tepat waktu
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
      row.tunjangan_jamlebur || row.tunjangan_jamlebih, // Handle typo di database
      row.tunjangan_anak,
      row.tunjangan_nikah
    ].reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    const totalTunjangan = totalTunjanganMakan + totalTunjanganKehadiran + tunjanganLainnya;
    
    // Hitung potongan
    const potonganMakan = totalTunjanganMakan; // Sama dengan total tunjangan makan
    const potonganPensiun = parseFloat(row.potongan_pensiun) || 0;
    const potonganLainnya = parseFloat(row.potongan_makan) || 0;
    
    // Potongan ijin keperluan pribadi = 50% tunjangan kehadiran × jumlah ijin
    const jumlahIjin = getIjinCount(userId);
    const potonganIjin = jumlahIjin * (tunjanganKehadiran * 0.5);
    
    const totalPotongan = potonganMakan + potonganPensiun + potonganIjin +potonganLainnya;
    
    return {
      totalTunjanganMakan,
      totalTunjanganKehadiran,
      totalTunjangan,
      potonganMakan,
      potonganIjin,
      totalPotongan,
      potonganLainnya,
      totalGaji: gajiPokok + totalTunjangan - totalPotongan
    };
  };

  // Prepare data untuk Excel dengan detail lengkap
  const excelData = data.map((row, index) => {
    const userId = row.user_id; // PENTING: Gunakan user_id
    const { tepatWaktu, terlambat, totalKehadiran } = getAttendanceStats(userId);
    const jumlahIjin = getIjinCount(userId);
    const calculated = calculateTotalGaji(row);
    const jabatan = (row.jabatan || '').toLowerCase();
    
    // Tunjangan lainnya (yang tidak berubah)
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

    return {
      'No': index + 1,
      'Nama Karyawan': row.name || '-',
      'Jabatan': row.jabatan || '-',
      'Departemen': row.departemen || '-',
      'Jumlah Anak': row.jml_anak || 0,
      'Kehadiran Tepat Waktu': tepatWaktu,
      'Kehadiran Terlambat': terlambat,
      'Total Kehadiran': totalKehadiran,
      'Ijin Keperluan Pribadi': jumlahIjin,
      'Gaji Pokok': parseFloat(row.gaji_pokok) || 0,
      'Tunjangan Makan/Hari': parseFloat(row.tunjangan_makan) || 0,
      'Total Tunjangan Makan': calculated.totalTunjanganMakan,
      'Tunjangan Kehadiran/Hari': parseFloat(row.tunjangan_kehadiran) || 0,
      'Total Tunjangan Kehadiran': calculated.totalTunjanganKehadiran,
      'Tunjangan Lainnya': tunjanganLainnya,
      'Total Tunjangan': calculated.totalTunjangan,
      'Potongan Makan': calculated.potonganMakan,
      'Potongan Pensiun': parseFloat(row.potongan_pensiun) || 0,
      'Potongan Ijin': calculated.potonganIjin,
      'Potongan Lainnya': calculated.potonganLainnya,
      'Total Potongan': calculated.totalPotongan,
      'Total Gaji Bersih': calculated.totalGaji,
      'Tanggal Efektif': row.effective_date || '-',
      'Keterangan': jabatan === 'staf dapur' || jabatan === 'magang' 
        ? 'Tunjangan kehadiran penuh' 
        : 'Tunjangan kehadiran hanya tepat waktu'
    };
  });

  // Tambahkan baris total
  const totals = {
    'No': '',
    'Nama Karyawan': 'TOTAL',
    'Jabatan': '',
    'Departemen': '',
    'Jumlah Anak': data.reduce((sum, row) => sum + (parseInt(row.jml_anak) || 0), 0),
    'Kehadiran Tepat Waktu': data.reduce((sum, row) => {
      const { tepatWaktu } = getAttendanceStats(row.user_id);
      return sum + tepatWaktu;
    }, 0),
    'Kehadiran Terlambat': data.reduce((sum, row) => {
      const { terlambat } = getAttendanceStats(row.user_id);
      return sum + terlambat;
    }, 0),
    'Total Kehadiran': data.reduce((sum, row) => {
      const { totalKehadiran } = getAttendanceStats(row.user_id);
      return sum + totalKehadiran;
    }, 0),
    'Ijin Keperluan Pribadi': data.reduce((sum, row) => sum + getIjinCount(row.user_id), 0),
    'Gaji Pokok': data.reduce((sum, row) => sum + (parseFloat(row.gaji_pokok) || 0), 0),
    'Tunjangan Makan/Hari': '',
    'Total Tunjangan Makan': data.reduce((sum, row) => {
      return sum + calculateTotalGaji(row).totalTunjanganMakan;
    }, 0),
    'Tunjangan Kehadiran/Hari': '',
    'Total Tunjangan Kehadiran': data.reduce((sum, row) => {
      return sum + calculateTotalGaji(row).totalTunjanganKehadiran;
    }, 0),
    'Tunjangan Lainnya': data.reduce((sum, row) => {
      return sum + [
        row.tunjangan_bpjs,
        row.tunjangan_jabatan,
        row.tunjangan_sembako,
        row.tunjangan_kepala_keluarga,
        row.tunjangan_pendidikan,
        row.tunjangan_pensiun,
        row.tunjangan_jamlebur || row.tunjangan_jamlebih,
        row.tunjangan_anak,
        row.tunjangan_nikah
      ].reduce((s, val) => s + (parseFloat(val) || 0), 0);
    }, 0),
    'Total Tunjangan': data.reduce((sum, row) => {
      return sum + calculateTotalGaji(row).totalTunjangan;
    }, 0),
    'Potongan Makan': data.reduce((sum, row) => {
      return sum + calculateTotalGaji(row).potonganMakan;
    }, 0),
    'Potongan Pensiun': data.reduce((sum, row) => sum + (parseFloat(row.potongan_pensiun) || 0), 0),
    'Potongan Ijin': data.reduce((sum, row) => {
      return sum + calculateTotalGaji(row).potonganIjin;
    }, 0),
    'Total Potongan': data.reduce((sum, row) => {
      return sum + calculateTotalGaji(row).totalPotongan;
    }, 0),
    'Total Gaji Bersih': data.reduce((sum, row) => {
      return sum + calculateTotalGaji(row).totalGaji;
    }, 0),
    'Tanggal Efektif': '',
    'Keterangan': ''
  };

  excelData.push(totals);

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = [
    { wch: 5 },  // No
    { wch: 25 }, // Nama
    { wch: 20 }, // Jabatan
    { wch: 20 }, // Departemen
    { wch: 12 }, // Jml Anak
    { wch: 12 }, // Kehadiran Tepat Waktu
    { wch: 12 }, // Kehadiran Terlambat
    { wch: 12 }, // Total Kehadiran
    { wch: 18 }, // Ijin Keperluan Pribadi
    { wch: 15 }, // Gaji Pokok
    { wch: 18 }, // Tunjangan Makan/Hari
    { wch: 20 }, // Total Tunjangan Makan
    { wch: 22 }, // Tunjangan Kehadiran/Hari
    { wch: 22 }, // Total Tunjangan Kehadiran
    { wch: 18 }, // Tunjangan Lainnya
    { wch: 18 }, // Total Tunjangan
    { wch: 18 }, // Potongan Makan
    { wch: 18 }, // Potongan Pensiun
    { wch: 18 }, // Potongan Ijin
    { wch: 18 }, // Potongan Lainnya
    { wch: 18 }, // Total Potongan
    { wch: 20 }, // Total Gaji Bersih
    { wch: 15 }, // Tanggal Efektif
    { wch: 30 }  // Keterangan
  ];
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Gaji');

  // Add metadata sheet
  const metaData = [
    ['Rekap Gaji Karyawan'],
    [''],
    ['Tanggal Cetak:', new Date().toLocaleString('id-ID')],
    ['Total Karyawan:', data.length],
    ['Periode Data:', izinData?.periode || '-'],
    [''],
    ['Aturan Perhitungan:'],
    ['- Total Tunjangan Makan = Total Kehadiran × Tunjangan Makan/Hari'],
    ['- Total Tunjangan Kehadiran (Umum) = Kehadiran Tepat Waktu × Tunjangan Kehadiran/Hari'],
    ['- Total Tunjangan Kehadiran (Staf Dapur/Magang) = Total Kehadiran × Tunjangan Kehadiran/Hari'],
    ['- Potongan Makan = Total Tunjangan Makan'],
    ['- Potongan Ijin = Jumlah Ijin × (50% Tunjangan Kehadiran)'],
    [''],
    ['Keterangan:'],
    ['- Semua nilai dalam Rupiah (Rp)'],
    ['- Data kehadiran dan ijin diambil dari periode bulan lalu']
  ];
  const wsMeta = XLSX.utils.aoa_to_sheet(metaData);
  XLSX.utils.book_append_sheet(wb, wsMeta, 'Info');

  // Save file
  const today = new Date().toISOString().split('T')[0];
  const fileName = `Rekap_Gaji_Karyawan_${today}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

// Komponen button untuk export Excel
export default function ExcelExportButton({ data, attendanceData, izinData, disabled }) {
  const handleExport = () => {
    generateGajiExcel(data, attendanceData, izinData);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      Export Excel
    </button>
  );
}