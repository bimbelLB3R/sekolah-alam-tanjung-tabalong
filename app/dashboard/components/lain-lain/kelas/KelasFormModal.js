"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function KelasFormModal({ open, setOpen, onSuccess }) {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    kelas: "",
    jenjang: "",
    rombel: "",
    wali_kelas: ""
  });

  useEffect(() => {
    if (typeof open === "object") {
      setForm({
        id: open.id,
        kelas: open.kelas || "",
        jenjang: open.jenjang || "",
        rombel: open.rombel || "",
        wali_kelas: open.wali_kelas_id || ""
      });
    } else {
      setForm({
        id: null,
        kelas: "",
        jenjang: "",
        rombel: "",
        wali_kelas: ""
      });
    }
  }, [open]);

  useEffect(() => {
    async function fetchGuru() {
      try {
        const res = await fetch("/api/tahfidz/pembimbing");
        const data = await res.json();
        setGuruList(data);
      } catch (err) {
        console.error("Gagal mengambil data wali kelas", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuru();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/nama-kelas", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setOpen(false);
      await onSuccess(); // ✅ langsung refresh tabel kelas
    }
  }

  return (
    <Dialog open={!!open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">Kelas</label>
            <input
              type="number"
              value={form.kelas}
              onChange={(e) => setForm({ ...form, kelas: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Jenjang</label>
            <select
              value={form.jenjang}
              onChange={(e) => setForm({ ...form, jenjang: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            >
              <option value="">Pilih Jenjang</option>
              <option value="TK">TK</option>
              <option value="KB">KB</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Rombel</label>
            <select
              value={form.rombel}
              onChange={(e) => setForm({ ...form, rombel: e.target.value })}
              className="border rounded w-full px-2 py-1"
              required
            >
              <option value="">Pilih Rombel</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Wali Kelas</label>
            <select
              value={form.wali_kelas}
              onChange={(e) => setForm({ ...form, wali_kelas: e.target.value })}
              className="border rounded w-full px-2 py-1"
              disabled={loading}
              required
            >
              <option value="">{loading ? "Loading..." : "Pilih Wali Kelas"}</option>
              {guruList.map((guru) => (
                <option key={guru.id} value={guru.id}>
                  {guru.name}
                </option>
              ))}
            </select>
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
