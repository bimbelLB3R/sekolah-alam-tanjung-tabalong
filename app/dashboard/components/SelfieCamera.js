"use client";
import { useRef, useState, useEffect } from "react";

export default function SelfieCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selfie, setSelfie] = useState(null);
  const [stream, setStream] = useState(null);

  // Mulai kamera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Tidak bisa mengakses kamera:", err);
    }
  };

  // Matikan kamera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // nyalakan kamera saat pertama kali load
  useEffect(() => {
    startCamera();

    // cleanup saat komponen unmount (misal pindah halaman)
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setSelfie(dataUrl);

    stopCamera(); // matikan kamera setelah ambil foto
  };

  const retakeSelfie = () => {
    setSelfie(null);
    startCamera(); // nyalakan lagi kamera untuk ambil ulang
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!selfie ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-xl w-64 h-64 object-cover border"
          />
          <button
            onClick={takeSelfie}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Ambil Selfie
          </button>
        </>
      ) : (
        <>
          <img
            src={selfie}
            alt="Selfie"
            className="w-64 h-64 rounded-xl object-cover border"
          />
          <button
            onClick={retakeSelfie}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Ulangi
          </button>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
