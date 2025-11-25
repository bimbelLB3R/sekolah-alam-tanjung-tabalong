// utils/date.js

export function formatDate(tanggal) {
  if (!tanggal) return "";
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// 26 Oktober 2025 
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

// isoString: "2025-11-15T16:00:00.000Z"
export function isoToDateInputWITA(isoString) {
  const date = new Date(isoString);

  // Tambahkan offset UTC+8 (WITA)
  const witaTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);

  const year = witaTime.getFullYear();
  const month = String(witaTime.getMonth() + 1).padStart(2, "0");
  const day = String(witaTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // Hasil: "2025-11-16"
}

// Format tanggal untuk PDF dengan WITA timezone
export function formatDateWITA(isoString) {
  if (!isoString) return "";
  
  const date = new Date(isoString);
  // Tambahkan offset UTC+8 (WITA)
  const witaTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  
  return witaTime.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC" // Karena sudah di-offset manual
  });
}