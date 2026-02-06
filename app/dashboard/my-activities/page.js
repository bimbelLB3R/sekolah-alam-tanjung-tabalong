'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  ListTodo, 
  ClipboardList,
  AlertCircle,
  XCircle,
  MapPin,
  FileText,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Eye
} from 'lucide-react';
import TodoAttachmentUpload from '../components/allevents/todos/TodoAttachmentUpload';
import TodoAttachmentList from '../components/allevents/todos/TodoAttachmentList';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

export default function MyActivitiesPage() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingTodo, setUpdatingTodo] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          const err = await res.json();
          console.error("API error:", err);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Gagal memuat data user',
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Gagal memuat data user',
        });
      }
    };

    fetchUser();
  }, []);

  // Fetch activities setelah user tersedia
  useEffect(() => {
    if (user?.id) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const response = await fetch(`/api/users/activities?userId=${user.id}`, {
        credentials: "include",
        cache: "no-store",
      });
      
      const result = await response.json();

      if (result.success) {
        setActivities(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Fetch activities error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data aktivitas',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update todo status
  const handleUpdateTodoStatus = async (eventId, todoId, newStatus) => {
    try {
      setUpdatingTodo(todoId);
      
      const response = await fetch(`/api/allevents/${eventId}/todos`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          todo_id: todoId,
          status: newStatus,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response bukan JSON:', await response.text());
        throw new Error('Server tidak mengembalikan JSON.');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengupdate status');
      }

      if (result.success) {
        toast({
          title: 'Berhasil',
          description: 'Status todo berhasil diupdate',
        });
        
        await fetchActivities();
      } else {
        throw new Error(result.error || 'Update gagal');
      }
    } catch (error) {
      console.error('Update todo error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal mengupdate status todo',
      });
    } finally {
      setUpdatingTodo(null);
    }
  };

  // ✅ FUNGSI BARU: Cek apakah user adalah ketua
  const isChairman = (committees) => {
    if (!committees || !user?.name) return false;
    console.log(committees);
    
    return committees.some(committee => 
      committee.positionName && 
      committee.positionName.toLowerCase().includes('ketua') 
    );
  };

  // ✅ FUNGSI BARU: Handle navigasi ke detail event
  const handleViewEventDetail = (eventId) => {
    router.push(`/dashboard/allevents/${eventId}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { variant: 'secondary', icon: Clock, label: 'Perencanaan' },
      ongoing: { variant: 'default', icon: AlertCircle, label: 'Berlangsung' },
      completed: { variant: 'success', icon: CheckCircle2, label: 'Selesai' },
      cancelled: { variant: 'destructive', icon: XCircle, label: 'Dibatalkan' }
    };

    const config = statusConfig[status] || statusConfig.planning;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTodoStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', label: 'Pending' },
      in_progress: { variant: 'default', label: 'Dikerjakan' },
      completed: { variant: 'success', label: 'Selesai' },
      cancelled: { variant: 'destructive', label: 'Dibatalkan' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { variant: 'outline', label: 'Rendah', color: 'text-gray-600' },
      medium: { variant: 'outline', label: 'Sedang', color: 'text-blue-600' },
      high: { variant: 'outline', label: 'Tinggi', color: 'text-orange-600' },
      urgent: { variant: 'destructive', label: 'Urgent', color: 'text-red-600' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.eventStatus === filter;
  });

  const stats = {
    total: activities.length,
    planning: activities.filter(a => a.eventStatus === 'planning').length,
    ongoing: activities.filter(a => a.eventStatus === 'ongoing').length,
    completed: activities.filter(a => a.eventStatus === 'completed').length,
  };

  const groupInvolvementsByType = (involvements) => {
    return {
      committees: involvements.filter(i => i.type === 'committee'),
      todos: involvements.filter(i => i.type === 'todo'),
      rundowns: involvements.filter(i => i.type === 'rundown'),
    };
  };

  const groupTodosByStatus = (todos) => {
    return {
      pending: todos.filter(t => t.status === 'pending'),
      in_progress: todos.filter(t => t.status === 'in_progress'),
      completed: todos.filter(t => t.status === 'completed'),
    };
  };

  if (!mounted || !user || loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aktivitas Saya</h1>
          <p className="text-muted-foreground mt-2">
            Riwayat keterlibatan Anda dalam berbagai kegiatan
          </p>
        </div>
        {user && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Kegiatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Perencanaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">{stats.planning}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Berlangsung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.ongoing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Selesai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
          <TabsTrigger value="planning">Perencanaan ({stats.planning})</TabsTrigger>
          <TabsTrigger value="ongoing">Berlangsung ({stats.ongoing})</TabsTrigger>
          <TabsTrigger value="completed">Selesai ({stats.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4 mt-6">
          {filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Tidak ada kegiatan dengan status ini
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => {
              const grouped = groupInvolvementsByType(activity.involvements);
              const todosByStatus = groupTodosByStatus(grouped.todos);
              const userIsChairman = isChairman(grouped.committees);
              console.log(userIsChairman)

              return (
                <Card key={activity.eventId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl">{activity.eventName}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {activity.eventDescription}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activity.eventStatus)}
                        {/* ✅ BADGE KETUA */}
                        {userIsChairman && (
                          <Badge variant="default" className="bg-purple-600">
                            <Users className="w-3 h-3 mr-1" />
                            Ketua
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Tanggal */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {activity.startDate && format(new Date(activity.startDate), 'dd MMM yyyy', { locale: id })}
                        {activity.endDate && ` - ${format(new Date(activity.endDate), 'dd MMM yyyy', { locale: id })}`}
                      </span>
                    </div>

                    {/* Committee Section */}
                    {grouped.committees.length > 0 && (
                      <div className="space-y-3">
                        <div className="">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">Posisi Kepanitiaan</h3>
                          </div>
                          
                          {/* ✅ TOMBOL LIHAT DETAIL UNTUK KETUA */}
                          {userIsChairman && (
                            <div className='flex gap-2 items-center'>
                            <Button
                              onClick={() => handleViewEventDetail(activity.eventId)}
                              size="xs"
                              className="text-xs p-2"
                            >
                              
                              Lihat Detail Kegiatan
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Link href={`/dashboard/allevents/${activity.eventId}/todos`} className='underline text-xs text-blue-600'>Lihat TODOS</Link>
                            </div>
                          )}
                        </div>

                        {grouped.committees.map((committee, idx) => (
                          <Card key={idx} className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="default" className="bg-blue-600">
                                    {committee.positionName}
                                  </Badge>
                                </div>
                                {committee.responsibilities && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                      Tanggung Jawab:
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {committee.responsibilities}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Todo Section */}
                    {grouped.todos.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ListTodo className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-lg">Tugas Saya</h3>
                        </div>
                        
                        <Tabs defaultValue="pending" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="pending">
                              Pending ({todosByStatus.pending.length})
                            </TabsTrigger>
                            <TabsTrigger value="in_progress">
                              Dikerjakan ({todosByStatus.in_progress.length})
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                              Selesai ({todosByStatus.completed.length})
                            </TabsTrigger>
                          </TabsList>

                          {/* Pending Todos */}
                          <TabsContent value="pending" className="space-y-2 mt-3">
                            {todosByStatus.pending.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Tidak ada tugas pending
                              </p>
                            ) : (
                              todosByStatus.pending.map((todo, idx) => (
                                <Card key={idx} className="border-orange-200">
                                  <CardContent className="pt-4">
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-medium">{todo.title}</h4>
                                        <div className="flex gap-2">
                                          {getPriorityBadge(todo.priority)}
                                          {getTodoStatusBadge(todo.status)}
                                        </div>
                                      </div>
                                      
                                      {todo.description && (
                                        <p className="text-sm text-muted-foreground">
                                          {todo.description}
                                        </p>
                                      )}
                                      
                                      {todo.deadline && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Clock className="w-4 h-4" />
                                          <span>
                                            Deadline: {format(new Date(todo.deadline), 'dd MMM yyyy', { locale: id })}
                                          </span>
                                        </div>
                                      )}

                                      <div className="flex gap-2 mt-3">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleUpdateTodoStatus(activity.eventId, todo.id, 'in_progress')}
                                          disabled={updatingTodo === todo.id}
                                        >
                                          <ChevronRight className="w-4 h-4 mr-1" />
                                          Mulai Kerjakan
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-green-600 hover:text-green-700"
                                          onClick={() => handleUpdateTodoStatus(activity.eventId, todo.id, 'completed')}
                                          disabled={updatingTodo === todo.id}
                                        >
                                          <CheckCircle2 className="w-4 h-4 mr-1" />
                                          Tandai Selesai
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </TabsContent>

                          {/* In Progress Todos */}
                          <TabsContent value="in_progress" className="space-y-2 mt-3">
                            {todosByStatus.in_progress.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Tidak ada tugas yang sedang dikerjakan
                              </p>
                            ) : (
                              todosByStatus.in_progress.map((todo, idx) => (
                                <Card key={idx} className="border-blue-200 bg-blue-50">
                                  <CardContent className="pt-4">
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-medium">{todo.title}</h4>
                                        <div className="flex gap-2">
                                          {getPriorityBadge(todo.priority)}
                                          {getTodoStatusBadge(todo.status)}
                                        </div>
                                      </div>
                                      
                                      {todo.description && (
                                        <p className="text-sm text-muted-foreground">
                                          {todo.description}
                                        </p>
                                      )}
                                      
                                      {todo.deadline && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Clock className="w-4 h-4" />
                                          <span>
                                            Deadline: {format(new Date(todo.deadline), 'dd MMM yyyy', { locale: id })}
                                          </span>
                                        </div>
                                      )}

                                      <div className="flex gap-2 mt-3">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleUpdateTodoStatus(activity.eventId, todo.id, 'pending')}
                                          disabled={updatingTodo === todo.id}
                                        >
                                          Kembalikan ke Pending
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => handleUpdateTodoStatus(activity.eventId, todo.id, 'completed')}
                                          disabled={updatingTodo === todo.id}
                                        >
                                          <CheckCircle2 className="w-4 h-4 mr-1" />
                                          Selesaikan
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </TabsContent>

                          {/* Completed Todos */}
                          {/* Completed Todos */}
                          <TabsContent value="completed" className="space-y-2 mt-3">
                            {todosByStatus.completed.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Belum ada tugas yang selesai
                              </p>
                            ) : (
                              todosByStatus.completed.map((todo, idx) => (
                                <Card key={idx} className="border-green-200 bg-green-50">
                                  <CardContent className="pt-4">
                                    <div className="space-y-3">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-medium line-through text-muted-foreground">
                                          {todo.title}
                                        </h4>
                                        <div className="flex gap-2">
                                          {getPriorityBadge(todo.priority)}
                                          {getTodoStatusBadge(todo.status)}
                                        </div>
                                      </div>
                                      
                                      {todo.description && (
                                        <p className="text-sm text-muted-foreground">
                                          {todo.description}
                                        </p>
                                      )}
                                      
                                      {todo.completed_at && (
                                        <div className="flex items-center gap-2 text-sm text-green-700">
                                          <CheckCircle2 className="w-4 h-4" />
                                          <span>
                                            Selesai: {format(new Date(todo.completed_at), 'dd MMM yyyy HH:mm', { locale: id })}
                                          </span>
                                        </div>
                                      )}

                                      {/* Upload Section */}
                                      <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                                        <h5 className="text-sm font-semibold mb-3">Dokumen Pendukung</h5>
                                        
                                        <TodoAttachmentList 
                                          eventId={activity.eventId}
                                          todoId={todo.id}
                                          userId={user.id}
                                        />

                                        <div className="mt-3 pt-3 border-t">
                                          <TodoAttachmentUpload
                                            eventId={activity.eventId}
                                            todoId={todo.id}
                                            userId={user.id}
                                            userName={user.name}
                                            userEmail={user.email}
                                            onUploadComplete={() => {
                                              // Refresh attachment list secara otomatis
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}

                    {/* Rundown Section */}
                    {grouped.rundowns.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-lg">Rundown Kegiatan</h3>
                        </div>
                        <div className="space-y-2">
                          {grouped.rundowns.map((rundown, idx) => (
                            <Card key={idx} className="border-purple-200 bg-purple-50">
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <h4 className="font-semibold text-lg">{rundown.activity}</h4>
                                    <Badge variant="outline" className="text-purple-700">
                                      Penanggung Jawab
                                    </Badge>
                                  </div>

                                  {rundown.description && (
                                    <p className="text-sm text-gray-700">
                                      {rundown.description}
                                    </p>
                                  )}

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Clock className="w-4 h-4" />
                                      <span>
                                        {rundown.timeStart} - {rundown.timeEnd || 'Selesai'}
                                      </span>
                                    </div>

                                    {rundown.location && (
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{rundown.location}</span>
                                      </div>
                                    )}
                                  </div>

                                  {rundown.notes && (
                                    <div className="mt-2 p-2 bg-white rounded border border-purple-200">
                                      <p className="text-xs font-medium text-muted-foreground mb-1">
                                        Catatan:
                                      </p>
                                      <p className="text-sm text-gray-700">
                                        {rundown.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}