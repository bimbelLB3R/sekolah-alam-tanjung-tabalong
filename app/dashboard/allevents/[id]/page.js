// app/(dashboard)/events/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { CommitteeList } from '../../components/allevents/committee/CommitteeList';
import { TodoBoard } from '../../components/allevents/todos/TodoBoard';
import { RundownTimeline } from '../../components/allevents/rundown/RundownTimeline';
import { EventAPI } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const statusConfig = {
  planning: { label: 'Perencanaan', color: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Berlangsung', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Selesai', color: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' }
};

export default function EventDetailPage() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [committees, setCommittees] = useState([]);
  const [todos, setTodos] = useState([]);
  const [rundowns, setRundowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  async function loadEventData() {
    try {
      setLoading(true);
      const [eventRes, committeeRes, todosRes, rundownRes] = await Promise.all([
        EventAPI.getById(eventId),
        EventAPI.getCommittee(eventId),
        EventAPI.getTodos(eventId),
        EventAPI.getRundown(eventId)
      ]);

      if (eventRes.success) setEvent(eventRes.data);
      if (committeeRes.success) setCommittees(committeeRes.data);
      if (todosRes.success) setTodos(todosRes.data);
      if (rundownRes.success) setRundowns(rundownRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal Memuat Data Event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Committee handlers
  const handleAddCommittee = async (data) => {
    const result = await EventAPI.addCommitteeMember(eventId, data);
    if (result.success) {
        toast({
        title: "Berhasil!",
        description: "Anggota Panitia Berhasil Ditambahkan",
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
    const result = await EventAPI.updateCommitteeMember(eventId, committeeId, data);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Anggota Panitia Berhasil Diupdate",
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
    const result = await EventAPI.deleteCommitteeMember(eventId, committeeId);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Anggota Panitia Berhasil Dihapus",
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

  // Todo handlers
  const handleAddTodo = async (data) => {
    const result = await EventAPI.addTodo(eventId, data);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Task Berhasil ditambahkan",
        });
      setTodos([...todos, result.data]);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        });
    }
  };

  const handleUpdateTodo = async (todoId, data) => {
    const result = await EventAPI.updateTodo(eventId, todoId, data);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Task Berhasil diupdate",
        });
      setTodos(todos.map(t => t.id === todoId ? result.data : t));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        });
    }
  };

  const handleDeleteTodo = async (todoId) => {
    const result = await EventAPI.deleteTodo(eventId, todoId);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Task Berhasil dihapus",
        });
      setTodos(todos.filter(t => t.id !== todoId));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        });
    }
  };

  const handleTodoStatusChange = async (todoId, status) => {
    const result = await EventAPI.updateTodoStatus(eventId, todoId, status);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Status Berhasil diupdate",
        });
      setTodos(todos.map(t => t.id === todoId ? result.data : t));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        });
    }
  };

  // Rundown handlers
  const handleAddRundown = async (data) => {
    const result = await EventAPI.addRundownItem(eventId, data);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Agenda Berhasil ditambahkan",
        });
      setRundowns([...rundowns, result.data]);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        });
    }
  };

  const handleUpdateRundown = async (rundownId, data) => {
    const result = await EventAPI.updateRundownItem(eventId, rundownId, data);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Agenda Berhasil diup date",
        });
      setRundowns(rundowns.map(r => r.id === rundownId ? result.data : r));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        });
    }
  };

  const handleDeleteRundown = async (rundownId) => {
    const result = await EventAPI.deleteRundownItem(eventId, rundownId);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Agenda Berhasil dihapus",
        });
      setRundowns(rundowns.filter(r => r.id !== rundownId));
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        });
    }
  };

  // Event handlers
  const handleDeleteEvent = async () => {
    const result = await EventAPI.delete(eventId);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Event Berhasil dihapus",
        });
      router.push('/dashboard/allevents');
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
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
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

  const status = statusConfig[event.status];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/allevents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{event.name}</h1>
              <Badge className={status.color}>{status.label}</Badge>
            </div>
            {event.description && (
              <p className="text-muted-foreground max-w-3xl">
                {event.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(event.start_date), 'd MMMM yyyy', { locale: idLocale })}
                {event.end_date !== event.start_date && (
                  <> - {format(new Date(event.end_date), 'd MMMM yyyy', { locale: idLocale })}</>
                )}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/allevents/${eventId}/edit`}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {event.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              {event.stats.committee_count}
            </div>
            <div className="text-sm text-blue-600">Anggota Panitia</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {event.stats.todo_completed}/{event.stats.todo_total}
            </div>
            <div className="text-sm text-green-600">Task Selesai</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              {event.stats.todo_in_progress}
            </div>
            <div className="text-sm text-orange-600">Task Dikerjakan</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {event.stats.rundown_count}
            </div>
            <div className="text-sm text-purple-600">Agenda Rundown</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="committee">
            Kepanitiaan ({committees.length})
          </TabsTrigger>
          <TabsTrigger value="todos">
            Todo List ({todos.length})
          </TabsTrigger>
          <TabsTrigger value="rundown">
            Rundown ({rundowns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Informasi Event</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Nama Event</dt>
                  <dd className="font-medium">{event.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd><Badge className={status.color}>{status.label}</Badge></dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Tanggal Mulai</dt>
                  <dd className="font-medium">
                    {format(new Date(event.start_date), 'd MMMM yyyy', { locale: idLocale })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Tanggal Selesai</dt>
                  <dd className="font-medium">
                    {format(new Date(event.end_date), 'd MMMM yyyy', { locale: idLocale })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="committee">
          <CommitteeList
            committees={committees}
            onAdd={handleAddCommittee}
            onUpdate={handleUpdateCommittee}
            onDelete={handleDeleteCommittee}
          />
        </TabsContent>

        <TabsContent value="todos">
          <TodoBoard
            todos={todos}
            onAdd={handleAddTodo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            onStatusChange={handleTodoStatusChange}
          />
        </TabsContent>

        <TabsContent value="rundown">
          <RundownTimeline
            rundowns={rundowns}
            onAdd={handleAddRundown}
            onUpdate={handleUpdateRundown}
            onDelete={handleDeleteRundown}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data termasuk kepanitiaan, 
              todo list, dan rundown akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}