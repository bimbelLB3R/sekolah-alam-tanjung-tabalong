"use client";

import { useRef, useState, useEffect } from "react";

export default function SelfieCamera({ onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // kamera depan
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Kamera error:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const size = 256; // ukuran square final
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // hitung crop supaya tetap square
    const videoAspect = video.videoWidth / video.videoHeight;
    let sx, sy, sw, sh;

    if (videoAspect > 1) {
      // video lebih lebar dari tinggi (16:9)
      sh = video.videoHeight;
      sw = sh;
      sx = (video.videoWidth - sw) / 2;
      sy = 0;
    } else {
      // video lebih tinggi dari lebar
      sw = video.videoWidth;
      sh = sw;
      sx = 0;
      sy = (video.videoHeight - sh) / 2;
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, size, size);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `selfie-${Date.now()}.png`, {
        type: "image/png",
      });
      setPhoto(URL.createObjectURL(file));
      onCapture(file);
      stopCamera();
    }, "image/png");
  };

  const handleRetake = () => {
    setPhoto(null);
    startCamera();
  };

  return (
    <div className="space-y-2">
      <h1 className="font-bold text-center">PRESENSI SATT</h1>
      {!photo ? (
        <div className="w-64 h-64 rounded overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <img src={photo} alt="Selfie" className="w-64 h-64 rounded" />
      )}

      <div className="flex items-center justify-center gap-2">
        {!photo ? (
          <button
            onClick={handleCapture}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Ambil Foto
          </button>
        ) : (
          <button
            onClick={handleRetake}
            className="px-4 py-2 bg-yellow-600 text-white rounded"
          >
            Ulangi
          </button>
        )}
      </div>
    </div>
  );
}
