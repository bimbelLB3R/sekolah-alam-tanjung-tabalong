


"use client"

import DashboardCard from "../components/DashboardCard";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/getUserClientSide";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SiswaPage() {
  const { user, loading: authLoading } = useAuth();
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchKelas = async () => {
      // Tunggu auth selesai
      if (authLoading) return;
      
      // Jika tidak ada user, skip fetch
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/nama-kelas", { 
          cache: "no-store",
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!res.ok) {
          throw new Error(`Gagal fetch kelas: ${res.status}`);
        }

        const data = await res.json();

        // Filter berdasarkan role
        if (user.role_name?.toLowerCase() === 'guru') {
          const filteredData = data.filter(
            (item) => item.wali_kelas_nama?.toLowerCase() === user.name?.toLowerCase()
          );
          setKelasList(filteredData);
        } else {
          setKelasList(data);
        }
      } catch (err) {
        console.error("Error fetch kelas:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data kelas");
      } finally {
        setLoading(false);
      }
    };

    fetchKelas();
  }, [user, authLoading]);

  // Loading state saat auth atau fetch data
  if (authLoading || loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Data Kelas</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="text-gray-500 mt-4">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Data Kelas</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (kelasList.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Data Kelas</h1>
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Tidak ada data kelas tersedia</p>
          {user?.role_name?.toLowerCase() === 'guru' && (
            <p className="text-gray-400 text-sm mt-2">
              Anda belum menjadi wali kelas
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Data Kelas</h1>
        <div className="text-sm text-gray-500">
          {kelasList.length} kelas
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {kelasList.map((jenjang, index) => (
          <DashboardCard
            key={jenjang.id}
            title={jenjang.kelas_lengkap}
            href={`/dashboard/data-kelas/${jenjang.id}`}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}