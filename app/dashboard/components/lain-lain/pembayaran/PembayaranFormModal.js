"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/formatDate";

export default function PembayaranFormModal({ open, setOpen, onSuccess }) {
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    tgl_bayar:"",
    nama_lengkap:"",
    kelas_saatini: "",
    jenis_pembayaran: "",
    jml_bayar:"",
    cara_bayar:"",
    penerima: "",
    keterangan:""
  });
//   console.log(form)

  useEffect(() => {
    const today= new Date().toISOString().split("T")[0];
    if (typeof open === "object") {
        const today2= new Date(open.tgl_bayar).toISOString().split("T")[0];
        // console.log(today2)
      setForm({
          ...open,
        tgl_bayar:today2||today,
      });
    //   const cek=open.tgl_bayar
    //   console.log(today)
    } else {
      setForm({
        id: null,
        tgl_bayar:today,
        nama_lengkap:"",
        kelas_saatini: "",
        jenis_pembayaran: "",
        jml_bayar:"",
        cara_bayar:"",
        penerima: "",
        keterangan:""
      });
    }
  }, [open]);

  useEffect(() => {
    async function fetchSiswa() {
      try {
        const res = await fetch("/api/.....");
        const data = await res.json();
        setSiswaList(data);
      } catch (err) {
        console.error("Gagal mengambil data wali kelas", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSiswa();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/.....", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setOpen(false);
      await onSuccess(); // ✅ langsung refresh tabel kelas
    }
  }
  console.log(siswaList)

  return (
    <Dialog open={!!open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">Tanggal</label>
            <input
              type="date"
              value={form.tgl_bayar}
              onChange={(e) => setForm({ ...form, tgl_bayar: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Nama Lengkap</label>
            <input
              type="text"
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Kelas</label>
            <input
              type="text"
              value={form.kelas_saatini}
              onChange={(e) => setForm({ ...form, kelas_saatini: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Jenis Pembayaran</label>
            <input
              type="text"
              value={form.jenis_pembayaran}
              onChange={(e) => setForm({ ...form, jenis_pembayaran: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Jumlah</label>
            <input
              type="number"
              value={form.jml_bayar}
              onChange={(e) => setForm({ ...form, jml_bayar: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Cara Pembayaran</label>
            <input
              type="text"
              value={form.cara_bayar}
              onChange={(e) => setForm({ ...form, cara_bayar: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Penerima</label>
            <input
              type="text"
              value={form.penerima}
              onChange={(e) => setForm({ ...form, penerima: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Keterangan</label>
            <input
              type="text"
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>

         

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">
              {form.id ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
