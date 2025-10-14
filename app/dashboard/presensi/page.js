
"use client";

import { useState, useEffect } from "react";
import SelfieCamera from "../components/SelfieCamera";
import { useRouter } from "next/navigation";

export default function PresensiPage() {
  const [user, setUser] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [distance, setDistance] = useState(null);
  const router=useRouter();

  // Titik acuan (misal lokasi kantor)
  const baseLat = -2.173433;
  const baseLng = 115.432810;
  const maxDistance = 500; // meter

  const now = new Date();
  const tanggal = now.toISOString().split("T")[0];
  const jam = now.toTimeString().split(" ")[0];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  // Fungsi hitung jarak pakai rumus haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // radius bumi dalam meter
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d;
  };

  const handleCapture = async (file) => {
    setPhotoFile(file);

    try {
      const pos = await new Promise((resolve, reject) =>
  navigator.geolocation.getCurrentPosition(resolve, reject, {
    enableHighAccuracy: true,
    timeout: 10000, // tunggu hingga 10 detik
    maximumAge: 0   // jangan pakai lokasi cache
  })
);


      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      setLatitude(userLat);
      setLongitude(userLng);

      // hitung jarak ke titik acuan
      const jarak = calculateDistance(baseLat, baseLng, userLat, userLng);
      setDistance(jarak);
    } catch (err) {
      console.error("Gagal ambil lokasi:", err);
      alert("Pastikan GPS aktif dan beri izin lokasi.");
    }
  };

  const handleSubmit = async (jenis) => {
    if (!photoFile) {
      alert("Harap ambil foto dulu!");
      return;
    }

    if (!latitude || !longitude) {
      alert("Lokasi belum berhasil didapatkan. Coba ambil foto ulang.");
      return;
    }

    if (distance > maxDistance) {
      alert(`Jarak Anda ${distance.toFixed(2)} m dari titik acuan. Presensi tidak bisa dilakukan.`);
      return;
    }

    setLoading(true);

    try {
      let deviceInfo = {
        userAgent: navigator.userAgent,
        memory: navigator.deviceMemory || "unknown",
      };

      if (navigator.userAgentData) {
        deviceInfo.brands = navigator.userAgentData.brands;
        deviceInfo.mobile = navigator.userAgentData.mobile;
        deviceInfo.platform = navigator.userAgentData.platform;
      }

      const formData = new FormData();
      formData.append("photo", photoFile);
      formData.append("user_id", user?.id);
      formData.append("jenis", jenis);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("jarak", distance);
      formData.append("device", JSON.stringify(deviceInfo));
      formData.append("tanggal", tanggal);
      formData.append("jam", jam);

      const res = await fetch("/api/presensi", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Presensi berhasil!");
        router.push("/dashboard/manajemen/data-presensi")
      } else {
        alert("Presensi gagal: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal kirim presensi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-center">
        <SelfieCamera onCapture={handleCapture} />
      </div>

      {/* Info lokasi dan jarak */}
      {latitude && longitude && (
        <div className="text-center text-sm text-gray-600">
          Lokasi: {latitude.toFixed(6)}, {longitude.toFixed(6)} <br />
          Jarak dari titik acuan:{" "}
          <span className="font-bold">{distance ? distance.toFixed(2) : 0} m</span>
        </div>
      )}

      {/* Jika jarak melebihi batas, beri peringatan */}
      {distance !== null && distance > maxDistance && (
        <div className="text-center text-red-600 text-sm font-semibold">
          ❌ Anda berada terlalu jauh dari lokasi presensi (lebih dari {maxDistance} m)
        </div>
      )}

      {/* Tombol hanya muncul jika jarak <= 100 m */}
      {distance !== null && distance <= maxDistance && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleSubmit("masuk")}
            disabled={loading || !user}
            className={`px-4 py-2 rounded text-white flex items-center justify-center ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
            }`}
          >
            {loading ? "Memproses..." : "Absen Masuk"}
          </button>

          <button
            onClick={() => handleSubmit("pulang")}
            disabled={loading || !user}
            className={`px-4 py-2 rounded text-white flex items-center justify-center ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600"
            }`}
          >
            {loading ? "Memproses..." : "Absen Pulang"}
          </button>
        </div>
      )}
    </div>
  );
}
