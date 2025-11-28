


"use client";

import { useState, useEffect } from "react";
import SelfieCamera from "../components/SelfieCamera";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";

export default function PresensiPage() {
  const [user, setUser] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [distance, setDistance] = useState(null);
  const [gpsValidationEnabled, setGpsValidationEnabled] = useState(true);
  const [presensiStatus, setPresensiStatus] = useState({
    sudahMasuk: false,
    sudahPulang: false,
    masuk: null,
    pulang: null
  });
  const [checkingStatus, setCheckingStatus] = useState(true);
  const router = useRouter();

  const baseLat = -2.173433;
  const baseLng = 115.432810;
  const maxDistance = 500;

  const now = new Date();
  // const tanggal = now.toISOString().split("T")[0]; //tanggal tidak usah dikonversi ke iso
  const tanggal = now.toLocaleDateString("en-CA"); //2025-11-29 en CA english Canada formatnya 2025-11-29
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
          
          // Setelah dapat user, cek status presensi
          if (data?.id) {
            await checkPresensiStatus(data.id);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    const fetchGPSSetting = async () => {
      try {
        const res = await fetch("/api/settings/gps");
        const data = await res.json();
        
        if (data.success) {
          setGpsValidationEnabled(data.enabled);
        }
      } catch (err) {
        console.error("Failed to fetch GPS setting:", err);
      }
    };

    fetchUser();
    fetchGPSSetting();
  }, []);

  const checkPresensiStatus = async (userId) => {
    setCheckingStatus(true);
    try {
      const res = await fetch(
        `/api/presensi/check?user_id=${userId}&tanggal=${tanggal}`
      );
      const data = await res.json();
      
      if (data.success) {
        setPresensiStatus({
          sudahMasuk: data.sudahMasuk,
          sudahPulang: data.sudahPulang,
          masuk: data.masuk,
          pulang: data.pulang
        });
      }
    } catch (err) {
      console.error("Error checking presensi:", err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
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

    if (!gpsValidationEnabled) {
      setLatitude(0);
      setLongitude(0);
      setDistance(0);
      return;
    }

    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      );

      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;

      setLatitude(userLat);
      setLongitude(userLng);

      const jarak = calculateDistance(baseLat, baseLng, userLat, userLng);
      setDistance(jarak);
    } catch (err) {
      console.error("Gagal ambil lokasi:", err);
      alert("Pastikan GPS aktif dan beri izin lokasi.");
    }
  };

  const handleSubmit = async (jenis) => {
    // Validasi sudah presensi atau belum
    if (jenis === "masuk" && presensiStatus.sudahMasuk) {
      alert("Anda sudah melakukan absen masuk hari ini!");
      return;
    }

    if (jenis === "pulang" && presensiStatus.sudahPulang) {
      alert("Anda sudah melakukan absen pulang hari ini!");
      return;
    }

    // Validasi harus absen masuk dulu sebelum pulang
    if (jenis === "pulang" && !presensiStatus.sudahMasuk) {
      alert("Anda harus absen masuk terlebih dahulu sebelum absen pulang!");
      return;
    }

    if (!photoFile) {
      alert("Harap ambil foto dulu!");
      return;
    }

    if (gpsValidationEnabled) {
      if (!latitude || !longitude) {
        alert("Lokasi belum berhasil didapatkan. Coba ambil foto ulang.");
        return;
      }

      if (distance > maxDistance) {
        alert(`Jarak Anda ${distance.toFixed(2)} m dari titik acuan. Presensi tidak bisa dilakukan.`);
        return;
      }
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
      formData.append("latitude", latitude || 0);
      formData.append("longitude", longitude || 0);
      formData.append("jarak", distance || 0);
      formData.append("gps_validated", gpsValidationEnabled);
      formData.append("device", JSON.stringify(deviceInfo));
      formData.append("tanggal", tanggal);
      formData.append("jam", jam);

      const res = await fetch("/api/presensi", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      // console.log(formData);
      if (data.success) {
        // Tampilkan pesan sesuai keterangan
        const message = data.message || "Presensi berhasil!";
        alert(message);
        
        // Refresh status presensi
        await checkPresensiStatus(user.id);
        // Reset foto
        setPhotoFile(null);
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

  const canSubmit = gpsValidationEnabled 
    ? (distance !== null && distance <= maxDistance)
    : (photoFile !== null);

  // Tampilan loading saat cek status
  if (checkingStatus) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Memuat status presensi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Status Presensi Hari Ini */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          📅 Status Presensi Hari Ini
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Status Masuk */}
          <div className={`p-3 rounded-lg border ${
            presensiStatus.sudahMasuk 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {presensiStatus.sudahMasuk ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-xs font-medium text-gray-700">
                Absen Masuk
              </span>
            </div>
            {presensiStatus.sudahMasuk ? (
              <p className="text-xs text-green-700 font-semibold">
                ✓ {presensiStatus.masuk?.jam}
              </p>
            ) : (
              <p className="text-xs text-gray-500">Belum absen</p>
            )}
          </div>

          {/* Status Pulang */}
          <div className={`p-3 rounded-lg border ${
            presensiStatus.sudahPulang 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {presensiStatus.sudahPulang ? (
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              ) : (
                <Clock className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-xs font-medium text-gray-700">
                Absen Pulang
              </span>
            </div>
            {presensiStatus.sudahPulang ? (
              <p className="text-xs text-blue-700 font-semibold">
                ✓ {presensiStatus.pulang?.jam}
              </p>
            ) : (
              <p className="text-xs text-gray-500">Belum absen</p>
            )}
          </div>
        </div>
      </div>

      {/* Badge Status GPS */}
      {!gpsValidationEnabled && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-orange-800">
                Mode Darurat: Validasi GPS Nonaktif
              </p>
              <p className="text-xs text-orange-600">
                Presensi dapat dilakukan dari lokasi manapun
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Jika sudah absen masuk dan pulang, tampilkan pesan */}
      {presensiStatus.sudahMasuk && presensiStatus.sudahPulang ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-green-800">
            Presensi Hari Ini Sudah Lengkap!
          </p>
          <p className="text-xs text-green-600 mt-1">
            Anda sudah melakukan absen masuk dan pulang hari ini.
          </p>
          <button
            onClick={() => router.push("/dashboard/manajemen/data-presensi")}
            className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            Lihat Riwayat Presensi
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <SelfieCamera onCapture={handleCapture} />
          </div>

          {gpsValidationEnabled && latitude && longitude && (
            <div className="text-center text-sm text-gray-600">
              Lokasi: {latitude.toFixed(6)}, {longitude.toFixed(6)} <br />
              Jarak dari titik acuan:{" "}
              <span className="font-bold">{distance ? distance.toFixed(2) : 0} m</span>
            </div>
          )}

          {gpsValidationEnabled && distance !== null && distance > maxDistance && (
            <div className="text-center text-red-600 text-sm font-semibold">
              ❌ Anda berada terlalu jauh dari lokasi presensi (lebih dari {maxDistance} m)
            </div>
          )}

          {canSubmit && (
            <div className="flex items-center justify-center gap-4">
              {!presensiStatus.sudahMasuk && (
                <button
                  onClick={() => handleSubmit("masuk")}
                  disabled={loading || !user}
                  className={`px-4 py-2 rounded text-white flex items-center justify-center ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Memproses..." : "Absen Masuk"}
                </button>
              )}

              {!presensiStatus.sudahPulang && presensiStatus.sudahMasuk && (
                <button
                  onClick={() => handleSubmit("pulang")}
                  disabled={loading || !user}
                  className={`px-4 py-2 rounded text-white flex items-center justify-center ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loading ? "Memproses..." : "Absen Pulang"}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}