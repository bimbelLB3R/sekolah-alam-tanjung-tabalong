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
  cardBlue: {
    border: "1pt solid #bfdbfe",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#eff6ff",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  cardHeaderBlue: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#bfdbfe",
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 5,
  },
  cardTitleBlue: {
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#1e3a8a",
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
  infoLabel: {
    fontWeight: "bold",
  },
  // Grid untuk data kehadiran (4 kolom)
  kehadiranGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  kehadiranBox: {
    width: "22%",
    backgroundColor: "#ffffff",
    border: "1pt solid #bfdbfe",
    borderRadius: 3,
    padding: 8,
  },
  kehadiranLabel: {
    fontSize: 7,
    color: "#6b7280",
    marginBottom: 4,
  },
  kehadiranValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  kehadiranUnit: {
    fontSize: 7,
    color: "#6b7280",
  },
  // Warna untuk masing-masing box
  valueGreen: {
    color: "#16a34a",
  },
  valueRed: {
    color: "#dc2626",
  },
  valueBlue: {
    color: "#2563eb",
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
    backgroundColor: "#f0fdf4",
  },
  takeHomeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#374151",
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

const SlipGajiPDF = ({ data, tanggalCetak, presensiSummary, dataIjin,jabatan }) => {
  // Hitung tunjangan kehadiran berdasarkan jumlah tepat waktu
  const tunjanganKehadiranBase = Number(data.tunjangan_kehadiran) || 0;
  const tepatWaktu = presensiSummary?.tepatWaktu || 0;
  const totalHadir = presensiSummary?.totalHadir || 0;
  const terlambat = presensiSummary?.terlambat || 0;

  // const tunjanganKehadiranTotal = tunjanganKehadiranBase * tepatWaktu;
  const tunjanganKehadiranTotal = presensiSummary 
  ? (jabatan?.toLowerCase() === 'magang' ||jabatan?.toLowerCase() === 'staf dapur'
      ? tunjanganKehadiranBase * presensiSummary.totalHadir 
      : tunjanganKehadiranBase * presensiSummary.tepatWaktu)
  : 0;
  
  // Data ijin
  const ijinTidakMasuk = dataIjin?.summary?.total_ijin_tidak_masuk || 0;
  const ijinKeluarDipotong = dataIjin?.summary?.total_ijin_keluar_dipotong || 0;

  // Hitung total gaji dengan tunjangan makan per hari hadir
  const tunjanganMakanPerHari = Number(data.tunjangan_makan) || 0;
  const totalTunjanganMakan = tunjanganMakanPerHari * totalHadir;

  const totalGaji =
    Number(data.gaji_pokok) +
    Number(data.tunjangan_bpjs) +
    Number(data.tunjangan_jabatan) +
    totalTunjanganMakan +
    tunjanganKehadiranTotal +
    Number(data.tunjangan_sembako) +
    Number(data.tunjangan_kepala_keluarga)+
    Number(data.tunjangan_pendidikan)+
    Number(data.tunjangan_pensiun)+
    Number(data.tunjangan_jamlebih)+
    Number(data.tunjangan_anak)+
    Number(data.tunjangan_nikah)

  // Hitung potongan
  const potonganIjinKeluar = ijinKeluarDipotong * tunjanganKehadiranBase*0.5;
  const totalPotongan = Number(data.potongan_makan || 0) + potonganIjinKeluar + Number(data.potongan_pensiun)+totalTunjanganMakan;
  const takeHomePay = totalGaji - totalPotongan;

  const formatRupiah = (amount) => {
    return `Rp ${Number(amount).toLocaleString("id-ID")}`;
  };

    // Bulan lalu
const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logoLeft} src="/yamasaka.jpg" />
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Slip Gaji Karyawan</Text>
            <Text style={styles.subtitle}>
              Periode: {lastMonth.toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <Image style={styles.logoRight} src="/logo-sattnav.png" />
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

        {/* Data Kehadiran Bulan lalu */}
        {presensiSummary && (
          <View style={styles.cardBlue}>
            <View style={styles.cardHeaderBlue}>
              <Text style={styles.cardTitleBlue}>Data Kehadiran {lastMonth.toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}</Text>
            </View>
            <View style={styles.kehadiranGrid}>
              {/* Ijin Tidak Masuk */}
              <View style={styles.kehadiranBox}>
                <Text style={styles.kehadiranLabel}>Ijin Tidak Masuk</Text>
                <Text style={[styles.kehadiranValue, styles.valueGreen]}>
                  {ijinTidakMasuk}
                </Text>
                <Text style={styles.kehadiranUnit}>hari</Text>
              </View>

              {/* Ijin Keluar Pribadi */}
              <View style={styles.kehadiranBox}>
                <Text style={styles.kehadiranLabel}>Ijin Keluar Dipotong</Text>
                <Text style={[styles.kehadiranValue, styles.valueGreen]}>
                  {ijinKeluarDipotong}
                </Text>
                <Text style={styles.kehadiranUnit}>hari</Text>
              </View>

              {/* Tepat Waktu */}
              <View style={styles.kehadiranBox}>
                <Text style={styles.kehadiranLabel}>Tepat Waktu</Text>
                <Text style={[styles.kehadiranValue, styles.valueGreen]}>
                  {tepatWaktu}
                </Text>
                <Text style={styles.kehadiranUnit}>hari</Text>
              </View>

              {/* Terlambat */}
              <View style={styles.kehadiranBox}>
                <Text style={styles.kehadiranLabel}>Terlambat</Text>
                <Text style={[styles.kehadiranValue, styles.valueRed]}>
                  {terlambat}
                </Text>
                <Text style={styles.kehadiranUnit}>hari</Text>
              </View>

              {/* Total Hadir */}
              <View style={styles.kehadiranBox}>
                <Text style={styles.kehadiranLabel}>Total Hadir</Text>
                <Text style={[styles.kehadiranValue, styles.valueBlue]}>
                  {totalHadir}
                </Text>
                <Text style={styles.kehadiranUnit}>hari</Text>
              </View>
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
                <View>
                  <Text>Tunjangan Makan</Text>
                  <Text style={styles.subText}>
                    {formatRupiah(tunjanganMakanPerHari)} × {totalHadir} hari
                  </Text>
                </View>
                <Text>{formatRupiah(totalTunjanganMakan)}</Text>
              </View>
              {jabatan?.toLowerCase()==='magang'||jabatan?.toLowerCase()==='staf dapur'?(
              <View style={styles.detailRowHighlight}>
                <View>
                  <Text>Tunjangan Kehadiran</Text>
                  <Text style={styles.subText}>
                    {formatRupiah(tunjanganKehadiranBase)} × {totalHadir} hari
                  </Text>
                </View>
                <Text style={{ fontWeight: "bold", color: "#16a34a" }}>
                  {formatRupiah(tunjanganKehadiranTotal)}
                </Text>
              </View>
              ):(
                <View style={styles.detailRowHighlight}>
                <View>
                  <Text>Tunjangan Hadir On Time</Text>
                  <Text style={styles.subText}>
                    {formatRupiah(tunjanganKehadiranBase)} × {tepatWaktu} hari
                  </Text>
                </View>
                <Text style={{ fontWeight: "bold", color: "#16a34a" }}>
                  {formatRupiah(tunjanganKehadiranTotal)}
                </Text>
              </View>
              )}

              <View style={styles.detailRow}>
                <Text>Tunjangan Sembako</Text>
                <Text>{formatRupiah(data.tunjangan_sembako)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Kepala Keluarga</Text>
                <Text>{formatRupiah(data.tunjangan_kepala_keluarga)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Pendidikan</Text>
                <Text>{formatRupiah(data.tunjangan_pendidikan)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Pensiun</Text>
                <Text>{formatRupiah(data.tunjangan_pensiun)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Kelebihan Jam</Text>
                <Text>{formatRupiah(data.tunjangan_jamlebih)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Anak</Text>
                <Text>{formatRupiah(data.tunjangan_anak)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Tunjangan Lain-lain</Text>
                <Text>{formatRupiah(data.tunjangan_nikah)}</Text>
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
              {ijinKeluarDipotong > 0 && (
                <View style={styles.detailRow}>
                  <View>
                    <Text>Potongan Ijin Keluar</Text>
                    <Text style={styles.subText}>
                      50% x {formatRupiah(tunjanganKehadiranBase)} × {ijinKeluarDipotong} kali
                    </Text>
                  </View>
                  <Text>{formatRupiah(potonganIjinKeluar)}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text>Potongan Pensiun</Text>
                <Text>{formatRupiah(data.potongan_pensiun || 0)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Potongan Makan</Text>
                <Text>{formatRupiah(totalTunjanganMakan || 0)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text>Potongan Lainnya</Text>
                <Text>{formatRupiah(data.potongan_makan || 0)}</Text>
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
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Karyawan</Text>
            <Text style={styles.signatureName}>{data.name}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SlipGajiPDF;