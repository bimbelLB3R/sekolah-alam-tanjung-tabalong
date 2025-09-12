import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardCard({ title, value, href, bgColor }) {
  return (
    <Link href={href}>
      <Card
        className={`cursor-pointer hover:shadow-lg transition ${bgColor ?? 'bg-white'}`}
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{value}</CardContent>
      </Card>
    </Link>
  );
}
