import DashboardCard from './components/DashboardCard';


export default function DashboardPage() {
  return (
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard title="Jumlah Siswa" value="1,500" href="/dashboard/siswa" />
      <DashboardCard title="Revenue" value="$12,000" href="/dashboard/revenue" />
      <DashboardCard title="Orders" value="320" href="/dashboard/orders" />
    </div>
  );
}
