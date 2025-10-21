// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   Font,
// } from "@react-pdf/renderer";

// // Register font (opsional, untuk font Indonesia yang lebih baik)
// // Font.register({
// //   family: 'Roboto',
// //   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf'
// // });

// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 10,
//     fontFamily: "Helvetica",
//     backgroundColor: "#ffffff",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     borderBottomWidth: 2,
//     borderBottomColor: "#000000",
//     paddingBottom: 15,
//     marginBottom: 20,
//   },
//   logoLeft: {
//     width: 60,
//     height: 60,
//     objectFit: "contain",
//   },
//   logoRight: {
//     width: 50,
//     height: 50,
//     objectFit: "contain",
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textTransform: "uppercase",
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 9,
//     color: "#666666",
//   },
//   card: {
//     border: "1pt solid #e5e7eb",
//     borderRadius: 4,
//     padding: 12,
//     marginBottom: 12,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },
//   cardTitle: {
//     fontSize: 11,
//     fontWeight: "bold",
//     marginLeft: 5,
//   },
//   infoGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   infoItem: {
//     width: "50%",
//     marginBottom: 6,
//     fontSize: 9,
//   },
//   infoLabel: {
//     fontWeight: "bold",
//   },
//   twoColumns: {
//     flexDirection: "row",
//     gap: 15,
//     marginTop: 5,
//   },
//   column: {
//     flex: 1,
//   },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 5,
//     fontSize: 9,
//   },
//   separator: {
//     borderTopWidth: 1,
//     borderTopColor: "#e5e7eb",
//     marginVertical: 8,
//   },
//   boldRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     fontWeight: "bold",
//     fontSize: 10,
//   },
//   takeHomeCard: {
//     border: "1pt solid #e5e7eb",
//     borderRadius: 4,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 5,
//     backgroundColor: "#f9fafb",
//   },
//   takeHomeLabel: {
//     fontSize: 12,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   takeHomeAmount: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#16a34a",
//   },
//   dateText: {
//     textAlign: "right",
//     fontSize: 9,
//     marginTop: 10,
//   },
//   signatureSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 40,
//   },
//   signatureBox: {
//     alignItems: "center",
//     width: "40%",
//   },
//   signatureLabel: {
//     fontSize: 9,
//     marginBottom: 40,
//   },
//   signatureName: {
//     fontSize: 9,
//     fontWeight: "bold",
//     borderBottomWidth: 1,
//     borderBottomColor: "#000000",
//     paddingBottom: 2,
//     paddingHorizontal: 20,
//   },
// });

// const SlipGajiPDF = ({ data, tanggalCetak }) => {
//   const totalGaji =
//     Number(data.gaji_pokok) +
//     Number(data.tunjangan_bpjs) +
//     Number(data.tunjangan_jabatan) +
//     Number(data.tunjangan_makan) +
//     Number(data.tunjangan_kehadiran) +
//     Number(data.tunjangan_sembako) +
//     Number(data.tunjangan_kepala_keluarga);

//   const totalPotongan = Number(data.potongan_makan);
//   const takeHomePay = totalGaji - totalPotongan;

//   const formatRupiah = (amount) => {
//     return `Rp ${Number(amount).toLocaleString("id-ID")}`;
//   };

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Image
//             style={styles.logoLeft}
//             src="/yamasaka.jpg"
//           />
//           <View style={styles.headerCenter}>
//             <Text style={styles.title}>Slip Gaji Karyawan</Text>
//             <Text style={styles.subtitle}>
//               Periode: {new Date(data.effective_date).toLocaleDateString("id-ID")}
//             </Text>
//           </View>
//           <Image
//             style={styles.logoRight}
//             src="/logo-sattnav.png"
//           />
//         </View>

//         {/* Informasi Karyawan */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardTitle}>Informasi Karyawan</Text>
//           </View>
//           <View style={styles.infoGrid}>
//             <Text style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Nama: </Text>
//               {data.name}
//             </Text>
//             <Text style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Departemen: </Text>
//               {data.departemen}
//             </Text>
//             <Text style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Jabatan: </Text>
//               {data.jabatan}
//             </Text>
//             <Text style={styles.infoItem}>
//               <Text style={styles.infoLabel}>Tanggal Efektif: </Text>
//               {new Date(data.effective_date).toLocaleDateString("id-ID")}
//             </Text>
//           </View>
//         </View>

//         {/* Rincian Gaji dan Potongan */}
//         <View style={styles.twoColumns}>
//           {/* Gaji */}
//           <View style={[styles.column, styles.card]}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>Rincian Gaji</Text>
//             </View>
//             <View>
//               <View style={styles.detailRow}>
//                 <Text>Gaji Pokok</Text>
//                 <Text>{formatRupiah(data.gaji_pokok)}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text>Tunjangan BPJS</Text>
//                 <Text>{formatRupiah(data.tunjangan_bpjs)}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text>Tunjangan Jabatan</Text>
//                 <Text>{formatRupiah(data.tunjangan_jabatan)}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text>Tunjangan Makan</Text>
//                 <Text>{formatRupiah(data.tunjangan_makan)}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text>Tunjangan Kehadiran</Text>
//                 <Text>{formatRupiah(data.tunjangan_kehadiran)}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text>Tunjangan Sembako</Text>
//                 <Text>{formatRupiah(data.tunjangan_sembako)}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text>Tunjangan Kepala Keluarga</Text>
//                 <Text>{formatRupiah(data.tunjangan_kepala_keluarga)}</Text>
//               </View>
//               <View style={styles.separator} />
//               <View style={styles.boldRow}>
//                 <Text>Total Gaji</Text>
//                 <Text>{formatRupiah(totalGaji)}</Text>
//               </View>
//             </View>
//           </View>

//           {/* Potongan */}
//           <View style={[styles.column, styles.card]}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>Potongan</Text>
//             </View>
//             <View>
//               <View style={styles.detailRow}>
//                 <Text>Potongan Makan Siang</Text>
//                 <Text>{formatRupiah(data.potongan_makan)}</Text>
//               </View>
//               <View style={styles.separator} />
//               <View style={styles.boldRow}>
//                 <Text>Total Potongan</Text>
//                 <Text>{formatRupiah(totalPotongan)}</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Take Home Pay */}
//         <View style={styles.takeHomeCard}>
//           <Text style={styles.takeHomeLabel}>Take Home Pay</Text>
//           <Text style={styles.takeHomeAmount}>{formatRupiah(takeHomePay)}</Text>
//         </View>

//         {/* Tanggal Cetak */}
//         <Text style={styles.dateText}>Tabalong, {tanggalCetak}</Text>

//         {/* Tanda Tangan */}
//         <View style={styles.signatureSection}>
//           <View style={styles.signatureBox}>
//             <Text style={styles.signatureLabel}>Bendahara</Text>
//             <Text style={styles.signatureName}>________________</Text>
//           </View>
//           <View style={styles.signatureBox}>
//             <Text style={styles.signatureLabel}>Karyawan</Text>
//             <Text style={styles.signatureName}>{data.name}</Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default SlipGajiPDF;

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 15,
    marginBottom: 20,
  },
  logoLeft: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  logoRight: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
  },
  card: {
    border: "1pt solid #e5e7eb",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 5,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    marginBottom: 6,
    fontSize: 9,
  },
  infoItemFull: {
    width: "100%",
    marginBottom: 6,
    fontSize: 9,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  twoColumns: {
    flexDirection: "row",
    gap: 15,
    marginTop: 5,
  },
  column: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    fontSize: 9,
  },
  detailRowHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    fontSize: 9,
    backgroundColor: "#f0fdf4",
    padding: 6,
    borderRadius: 3,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginVertical: 8,
  },
  boldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: 10,
  },
  takeHomeCard: {
    border: "1pt solid #e5e7eb",
    borderRadius: 4,
    padding: 15,
    alignItems: "center",
    marginTop: 5,
    backgroundColor: "#f9fafb",
  },
  takeHomeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  takeHomeAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
  },
  dateText: {
    textAlign: "right",
    fontSize: 9,
    marginTop: 10,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBox: {
    alignItems: "center",
    width: "40%",
  },
  signatureLabel: {
    fontSize: 9,
    marginBottom: 40,
  },
  signatureName: {
    fontSize: 9,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
    paddingHorizontal: 20,
  },
  subText: {
    fontSize: 7,
    color: "#16a34a",
    marginTop: 2,
  },
});

const SlipGajiPDF = ({ data, tanggalCetak, presensiSummary }) => {
  // Hitung tunjangan kehadiran berdasarkan jumlah tepat waktu
  const tunjanganKehadiranBase = Number(data.tunjangan_kehadiran);
  const tepatWaktu = presensiSummary?.tepatWaktu || 0;
  const tunjanganKehadiranTotal = tunjanganKehadiranBase * tepatWaktu;

  const totalGaji =
    Number(data.gaji_pokok) +
    Number(data.tunjangan_bpjs) +
    Number(data.tunjangan_jabatan) +
    Number(data.tunjangan_makan) +
    tunjanganKehadiranTotal + // Gunakan yang sudah dikalikan
    Number(data.tunjangan_sembako) +
    Number(data.tunjangan_kepala_keluarga);

  const totalPotongan = Number(data.potongan_makan);
  const takeHomePay = totalGaji - totalPotongan;

  const formatRupiah = (amount) => {
    return `Rp ${Number(amount).toLocaleString("id-ID")}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            style={styles.logoLeft}
            src="/yamasaka.jpg"
          />
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Slip Gaji Karyawan</Text>
            <Text style={styles.subtitle}>
              Periode: {new Date().toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <Image
            style={styles.logoRight}
            src="/logo-sattnav.png"
          />
        </View>

        {/* Informasi Karyawan */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informasi Karyawan</Text>
          </View>
          <View style={styles.infoGrid}>
            <Text style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nama: </Text>
              {data.name}
            </Text>
            <Text style={styles.infoItem}>
              <Text style={styles.infoLabel}>Departemen: </Text>
              {data.departemen}
            </Text>
            <Text style={styles.infoItem}>
              <Text style={styles.infoLabel}>Jabatan: </Text>
              {data.jabatan}
            </Text>
            <Text style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tanggal Efektif: </Text>
              {new Date(data.effective_date).toLocaleDateString("id-ID")}
            </Text>
          </View>
        </View>

        {/* Data Kehadiran Bulan Ini */}
        {presensiSummary && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Data Kehadiran Bulan Ini</Text>
            </View>
            <View style={styles.infoGrid}>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Hadir Tepat Waktu: </Text>
                {presensiSummary.tepatWaktu} hari
              </Text>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Hadir Terlambat: </Text>
                {presensiSummary.terlambat} hari
              </Text>
              <Text style={styles.infoItem}>
                <Text style={styles.infoLabel}>Total Kehadiran: </Text>
                {presensiSummary.totalHadir} hari
              </Text>
            </View>
          </View>
        )}

        {/* Rincian Gaji dan Potongan */}
        <View style={styles.twoColumns}>
          {/* Gaji */}
          <View style={[styles.column, styles.card]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Rincian Gaji</Text>
            </View>
            <View>
              <View style={styles.detailRow}>
                <Text>Gaji Pokok</Text>
                <Text>{formatRupiah(data.gaji_pokok)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan BPJS</Text>
                <Text>{formatRupiah(data.tunjangan_bpjs)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Jabatan</Text>
                <Text>{formatRupiah(data.tunjangan_jabatan)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Makan</Text>
                <Text>{formatRupiah(data.tunjangan_makan)}</Text>
              </View>
              <View style={styles.detailRowHighlight}>
                <View>
                  <Text>Tunjangan Kehadiran</Text>
                  <Text style={styles.subText}>
                    {formatRupiah(tunjanganKehadiranBase)} × {tepatWaktu} hari
                  </Text>
                </View>
                <Text style={{ fontWeight: "bold" }}>
                  {formatRupiah(tunjanganKehadiranTotal)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Sembako</Text>
                <Text>{formatRupiah(data.tunjangan_sembako)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Kepala Keluarga</Text>
                <Text>{formatRupiah(data.tunjangan_kepala_keluarga)}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.boldRow}>
                <Text>Total Gaji</Text>
                <Text>{formatRupiah(totalGaji)}</Text>
              </View>
            </View>
          </View>

          {/* Potongan */}
          <View style={[styles.column, styles.card]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Potongan</Text>
            </View>
            <View>
              <View style={styles.detailRow}>
                <Text>Potongan Makan</Text>
                <Text>{formatRupiah(data.potongan_makan)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Potongan Ijin Pribadi</Text>
                <Text>{formatRupiah(data.potongan_makan)}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.boldRow}>
                <Text>Total Potongan</Text>
                <Text>{formatRupiah(totalPotongan)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Take Home Pay */}
        <View style={styles.takeHomeCard}>
          <Text style={styles.takeHomeLabel}>Take Home Pay</Text>
          <Text style={styles.takeHomeAmount}>{formatRupiah(takeHomePay)}</Text>
        </View>

        {/* Tanggal Cetak */}
        <Text style={styles.dateText}>Tabalong, {tanggalCetak}</Text>

        {/* Tanda Tangan */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Bendahara</Text>
            <Text style={styles.signatureName}>________________</Text>
          </View>
          {/* <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Karyawan</Text>
            <Text style={styles.signatureName}>{data.name}</Text>
          </View> */}
        </View>
      </Page>
    </Document>
  );
};

export default SlipGajiPDF;