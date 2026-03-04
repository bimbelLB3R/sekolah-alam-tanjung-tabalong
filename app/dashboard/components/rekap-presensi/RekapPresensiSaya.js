'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { Download, FileText, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight, TrendingUp, Award, Activity } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ── Utility ────────────────────────────────────────────────────────────────────

const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
};

const formatMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDateTime = (date) => {
  const d = new Date(date);
  const p = (n) => n.toString().padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const getWorkingDaysInMonth = (year, month) => {
  const days = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let i = 1; i <= days; i++) {
    const dow = new Date(year, month, i).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
};

const prevMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
};

const nextMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
};

const todayMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
};

// ── Status Badge ───────────────────────────────────────────────────────────────

const StatusBadge = ({ status, type, hasPulang, jamPulang }) => {
  if (type === 'masuk') {
    return status === 'tepat waktu' ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" /> Tepat Waktu
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle className="w-3 h-3" /> Terlambat
      </span>
    );
  }

  if (!hasPulang || !jamPulang) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3 h-3" /> Belum Absen
      </span>
    );
  }

  if (!status) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <CheckCircle2 className="w-3 h-3" /> Sudah Absen
      </span>
    );
  }

  return status === 'tepat waktu' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" /> Tepat Waktu
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <AlertCircle className="w-3 h-3" /> Terlambat
    </span>
  );
};

// ── Donut Chart (pure CSS/SVG) ─────────────────────────────────────────────────

const DonutChart = ({ percent }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  const color = percent >= 95 ? '#10b981' : percent >= 85 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="48" cy="48" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="48" y="53" textAnchor="middle" fontSize="14" fontWeight="700" fill={color}>
        {percent}%
      </text>
    </svg>
  );
};

// ── Stat Pill ──────────────────────────────────────────────────────────────────

const StatPill = ({ label, value, color, icon: Icon }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${color} bg-white shadow-sm`}>
    <Icon className="w-5 h-5 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-500 leading-none mb-0.5">{label}</p>
      <p className="text-lg font-bold leading-none">{value}</p>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

const RekapPresensiSaya = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(todayMonth());
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });
        if (res.ok) {
          const d = await res.json();
          setUser(d);
        } else {
          setError('Gagal memuat data user. Pastikan Anda sudah login.');
        }
      } catch {
        setError('Gagal terhubung ke server.');
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);


  // Fetch presensi data
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ month: selectedMonth, user_id: user.id });
        const res = await fetch(`/api/rekap-presensi?${params}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Gagal memuat data presensi.');
        }
      } catch {
        setError('Gagal terhubung ke server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, selectedMonth]);

  // Derived stats
  const stats = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const workingDays = getWorkingDaysInMonth(year, month - 1);
    const hadir = data.length;
    const terlambat = data.filter(d => d.keterangan_masuk === 'terlambat').length;
    const tidakAbsenPulang = data.filter(d => !d.jam_pulang).length;
    const persen = workingDays > 0 ? ((hadir / workingDays) * 100).toFixed(1) : '0.0';
    return { workingDays, hadir, terlambat, tidakAbsenPulang, persen };
  }, [data, selectedMonth]);

  // ── Export helpers ──────────────────────────────────────────────────────────

  const loadImageAsBase64 = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        c.getContext('2d').drawImage(img, 0, 0);
        resolve(c.toDataURL('image/png'));
      };
      img.src = url;
    });

  const exportToPDF = async () => {
    const logo = await loadImageAsBase64('/logo-sattnav.png');
    const doc = new jsPDF();
    const monthYear = formatMonthYear(selectedMonth + '-01');

    doc.addImage(logo, 'PNG', 10, 8, 20, 20);
    doc.setFontSize(16);
    doc.text('REKAP PRESENSI PRIBADI', 105, 14, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Sekolah Alam Tanjung Tabalong', 105, 21, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Nama: ${user?.name || '-'}   |   Periode: ${monthYear}`, 105, 28, { align: 'center' });

    // Summary box
    autoTable(doc, {
      startY: 34,
      head: [['Total Hadir', 'Hari Kerja', '% Kehadiran', 'Terlambat', 'Tdk Absen Pulang']],
      body: [[stats.hadir, stats.workingDays, `${stats.persen}%`, stats.terlambat, stats.tidakAbsenPulang]],
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175], fontSize: 10 },
      styles: { fontSize: 10, halign: 'center' }
    });

    const detailData = data.map(d => [
      formatDate(d.tanggal),
      d.jam_masuk || '-',
      d.jam_pulang || '-',
      d.keterangan_masuk || '-',
      d.jam_pulang ? (d.keterangan_pulang || 'Sudah Absen') : 'Belum Absen'
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [['Tanggal', 'Jam Masuk', 'Jam Pulang', 'Ket. Masuk', 'Ket. Pulang']],
      body: detailData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 2.5 }
    });

    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.text(`Halaman ${i}/${pages} — Dicetak: ${formatDateTime(new Date())}`, 105, doc.internal.pageSize.height - 8, { align: 'center' });
    }

    doc.save(`Presensi-${user?.name || 'saya'}-${selectedMonth}.pdf`);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryRows = [[
      'Nama', user?.name || '-',
    ], [
      'Periode', formatMonthYear(selectedMonth + '-01'),
    ], [], [
      'Total Hadir', stats.hadir,
    ], [
      'Hari Kerja', stats.workingDays,
    ], [
      'Persentase Kehadiran', `${stats.persen}%`,
    ], [
      'Terlambat', stats.terlambat,
    ], [
      'Tidak Absen Pulang', stats.tidakAbsenPulang,
    ]];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    wsSummary['!cols'] = [{ wch: 22 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

    // Detail sheet
    const detailData = data.map(d => ({
      'Tanggal': formatDate(d.tanggal),
      'Jam Masuk': d.jam_masuk || '-',
      'Jam Pulang': d.jam_pulang || '-',
      'Keterangan Masuk': d.keterangan_masuk || '-',
      'Keterangan Pulang': d.jam_pulang ? (d.keterangan_pulang || 'Sudah Absen') : 'Belum Absen',
    }));
    const wsDetail = XLSX.utils.json_to_sheet(detailData);
    wsDetail['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, wsDetail, 'Detail Presensi');

    XLSX.writeFile(wb, `Presensi-${user?.name || 'saya'}-${selectedMonth}.xlsx`);
  };

  // ── Render states ────────────────────────────────────────────────────────────

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm">Memuat data user…</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 max-w-sm text-center">
          <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <p className="font-semibold text-rose-700">{error}</p>
        </div>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-5">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white p-6 shadow-xl">
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Rekap Presensi Saya</p>
            <h1 className="text-2xl md:text-3xl font-bold">{user?.name || '–'}</h1>
            <p className="text-blue-200 text-sm mt-1 capitalize">{user?.role_name || ''} · Sekolah Alam Tanjung Tabalong</p>
          </div>

          {/* Month navigator */}
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 self-start sm:self-auto">
            <button
              onClick={() => setSelectedMonth(prevMonth(selectedMonth))}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center min-w-[130px]">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-white text-sm font-semibold text-center outline-none cursor-pointer w-full"
              />
            </div>
            <button
              onClick={() => setSelectedMonth(nextMonth(selectedMonth))}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <DonutChart percent={parseFloat(stats.persen)} />
          <p className="text-xs text-gray-500 mt-1 font-medium">Tingkat Kehadiran</p>
        </div>

        <StatPill
          label="Total Hadir"
          value={`${stats.hadir} hari`}
          icon={CheckCircle2}
          color="border-emerald-200 text-emerald-700"
        />
        <StatPill
          label="Terlambat"
          value={`${stats.terlambat}×`}
          icon={AlertCircle}
          color="border-amber-200 text-amber-700"
        />
        <StatPill
          label="Tdk Absen Pulang"
          value={`${stats.tidakAbsenPulang}×`}
          icon={XCircle}
          color="border-rose-200 text-rose-700"
        />
      </div>

      {/* ── Export + alert ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Periode: <span className="font-semibold text-gray-700">{formatMonthYear(selectedMonth + '-01')}</span>
          &nbsp;·&nbsp;
          Hari kerja: <span className="font-semibold text-gray-700">{stats.workingDays} hari</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            disabled={loading || data.length === 0}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={exportToExcel}
            disabled={loading || data.length === 0}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* ── Detail table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-gray-800">Detail Kehadiran</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mr-3" />
            Memuat data…
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 text-rose-500 gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Calendar className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">Tidak ada data presensi</p>
            <p className="text-xs mt-1">untuk periode {formatMonthYear(selectedMonth + '-01')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-5 py-3 text-center font-semibold">Jam Masuk</th>
                  <th className="px-5 py-3 text-center font-semibold">Jam Pulang</th>
                  <th className="px-5 py-3 text-center font-semibold">Status Masuk</th>
                  <th className="px-5 py-3 text-center font-semibold">Status Pulang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((detail, i) => (
                  <tr
                    key={detail.id}
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/40 transition-colors`}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        {formatDate(detail.tanggal)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-gray-800 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        {detail.jam_masuk || '–'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-gray-800 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {detail.jam_pulang || '–'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                      <StatusBadge status={detail.keterangan_masuk} type="masuk" />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                      <StatusBadge
                        status={detail.keterangan_pulang}
                        type="pulang"
                        hasPulang={detail.has_pulang}
                        jamPulang={detail.jam_pulang}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Footer note ── */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          Persentase kehadiran dihitung dari total hari kerja (Senin–Jumat). 
          Ketidakhadiran dan keterlambatan dapat mempengaruhi perhitungan penggajian.
        </p>
      </div>
    </div>
  );
};

export default RekapPresensiSaya;