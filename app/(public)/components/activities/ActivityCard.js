"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function ActivityCard({ slug, title, description, image }) {
  return (
    <Link href={`/activities/${slug}`} className="block">
      <Card className="flex flex-row hover:shadow-lg transition-shadow duration-200">
        {/* Foto di kiri */}
        <div className="w-1/3 relative">
          <Image
            src={image}
            alt={title}
            width={300}
            height={200}
            className="object-cover h-full w-full rounded-l-lg"
          />
        </div>

        {/* Teks di kanan */}
        <CardContent className="w-2/3 p-4 flex flex-col justify-between border-l">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="mt-2 flex items-center text-primary font-medium">
            <span>Baca selengkapnya</span>
            <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
