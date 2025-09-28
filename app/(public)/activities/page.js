import { activities } from "@/app/data/activities";
import ActivityCard from "../components/activities/ActivityCard";

export default function ActivitiesPage() {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Aktivitas Anak Sekolah Alam</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activities.map((act) => (
        <ActivityCard
          key={act.slug}
          slug={act.slug}
          title={act.title}
          description={act.description}
          image={act.image}
        />
      ))}
      </div>
    </div>
  );
}
