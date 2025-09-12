import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import DashboardCard from "../../components/DashboardCard";

export default function SdPage() {
  const kelasList = ["kelas-1", "kelas-2", "kelas-3", "kelas-4", "kelas-5", "kelas-6"];
  const rombelList = ["rombel-a", "rombel-b", "rombel-c"];
  const colors = ["bg-pink-200","bg-yellow-200","bg-green-200","bg-blue-200","bg-purple-200","bg-orange-200"];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/siswa">Siswa</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>SD</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">SD</h1>
      <p className="mb-6">Detail jumlah siswa per rombel SD.</p>

      {/* Grid rombel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {kelasList.map((kelas, i) =>
          rombelList.map((rombel, j) => (
            <DashboardCard
              key={`${kelas}-${rombel}`}
              title={`${kelas.replace("-", " ").toUpperCase()} - ${rombel.toUpperCase()}`}
              value={Math.floor(Math.random() * 30 + 20)} // contoh jumlah siswa
              href={`/dashboard/siswa/sd/${kelas}/${rombel}`}
              bgColor={colors[i % colors.length]}
            />
          ))
        )}
      </div>
    </div>
  );
}
