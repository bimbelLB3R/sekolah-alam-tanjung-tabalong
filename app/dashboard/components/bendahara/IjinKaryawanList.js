import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function IjinKaryawanList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [jenisIjin, setJenisIjin] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('tanggal_ijin');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
        ...(search && { search }),
        ...(jenisIjin && { jenis_ijin: jenisIjin }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      });

      const response = await fetch(`/api/ijin-karyawan/summary?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, jenisIjin, startDate, endDate, sortBy, sortOrder]);

  const handleSearchClick = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('DESC');
    }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setJenisIjin('');
    setStartDate('');
    setEndDate('');
    setSortBy('tanggal_ijin');
    setSortOrder('DESC');
    setPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return time.substring(0, 5);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-green-100">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Data Ijin Karyawan</h1>
          <p className="text-green-600">Kelola dan pantau data ijin karyawan</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-green-600" size={20} />
            <h2 className="text-lg font-semibold text-green-800">Filter & Pencarian</h2>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
                <input
                  type="text"
                  placeholder="Cari nama karyawan..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleSearchClick}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Jenis Ijin */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Jenis Ijin</label>
              <select
                value={jenisIjin}
                onChange={(e) => { setJenisIjin(e.target.value); setPage(1); }}
                className="w-full px-4 py-2.5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="">Semua</option>
                <option value="keluar">Keluar</option>
                <option value="tidak_masuk">Tidak Masuk</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Tanggal Mulai</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none" size={18} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Tanggal Akhir</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none" size={18} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span className="text-sm font-medium">Reset Filter</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 text-green-600">
              <p className="text-lg">Tidak ada data yang ditemukan</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        <button onClick={() => handleSort('name')} className="flex items-center gap-2 hover:text-green-100">
                          Nama Karyawan
                          {sortBy === 'name' && <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        <button onClick={() => handleSort('jenis_ijin')} className="flex items-center gap-2 hover:text-green-100">
                          Jenis Ijin
                          {sortBy === 'jenis_ijin' && <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        <button onClick={() => handleSort('tanggal_ijin')} className="flex items-center gap-2 hover:text-green-100">
                          Tanggal
                          {sortBy === 'tanggal_ijin' && <span>{sortOrder === 'ASC' ? '↑' : '↓'}</span>}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Waktu</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Alasan</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Potong Tunjangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {data.map((item, index) => (
                      <tr key={item.id} className={`hover:bg-green-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-green-25'}`}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{item.nama_karyawan}</p>
                            <p className="text-sm text-gray-500">{item.email_karyawan}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.jenis_ijin === 'keluar' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.jenis_ijin === 'keluar' ? 'Keluar' : 'Tidak Masuk'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(item.tanggal_ijin)}</td>
                        <td className="px-6 py-4 text-gray-700">
                          {item.jenis_ijin === 'keluar' ? (
                            <div className="text-sm">
                              <div>Keluar: {formatTime(item.jam_keluar)}</div>
                              <div>Kembali: {formatTime(item.jam_kembali)}</div>
                            </div>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 line-clamp-2">{item.alasan_ijin}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.dipotong_tunjangan 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.dipotong_tunjangan ? 'Ya' : 'Tidak'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-green-100">
                {data.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-green-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.nama_karyawan}</h3>
                        <p className="text-sm text-gray-500">{item.email_karyawan}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.jenis_ijin === 'keluar' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.jenis_ijin === 'keluar' ? 'Keluar' : 'Tidak Masuk'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal:</span>
                        <span className="font-medium text-gray-900">{formatDate(item.tanggal_ijin)}</span>
                      </div>
                      
                      {item.jenis_ijin === 'keluar' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Waktu:</span>
                          <span className="font-medium text-gray-900">
                            {formatTime(item.jam_keluar)} - {formatTime(item.jam_kembali)}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-gray-600">Alasan:</span>
                        <p className="text-gray-900 mt-1">{item.alasan_ijin}</p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-600">Potong Tunjangan:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.dipotong_tunjangan 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.dipotong_tunjangan ? 'Ya' : 'Tidak'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="bg-linear-to-r from-green-50 to-emerald-50 px-6 py-4 border-t border-green-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-green-700">
                    Menampilkan {data.length} dari {pagination.total} data
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrev}
                      className="p-2 rounded-lg border-2 border-green-300 text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                page === pageNum
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white border-2 border-green-300 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                          return <span key={pageNum} className="px-2 text-green-600">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNext}
                      className="p-2 rounded-lg border-2 border-green-300 text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}