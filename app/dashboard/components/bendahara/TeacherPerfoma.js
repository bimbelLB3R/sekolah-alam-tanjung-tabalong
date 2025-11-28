import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, TrendingUp, User } from 'lucide-react';

export default function TeacherPerformanceDashboard() {
  const now = new Date();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    ).toLocaleDateString("en-CA"),
    endDate: now.toLocaleDateString("en-CA")
  });
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [performanceData, setPerformanceData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  // Fetch daftar guru
  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const response = await fetch('/api/users/teachers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }
      
      const result = await response.json();
      setTeachers(result.data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  // Fetch data dari API
  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/presensi/performance?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&userId=${selectedTeacher}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      // Tampilkan error ke user
      alert('Gagal memuat data performa. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch teachers saat component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchPerformanceData();
  }, [dateRange, selectedTeacher]);

  const COLORS = {
    tepatWaktu: '#10b981',
    terlambat: '#ef4444'
  };

  // Filter data dengan value > 0 untuk pie chart (konversi ke number)
  const pieData = performanceData ? [
    { name: 'Tepat Waktu', value: Number(performanceData.summary.tepatWaktu) || 0 },
    { name: 'Terlambat', value: Number(performanceData.summary.terlambat) || 0 }
  ].filter(item => item.value > 0) : [];
  
  // Format tanggal untuk chart (konversi ISO ke lokal)
  const dailyDataFormatted = performanceData?.dailyData?.map(item => ({
    ...item,
    tanggal: new Date(item.tanggal).toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short' 
    })
  })) || [];
  
  // console.log('Pie Chart Data:', pieData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <TrendingUp className="text-indigo-600" size={32} />
                Dashboard Performa Guru
              </h1>
              <p className="text-gray-600 mt-2">Rekap kehadiran dan analisis performa</p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Guru
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                disabled={loadingTeachers}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="all">Semua Guru</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          </div>
        ) : performanceData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Hari</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {performanceData.summary.totalHari}
                    </p>
                  </div>
                  <Calendar className="text-indigo-600" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Tepat Waktu</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {performanceData.summary.tepatWaktu}
                    </p>
                  </div>
                  <Clock className="text-green-600" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Terlambat</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                      {performanceData.summary.terlambat}
                    </p>
                  </div>
                  <Clock className="text-red-600" size={40} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Persentase</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {performanceData.summary.persentaseTepatWaktu}%
                    </p>
                  </div>
                  <TrendingUp className="text-white" size={40} />
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Bar Chart - Daily Attendance */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Kehadiran Harian
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyDataFormatted}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tanggal" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tepatWaktu" fill={COLORS.tepatWaktu} name="Tepat Waktu" />
                    <Bar dataKey="terlambat" fill={COLORS.terlambat} name="Terlambat" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Distribusi Kehadiran
                </h2>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.name === 'Tepat Waktu' ? COLORS.tepatWaktu : COLORS.terlambat} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    Tidak ada data kehadiran
                  </div>
                )}
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart - Trend */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Tren Persentase Tepat Waktu
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="minggu" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="persentase" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      name="Persentase (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Teacher Comparison */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Perbandingan Guru
                </h2>
                <div className="space-y-4">
                  {performanceData.teachers.map((teacher, index) => {
                    const total = teacher.tepatWaktu + teacher.terlambat;
                    const percentage = total > 0 ? (teacher.tepatWaktu / total * 100).toFixed(1) : 0;
                    return (
                      <div key={teacher.id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User size={20} className="text-gray-600" />
                            <span className="font-medium text-gray-800">{teacher.name}</span>
                          </div>
                          <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
                        </div>
                        <div className="flex gap-2 text-sm text-gray-600">
                          <span className="text-green-600">✓ {teacher.tepatWaktu}</span>
                          <span className="text-red-600">✗ {teacher.terlambat}</span>
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{width: `${percentage}%`}}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}