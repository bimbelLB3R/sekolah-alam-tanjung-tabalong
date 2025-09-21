"use client";
import { useState, useEffect } from "react";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role_id: "" });
  const [editingId, setEditingId] = useState(null);

  // Ambil data dari API
  const fetchData = async () => {
    const res = await fetch("/api/users");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...form }),
      });
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ name: "", email: "", role_id: "" });
    setEditingId(null);
    fetchData();
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role_id: user.role_id });
  };

  const handleDelete = async (id) => {
    if (confirm("Hapus user ini?")) {
      await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchData();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      {/* Form Tambah/Edit */}
      <div className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Role ID"
          value={form.role_id}
          onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          className="border p-2 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Tabel Users */}
      {data.map((role) => (
        <div key={role.id} className="mb-6">
          <h2 className="font-semibold">{role.name}</h2>
          <table className="w-full border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {role.users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-2 py-1">{user.name}</td>
                  <td className="border px-2 py-1">{user.email}</td>
                  <td className="border px-2 py-1 space-x-2 flex justify-end">
                    <button
                      onClick={() => handleEdit({ ...user, role_id: role.id })}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {role.users.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center p-2">
                    No users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
