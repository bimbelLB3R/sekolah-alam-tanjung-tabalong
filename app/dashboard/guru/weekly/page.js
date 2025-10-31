"use client"
import WeeklyManagement from "../../components/weekly/WeeklyManagement";
import { useAuth } from "@/lib/getUserClientSide";
import { Loader2 } from "lucide-react";

export default function GuruWeeklyPage() {
  const { user, loading, mounted } = useAuth();

  // Tampilkan loading saat:
  // 1. Belum mounted (hydration)
  // 2. Masih fetch data user
  // 3. User belum ada
  if (!mounted || loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="text-gray-500 mt-4">Memuat data...</p>
      </div>
    );
  }

  const guruData = {
    id: user.id,
    nama: user.name
  };

  return <WeeklyManagement guruData={guruData} />;
}