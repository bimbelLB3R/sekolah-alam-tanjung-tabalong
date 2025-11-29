"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/formatDate";

export default function GajiFormModal({ open, setOpen, onSuccess }) {
  const [users, setUsers] = useState([]);
  const today1 = new Date().toISOString().split("T")[0];
  const today=formatDate(today1)
  const [form, setForm] = useState({
    id: null,
    user_id: "",
    jabatan: "",
    departemen: "",
    gaji_pokok: "",
    tunjangan_bpjs: 0,
    tunjangan_jabatan: 0,
    tunjangan_makan: 0,
    tunjangan_kehadiran: 0,
    tunjangan_sembako: 0,
    tunjangan_kepala_keluarga: 0,
    potongan_makan: 0,
    effective_date: today, // ✅ Tanggal hari ini (YYYY-MM-DD)
  });

  useEffect(() => {
    const today1 = new Date().toISOString().split("T")[0];
  const today=formatDate(today1)
    if (typeof open === "object") {
      setForm({
        ...open,
        effective_date: open.effective_date || today
      });
    } else {
      setForm({
        id: null,
        user_id: "",
        jabatan: "",
        departemen: "",
        gaji_pokok: "",
        tunjangan_bpjs: 0,
        tunjangan_jabatan: 0,
        tunjangan_makan: 0,
        tunjangan_kehadiran: 0,
        tunjangan_sembako: 0,
        tunjangan_kepala_keluarga: 0,
        potongan_makan: 0,
        effective_date: today
      });
    }
  }, [open]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/tahfidz/pembimbing");
      setUsers(await res.json());
    }
    fetchUsers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/bendahara/listkaryawan", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setOpen(false);
      onSuccess();
    }
  }

  return (
    <Dialog open={!!open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Gaji" : "Tambah Gaji Karyawan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Karyawan</label>
            <select
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            >
              <option value="">Pilih karyawan</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm">Jabatan</label>
            <input
              value={form.jabatan}
              onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Departemen</label>
            <input
              value={form.departemen}
              onChange={(e) => setForm({ ...form, departemen: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Gaji Pokok</label>
            <input
              type="number"
              value={form.gaji_pokok}
              onChange={(e) => setForm({ ...form, gaji_pokok: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>
          {/* tunjangan lainnya */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm">Tunjangan BPJS</label>
              <input
                type="number"
                value={form.tunjangan_bpjs}
                onChange={(e) => setForm({ ...form, tunjangan_bpjs: e.target.value })}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">Tunjangan Jabatan</label>
              <input
                type="number"
                value={form.tunjangan_jabatan}
                onChange={(e) => setForm({ ...form, tunjangan_jabatan: e.target.value })}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">Tunjangan Makan</label>
              <input
                type="number"
                value={form.tunjangan_makan}
                onChange={(e) => setForm({ ...form, tunjangan_makan: e.target.value })}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">Tunjangan Kehadiran</label>
              <input
                type="number"
                value={form.tunjangan_kehadiran}
                onChange={(e) => setForm({ ...form, tunjangan_kehadiran: e.target.value })}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">Tunjangan Sembako</label>
              <input
                type="number"
                value={form.tunjangan_sembako}
                onChange={(e) => setForm({ ...form, tunjangan_sembako: e.target.value })}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">Tunjangan Kepala Keluarga</label>
              <input
                type="number"
                value={form.tunjangan_kepala_keluarga}
                onChange={(e) => setForm({ ...form, tunjangan_kepala_keluarga: e.target.value })}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">Potongan Lainnya</label>
              <input
                type="number"
                value={form.potongan_makan}
                onChange={(e) => setForm({ ...form, potongan_makan: e.target.value })}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">Tanggal Efektif</label>
              <input
                type="date"
                value={form.effective_date}
                onChange={(e) => setForm({ ...form, effective_date: e.target.value })}
                className="border rounded w-full px-2 py-1"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit">{form.id ? "Simpan Perubahan" : "Tambah"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
