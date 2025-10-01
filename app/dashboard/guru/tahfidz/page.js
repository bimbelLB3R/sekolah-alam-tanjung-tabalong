"use client"
import { useAuth } from "@/lib/getUserClientSide"
import PesertaTahfidzTable from "../../components/tahfidz/TabelPeserta";

export default function Tahfidz(){
    const { user, loading } = useAuth();
    const userName=user?.name;
    return (
    <div className="p-1">
      <PesertaTahfidzTable userName={userName} />
    </div>
  );
}