"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function GPSSettingToggle({ user }) {
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch current setting saat komponen dimuat
  useEffect(() => {
    fetchGPSSetting();
  }, []);

  const fetchGPSSetting = async () => {
    try {
      const res = await fetch("/api/settings/gps");
      const data = await res.json();
      
      if (data.success) {
        setGpsEnabled(data.enabled);
      }
    } catch (error) {
      console.error("Failed to fetch GPS setting:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleToggle = async (checked) => {
    setLoading(true);
    
    try {
      const res = await fetch("/api/settings/gps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: checked,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setGpsEnabled(checked);
      } else {
        alert("Gagal mengubah pengaturan: " + data.error);
      }
    } catch (error) {
      console.error("Error toggling GPS:", error);
      alert("Gagal mengubah pengaturan GPS");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
            <p className="text-sm text-muted-foreground">Memuat pengaturan...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <CardTitle>Validasi Lokasi GPS</CardTitle>
          </div>
          <Switch
            checked={gpsEnabled}
            onCheckedChange={handleToggle}
            disabled={loading}
            id="gps-toggle"
          />
        </div>
        <CardDescription>
          Kontrol validasi lokasi untuk sistem presensi karyawan
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          {gpsEnabled ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Validasi GPS Aktif
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                Validasi GPS Nonaktif
              </span>
            </>
          )}
        </div>

        {/* Info Alert */}
        {gpsEnabled ? (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              Karyawan harus berada dalam radius <strong>500 meter</strong> dari lokasi kantor untuk melakukan presensi.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Mode Darurat:</strong> Presensi dapat dilakukan dari lokasi manapun. Gunakan dengan bijak!
            </AlertDescription>
          </Alert>
        )}

        {/* Additional Info */}
        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">ℹ️ Informasi:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Nonaktifkan saat ada kebijakan WFH atau situasi darurat</li>
            <li>Perubahan pengaturan akan dicatat dalam sistem audit</li>
            <li>Pengaturan berlaku untuk semua karyawan</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}