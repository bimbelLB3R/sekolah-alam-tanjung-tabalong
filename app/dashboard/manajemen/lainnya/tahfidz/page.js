"use client";
import TabelManajemenTahfidz from "@/app/dashboard/components/lain-lain/tahfidz/TabelManajemenTahfidz";
import { useEffect, useState } from "react";
export default function ManajemenTahfidz(){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataSiswa, setDataSiswa] = useState([]);
    const [dataUser, setDataUser] = useState([]);

    // modal state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nama_siswa: "",
    pembimbing: "",
    nama_rombel: "",
  });
  const [submitting, setSubmitting] = useState(false);
    // fetch data
      const fetchData = async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/tahfidz");
          const json = await res.json();
          setData(json);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);

      
// ambil data siswa
useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dapodik")
        const result = await res.json()
        setDataSiswa(result)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ambil data user
useEffect(() => {
    const fetchData = async () => {
      try {
        const res2=await fetch("/api/tahfidz/pembimbing")
        const result2 = await res2.json()
        console.log(result2)
        setDataUser(result2)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  
  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let res, result;

      if (form.id) {
        // update
        res = await fetch(`/api/tahfidz/peserta/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // insert
        res = await fetch("/api/tahfidz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      result = await res.json();
      if (res.ok) {
        // agar data langsung up date dan tidak load ulang semua data seperti fetch
        setData(prev => {
        const exists = prev.some(item => item.id === result.id);
        if (exists) {
            // Jika data sudah ada → UPDATE
            return prev.map(item => item.id === result.id ? result : item);
        } else {
            // Jika data belum ada → INSERT
            return [result, ...prev];
        }
        });
        setOpen(false);
      } else {
        // alert(result.error || "Terjadi kesalahan");
        console.log(result.error)
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  
  // buka modal untuk tambah
  const handleOpenAdd = () => {
    setForm({ id: null, nama_siswa: "", pembimbing: "", nama_rombel: "" });
    setOpen(true);
  };

  // buka modal untuk edit
  const handleOpenEdit = (row) => {
    setForm({
      id: row.id,
      nama_siswa: row.nama_siswa,
      pembimbing: row.pembimbing,
      nama_rombel: row.nama_rombel,
    });
    setOpen(true);
  };
    return <><TabelManajemenTahfidz data={data} loading={loading} dataSiswa={dataSiswa} dataUser={dataUser} handleOpenEdit={handleOpenEdit} handleOpenAdd={handleOpenAdd} handleSubmit={handleSubmit} submitting={submitting} open={open} setOpen={setOpen} form={form} setForm={setForm}/></>
}