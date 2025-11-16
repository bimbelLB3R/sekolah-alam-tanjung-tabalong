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


// cara penggunaan
// import { isoToDateInputWITA } from "@/utils/date";

// export default function EditForm({ data }) {
//   return (
//     <input
//       type="date"
//       defaultValue={isoToDateInputWITA(data.tanggal)} 
//     />
//   );
// }
