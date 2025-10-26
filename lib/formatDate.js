
export function formatDate(tanggal) {
  if (!tanggal) return "";
  return new Date(tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
}

// 26 Oktober 2025