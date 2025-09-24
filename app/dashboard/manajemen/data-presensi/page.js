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
      const res = await fetch("/api/presensi/data-presensi");
      const data = await res.json();
      setPresensi(data);
    }
    fetchPresensi();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Presensi</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Selfie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presensi.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.tanggal}</TableCell>
                <TableCell>{row.nama}</TableCell>
                <TableCell>{row.jam}</TableCell>
                <TableCell>{row.jenis}</TableCell>
                <TableCell>
                  <img
                    src={row.photo_url}
                    alt="Selfie"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
