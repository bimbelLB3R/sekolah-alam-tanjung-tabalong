"use client"
import DataSiswa from "../../components/dapodik/DataSiswa";
import { useAuth } from "@/lib/getUserClientSide";

export default function Dapodik(){
    const { user, loading } = useAuth();
    const userRoleName=user?.name;
    return <><DataSiswa userRoleName={userRoleName}/></>
}