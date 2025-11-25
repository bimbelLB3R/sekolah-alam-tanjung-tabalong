import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Styles untuk PDF
const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  border: {
    border: '2px dashed #FFA500',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '1px solid #ccc',
  },
  logoContainer: {
    width: 70,
    marginRight: 10,
  },
  logo: {
    width: 70,
    height: 65,
  },
  headerCenter: {
    flex: 1,
  },
  headerRight: {
    textAlign: 'right',
    width: 180,
  },
  schoolName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  schoolInfo: {
    fontSize: 8,
    marginBottom: 2,
    color: '#444',
  },
  infoRow: {
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 10,
  },
  table: {
    marginTop: 15,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#666',
    color: 'white',
    fontWeight: 'bold',
    padding: 7,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 7,
    borderBottom: '1px solid #ccc',
  },
  tableColId: {
    width: '15%',
    textAlign: 'center',
  },
  tableColDate: {
    width: '20%',
    textAlign: 'center',
  },
  tableColDesc: {
    width: '40%',
    paddingLeft: 5,
  },
  tableColAmount: {
    width: '25%',
    textAlign: 'right',
    paddingRight: 5,
  },
  catatanRow: {
    padding: 7,
    fontSize: 8,
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #ccc',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#666',
    color: 'white',
    fontWeight: 'bold',
    padding: 7,
  },
  totalLabel: {
    width: '75%',
    textAlign: 'center',
    fontSize: 11,
  },
  totalAmount: {
    width: '25%',
    textAlign: 'right',
    paddingRight: 5,
    fontSize: 11,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLeft: {
    width: '60%',
    padding: 8,
    backgroundColor: '#E8F5E9',
  },
  footerRight: {
    width: '35%',
    textAlign: 'center',
  },
  qrNote: {
    fontSize: 8,
    color: '#FF6600',
    marginBottom: 2,
  },
  receiverLabel: {
    fontSize: 9,
    marginTop: 8,
    marginBottom: 15,
  },
  signature: {
    fontSize: 9,
    marginTop: 3,
  },
  signatureNote: {
    fontSize: 7,
    marginTop: 2,
  },
});

// Komponen PDF Document
export const ReceiptDocument = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Document>
      <Page size={[363,595]} orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          {/* Header */}
          <View style={styles.header}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                src="/logo-sattnav.png"
              />
            </View>

            {/* School Info */}
            <View style={styles.headerCenter}>
              <Text style={styles.schoolName}>
                Sekolah Alam Tanjung Tabalong (SATT)
              </Text>
              <Text style={styles.schoolInfo}>
                Jalan Tanjung Baru, Maburai RT. 01, Kec. Murung Pudak Kab. Tabalong
              </Text>
              <Text style={styles.schoolInfo}>
                Email : sa.tanjungtabalong@gmail.com , IG.sekolahalam.tanjungtabalong
              </Text>
              <Text style={styles.schoolInfo}>Website : www.sekolahalam-tanjungtabalong.id</Text>
            </View>

            {/* Right Info */}
            <View style={styles.headerRight}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>No.Reg</Text>
                <Text style={styles.infoValue}>{data.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nama</Text>
                <Text style={styles.infoValue}>{data.nama_lengkap}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Keterangan</Text>
                <Text style={styles.infoValue}>
                  {data.cara_bayar === 'transfer' ? 'Transfer' : 'Cash'}
                </Text>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableColId}>Tahun</Text>
              <Text style={styles.tableColDate}>Tanggal</Text>
              <Text style={styles.tableColDesc}>Uraian</Text>
              <Text style={styles.tableColAmount}>Jumlah</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColId}>{data.tahun_ajaran}</Text>
              <Text style={styles.tableColDate}>{formatDate(data.tgl_bayar)}</Text>
              <Text style={styles.tableColDesc}>{data.jenis_pembayaran}</Text>
              <Text style={styles.tableColAmount}>{formatCurrency(data.jml_bayar)}</Text>
            </View>
            {data.keterangan && (
              <View style={styles.catatanRow}>
                <Text>Catatan Lain : {data.keterangan}</Text>
              </View>
            )}
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatCurrency(data.jml_bayar)}</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.qrNote}>Fast Response:wa +62 857-5211-2725</Text>
              <Text style={styles.qrNote}>
                Catatan: Simpan kuitansi ini dengan baik sebagai bukti fisik pembayaran kamu ya!
              </Text>
              <Text style={styles.qrNote}>
                Terimakasih telah melakukan pembayaran tepat waktu
              </Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.receiverLabel}>Nama Penerima (Receiver)</Text>
              <Text style={styles.signature}>{data.penerima}</Text>
              <Text style={styles.signatureNote}>(tanda tangan disini)</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};