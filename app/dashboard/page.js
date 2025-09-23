import DashboardCard from './components/DashboardCard';


export default function DashboardPage() {
  return (
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard title="Jumlah Siswa" value="80" href="/dashboard/siswa" />
      <DashboardCard title="Reservasi Siswa" value="5" href="/dashboard/reservasi" />
      <DashboardCard title="Daftar Ulang" value="10" href="/dashboard/daftarulang" />
    </div>
  );
}
