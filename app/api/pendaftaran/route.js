import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(req) {
  const data = await req.json()

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })

  try {
    await connection.execute(
      `INSERT INTO pendaftaran 
      (jenjang, namaLengkap, namaPanggilan, nik, kk, jenisKelamin, tempatLahir, tglLahir, kebKhusus, sekolahAsal, agama, anakKe, jmlSaudara, alamatSiswa,
       namaAyah, tempatLahirAyah, tglLahirAyah, pendidikanAyah, alamatAyah, pekerjaanAyah, gajiAyah,
       namaIbu, tempatLahirIbu, tglLahirIbu, pendidikanIbu, alamatIbu, pekerjaanIbu, gajiIbu,
       noHpAyah, noHpIbu, email)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.jenjang, data.namaLengkap, data.namaPanggilan, data.nik, data.kk, data.jenisKelamin, data.tempatLahir, data.tglLahir, data.kebKhusus, data.sekolahAsal, data.agama, data.anakKe, data.jmlSaudara, data.alamatSiswa,
        data.namaAyah, data.tempatLahirAyah, data.tglLahirAyah, data.pendidikanAyah, data.alamatAyah, data.pekerjaanAyah, data.gajiAyah,
        data.namaIbu, data.tempatLahirIbu, data.tglLahirIbu, data.pendidikanIbu, data.alamatIbu, data.pekerjaanIbu, data.gajiIbu,
        data.noHpAyah, data.noHpIbu, data.email
      ]
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  } finally {
    await connection.end()
  }
}
