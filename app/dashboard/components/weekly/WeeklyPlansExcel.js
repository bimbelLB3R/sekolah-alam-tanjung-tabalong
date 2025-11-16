import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Parse waktu menjadi menit
const parseTime = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{2}):(\d{2})/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return null;
};

// Parse range waktu
const parseTimeRange = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/);
  if (match) {
    return {
      start: parseInt(match[1]) * 60 + parseInt(match[2]),
      end: parseInt(match[3]) * 60 + parseInt(match[4])
    };
  }
  return null;
};

// Generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 13; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`);
  }
  return slots;
};

export async function exportWeeklyPlanToExcel(planData) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Weekly Plan');

  // Set column widths
  worksheet.columns = [
    { width: 15 }, // Waktu
    { width: 20 }, // Senin
    { width: 20 }, // Selasa
    { width: 20 }, // Rabu
    { width: 20 }, // Kamis
    { width: 20 }, // Jumat
  ];

  const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const timeSlots = generateTimeSlots();

  // Add title rows
  let currentRow = 1;
  
  // School header
  worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
  const titleRow = worksheet.getRow(currentRow);
  titleRow.getCell(1).value = 'YAYASAN MUTIARA INSAN SARABAKAWA';
  titleRow.getCell(1).font = { bold: true, size: 14 };
  titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  currentRow++;

  worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
  worksheet.getRow(currentRow).getCell(1).value = 'SEKOLAH ALAM TANJUNG TABALONG (SEKOLAH DASAR)';
  worksheet.getRow(currentRow).getCell(1).font = { bold: true, size: 12 };
  worksheet.getRow(currentRow).getCell(1).alignment = { horizontal: 'center' };
  currentRow++;

  // Title
  currentRow++;
  worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
  worksheet.getRow(currentRow).getCell(1).value = 'RENCANA KEGIATAN MINGGUAN';
  worksheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14 };
  worksheet.getRow(currentRow).getCell(1).alignment = { horizontal: 'center' };
  currentRow++;

  // Subtitle
  worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
  const subtitle = `Kelas: ${planData.kelas_lengkap} | Minggu ke-${planData.minggu_ke} (${planData.tahun})`;
  worksheet.getRow(currentRow).getCell(1).value = subtitle;
  worksheet.getRow(currentRow).getCell(1).alignment = { horizontal: 'center' };
  currentRow++;

  currentRow++; // Empty row

  // Table header
  const headerRow = worksheet.getRow(currentRow);
  headerRow.values = ['Waktu', ...HARI];
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };
  
  // Add borders to header
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  
  const tableStartRow = currentRow;
  currentRow++;

  // Build activity mapping
  const activityMap = {};
  timeSlots.forEach((slot) => {
    activityMap[slot] = {};
    HARI.forEach(hari => {
      activityMap[slot][hari] = [];
    });
  });

  // Fill activities
  planData.activities.forEach(activity => {
    const activityRange = parseTimeRange(activity.waktu);
    if (!activityRange) return;

    timeSlots.forEach((slot) => {
      const slotRange = parseTimeRange(slot);
      if (slotRange && activityRange.start < slotRange.end && activityRange.end > slotRange.start) {
        activityMap[slot][activity.hari].push(activity);
      }
    });
  });

  // Track merged cells
  const skipCells = new Set();

  // Process each time slot
  timeSlots.forEach((slot, slotIdx) => {
    const rowNum = currentRow;
    const row = worksheet.getRow(rowNum);
    
    // Add time cell
    row.getCell(1).value = slot;
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
    // Process each day untuk horizontal merge
    let dayIdx = 0;
    while (dayIdx < HARI.length) {
      const hari = HARI[dayIdx];
      const colNum = dayIdx + 2; // Column B, C, D, E, F
      const cellKey = `${rowNum}-${colNum}`;
      
      // Skip if this cell is part of a merged cell
      if (skipCells.has(cellKey)) {
        dayIdx++;
        continue;
      }

      const activities = activityMap[slot][hari];
      
      if (activities.length > 0) {
        const firstActivity = activities[0];
        const activityRange = parseTimeRange(firstActivity.waktu);
        
        // Calculate vertical span (rows)
        let rowSpan = 1;
        if (activityRange) {
          for (let i = slotIdx; i < timeSlots.length; i++) {
            const checkSlot = timeSlots[i];
            const slotRange = parseTimeRange(checkSlot);
            if (slotRange && activityRange.start < slotRange.end && activityRange.end > slotRange.start) {
              rowSpan = i - slotIdx + 1;
            } else if (rowSpan > 1) {
              break;
            }
          }
        }

        // Calculate horizontal span (columns) - cek kegiatan sama dengan waktu sama
        let colSpan = 1;
        for (let nextDay = dayIdx + 1; nextDay < HARI.length; nextDay++) {
          const nextHari = HARI[nextDay];
          const nextActivities = activityMap[slot][nextHari];
          
          if (nextActivities.length > 0) {
            const nextActivity = nextActivities[0];
            
            // Cek apakah kegiatan sama DAN waktu sama
            if (nextActivity.kegiatan === firstActivity.kegiatan && 
                nextActivity.waktu === firstActivity.waktu) {
              colSpan++;
            } else {
              break;
            }
          } else {
            break;
          }
        }

        // Set cell value
        let cellValue = firstActivity.kegiatan;
        
        row.getCell(colNum).value = cellValue;
        row.getCell(colNum).alignment = { 
          horizontal: 'center',
          vertical: 'middle', 
          wrapText: true 
        };
        row.getCell(colNum).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF8DC' }
        };

        // Merge cells
        const startRow = rowNum;
        const endRow = rowNum + rowSpan - 1;
        const startCol = colNum;
        const endCol = colNum + colSpan - 1;
        
        if (rowSpan > 1 || colSpan > 1) {
          worksheet.mergeCells(startRow, startCol, endRow, endCol);
          
          // Mark cells to skip
          for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
              if (r !== startRow || c !== startCol) {
                skipCells.add(`${r}-${c}`);
              }
            }
          }
        }
        
        // Add border to merged cell
        row.getCell(colNum).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        // Skip the merged columns
        dayIdx += colSpan;
      } else {
        // Empty cell
        row.getCell(colNum).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        dayIdx++;
      }
    }
    
    currentRow++;
  });

  // Add Perlengkapan row
  const perlengkapanRow = worksheet.getRow(currentRow);
  perlengkapanRow.getCell(1).value = 'Perlengkapan';
  perlengkapanRow.getCell(1).font = { bold: true };
  perlengkapanRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  perlengkapanRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }
  };
  perlengkapanRow.getCell(1).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  const perlengkapanItems = [
    '• Bekal sehat tanpa kemasan',
    '• Botol minum',
    '• Baju olahraga & ganti',
    '• Baju outbound & ganti'
  ].join('\n');

  HARI.forEach((hari, idx) => {
    const cell = perlengkapanRow.getCell(idx + 2);
    cell.value = perlengkapanItems;
    cell.alignment = { vertical: 'top', wrapText: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Set row heights
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= tableStartRow && rowNumber < currentRow) {
      // Baris aktivitas
      row.height = 40;
    } else if (rowNumber === currentRow) {
      // Baris Perlengkapan - auto height berdasarkan konten
      // Hitung jumlah baris teks (jumlah bullet points)
      const lineCount = perlengkapanItems.split('\n').length;
      // Setiap baris ≈ 15 pixel, tambah padding
      row.height = Math.max(60, lineCount * 15 + 10);
    }
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  
  // Save file
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  saveAs(blob, `Weekly-Plan-${planData.kelas_lengkap}-Minggu-${planData.minggu_ke}.xlsx`);
}

// Usage in WeeklyManagement component:
// import { exportWeeklyPlanToExcel } from './WeeklyPlanExcel';
// 
// const handleExportExcel = async (planId) => {
//   try {
//     setExportingExcel(true);
//     const res = await fetch(`/api/weekly-plans?id=${planId}`);
//     const planData = await res.json();
//     await exportWeeklyPlanToExcel(planData);
//     toast({ title: 'Berhasil', description: 'Excel berhasil diunduh' });
//   } catch (err) {
//     toast({ variant: 'destructive', title: 'Error', description: 'Gagal export Excel' });
//   } finally {
//     setExportingExcel(false);
//   }
// };