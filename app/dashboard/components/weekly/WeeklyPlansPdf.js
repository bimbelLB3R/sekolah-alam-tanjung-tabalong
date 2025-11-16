// WeeklyPlanPDF.jsx - Komponen untuk generate PDF
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet,
  Image
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottom: '2 solid black',
    paddingBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  logo2: {
    width: 80,
    height: 50,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  schoolName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  schoolNameSub: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  schoolAddress: {
    fontSize: 7,
    marginBottom: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    marginTop: 10,
    border: '1 solid black',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid black',
    minHeight: 30,
  },
  tableRowLast: {
    borderBottom: 'none',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    fontSize: 8,
  },
  tableCell: {
    padding: 4,
    borderRight: '1 solid black',
    fontSize: 7,
    justifyContent: 'center',
  },
  tableCellLast: {
    borderRight: 'none',
  },
  timeColumn: {
    width: '12%',
    textAlign: 'center',
  },
  dayColumn: {
    width: '17.6%',
  },
  dayHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activityText: {
    fontSize: 7,
    lineHeight: 1.3,
  },
  targetText: {
    fontSize: 6,
    fontStyle: 'italic',
    marginTop: 2,
    color: '#555',
  },
  mergedCell: {
    backgroundColor: '#fff8dc',
  },
  perlengkapanRow: {
    backgroundColor: '#e6e6fa',
  },
  perlengkapanHeader: {
    fontWeight: 'bold',
    fontSize: 8,
  },
  bulletPoint: {
    fontSize: 6,
    marginLeft: 5,
    marginTop: 1,
  },
});

// Helper function untuk mengelompokkan aktivitas berdasarkan waktu
const groupActivitiesByTime = (activities) => {
  const timeSlots = {};
  
  activities.forEach(act => {
    const time = act.waktu || 'Tidak ada waktu';
    if (!timeSlots[time]) {
      timeSlots[time] = {
        Senin: [],
        Selasa: [],
        Rabu: [],
        Kamis: [],
        Jumat: [],
      };
    }
    timeSlots[time][act.hari].push(act);
  });

  return timeSlots;
};

// Helper untuk mengurutkan waktu
const sortTimeSlots = (timeSlots) => {
  const parseTime = (timeStr) => {
    if (timeStr === 'Tidak ada waktu') return 9999;
    const match = timeStr.match(/(\d{2}):(\d{2})/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 9999;
  };

  return Object.keys(timeSlots).sort((a, b) => parseTime(a) - parseTime(b));
};

export default function WeeklyPlanPDF({ planData }) {
  if (!planData) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const groupedActivities = groupActivitiesByTime(planData.activities || []);
  const sortedTimes = sortTimeSlots(groupedActivities);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            style={styles.logo2} 
            src="/yamasaka.jpg"
            alt="logo yamasaka"
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
            src="/logo-sattnav.png"
            alt="logo satt"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          RENCANA KEGIATAN MINGGUAN
        </Text>
        <Text style={styles.subtitle}>
          Kelas: {planData.kelas_lengkap} | Minggu ke-{planData.minggu_ke} ({planData.tahun})
        </Text>
        <Text style={styles.subtitle}>
          Periode: {formatDate(planData.tanggal_mulai)} - {formatDate(planData.tanggal_selesai)}
        </Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, styles.timeColumn]}>
              <Text>Waktu</Text>
            </View>
            <View style={[styles.tableCell, styles.dayColumn]}>
              <Text style={styles.dayHeader}>Senin</Text>
            </View>
            <View style={[styles.tableCell, styles.dayColumn]}>
              <Text style={styles.dayHeader}>Selasa</Text>
            </View>
            <View style={[styles.tableCell, styles.dayColumn]}>
              <Text style={styles.dayHeader}>Rabu</Text>
            </View>
            <View style={[styles.tableCell, styles.dayColumn]}>
              <Text style={styles.dayHeader}>Kamis</Text>
            </View>
            <View style={[styles.tableCell, styles.dayColumn, styles.tableCellLast]}>
              <Text style={styles.dayHeader}>Jumat</Text>
            </View>
          </View>

          {/* Data Rows */}
          {sortedTimes.map((timeSlot, idx) => {
            const activities = groupedActivities[timeSlot];
            const isLastRow = idx === sortedTimes.length - 1;
            
            return (
              <View key={idx} style={[styles.tableRow, isLastRow && styles.tableRowLast]}>
                <View style={[styles.tableCell, styles.timeColumn]}>
                  <Text style={styles.activityText}>{timeSlot}</Text>
                </View>
                
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((hari, dayIdx) => {
                  const dayActivities = activities[hari];
                  const isLast = dayIdx === 4;
                  
                  return (
                    <View 
                      key={hari} 
                      style={[
                        styles.tableCell, 
                        styles.dayColumn,
                        isLast && styles.tableCellLast,
                        dayActivities.length > 0 && styles.mergedCell
                      ]}
                    >
                      {dayActivities.map((act, actIdx) => (
                        <View key={act.id}>
                          <Text style={styles.activityText}>
                            {act.kegiatan}
                          </Text>
                          {act.target_capaian && (
                            <Text style={styles.targetText}>
                              Target: {act.target_capaian}
                            </Text>
                          )}
                          {actIdx < dayActivities.length - 1 && (
                            <Text style={{ marginTop: 3, marginBottom: 3 }}>---</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            );
          })}

          {/* Perlengkapan Row */}
          <View style={[styles.tableRow, styles.perlengkapanRow, styles.tableRowLast]}>
            <View style={[styles.tableCell, styles.timeColumn]}>
              <Text style={styles.perlengkapanHeader}>Perlengkapan</Text>
            </View>
            
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((hari, dayIdx) => {
              const isLast = dayIdx === 4;
              // Placeholder untuk perlengkapan - nanti akan diisi dari database
              return (
                <View 
                  key={hari} 
                  style={[
                    styles.tableCell, 
                    styles.dayColumn,
                    isLast && styles.tableCellLast
                  ]}
                >
                  <Text style={styles.bulletPoint}>• Bekal sehat tanpa kemasan</Text>
                  <Text style={styles.bulletPoint}>• Batal minum</Text>
                  <Text style={styles.bulletPoint}>• Baju olahraga & ganti</Text>
                  <Text style={styles.bulletPoint}>• Baju outbound & ganti</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer Note */}
        <View style={{ marginTop: 15, fontSize: 7 }}>
          <Text style={{ fontStyle: 'italic', textAlign: 'center', color: '#666' }}>
            Catatan: 1.Senin-Kamis 07.30-13.30 WITA | 2.Jumat 07.30-11.00 WITA | 3.Jumat - market day membawa uang maksimal 20.000
          </Text>
        </View>

        {/* Signature Section */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginTop: 20,
          paddingHorizontal: 40
        }}>
          <View style={{ textAlign: 'center', width: '35%' }}>
            <Text style={{ fontSize: 8, marginBottom: 40 }}>Kepala Sekolah</Text>
            <Text style={{ fontSize: 8, borderTop: '1 solid black', paddingTop: 2 }}>
              (............................)
            </Text>
          </View>
          
          <View style={{ textAlign: 'center', width: '35%' }}>
            <Text style={{ fontSize: 8, marginBottom: 40 }}>Wali Kelas</Text>
            <Text style={{ fontSize: 8, borderTop: '1 solid black', paddingTop: 2 }}>
              {planData.guru_nama}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}