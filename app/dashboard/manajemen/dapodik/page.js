"use client"
import { useEffect, useState } from "react"
import DataSiswa from "../../components/dapodik/DataSiswa";
import { useAuth } from "@/lib/getUserClientSide";

export default function Dapodik(){
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dapodik")
        const result = await res.json()
        setData(result)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
    const { user } = useAuth();
    const userRoleName=user?.name;
    return <><DataSiswa userRoleName={userRoleName} data={data} loading={loading}/></>
}