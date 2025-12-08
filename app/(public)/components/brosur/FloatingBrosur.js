"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingBrosur() {
  const [visible, setVisible] = useState(false);

  const STORAGE_KEY = "brosurClosedAt";
  const ONE_DAY = 24 * 60 * 60 * 1000; // ✅ 1 hari

  useEffect(() => {
    const closedAt = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!closedAt || now - Number(closedAt) > ONE_DAY) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 5000); // ✅ Muncul setelah 5 detik

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setVisible(false);
  };

  // ✅ DOWNLOAD PAKSA (LANGSUNG UNDUH)
  const handleDownload = async () => {
    const fileUrl = "https://foto-presensigurusatt.s3.ap-southeast-1.amazonaws.com/brosur/SPMB_20251208_111352_0000.pdf";

    const res = await fetch(fileUrl);
    const blob = await res.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Brosur-SPMB-2025-2026.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="relative flex items-center gap-3 bg-background shadow-xl rounded-2xl px-3 py-2 border w-[340px]">

            {/* ✅ Tombol Close */}
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80"
            >
              <X size={14} />
            </button>

            {/* ✅ Thumbnail */}
            <div className="w-[50px] h-[50px] rounded-lg overflow-hidden border shrink-0">
              <Image
                src="https://foto-presensigurusatt.s3.ap-southeast-1.amazonaws.com/brosur/brosur-tumb.jpg"
                alt="Brosur SPMB"
                width={50}
                height={50}
                className="object-cover w-full h-full"
              />
            </div>

            {/* ✅ Text + Button */}
            <div className="flex-1 leading-tight">
              <p className="text-xs font-semibold">Brosur SPMB 2025/2026</p>

              <Button
                size="sm"
                className="mt-1 h-7 text-xs rounded-full"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
