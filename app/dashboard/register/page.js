"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    created_at: "",
  });
  const [message, setMessage] = useState("");
  const [loadingRoles, setLoadingRoles] = useState(true); // loader roles
  const [submitting, setSubmitting] = useState(false); // loader submit

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Error fetch roles:", err);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Pendaftaran berhasil!");
        setForm({
          name: "",
          email: "",
          password: "",
          role_id: "",
          created_at: "",
        });
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("❌ Terjadi kesalahan server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Register User</h1>

      {loadingRoles ? (
        <div className="flex items-center justify-center py-10 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Memuat roles...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={submitting}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={submitting}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={submitting}
          />
          <select
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={submitting}
          >
            <option value="">-- Pilih Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Mendaftarkan...
              </>
            ) : (
              "Daftar"
            )}
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
