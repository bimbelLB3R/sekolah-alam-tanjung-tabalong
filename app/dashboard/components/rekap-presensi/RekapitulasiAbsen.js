'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Download, FileText, Calendar, Clock, User, AlertCircle, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';




// Utility functions
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateTime = (date) => {
  const d = new Date(date);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const getWorkingDaysInMonth = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let workingDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++;
  }
  return workingDays;
};

// Component: Statistics Card
const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`${bgColor} rounded-full p-3`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  </div>
);




// Component: Status Badge
const StatusBadge = ({ status, type, hasPulang, jamPulang }) => {
  if (type === 'masuk') {
    return status === 'tepat waktu' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Tepat Waktu
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Terlambat
      </span>
    );
  }
  
  // Untuk kolom pulang
  // Jika hasPulang false atau tidak ada jam_pulang, berarti belum absen pulang
  if (!hasPulang || !jamPulang) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Belum Absen
      </span>
    );
  }
  
  // Jika ada data pulang dan ada jam_pulang, tampilkan statusnya
  // Jika keterangan NULL, anggap sebagai "Sudah Absen" (tanpa status spesifik)
  if (!status) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Sudah Absen
      </span>
    );
  }
  
  return status === 'tepat waktu' ? (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <CheckCircle2 className="w-3 h-3 mr-1" />
      Tepat Waktu
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
      <AlertCircle className="w-3 h-3 mr-1" />
      Terlambat
    </span>
  );
};

// Component: Summary Table
const SummaryTable = ({ monthlyReport, selectedMonth }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <h2 className="text-xl font-bold text-gray-800">Ringkasan Bulanan</h2>
      <p className="text-sm text-gray-600 mt-1">Periode: {formatMonthYear(selectedMonth + '-01')}</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Guru</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hadir</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hari Kerja</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Kehadiran</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Terlambat</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tidak Absen Pulang</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {monthlyReport.map((item, index) => (
            <tr key={item.user_id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="text-sm font-semibold text-gray-900">{item.hadir}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="text-sm text-gray-600" title='senin-jumat'>{item.totalHariKerja}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  parseFloat(item.persentaseKehadiran) >= 95 ? 'bg-green-100 text-green-800' :
                  parseFloat(item.persentaseKehadiran) >= 85 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.persentaseKehadiran}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`text-sm font-semibold ${item.terlambat === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {item.terlambat}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={`text-sm font-semibold ${item.tidakAbsenPulang === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.tidakAbsenPulang}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


// Component: Detail Table
const DetailTable = ({ user }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Detail Presensi: {user.nama}</h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Hadir: {user.hadir}
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            Terlambat: {user.terlambat}
          </span>
        </div>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jam Masuk</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jam Pulang</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status Masuk</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status Pulang</th>
            
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {user.details.map((detail, index) => (
            <tr key={detail.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{formatDate(detail.tanggal)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{detail.jam_masuk || '-'}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{detail.jam_pulang || '-'}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <StatusBadge status={detail.keterangan_masuk} type="masuk" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <StatusBadge status={detail.keterangan_pulang} type="pulang" hasPulang={detail.has_pulang} jamPulang={detail.jam_pulang}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Main Component
const RekapPresensi = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [selectedUser, setSelectedUser] = useState('all');
  // const [data] = useState(sampleData);
   const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/rekap-presensi/users?role=guru&role=manajemen&role=staff');
 // Filter guru saja
        const result = await response.json();
        
        if (result.success) {
          setUsers(result.data);
        } else {
          console.error('Failed to fetch users:', result.error);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  // Fetch presensi data when month or user changes
  useEffect(() => {
    const fetchPresensiData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          month: selectedMonth,
        });

        if (selectedUser !== 'all') {
          params.append('user_id', selectedUser);
        }

        const response = await fetch(`/api/rekap-presensi?${params}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching presensi:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchPresensiData();
  }, [selectedMonth, selectedUser]);

  // console.log(data)

  const monthlyReport = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const filtered = selectedUser === 'all' ? data : data.filter(d => d.user_id === selectedUser);

    const groupedByUser = filtered.reduce((acc, item) => {
      if (!acc[item.user_id]) {
        acc[item.user_id] = { user_id: item.user_id, nama: item.nama, hadir: 0, terlambat: 0, tidakAbsenPulang: 0, details: [] };
      }
      acc[item.user_id].hadir++;
      if (item.keterangan_masuk === 'terlambat') acc[item.user_id].terlambat++;
      if (!item.jam_pulang) acc[item.user_id].tidakAbsenPulang++;
      acc[item.user_id].details.push(item);
      return acc;
    }, {});

    const workingDays = getWorkingDaysInMonth(year, month - 1);
    Object.keys(groupedByUser).forEach(userId => {
      groupedByUser[userId].totalHariKerja = workingDays;
      groupedByUser[userId].persentaseKehadiran = ((groupedByUser[userId].hadir / workingDays) * 100).toFixed(1);
    });

    return Object.values(groupedByUser);
  }, [data, selectedUser, selectedMonth]);
  console.log(monthlyReport)

  const loadImageAsBase64 = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = url;
  });
};


  const exportToPDF =async () => {
    const logoKiri = await loadImageAsBase64('/logo-sattnav.png');
    // const logoKanan = await loadImageAsBase64('/logo-sattnav.png');

    const doc = new jsPDF();
    // Logo kiri
    doc.addImage(logoKiri, 'PNG', 10, 8, 20, 20);

// Logo kanan
    // doc.addImage(logoKanan, 'PNG', doc.internal.pageSize.width - 30, 8, 20, 20);

    const monthYear = formatMonthYear(selectedMonth + '-01');

    doc.setFontSize(18);
    doc.text('REKAP PRESENSI GURU & KARYAWAN', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Sekolah Alam Tanjung Tabalong', 105, 22, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Periode: ${monthYear}`, 105, 29, { align: 'center' });

    const summaryData = monthlyReport.map(item => [
      item.nama, item.hadir, item.totalHariKerja, `${item.persentaseKehadiran}%`, item.terlambat, item.tidakAbsenPulang
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Nama Guru/Kar', 'Total Hadir', 'Total Hari Kerja', '% Kehadiran', 'Terlambat', 'Tidak Absen Pulang']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], fontSize: 10 },
      styles: { fontSize: 9, cellPadding: 3 }
    });

    let currentY = doc.lastAutoTable.finalY + 10;
    
    monthlyReport.forEach((user) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(`Detail Presensi: ${user.nama}`, 14, currentY);
      currentY += 7;

      const detailData = user.details.map(d => [
        formatDate(d.tanggal), d.jam_masuk || '-', d.jam_pulang || '-', d.keterangan_masuk || '-'
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Tanggal', 'Jam Masuk', 'Jam Pulang', 'Ket. Masuk']],
        body: detailData,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219], fontSize: 9 },
        styles: { fontSize: 8, cellPadding: 2 }
      });

      currentY = doc.lastAutoTable.finalY + 10;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} dari ${pageCount} - Dicetak: ${formatDateTime(new Date())}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`Rekap-Presensi-${selectedMonth}.pdf`);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const summaryData = monthlyReport.map(item => ({
      'Nama Guru': item.nama,
      'Jumlah Hadir': item.hadir,
      'Total Hari Kerja': item.totalHariKerja,
      'Persentase Kehadiran': `${item.persentaseKehadiran}%`,
      'Jumlah Terlambat': item.terlambat,
      'Tidak Absen Pulang': item.tidakAbsenPulang
    }));

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

    monthlyReport.forEach(user => {
      const detailData = user.details.map(d => ({
        'Tanggal': formatDate(d.tanggal),
        'Jam Masuk': d.jam_masuk || '-',
        'Jam Pulang': d.jam_pulang || '-',
        'Keterangan Masuk': d.keterangan_masuk || '-',
        'Keterangan Pulang': d.keterangan_pulang || '-',
        'Device': d.device_info || '-'
      }));

      const wsDetail = XLSX.utils.json_to_sheet(detailData);
      wsDetail['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsDetail, user.nama.substring(0, 30));
    });

    XLSX.writeFile(wb, `Rekap-Presensi-${selectedMonth}.xlsx`);
  };

  const avgKehadiran = monthlyReport.length > 0
    ? (monthlyReport.reduce((sum, item) => sum + parseFloat(item.persentaseKehadiran), 0) / monthlyReport.length).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Rekap Presensi Guru/Karyawan</h1>
        <p className="text-blue-100">Sekolah Alam Tanjung Tabalong</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filter Data</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />Bulan
            </label>
            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />Guru
            </label>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">Semua Guru</option>
              {users.map(user => <option key={user.user_id} value={user.user_id}>{user.nama}</option>)}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button onClick={exportToPDF}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md">
              <FileText className="w-4 h-4" />PDF
            </button>
            <button onClick={exportToExcel}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md">
              <Download className="w-4 h-4" />Excel
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Guru" value={monthlyReport.length} icon={User} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard title="Rata-rata Kehadiran" value={`${avgKehadiran}%`} icon={CheckCircle2} color="text-green-600" bgColor="bg-green-100" />
        <StatCard title="Total Keterlambatan" value={monthlyReport.reduce((sum, item) => sum + item.terlambat, 0)} icon={AlertCircle} color="text-orange-600" bgColor="bg-orange-100" />
        <StatCard title="Tidak Absen Pulang" value={monthlyReport.reduce((sum, item) => sum + item.tidakAbsenPulang, 0)} icon={XCircle} color="text-red-600" bgColor="bg-red-100" />
      </div>

      {/* Summary Table */}
      <SummaryTable monthlyReport={monthlyReport} selectedMonth={selectedMonth} />

      {/* Detail Tables */}
      {monthlyReport.map(user => <DetailTable key={user.user_id} user={user} />)}

      {/* Footer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Informasi:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Data dapat diexport ke format PDF dan Excel untuk keperluan laporan</li>
              <li>Persentase kehadiran dihitung dari total hari kerja (tidak termasuk weekend)</li>
              <li>Status terlambat dan tidak absen pulang mempengaruhi perhitungan penggajian</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RekapPresensi;