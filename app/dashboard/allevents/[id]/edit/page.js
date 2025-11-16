// app/(dashboard)/events/[id]/edit/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import EventForm from '@/app/dashboard/components/allevents/EventForm';
// import { EventAPI } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { isoToDateInputWITA } from '@/lib/formatDateIsoToInput';
import { useAuth } from '@/lib/getUserClientSide';
import { EventAPI} from '@/lib/api-client';

export default function EditEventPage() {
    const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {user}=useAuth();
// console.log(user)

  // console.log(event)

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  async function loadEvent() {
    try {
      setLoading(true);
      const result = await EventAPI.getById(eventId);
      
      if (result.success) {
        setEvent(result.data);
      } else {
        toast({
        title: "Error",
        description: "Event Tidak ditemukan",
        variant: "destructive",
        });
        router.push('/dashboard/allevents');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal Memuat Data Event",
        variant: "destructive",
        });
      router.push('/dashboard/allevents');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      const result = await EventAPI.update(eventId, data,user);
      
      if (result.success) {
        toast({
        title: "Berhasil!",
        description: "Event Berhasil Diupdate",
        });
        router.push(`/dashboard/allevents/${eventId}`);
      } else {
        toast({
        title: "Error",
        description: "Gagal Update Event",
        variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi Kesalahan Saat Up Date Event",
        variant: "destructive",
        });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/allevents/${eventId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Event tidak ditemukan</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/allevents">Kembali ke Daftar Event</Link>
        </Button>
      </div>
    );
  }

  // Format default values untuk form
  const defaultValues = {
    name: event.name,
    description: event.description || '',
    start_date: isoToDateInputWITA(event.start_date),
    end_date: isoToDateInputWITA(event.end_date),
    status: event.status
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        asChild 
        className="mb-6"
      >
        <Link href={`/dashboard/allevents/${eventId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Event
        </Link>
      </Button>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>
            Update informasi event. Perubahan akan langsung tersimpan setelah submit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm 
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={submitting}
          />
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>💡 <strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Pastikan tanggal mulai tidak lebih besar dari tanggal selesai</li>
              <li>Gunakan status Planning untuk event yang masih dalam tahap persiapan</li>
              <li>Ubah status ke Ongoing saat event berlangsung</li>
              <li>Setelah event selesai, ubah status menjadi Completed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}