"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [editRole, setEditRole] = useState(null);
  const [loading, setLoading] = useState(true); // loader state
  const [actionLoading, setActionLoading] = useState(false); // loader saat add/update/delete

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Error fetch roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAdd = async () => {
    if (!newRole) return;
    setActionLoading(true);
    try{
    const res=await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRole }),
    });
    const result = await res.json();
    if (res.ok) {
      // Tambahkan role baru ke state lokal
      setRoles(prev => [result, ...prev]);
      setActionLoading(false);
      setNewRole("");
    } else {
      console.error(result.error);
    }
  }catch (error) {
    console.error("Error tambah role:", error);
  } finally {
    setActionLoading(false); // ✅ pastikan loading dimatikan walau error
  
  }
    // setNewRole("");
    // await fetchRoles();
    // setActionLoading(false);
  };

  const handleUpdate = async (id) => {
    setActionLoading(true);
    try{
    const res=await fetch("/api/roles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editRole.name }),
    });
    const result = await res.json();

     if (res.ok) {
      // Update item di state lokal
      setRoles(prev =>
        prev.map(role => role.id === id ? result : role)
      );
      setEditRole(null);
    } else {
      console.error(result.error);
    }
  }catch (error) {
    console.error("Error update role:", error);
  } finally {
    setActionLoading(false);
  }
  };

  
const handleDelete = async (id) => {
  if (!confirm("Yakin hapus role ini?")) return;

  setActionLoading(true);
  try {
    const res = await fetch("/api/roles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (res.ok) {
      // Hapus role dari state lokal
      setRoles(prev => prev.filter(role => role.id !== id));
      console.log(result.message);
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error delete role:", error);
  } finally {
    setActionLoading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Manajemen Roles & Users</h1>

      {/* Form tambah role */}
      <div className="flex gap-2">
        <Input
          placeholder="Nama role baru"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          disabled={actionLoading}
        />
        <Button onClick={handleAdd} className="gap-2" disabled={actionLoading}>
          {actionLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Tambah
        </Button>
      </div>

      {/* List role + user */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
            <span className="ml-3 text-gray-600">Loading roles...</span>
          </div>
        ) : roles ? (
          roles.map((role) => (
            <Card key={role.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>
                  {editRole?.id === role.id ? (
                    <Input
                      value={editRole.name}
                      onChange={(e) =>
                        setEditRole({ ...editRole, name: e.target.value })
                      }
                      disabled={actionLoading}
                    />
                  ) : (
                    role.name
                  )}
                </CardTitle>
                <CardContent className="flex gap-2">
                  {editRole?.id === role.id ? (
                    <Button
                      onClick={() => handleUpdate(role.id)}
                      size="sm"
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Simpan"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditRole(role)}
                      disabled={actionLoading}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(role.id)}
                    disabled={actionLoading}
                  >
                      <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </CardHeader>

              {/* Users dari role ini */}
              <CardContent>
                {role.users? (
                  <ul className="list-disc pl-5 space-y-1">
                    {role.users.map((u) => (
                      <li key={u.id}>
                        <span className="font-semibold">{u.name}</span> –{" "}
                        {u.email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    Belum ada user untuk role ini
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 italic">Belum ada role</p>
        )}
      </div>
    </div>
  );
}
