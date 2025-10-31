"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toLowerCase } from "zod";

export default function PesertaTilawatiTable({ userName }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/tilawati");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  //filter data berdasarkan pembimbing
 const filteredPembimbing = data?.filter((row) => {
  const pembimbing = (row.pembimbing || "").toLowerCase();
  const user = (userName || "").toLowerCase();
  return pembimbing.includes(user);
});

// console.log(data)

  // filter pencarian
  const filteredData = filteredPembimbing.filter(
    (row) =>
      row.nama_siswa?.toLowerCase().includes(search.toLowerCase()) ||
      row.nama_rombel?.toLowerCase().includes(search.toLowerCase())
  );

  // pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // handle change page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card className="w-full overflow-hidden shadow-md rounded-2xl">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Daftar Peserta Tilawati (Bapak/Ibu {userName})
        </h2>

        {/* input pencarian */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Cari nama atau rombel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset ke halaman pertama saat search berubah
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Memuat...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama Anak</th>
                    <th className="p-2 border">Rombel</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 even:bg-gray-50/50"
                      >
                        <td className="p-2 border">
                          {startIndex + index + 1}
                        </td>
                        <td className="p-2 border">
                          <Link
                            href={`/dashboard/guru/tilawati/${row.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {row.nama_siswa}
                          </Link>
                        </td>
                        <td className="p-2 border">{row.nama_rombel}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center p-4 text-gray-500"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-4 space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-lg disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-3 py-1 border rounded-lg ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-lg disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
