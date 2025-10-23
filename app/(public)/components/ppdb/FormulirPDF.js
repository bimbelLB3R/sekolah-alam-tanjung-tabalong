// components/pdf/FormulirPDF.jsx
import React from 'react'
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  Font 
} from '@react-pdf/renderer'

// Register fonts (optional - untuk font Indonesia yang lebih baik)
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf'
// })

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottom: '2 solid black',
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  logo2: {
    width: 100,
    height: 60,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  schoolName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  schoolNameSub: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  schoolAddress: {
    fontSize: 8,
    marginBottom: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  academicYear: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 15,
  },
  noPendaftaran: {
    position: 'absolute',
    right: 30,
    top: 150,
    border: '1 solid black',
    padding: 5,
    fontSize: 8,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    textDecoration: 'underline',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  numberCol: {
    width: 20,
    fontSize: 9,
  },
  labelCol: {
    width: 150,
    fontSize: 9,
  },
  separatorCol: {
    width: 10,
    fontSize: 9,
  },
  valueCol: {
    flex: 1,
    fontSize: 9,
    borderBottom: '0.5 dotted #666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  signatureBox: {
    width: '40%',
    textAlign: 'center',
  },
  signatureTitle: {
    fontSize: 9,
    marginBottom: 10,
  },
  signatureName: {
    fontSize: 9,
    paddingTop: 20,
  },
  date: {
    textAlign: 'right',
    fontSize: 9,
    marginTop: 5,
    marginBottom: 10,
  },
})

export default function FormulirPDF({ data }) {
  // Format tanggal
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            style={styles.logo2} 
            src="/yamasaka.jpg" // Ganti dengan path logo Anda
          />
          <View style={styles.headerText}>
            <Text style={styles.schoolName}>YAYASAN MUTIARA INSAN SARABAKAWA</Text>
            <Text style={styles.schoolNameSub}>
              SEKOLAH ALAM TANJUNG TABALONG (SEKOLAH DASAR)
            </Text>
            <Text style={styles.schoolAddress}>
              Jalan Tanjung Baru, Maburai Kecamatan Murung Pudak, Kabupaten Tabalong, Kalsel 71571
            </Text>
            <Text style={styles.schoolAddress}>
              EMAIL: sa.tanjungtabalong@gmail.com  Telp/WA: 0857 5211 2725
            </Text>
          </View>
          <Image 
            style={styles.logo} 
            src="/logo-sattnav.png" // Ganti dengan path logo Anda
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          FORMULIR PENERIMAAN PESERTA DIDIK BARU
        </Text>
        <Text style={styles.subtitle}>
          SEKOLAH ALAM TANJUNG TABALONG (SEKOLAH DASAR)
        </Text>
        <Text style={styles.academicYear}>
          TAHUN PELAJARAN 2026/2027
        </Text>

        {/* No Pendaftaran Box */}
        <View style={styles.noPendaftaran}>
          <Text>No.</Text>
          <Text>Pendaftaran</Text>
          <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
            {data.id || ''}
          </Text>
        </View>

        {/* A. KETERANGAN CALON PESERTA DIDIK */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A. KETERANGAN CALON PESERTA DIDIK</Text>
          
          <View style={styles.row}>
            <Text style={styles.numberCol}>1.</Text>
            <Text style={styles.labelCol}>Nama Lengkap</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.nama_lengkap || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>2.</Text>
            <Text style={styles.labelCol}>Nama Panggilan</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.nama_panggilan || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>3.</Text>
            <Text style={styles.labelCol}>Jenis Kelamin</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>
              {data.jenis_kelamin === 'L' ? 'Laki-laki' : data.jenis_kelamin === 'P' ? 'Perempuan' : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>4.</Text>
            <Text style={styles.labelCol}>Tempat, Tgl. Bln. Thn. Lahir</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>
              {data.tempat_lahir ? `${data.tempat_lahir}, ${formatDate(data.tgl_lahir)}` : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>5.</Text>
            <Text style={styles.labelCol}>Bangsa/Suku/ Kewarganegaraan</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>Indonesia</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>6.</Text>
            <Text style={styles.labelCol}>Agama</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.agama || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>7.</Text>
            <Text style={styles.labelCol}>Anak ke</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>
              {data.anak_ke ? `${data.anak_ke} dari ${data.jml_saudara + 1} orang` : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>8.</Text>
            <Text style={styles.labelCol}>Jumlah Saudara Kandung</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>
              {data.jml_saudara !== undefined ? `${data.jml_saudara} orang` : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>9.</Text>
            <Text style={styles.labelCol}>Alamat Lengkap</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.alamat || ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.numberCol}>10.</Text>
            <Text style={styles.labelCol}>Berkebutuhan Khusus</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.keb_khusus || ''} ({data.jenis_kebkus ||''})</Text>
          </View>
        </View>

        {/* B. DATA AYAH KANDUNG */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>B. DATA AYAH KANDUNG</Text>
          
          <View style={styles.row}>
            <Text style={styles.numberCol}>1.</Text>
            <Text style={styles.labelCol}>Nama ayah kandung</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.nama_ayah || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>2.</Text>
            <Text style={styles.labelCol}>Tempat, Tgl. Bln. Thn. Lahir</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>
              {data.tempat_lahir_ayah ? `${data.tempat_lahir_ayah}, ${formatDate(data.tgl_lahir_ayah)}` : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>3.</Text>
            <Text style={styles.labelCol}>Alamat Tempat Tinggal</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.alamat_ayah || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>4.</Text>
            <Text style={styles.labelCol}>Pekerjaan</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.pekerjaan_ayah || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>5.</Text>
            <Text style={styles.labelCol}>Penghasilan rata-rata perbulan</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.gaji_ayah || ''}</Text>
          </View>
        </View>

        {/* C. DATA IBU KANDUNG */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>C. DATA IBU KANDUNG</Text>
          
          <View style={styles.row}>
            <Text style={styles.numberCol}>1.</Text>
            <Text style={styles.labelCol}>Nama ibu Kandung</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.nama_ibu || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>2.</Text>
            <Text style={styles.labelCol}>Tempat, Tgl. Bln. Thn. Lahir</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>
              {data.tempat_lahir_ibu ? `${data.tempat_lahir_ibu}, ${formatDate(data.tgl_lahir_ibu)}` : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>3.</Text>
            <Text style={styles.labelCol}>Alamat Tempat Tinggal</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.alamat_ibu || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>4.</Text>
            <Text style={styles.labelCol}>Pekerjaan</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.pekerjaan_ibu || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>5.</Text>
            <Text style={styles.labelCol}>Penghasilan rata-rata perbulan</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.gaji_ibu || ''}</Text>
          </View>
        </View>

        {/* D. DATA WALI (Optional - jika ada) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>D. Data WALI</Text>
          <View style={styles.row}>
            <Text style={styles.numberCol}>1.</Text>
            <Text style={styles.labelCol}>Nama</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>-</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.numberCol}>2.</Text>
            <Text style={styles.labelCol}>Tempat, Tgl. Bln. Thn. Lahir</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>
              -
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>3.</Text>
            <Text style={styles.labelCol}>Alamat Tempat Tinggal</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>-</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>4.</Text>
            <Text style={styles.labelCol}>Pekerjaan</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>-</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>5.</Text>
            <Text style={styles.labelCol}>Penghasilan rata-rata perbulan</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>-</Text>
          </View>
          {/* Tambahkan field wali lainnya jika diperlukan */}
        </View>

        {/* E. KONTAK */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>E. KONTAK</Text>
          
          <View style={styles.row}>
            <Text style={styles.numberCol}>1.</Text>
            <Text style={styles.labelCol}>Nomor HP</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>
              Ayah: {data.no_hp_ayah || ''} {'  '}  Ibu: {data.no_hp_ibu || ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.numberCol}>2.</Text>
            <Text style={styles.labelCol}>Email</Text>
            <Text style={styles.separatorCol}>:</Text>
            <Text style={styles.valueCol}>{data.email || ''}</Text>
          </View>
        </View>

        {/* Date and Signature */}
        <Text style={styles.date}>
          ........................................, {today}
        </Text>

        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Diketahui oleh</Text>
            <Text style={styles.signatureTitle}>Panitia PPDB</Text>
            <Text style={styles.signatureName}>(.............................)</Text>
          </View>
          
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Diketahui oleh</Text>
            <Text style={styles.signatureTitle}>Orang Tua / Wali Murid</Text>
            <Text style={styles.signatureName}>(.............................)</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}