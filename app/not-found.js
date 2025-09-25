"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Cherry } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Cherry className="w-16 h-16 text-red-500 animate-bounce" />
          </div>
          <CardTitle className="text-2xl font-bold">Oops! Halaman tidak ditemukan</CardTitle>
          <p className="text-gray-600">
            Halaman yang kamu cari mungkin sudah dipindahkan atau tidak ada.
          </p>
          <Button
            variant="default"
            onClick={() => router.push("/")}
            className="mt-4"
          >
            Kembali ke Beranda
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
