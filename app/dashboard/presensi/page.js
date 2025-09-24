import SelfieCamera from "../components/SelfieCamera";

export default function PresensiPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Presensi Guru & Karyawan</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Silakan ambil selfie untuk melakukan presensi. Pastikan wajah terlihat jelas.
      </p>

      <SelfieCamera />
    </div>
  );
}
