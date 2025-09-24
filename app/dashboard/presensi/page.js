"use client";

import { useState,useEffect } from "react";
import SelfieCamera from "../components/SelfieCamera";
// import { useUser } from "@/app/context/UserContext";

export default function PresensiPage() {
    // const user = useUser();
    const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
    // console.log (user);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const now = new Date();
const tanggal = now.toISOString().split("T")[0]; // YYYY-MM-DD
const jam = now.toTimeString().split(" ")[0];    // HH:MM:SS

 useEffect(() => {
      setMounted(true);
  
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/me", {
            credentials: "include",
            cache: "no-store",
          });
  
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            const err = await res.json();
            console.error("API error:", err);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        }
      };
  
      fetchUser();
    }, []);

  const handleCapture = (file) => {
    setPhotoFile(file);
  };

  const handleSubmit = async (type) => {
   
    if (!photoFile) {
      alert("Harap ambil foto dulu!");
      return;
    }

    setLoading(true);

    try {
      // ambil lokasi GPS
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

    // ambil info device
        let deviceInfo = {
        userAgent: navigator.userAgent,
        memory: navigator.deviceMemory || "unknown",
        };

        // jika browser support userAgentData (Chromium-based)
        if (navigator.userAgentData) {
        deviceInfo.brands = navigator.userAgentData.brands;
        deviceInfo.mobile = navigator.userAgentData.mobile;
        deviceInfo.platform = navigator.userAgentData.platform;
        }

      const formData = new FormData();
      formData.append("photo", photoFile);
      formData.append("user_id", user?.id); // ⬅️ user dari context
      formData.append("type", type); // MASUK atau KELUAR
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("device", JSON.stringify(deviceInfo)); // ⬅️ device info masuk sini
      formData.append("tanggal", tanggal);
      formData.append("jam", jam);

      const res = await fetch("/api/presensi", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Presensi berhasil!");
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
      <div className="flex items-center justify-center"><SelfieCamera onCapture={handleCapture} /></div>  
      

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleSubmit("MASUK")}
          disabled={loading || !user}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Absen Masuk
        </button>
        <button
          onClick={() => handleSubmit("KELUAR")}
          disabled={loading || !user}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Absen Keluar
        </button>
      </div>
    </div>
  );
}
