// app/(dashboard)/events/new/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import EventForm from '../../components/allevents/EventForm';
import { EventAPI } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CreateEventPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await EventAPI.create(data);
      
      if (result.success) {
        toast({
        title: "Berhasil!",
        description: "Event Berhasil dibuat",
        });
        router.push(`/dashboard/allevents/${result.data.id}`);
      } else {
        toast({
        title: "Error",
        description: "Gagal Membuat Event",
        variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat event",
        variant: "destructive",
        });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/allevents');
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        asChild 
        className="mb-6"
      >
        <Link href="/dashboard//allevents">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Event
        </Link>
      </Button>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Buat Event Baru</CardTitle>
          <CardDescription>
            Isi informasi dasar event. Anda bisa menambahkan kepanitiaan, 
            todo list, dan rundown setelah event dibuat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}