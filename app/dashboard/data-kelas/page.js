"use client"
import DashboardCard from "../components/DashboardCard";
import { useState,useEffect,useCallback } from "react";
import { useAuth } from "@/lib/getUserClientSide"

export default function SiswaPage() {
  const { user } = useAuth();
  const namaWali=user?.name
  const roleWali=user?.role_name
  const [kelasList, setKelasList] = useState([]);
  // console.log(roleWali)
  const fetchKelas = useCallback(async () => {
    try {
        const res = await fetch("/api/nama-kelas", { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal fetch kelas");
        const data = await res.json();

        if (roleWali === 'guru') {
          const selectedWali = data.filter(
            (item) => item.wali_kelas_nama?.toLowerCase() === namaWali?.toLowerCase()
          );
          setKelasList(selectedWali);
        } else {
          setKelasList(data);
        }
      } catch (error) {
        console.error("Error fetch kelas:", error);
      }
  }, [namaWali,roleWali]);
  // async function fetchKelas() {
  //     try {
  //       const res = await fetch("/api/nama-kelas", { cache: "no-store" });
  //       if (!res.ok) throw new Error("Gagal fetch kelas");
  //       const data = await res.json();

  //       if (roleWali === 'guru') {
  //         const selectedWali = data.filter(
  //           (item) => item.wali_kelas_nama?.toLowerCase() === namaWali?.toLowerCase()
  //         );
  //         setKelasList(selectedWali);
  //       } else {
  //         setKelasList(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetch kelas:", error);
  //     }
  //   }

  
    useEffect(() => {
  if (user) {
    fetchKelas();
  }
}, [user,fetchKelas]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Kelas</h1>
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
