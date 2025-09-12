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

export default function PaudPage() {
  const kelasList = ["paud-1", "paud-2"];
  const rombelList = ["rombel-a", "rombel-b"];
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
            <BreadcrumbPage>PAUD</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">PAUD</h1>
      <p className="mb-6">Detail jumlah siswa per rombel PAUD.</p>

      {/* Grid rombel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {kelasList.map((kelas, i) =>
          rombelList.map((rombel, j) => (
            <DashboardCard
              key={`${kelas}-${rombel}`}
              title={`${kelas.replace("-", " ").toUpperCase()} - ${rombel.toUpperCase()}`}
              value={Math.floor(Math.random() * 30 + 20)} // contoh jumlah siswa
              href={`/dashboard/siswa/paud/${kelas}/${rombel}`}
              bgColor={colors[i % colors.length]}
            />
          ))
        )}
      </div>
    </div>
  );
}
