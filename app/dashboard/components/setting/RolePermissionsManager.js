"use client";

import { useState, useEffect } from "react";
import { Shield, Plus, Trash2, Save, X, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RolePermissionsManager({ user }) {
  const [permissions, setPermissions] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const roles = Object.keys(permissions).sort();

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      setRoutes(permissions[selectedRole] || []);
      setHasChanges(false);
    }
  }, [selectedRole, permissions]);

  const fetchPermissions = async () => {
    try {
      const res = await fetch("/api/settings/role-permissions");
      const data = await res.json();

      if (data.success) {
        setPermissions(data.permissions);
        // Auto-select first role
        const firstRole = Object.keys(data.permissions).sort()[0];
        if (firstRole && !selectedRole) {
          setSelectedRole(firstRole);
        }
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setStatus({ type: "error", message: "Gagal memuat data permissions" });
    } finally {
      setFetching(false);
    }
  };

  const handleAddRoute = () => {
    if (!newRoute.trim()) return;

    const trimmedRoute = newRoute.trim();

    // Cek duplikasi
    if (routes.includes(trimmedRoute)) {
      setStatus({ type: "error", message: "Route sudah ada dalam daftar" });
      return;
    }

    setRoutes([...routes, trimmedRoute]);
    setNewRoute("");
    setHasChanges(true);
    setStatus(null);
  };

  const handleRemoveRoute = (routeToRemove) => {
    // Proteksi untuk superadmin wildcard
    if (selectedRole === "superadmin" && routeToRemove === "*") {
      setStatus({ 
        type: "error", 
        message: "Route '*' tidak bisa dihapus dari superadmin" 
      });
      return;
    }

    setRoutes(routes.filter(r => r !== routeToRemove));
    setHasChanges(true);
    setStatus(null);
  };

  const handleSave = async () => {
    if (!selectedRole) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/settings/role-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleName: selectedRole,
          routes: routes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ 
          type: "success", 
          message: `Permissions untuk '${selectedRole}' berhasil disimpan` 
        });
        setHasChanges(false);
        // Refresh data
        await fetchPermissions();
      } else {
        setStatus({ type: "error", message: data.error });
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      setStatus({ type: "error", message: "Gagal menyimpan permissions" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRoutes(permissions[selectedRole] || []);
    setHasChanges(false);
    setStatus(null);
  };

  if (fetching) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            <p className="text-sm text-muted-foreground">Memuat permissions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle>Manajemen Role Permissions</CardTitle>
        </div>
        <CardDescription>
          Kelola izin akses route untuk setiap role pengguna
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pilih Role</label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRole && (
          <>
            {/* Add Route Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tambah Route Baru</label>
              <div className="flex gap-2">
                <Input
                  placeholder="/dashboard/example"
                  value={newRoute}
                  onChange={(e) => setNewRoute(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRoute();
                    }
                  }}
                />
                <Button onClick={handleAddRoute} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah
                </Button>
              </div>
            </div>

            {/* Routes List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Daftar Routes ({routes.length})
                </label>
                {hasChanges && (
                  <Badge variant="outline" className="text-orange-600">
                    Belum disimpan
                  </Badge>
                )}
              </div>

              <div className="border rounded-lg p-3 max-h-80 overflow-y-auto space-y-2">
                {routes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Belum ada route untuk role ini
                  </p>
                ) : (
                  routes.map((route, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-muted/50 rounded px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <code className="text-sm font-mono">{route}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRoute(route)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={loading || !hasChanges}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
              {hasChanges && !loading && (
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </Button>
              )}
            </div>

            {/* Status Alert */}
            {status && (
              <Alert variant={status.type === "error" ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Info */}
        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">ℹ️ Informasi:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Route <code>*</code> untuk superadmin berarti akses ke semua halaman</li>
            <li>Perubahan langsung berlaku setelah user login ulang</li>
            <li>Hati-hati saat menghapus permissions — pastikan role masih bisa akses dashboard</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}