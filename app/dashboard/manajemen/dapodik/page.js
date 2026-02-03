"use client"
import { useEffect, useState } from "react"
import DataSiswa from "../../components/dapodik/DataSiswa";
import { useAuth } from "@/lib/getUserClientSide";

export default function Dapodik(){
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ jenjang: "all", kelas: "all" })

  const fetchData = async (filterParams = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterParams.jenjang && filterParams.jenjang !== "all") {
        params.append("jenjang", filterParams.jenjang)
      }
      if (filterParams.kelas && filterParams.kelas !== "all") {
        params.append("kelas", filterParams.kelas)
      }

      const res = await fetch(`/api/dapodik?${params.toString()}`)
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    fetchData(newFilters)
  }

  const { user } = useAuth();
  const userRoleName = user?.name;

  return (
    <DataSiswa 
      userRoleName={userRoleName} 
      data={data} 
      loading={loading}
      onFilterChange={handleFilterChange}
    />
  )
}