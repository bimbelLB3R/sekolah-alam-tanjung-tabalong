"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Loader2 } from "lucide-react";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState({}); // track toggle loading per user

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Hapus user ini?")) {
      setLoading(true);
      await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchData();
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    setToggling((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      if (res.ok) {
        // Update local state
        setData((prevData) =>
          prevData.map((role) => ({
            ...role,
            users: role.users.map((user) =>
              user.id === id ? { ...user, isActive: !currentStatus } : user
            ),
          }))
        );
      }
    } catch (err) {
      console.error("Error toggling user status:", err);
    } finally {
      setToggling((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Users</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
          <span className="ml-3 text-gray-600">Loading data...</span>
        </div>
      ) : (
        data.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="text-lg">{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-[300px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Name</TableHead>
                      <TableHead className="w-1/4">Email</TableHead>
                      <TableHead className="w-1/6">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {role.users.length > 0 ? (
                      role.users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50">
                          <TableCell className="whitespace-nowrap">
                            {user.name}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={user.isActive ?? true}
                                onCheckedChange={() =>
                                  handleToggleActive(
                                    user.id,
                                    user.isActive ?? true
                                  )
                                }
                                disabled={toggling[user.id]}
                              />
                              <span
                                className={`text-sm ${
                                  user.isActive ?? true
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {user.isActive ?? true ? "Aktif" : "Nonaktif"}
                              </span>
                              {toggling[user.id] && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500"
                        >
                          Tidak ada user
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}