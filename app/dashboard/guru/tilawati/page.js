"use client"
import { useAuth } from "@/lib/getUserClientSide"
import PesertaTilawatiTable from "../../components/tilawati/TabelPesertaTilawati";

export default function Tahfidz(){
    const { user, loading } = useAuth();
    const userName=user?.name;
    // console.log(userName)
    return (
    <div className="p-1">
      <PesertaTilawatiTable userName={userName} />
    </div>
  );
}