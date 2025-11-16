// app/(dashboard)/events/[id]/committee/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { CommitteeList } from '@/app/dashboard/components/allevents/committee/CommitteeList';
import { EventAPI } from '@/lib/api-client';
import Link from 'next/link';
import { useAuth } from '@/lib/getUserClientSide';

export default function CommitteePage() {
  const {user}=useAuth();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const { toast } = useToast();

  const [event, setEvent] = useState(null);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [eventId]);

  async function loadData() {
    try {
      setLoading(true);
      const [eventRes, committeeRes] = await Promise.all([
        EventAPI.getById(eventId),
        EventAPI.getCommittee(eventId)
      ]);

      if (eventRes.success) setEvent(eventRes.data);
      if (committeeRes.success) setCommittees(committeeRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddCommittee = async (data) => {
    const result = await EventAPI.addCommitteeMember(eventId, data,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Anggota panitia berhasil ditambahkan",
      });
      setCommittees([...committees, result.data]);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCommittee = async (committeeId, data) => {
    const result = await EventAPI.updateCommitteeMember(eventId, committeeId, data,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Anggota panitia berhasil diupdate",
      });
      setCommittees(committees.map(c => c.id === committeeId ? result.data : c));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCommittee = async (committeeId) => {
    const result = await EventAPI.deleteCommitteeMember(eventId, committeeId,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Anggota panitia berhasil dihapus",
      });
      setCommittees(committees.filter(c => c.id !== committeeId));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/allevents/${eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Detail Event
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Kepanitiaan</h1>
                <p className="text-muted-foreground">{event.name}</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {committees.length} Anggota
          </Badge>
        </div>
      </div>

      {/* Committee List */}
      <CommitteeList
        committees={committees}
        onAdd={handleAddCommittee}
        onUpdate={handleUpdateCommittee}
        onDelete={handleDeleteCommittee}
      />
    </div>
  );
}