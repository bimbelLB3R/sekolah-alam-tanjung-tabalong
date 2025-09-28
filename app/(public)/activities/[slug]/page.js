import { activities } from "@/app/data/activities";
import Image from "next/image";

export default async function ActivityDetailPage({ params }) {
  const paramss=await params
  const activity =activities.find((a) => a.slug ===paramss.slug);

  if (!activity) return <p>Aktivitas tidak ditemukan.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">{activity.title}</h1>
      <Image
        src={activity.zoomImage}
        alt={activity.title}
        width={800}
        height={400}
        className="rounded-lg object-cover"
      />
      <p className="text-gray-700">{activity.description}</p>
      <p>Konten lengkap aktivitas bisa ditambahkan di sini...</p>
    </div>
  );
}
