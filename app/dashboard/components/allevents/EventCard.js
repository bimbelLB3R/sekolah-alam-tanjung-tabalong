// components/events/EventCard.jsx
'use client';

import { Calendar, Users, CheckCircle2, ListTodo, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Link from 'next/link';

const statusConfig = {
  planning: {
    label: 'Perencanaan',
    variant: 'secondary',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  ongoing: {
    label: 'Berlangsung',
    variant: 'default',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  completed: {
    label: 'Selesai',
    variant: 'outline',
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  },
  cancelled: {
    label: 'Dibatalkan',
    variant: 'destructive',
    color: 'bg-red-100 text-red-700 border-red-200'
  }
};

export default function EventCard({ event, onDelete }) {
  const status = statusConfig[event.status] || statusConfig.planning;
  
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'd MMM yyyy', { locale: idLocale });
    } catch {
      return date;
    }
  };

  const calculateProgress = () => {
    if (!event.stats) return 0;
    const total = event.stats.todo_total || 0;
    const completed = event.stats.todo_completed || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link href={`/dashboard/allevents/${event.id}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                {event.name}
              </h3>
            </Link>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
          <Badge className={status.color} variant={status.variant}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          {/* Date Range */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(event.start_date)}
              {event.end_date !== event.start_date && (
                <> - {formatDate(event.end_date)}</>
              )}
            </span>
          </div>

          {/* Stats */}
          {event.stats && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {/* Committee */}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">
                  {event.stats.committee_count} Panitia
                </span>
              </div>

              {/* Rundown */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-muted-foreground">
                  {event.stats.rundown_count} Agenda
                </span>
              </div>

              {/* Todos Progress */}
              <div className="col-span-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-orange-500" />
                    <span className="text-muted-foreground">
                      Progress Task
                    </span>
                  </div>
                  <span className="font-medium text-xs">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{event.stats.todo_completed} selesai</span>
                  <span>{event.stats.todo_in_progress} dikerjakan</span>
                  <span>{event.stats.todo_pending} pending</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t grid grid-cols-2 gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/dashboard/allevents/${event.id}`}>
            Lihat Detail
          </Link>
        </Button>
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/dashboard/allevents/${event.id}/committee`}>
            Panitia
          </Link>
        </Button>
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/dashboard/allevents/${event.id}/rundown`}>
            Run Down
          </Link>
        </Button>
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/dashboard/allevents/${event.id}/todos`}>
            To do list
          </Link>
        </Button>
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/dashboard/allevents/${event.id}/budget`}>
            Budgeting
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}