"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatName } from "@/lib/formatName";

export default function TabelManajemenTahfidz({data,loading,dataSiswa,handleOpenAdd,dataUser,handleOpenEdit,handleSubmit,open,submitting, setOpen,form,setForm}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Autocomplete states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const dropdownRef = useRef(null);

  const itemsPerPage = 10;

  // filter pencarian
  const filteredData = data?.filter(
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

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Autocomplete search logic
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSearchLoading(true);
      // Simulasi delay untuk searching
      const timer = setTimeout(() => {
        const results = dataSiswa.filter((siswa) =>
          formatName(siswa.nama_lengkap)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setShowDropdown(true);
        setSearchLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, dataSiswa]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle select siswa from dropdown
  const handleSelectSiswa = (siswa) => {
    const formattedName = formatName(siswa.nama_lengkap);
    setSelectedSiswa(siswa);
    setSearchQuery(formattedName);
    setForm({ ...form, nama_siswa: formattedName });
    setShowDropdown(false);
  };

  // Handle clear siswa
  const handleClearSiswa = () => {
    setSearchQuery("");
    setSelectedSiswa(null);
    setForm({ ...form, nama_siswa: "" });
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Reset autocomplete when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedSiswa(null);
      setSearchResults([]);
      setShowDropdown(false);
    } else if (open && form.nama_siswa) {
      // Set search query if editing existing data
      setSearchQuery(form.nama_siswa);
    }
  }, [open, form.nama_siswa]);

  return (
    <Card className="w-full overflow-hidden shadow-md rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Daftar Peserta Tahfidz</h2>
          <Button onClick={handleOpenAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Peserta
          </Button>
        </div>

        {/* input pencarian */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Cari nama atau rombel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          />
        </div>
        {loading && (
        <div className="flex items-center gap-2 mb-3 text-gray-500">
          <Loader2 className="animate-spin h-4 w-4" />
          <span>Menyegarkan data...</span>
        </div>
      )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama Anak</th>
                    <th className="p-2 border">Pembimbing</th>
                    <th className="p-2 border">Rombel</th>
                    <th className="p-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-50 even:bg-gray-50/50">
                        <td className="p-2 border">{startIndex + index + 1}</td>
                        <td className="p-2 border">
                          <Link
                            href={`/dashboard/guru/tahfidz/${row.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {row.nama_siswa}
                          </Link>
                        </td>
                        <td className="p-2 border">{row.pembimbing}</td>
                        <td className="p-2 border">{row.nama_rombel}</td>
                        <td className="p-2 border">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="text-blue-500 hover:underline flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination */}
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

        {/* modal tambah/edit */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {form.id ? "Edit Peserta" : "Tambah Peserta"}
              </DialogTitle>
              <DialogDescription>Form Edit/tambah Data</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              {/* Autocomplete Siswa */}
              <div className="space-y-2" ref={dropdownRef}>
                <Label htmlFor="siswa">Nama Siswa *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="siswa"
                    placeholder="Ketik minimal 2 huruf untuk mencari siswa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9"
                    disabled={submitting}
                    required
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSiswa}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {searchLoading && (
                    <div className="absolute right-3 top-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  
                  {/* Dropdown Results */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                      {searchResults.map((siswa) => (
                        <button
                          key={siswa.id}
                          type="button"
                          onClick={() => handleSelectSiswa(siswa)}
                          className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground border-b last:border-b-0 transition-colors"
                        >
                          <div className="font-medium">{formatName(siswa.nama_lengkap)}</div>
                          {siswa.nik && (
                            <div className="text-sm text-muted-foreground">NIK: {siswa.nik}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showDropdown && searchResults.length === 0 && searchQuery.length >= 2 && !searchLoading && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg p-4 text-center text-muted-foreground">
                      Tidak ada siswa ditemukan
                    </div>
                  )}
                </div>
              </div>

              {/* Select Pembimbing */}
              <div className="space-y-2">
                <Label htmlFor="pembimbing">Pembimbing *</Label>
                <Select
                  value={form.pembimbing}
                  onValueChange={(val) => setForm({ ...form, pembimbing: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Pembimbing" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataUser.map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name} 
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Input Rombel */}
              <div className="space-y-2">
                <Label htmlFor="rombel">Rombel *</Label>
                <Input
                  id="rombel"
                  placeholder="Rombel"
                  value={form.nama_rombel}
                  onChange={(e) => setForm({ ...form, nama_rombel: e.target.value })}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Menyimpan..." : form.id ? "Update" : "Tambah"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}