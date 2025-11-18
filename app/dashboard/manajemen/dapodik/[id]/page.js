"use client"

import { useEffect, useState, useRef} from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Check, X, User, AlarmClockCheck, BookOpenCheck, Target, Banknote, Volleyball, Handshake, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { formatDate } from "@/lib/formatDate"

export default function DetailSiswaPage() {
  const fileInputRef = useRef(null);
  const dokumenFileInputRef = useRef(null);
  const { id } = useParams()
  const [siswa, setSiswa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingField, setEditingField] = useState(null)
  const [editedValue, setEditedValue] = useState("")
  const [foto, setFoto] = useState(null);
  const [uploadingField, setUploadingField] = useState(null); // Track field yang sedang diupload

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dapodik")
        const result = await res.json()

        const selected = result.find((item) => String(item.id) === String(id))
        setSiswa(selected || null)
        setFoto(selected?.fotoAnak)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleEdit = (key, value) => {
    setEditingField(key)
    setEditedValue(value || "")
  }

  const handleCancel = () => {
    setEditingField(null)
    setEditedValue("")
  }

  const handleSave = async (key) => {
    try {
      const res = await fetch(`/api/dapodik/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: editedValue }),
      })

      if (!res.ok) throw new Error("Gagal menyimpan perubahan")

      setSiswa((prev) => ({ ...prev, [key]: editedValue }))
      alert("Data berhasil disimpan")
      setEditingField(null)
    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan saat menyimpan data")
    }
  }

  // Handler untuk foto profil
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", siswa.id);
      formData.append("fieldName", "fotoAnak");

      const res = await fetch("/api/pendaftaran/updatefoto", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setFoto(result.url);
        setSiswa((prev) => ({ ...prev, fotoAnak: result.url }));
        alert("Foto profil berhasil diganti!");
      } else {
        alert("Gagal upload foto");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat upload");
    }
  };

  // Handler untuk dokumen (4 field)
  const handleDokumenFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(fieldName);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", siswa.id);
      formData.append("fieldName", fieldName);

      const res = await fetch("/api/pendaftaran/updatefoto", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setSiswa((prev) => ({ ...prev, [fieldName]: result.url }));
        alert(`${fieldName} berhasil diganti!`);
      } else {
        alert("Gagal upload dokumen");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat upload");
    } finally {
      setUploadingField(null);
    }
  };

  // Trigger file input untuk dokumen tertentu
  const handleEditDokumen = (fieldName) => {
    const input = document.getElementById(`file-${fieldName}`);
    if (input) input.click();
  };

  if (loading) return <p className="text-center py-10">Memuat data...</p>
  if (!siswa)
    return (
      <p className="text-center py-10 text-gray-500">
        Data siswa tidak ditemukan
      </p>
    )

  const sections = [
    { key: "biodata", label: "Data Siswa" },
    { key: "ortu", label: "Data Ortu" },
    { key: "kontak", label: "Kontak" },
    { key: "dokumen", label: "Dokumen" },
  ]

  const quickLinks = [
    { name: "Portofolio", href: `/manajemen/dapodik/${id}/portofolio`, icon: User },
    { name: "Kehadiran", href: `/manajemen/dapodik/${id}/kehadiran`, icon: AlarmClockCheck },
    { name: "Akademik", href: `/manajemen/dapodik/${id}/akademik`, icon: Brain },
    { name: "Bakat", href: `/manajemen/dapodik/${id}/bakat`, icon: Target },
    { name: "Pembayaran", href: `/manajemen/dapodik/${id}/pembayaran`, icon: Banknote },
    { name: "Tahfidz", href: `/manajemen/dapodik/${id}/tahfidz`, icon: BookOpenCheck },
    { name: "Tilawati", href: `/manajemen/dapodik/${id}/tilawati`, icon: BookOpenCheck },
    { name: "Komitmen", href: `/manajemen/dapodik/${id}/komitmen`, icon: Handshake },
    { name: "Ekskul", href: `/manajemen/dapodik/${id}/ekskul`, icon: Volleyball },
  ]

  const biodata = {
    nama_lengkap: siswa.nama_lengkap,
    nik: siswa.nik,
    jenis_kelamin: siswa.jenis_kelamin,
    tempat_lahir: siswa.tempat_lahir,
    tgl_lahir: formatDate(siswa.tgl_lahir),
    alamat: siswa.alamat,
  }

  const ortu = {
    nama_ayah: siswa.nama_ayah,
    pekerjaan_ayah: siswa.pekerjaan_ayah,
    nama_ibu: siswa.nama_ibu,
    pekerjaan_ibu: siswa.pekerjaan_ibu,
  }

  const kontak = {
    no_hp_ibu: siswa.no_hp_ibu,
    email: siswa.email,
    alamat_ibu: siswa.alamat_ibu,
  }

  const dokumen = {
    buktiBayar: siswa.buktiBayar,
    fotoAnak: siswa.fotoAnak,
    fotoKia: siswa.fotoKia,
    kkPdf: siswa.kkPdf
  }

  const dataTabs = { biodata, ortu, kontak, dokumen }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.name} href={link.href}>
              <Card className="cursor-pointer hover:shadow-md transition p-3 text-center">
                <CardContent className="p-2 flex flex-col items-center justify-center text-green-600">
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-sm font-semibold">{link.name}</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Tabs Detail */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {/* Foto siswa atau avatar default */}
            <div className="relative w-16 h-16">
              {foto ? (
                <Image
                  src={foto}
                  alt={siswa.nama_lengkap}
                  className="rounded-full object-cover border"
                  fill
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* Tombol ubah foto profil */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 bg-white shadow-md rounded-full p-1 hover:bg-gray-50"
                onClick={() => fileInputRef.current.click()}
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Nama siswa */}
            <CardTitle className="text-xl font-semibold">
              {siswa.nama_lengkap}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="biodata" className="w-full">
            <TabsList className="flex flex-wrap justify-start gap-2 mb-8">
              {sections.map((section) => (
                <TabsTrigger key={section.key} value={section.key}>
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map((section) => (
              <TabsContent key={section.key} value={section.key}>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border rounded-md">
                    <tbody>
                      {section.key === "dokumen" ? (
                        // TAB DOKUMEN - Tombol ganti foto
                        Object.entries(dataTabs[section.key]).map(([key, value]) => (
                          <tr key={key} className="hover:bg-gray-50">
                            <td className="border px-3 py-2 font-medium w-1/3 whitespace-nowrap">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </td>
                            <td className="border px-3 py-2">
                              {value ? (
                                <div className="flex items-center gap-3">
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Lihat
                                  </a>
                                  <a
                                    href={value}
                                    download
                                    className="text-green-600 hover:underline"
                                  >
                                    Unduh
                                  </a>
                                </div>
                              ) : (
                                <span className="text-gray-400">Tidak ada dokumen</span>
                              )}
                            </td>
                            <td className="border px-3 py-2 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditDokumen(key)}
                                disabled={uploadingField === key}
                              >
                                {uploadingField === key ? (
                                  <span className="text-xs">...</span>
                                ) : (
                                  <Pencil className="w-4 h-4 text-gray-500" />
                                )}
                              </Button>
                              {/* Hidden file input untuk setiap field */}
                              <input
                                id={`file-${key}`}
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => handleDokumenFileChange(e, key)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        // TAB LAINNYA - Edit biasa
                        Object.entries(dataTabs[section.key]).map(([key, value]) => (
                          <tr key={key} className="hover:bg-gray-50">
                            <td className="border px-3 py-2 font-medium w-1/3 whitespace-nowrap">
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </td>
                            <td className="border px-3 py-2">
                              {editingField === key ? (
                                <Input
                                  value={editedValue}
                                  onChange={(e) => setEditedValue(e.target.value)}
                                  className="max-w-xs"
                                />
                              ) : (
                                value || "-"
                              )}
                            </td>
                            <td className="border px-3 py-2 text-center">
                              {editingField === key ? (
                                <div className="flex justify-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleSave(key)}
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCancel}
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(key, value)}
                                >
                                  <Pencil className="w-4 h-4 text-gray-500" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}