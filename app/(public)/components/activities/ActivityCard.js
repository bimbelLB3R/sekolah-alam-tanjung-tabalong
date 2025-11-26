"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";

export default function ActivityCard({ slug, title, description, image, created_at }) {
  // Format date if available
  const formattedDate = created_at 
    ? new Date(created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <Link href={`/activities/${slug}`} className="block">
      <Card className="flex flex-row hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
        {/* Image Section */}
        <div className="w-1/3 relative min-h-[200px]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-l-lg"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-l-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="w-2/3 p-4 flex flex-col justify-between border-l">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {title}
            </h3>
            
            {formattedDate && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            )}
            
            <p className="text-sm text-gray-600 line-clamp-3">
              {description}
            </p>
          </div>
          
          <div className="mt-3 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
            <span>Baca selengkapnya</span>
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}