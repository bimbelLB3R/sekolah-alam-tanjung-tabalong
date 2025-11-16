// dateString: "2025-11-16" (dari <input type="date">)
export function dateInputToIsoUTC(dateString) {
  // Pecah tanggal
  const [year, month, day] = dateString.split("-").map(Number);

  // Buat tanggal pada zona WITA (UTC+8)
  const witaDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  // Kurangi offset 8 jam untuk menghasilkan waktu UTC
  const utcDate = new Date(witaDate.getTime() - 8 * 60 * 60 * 1000);

  return utcDate.toISOString(); 
}
