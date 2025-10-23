// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const query = `
//       INSERT INTO biodata_siswa (
//         jenis_pendaftaran, jenjang, nama_lengkap, nama_panggilan, nik, nomor_kk, 
//         jenis_kelamin, tempat_lahir, tgl_lahir, keb_khusus,jenis_kebkus, sekolah_asal, agama, anak_ke, jml_saudara, alamat, kelas_ditujukan,
//         nama_ayah, tempat_lahir_ayah, tgl_lahir_ayah, pendidikan_ayah, alamat_ayah, pekerjaan_ayah, gaji_ayah,
//         nama_ibu, tempat_lahir_ibu, tgl_lahir_ibu, pendidikan_ibu, alamat_ibu, pekerjaan_ibu, gaji_ibu,
//         no_hp_ayah, no_hp_ibu, email,buktiBayar,fotoAnak,fotoKia,kkPdf
//       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
//     `;

//     const values = [
//       body.jenis_pendaftaran || "",
//       body.jenjang || "",
//       body.nama_lengkap || "",
//       body.nama_panggilan || "",
//       body.nik || "",
//       body.nomor_kk || "",
//       body.jenis_kelamin || "",
//       body.tempat_lahir || "",
//       body.tgl_lahir || null,
//       body.keb_khusus || "",
//       body.jenis_kebkus || "",
//       body.sekolah_asal || "",
//       body.agama || "",
//       body.anak_ke ||  null,
//       body.jml_saudara ?? null,
//       body.alamat || "",
//       body.kelas_ditujukan || "",
//       body.nama_ayah || "",
//       body.tempat_lahir_ayah || "",
//       body.tgl_lahir_ayah || null,
//       body.pendidikan_ayah || "",
//       body.alamat_ayah || "",
//       body.pekerjaan_ayah || "",
//       body.gaji_ayah || "",
//       body.nama_ibu || "",
//       body.tempat_lahir_ibu || "",
//       body.tgl_lahir_ibu || null,
//       body.pendidikan_ibu || "",
//       body.alamat_ibu || "",
//       body.pekerjaan_ibu || "",
//       body.gaji_ibu || "",
//       body.no_hp_ayah || "",
//       body.no_hp_ibu || "",
//       body.email || "",
//       body.buktiBayar || "",
//       body.fotoAnak || "",
//       body.fotoKia || "",
//       body.kkPdf || "",
//     ];

//     const [result] = await pool.query(query, values);

//     return NextResponse.json({
//       success: true,
//       message: "Data berhasil disimpan",
//       insertedId: result.insertId,
//     });
//   } catch (error) {
//     console.error("Error simpan data:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }


// app/api/pendaftaran/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const id = uuidv4();

export async function POST(req) {
  try {
    const body = await req.json();

    // Validasi field yang NOT NULL
    const requiredFields = {
      jenis_pendaftaran: "Jenis pendaftaran",
      jenjang: "Jenjang",
      nama_lengkap: "Nama lengkap",
      nama_panggilan: "Nama panggilan",
      nik: "NIK",
      nomor_kk: "Nomor KK",
      jenis_kelamin: "Jenis kelamin",
      tempat_lahir: "Tempat lahir",
      tgl_lahir: "Tanggal lahir",
      keb_khusus: "Kebutuhan khusus",
      sekolah_asal: "Sekolah asal",
      agama: "Agama",
      anak_ke: "Anak ke",
      jml_saudara: "Jumlah saudara",
      alamat: "Alamat",
      nama_ayah: "Nama ayah",
      tempat_lahir_ayah: "Tempat lahir ayah",
      tgl_lahir_ayah: "Tanggal lahir ayah",
      pendidikan_ayah: "Pendidikan ayah",
      alamat_ayah: "Alamat ayah",
      pekerjaan_ayah: "Pekerjaan ayah",
      gaji_ayah: "Gaji ayah",
      nama_ibu: "Nama ibu",
      tempat_lahir_ibu: "Tempat lahir ibu",
      tgl_lahir_ibu: "Tanggal lahir ibu",
      pendidikan_ibu: "Pendidikan ibu",
      alamat_ibu: "Alamat ibu",
      pekerjaan_ibu: "Pekerjaan ibu",
      gaji_ibu: "Gaji ibu",
      no_hp_ayah: "No HP ayah",
      no_hp_ibu: "No HP ibu",
      email: "Email",
    };

    const numericAllowedZero = ["anak_ke", "jml_saudara"]; // field angka yang boleh bernilai 0
const missingFields = [];

for (const [field, label] of Object.entries(requiredFields)) {
  const val = body[field];

  if (numericAllowedZero.includes(field)) {
    // 0 dianggap valid, tapi undefined/null/empty string tetap salah
    if (val === undefined || val === null || val === "") {
      missingFields.push(label);
    }
  } else {
    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      missingFields.push(label);
    }
  }
}


    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Field wajib diisi: ${missingFields.join(", ")}`,
      }, { status: 400 });
    }

    // Validasi NIK & KK harus 16 digit
    if (body.nik.length !== 16) {
      return NextResponse.json({
        success: false,
        message: "NIK harus 16 digit"
      }, { status: 400 });
    }

    if (body.nomor_kk.length !== 16) {
      return NextResponse.json({
        success: false,
        message: "Nomor KK harus 16 digit"
      }, { status: 400 });
    }

    // Validasi enum jenis_kelamin
    if (!['L', 'P'].includes(body.jenis_kelamin)) {
      return NextResponse.json({
        success: false,
        message: "Jenis kelamin harus L atau P"
      }, { status: 400 });
    }

    // Validasi enum keb_khusus
    if (!['Ya', 'Tidak'].includes(body.keb_khusus)) {
      return NextResponse.json({
        success: false,
        message: "Kebutuhan khusus harus Ya atau Tidak"
      }, { status: 400 });
    }

    const query = `
      INSERT INTO biodata_siswa (id,
        jenis_pendaftaran, jenjang, nama_lengkap, nama_panggilan, nik, nomor_kk, 
        jenis_kelamin, tempat_lahir, tgl_lahir, keb_khusus, jenis_kebkus, sekolah_asal, 
        agama, anak_ke, jml_saudara, alamat, kelas_ditujukan,
        nama_ayah, tempat_lahir_ayah, tgl_lahir_ayah, pendidikan_ayah, alamat_ayah, 
        pekerjaan_ayah, gaji_ayah,
        nama_ibu, tempat_lahir_ibu, tgl_lahir_ibu, pendidikan_ibu, alamat_ibu, 
        pekerjaan_ibu, gaji_ibu,
        no_hp_ayah, no_hp_ibu, email,
        status_upload
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const values = [
      id,
      body.jenis_pendaftaran,
      body.jenjang,
      body.nama_lengkap,
      body.nama_panggilan,
      body.nik,
      body.nomor_kk,
      body.jenis_kelamin,
      body.tempat_lahir,
      body.tgl_lahir,
      body.keb_khusus,
      body.jenis_kebkus || null, // Optional
      body.sekolah_asal,
      body.agama,
      parseInt(body.anak_ke),
      body.jml_saudara,
      body.alamat,
      body.kelas_ditujukan || null, // Optional
      body.nama_ayah,
      body.tempat_lahir_ayah,
      body.tgl_lahir_ayah,
      body.pendidikan_ayah,
      body.alamat_ayah,
      body.pekerjaan_ayah,
      body.gaji_ayah,
      body.nama_ibu,
      body.tempat_lahir_ibu,
      body.tgl_lahir_ibu,
      body.pendidikan_ibu,
      body.alamat_ibu,
      body.pekerjaan_ibu,
      body.gaji_ibu,
      body.no_hp_ayah,
      body.no_hp_ibu,
      body.email,
      "pending_upload"
    ];

    const [result] = await pool.query(query, values);
     console.log("Insert result:", result); // 🟢 Tambahan penting
     console.log("Generated UUID:", id);
    return NextResponse.json({
      success: true,
      message: "Data berhasil disimpan",
      id,
      
    }, { status: 201 });


  } catch (error) {
    console.error("Error simpan data:", error);
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ 
        success: false, 
        message: "Data sudah terdaftar (NIK atau Email duplikat)"
      }, { status: 409 });
    }

    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}