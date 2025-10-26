export function formatRupiah(value) {
  // Pastikan value adalah angka
  const number = parseFloat(value);

  // Jika bukan angka valid, kembalikan tanda "-"
  if (isNaN(number)) return "-";

  // Format menggunakan locale Indonesia
  return number.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  });
}
