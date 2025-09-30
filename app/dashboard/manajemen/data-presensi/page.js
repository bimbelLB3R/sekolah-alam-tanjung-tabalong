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

export default function DataPresensi() {
  const [presensi, setPresensi] = useState([]);

  useEffect(() => {
    async function fetchPresensi() {
      const res = await fetch("/api/presensi/data-presensi"); // jangan /data-presensi karena route.js kamu di /api/presensi
      const data = await res.json();

      // 🔹 Grouping by tanggal + nama
      const grouped = {};
      data.forEach((row) => {
        const key = `${row.tanggal}-${row.nama}`;
        if (!grouped[key]) {
          grouped[key] = {
            id: row.id,
            tanggal: row.tanggal,
            nama: row.nama,
            jamMasuk: row.jenis === "masuk" ? row.jam : null,
            fotoMasuk: row.jenis === "masuk" ? row.photo_url : null,
            jamPulang: row.jenis === "pulang" ? row.jam : null,
            fotoPulang: row.jenis === "pulang" ? row.photo_url : null,
          };
        } else {
          // update jika ada data baru
          if (row.jenis === "masuk") {
            grouped[key].jamMasuk = row.jam;
            grouped[key].fotoMasuk = row.photo_url;
          }
          if (row.jenis === "pulang") {
            grouped[key].jamPulang = row.jam;
            grouped[key].fotoPulang = row.photo_url;
          }
        }
      });

      setPresensi(Object.values(grouped));
    }
    fetchPresensi();
  }, []);

  return (
    <Card className="overflow-x-auto">
      <CardHeader>
        <CardTitle>Data Presensi</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="min-w-[700px] text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jam Masuk</TableHead>
              <TableHead>Foto Masuk</TableHead>
              <TableHead>Jam Pulang</TableHead>
              <TableHead>Foto Pulang</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presensi.map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{row.tanggal}</TableCell>
                <TableCell>{row.nama}</TableCell>
                <TableCell>{row.jamMasuk || "-"}</TableCell>
                <TableCell>
                  {row.fotoMasuk ? (
                    <img
                      src={row.fotoMasuk}
                      alt="Masuk"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{row.jamPulang || "-"}</TableCell>
                <TableCell>
                  {row.fotoPulang ? (
                    <img
                      src={row.fotoPulang}
                      alt="Pulang"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
