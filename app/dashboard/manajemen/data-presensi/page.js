


"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function DataPresensi() {
  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const today=new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    async function fetchPresensi() {
      try {
        const res = await fetch("/api/presensi/data-presensi");
        const data = await res.json();
        // console.log(data)
        // 🔹 Grouping by tanggal + nama (FIXED: preserve keterangan)
        const grouped = {};
        data.forEach((row) => {
          const key = `${row.tanggal}-${row.nama}`;
          
          if (!grouped[key]) {
            grouped[key] = {
              id: row.id,
              tanggal: row.tanggal,
              nama: row.nama,
              keterangan: null, // akan diisi dari data masuk
              jamMasuk: null,
              fotoMasuk: null,
              jamPulang: null,
              fotoPulang: null,
            };
          }

          // Update data berdasarkan jenis
          if (row.jenis === "masuk") {
            grouped[key].jamMasuk = row.jam;
            grouped[key].fotoMasuk = row.photo_url;
            // ⚠️ PENTING: Simpan keterangan dari data masuk
            grouped[key].keterangan = row.keterangan;
          }
          
          if (row.jenis === "pulang") {
            grouped[key].jamPulang = row.jam;
            grouped[key].fotoPulang = row.photo_url;
            // JANGAN overwrite keterangan saat pulang
            // keterangan tetap dari data masuk
          }
        });

        setPresensi(Object.values(grouped));
      } catch (error) {
        console.error("Error fetching presensi:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPresensi();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-sm text-gray-600">Memuat data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto">
      <CardHeader>
        <CardTitle>Data Presensi {today}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="min-w-[700px] text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Jam Masuk</TableHead>
              <TableHead>Foto Masuk</TableHead>
              <TableHead>Jam Pulang</TableHead>
              <TableHead>Foto Pulang</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presensi.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  Belum ada data presensi
                </TableCell>
              </TableRow>
            ) : (
              presensi.map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {row.tanggal}
                  </TableCell>
                  <TableCell className="font-medium">{row.nama}</TableCell>
                  <TableCell>
                    {row.keterangan === "tepat waktu" && (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Tepat Waktu
                      </Badge>
                    )}
                    {row.keterangan === "terlambat" && (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Terlambat
                      </Badge>
                    )}
                    {!row.keterangan && (
                      <Badge variant="outline" className="text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        -
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {row.jamMasuk || "-"}
                  </TableCell>
                  <TableCell>
                    {row.fotoMasuk ? (
                      <img
                        src={row.fotoMasuk}
                        alt="Masuk"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => window.open(row.fotoMasuk, "_blank")}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {row.jamPulang || "-"}
                  </TableCell>
                  <TableCell>
                    {row.fotoPulang ? (
                      <img
                        src={row.fotoPulang}
                        alt="Pulang"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => window.open(row.fotoPulang, "_blank")}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}