"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function RolesPage() {
  const [roles, setRoles] = useState([])
  const [newRole, setNewRole] = useState("")
  const [editRole, setEditRole] = useState(null)

  const fetchRoles = async () => {
    const res = await fetch("/api/roles")
    const data = await res.json()
    setRoles(data)
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleAdd = async () => {
    if (!newRole) return
    await fetch("/api/roles", {
      method: "POST",
      body: JSON.stringify({ name: newRole }),
    })
    setNewRole("")
    fetchRoles()
  }

  const handleUpdate = async (id) => {
    await fetch("/api/roles", {
      method: "PUT",
      body: JSON.stringify({ id, name: editRole.name }),
    })
    setEditRole(null)
    fetchRoles()
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus role ini?")) return
    await fetch("/api/roles", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
    fetchRoles()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Manajemen Roles & Users</h1>

      {/* Form tambah role */}
      <div className="flex gap-2">
        <Input
          placeholder="Nama role baru"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        />
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </div>

      {/* List role + user */}
      <div className="space-y-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>
                {editRole?.id === role.id ? (
                  <Input
                    value={editRole.name}
                    onChange={(e) =>
                      setEditRole({ ...editRole, name: e.target.value })
                    }
                  />
                ) : (
                  role.name
                )}
              </CardTitle>
              <CardContent className="flex gap-2">
                {editRole?.id === role.id ? (
                  <Button onClick={() => handleUpdate(role.id)} size="sm">
                    Simpan
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditRole(role)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(role.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </CardHeader>

            {/* Users dari role ini */}
            <CardContent>
              {role.users.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {role.users.map((u) => (
                    <li key={u.id}>
                      <span className="font-semibold">{u.name}</span> – {u.email}
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
        ))}
      </div>
    </div>
  )
}
