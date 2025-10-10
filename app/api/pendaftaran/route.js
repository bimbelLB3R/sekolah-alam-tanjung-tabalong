import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const query = `
      INSERT INTO biodata_siswa (
        jenis_pendaftaran, jenjang, nama_lengkap, nama_panggilan, nik, nomor_kk, 
        jenis_kelamin, tempat_lahir, tgl_lahir, keb_khusus,jenis_kebkus, sekolah_asal, agama, anak_ke, jml_saudara, alamat, kelas_ditujukan,
        nama_ayah, tempat_lahir_ayah, tgl_lahir_ayah, pendidikan_ayah, alamat_ayah, pekerjaan_ayah, gaji_ayah,
        nama_ibu, tempat_lahir_ibu, tgl_lahir_ibu, pendidikan_ibu, alamat_ibu, pekerjaan_ibu, gaji_ibu,
        no_hp_ayah, no_hp_ibu, email,buktiBayar,fotoAnak,fotoKia,kkPdf
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const values = [
      body.jenis_pendaftaran || "",
      body.jenjang || "",
      body.nama_lengkap || "",
      body.nama_panggilan || "",
      body.nik || "",
      body.nomor_kk || "",
      body.jenis_kelamin || "",
      body.tempat_lahir || "",
      body.tgl_lahir || null,
      body.keb_khusus || "",
      body.jenis_kebkus || "",
      body.sekolah_asal || "",
      body.agama || "",
      body.anak_ke ||  null,
      body.jml_saudara ?? null,
      body.alamat || "",
      body.kelas_ditujukan || "",
      body.nama_ayah || "",
      body.tempat_lahir_ayah || "",
      body.tgl_lahir_ayah || null,
      body.pendidikan_ayah || "",
      body.alamat_ayah || "",
      body.pekerjaan_ayah || "",
      body.gaji_ayah || "",
      body.nama_ibu || "",
      body.tempat_lahir_ibu || "",
      body.tgl_lahir_ibu || null,
      body.pendidikan_ibu || "",
      body.alamat_ibu || "",
      body.pekerjaan_ibu || "",
      body.gaji_ibu || "",
      body.no_hp_ayah || "",
      body.no_hp_ibu || "",
      body.email || "",
      body.buktiBayar || "",
      body.fotoAnak || "",
      body.fotoKia || "",
      body.kkPdf || "",
    ];

    const [result] = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: "Data berhasil disimpan",
      insertedId: result.insertId,
    });
  } catch (error) {
    console.error("Error simpan data:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
