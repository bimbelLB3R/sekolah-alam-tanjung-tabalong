"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JamBatasSettings({ user }) {
  const [jamBatas, setJamBatas] = useState("07:15");
  const [inputJam, setInputJam] = useState("07:15");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }

  useEffect(() => {
    fetchJamBatas();
  }, []);

  const fetchJamBatas = async () => {
    try {
      const res = await fetch("/api/settings/jam-batas");
      const data = await res.json();

      if (data.success) {
        // Potong ke HH:MM untuk input type="time"
        const hhmm = data.jamBatas.slice(0, 5);
        setJamBatas(hhmm);
        setInputJam(hhmm);
      }
    } catch (error) {
      console.error("Failed to fetch jam batas:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    // Validasi tidak boleh kosong
    if (!inputJam) {
      setStatus({ type: "error", message: "Jam batas tidak boleh kosong" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/settings/jam-batas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jamBatas: inputJam,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setJamBatas(inputJam);
        setStatus({ type: "success", message: `Jam batas berhasil diubah ke ${inputJam}` });
      } else {
        setStatus({ type: "error", message: data.error ?? "Gagal menyimpan pengaturan" });
      }
    } catch (error) {
      console.error("Error saving jam batas:", error);
      setStatus({ type: "error", message: "Terjadi kesalahan saat menyimpan" });
    } finally {
      setLoading(false);
    }
  };

  const hasChanged = inputJam !== jamBatas;

  if (fetching) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            <p className="text-sm text-muted-foreground">Memuat pengaturan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <CardTitle>Jam Batas Presensi Masuk</CardTitle>
        </div>
        <CardDescription>
          Karyawan yang absen melebihi jam ini akan ditandai <strong>terlambat</strong>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Jam */}
        <div className="space-y-2">
          <Label htmlFor="jam-batas">Jam Batas</Label>
          <div className="flex items-center gap-3">
            <Input
              id="jam-batas"
              type="time"
              value={inputJam}
              onChange={(e) => {
                setInputJam(e.target.value);
                setStatus(null);
              }}
              className="w-40"
            />
            <Button
              onClick={handleSave}
              disabled={loading || !hasChanged}
              size="sm"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
            {/* Tombol reset jika ada perubahan yang belum disimpan */}
            {hasChanged && !loading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInputJam(jamBatas);
                  setStatus(null);
                }}
              >
                Batal
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Jam batas saat ini:{" "}
            <span className="font-semibold text-foreground">{jamBatas} WIB</span>
          </p>
        </div>

        {/* Feedback status */}
        {status && (
          <Alert variant={status.type === "error" ? "destructive" : "default"}>
            {status.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">ℹ️ Informasi:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Role <strong>Staff</strong> dan <strong>Superadmin</strong> tidak terikat jam batas</li>
            <li>Perubahan langsung berlaku untuk absensi berikutnya</li>
            <li>Perubahan pengaturan dicatat dalam sistem audit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}