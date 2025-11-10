// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useToast } from '@/hooks/use-toast';
// import { 
//   Calendar, 
//   CheckCircle2, 
//   Clock, 
//   Users, 
//   ListTodo, 
//   ClipboardList,
//   AlertCircle,
//   XCircle 
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { id } from 'date-fns/locale';

// export default function MyActivitiesPage() {
//   const [user, setUser] = useState(null);
//   const [mounted, setMounted] = useState(false);
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const { toast } = useToast();

//   console.log(activities)

//   // Fetch user data
//   useEffect(() => {
//     setMounted(true);

//     const fetchUser = async () => {
//       try {
//         const res = await fetch("/api/me", {
//           credentials: "include",
//           cache: "no-store",
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data);
//         } else {
//           const err = await res.json();
//           console.error("API error:", err);
//           toast({
//             variant: 'destructive',
//             title: 'Error',
//             description: 'Gagal memuat data user',
//           });
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         toast({
//           variant: 'destructive',
//           title: 'Error',
//           description: 'Gagal memuat data user',
//         });
//       }
//     };

//     fetchUser();
//   }, []);

//   // Fetch activities setelah user tersedia
//   useEffect(() => {
//     if (user?.id) {
//       fetchActivities();
//     }
//   }, [user]);

//   const fetchActivities = async () => {
//     if (!user?.id) return;

//     try {
//       setLoading(true);
      
//       const response = await fetch(`/api/users/activities?userId=${user.id}`, {
//         credentials: "include",
//         cache: "no-store",
//       });
      
//       const result = await response.json();

//       if (result.success) {
//         setActivities(result.data);
//       } else {
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error('Fetch activities error:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Gagal memuat data aktivitas',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       planning: { variant: 'secondary', icon: Clock, label: 'Perencanaan' },
//       ongoing: { variant: 'default', icon: AlertCircle, label: 'Berlangsung' },
//       completed: { variant: 'success', icon: CheckCircle2, label: 'Selesai' },
//       cancelled: { variant: 'destructive', icon: XCircle, label: 'Dibatalkan' }
//     };

//     const config = statusConfig[status] || statusConfig.planning;
//     const Icon = config.icon;

//     return (
//       <Badge variant={config.variant} className="flex items-center gap-1">
//         <Icon className="w-3 h-3" />
//         {config.label}
//       </Badge>
//     );
//   };

//   const getInvolvementIcon = (type) => {
//     switch (type) {
//       case 'committee':
//         return <Users className="w-4 h-4" />;
//       case 'todo':
//         return <ListTodo className="w-4 h-4" />;
//       case 'rundown':
//         return <ClipboardList className="w-4 h-4" />;
//       default:
//         return null;
//     }
//   };

//   const filteredActivities = activities.filter(activity => {
//     if (filter === 'all') return true;
//     return activity.eventStatus === filter;
//   });

//   const stats = {
//     total: activities.length,
//     planning: activities.filter(a => a.eventStatus === 'planning').length,
//     ongoing: activities.filter(a => a.eventStatus === 'ongoing').length,
//     completed: activities.filter(a => a.eventStatus === 'completed').length,
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 space-y-6">
//         <Skeleton className="h-12 w-64" />
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map(i => (
//             <Skeleton key={i} className="h-24" />
//           ))}
//         </div>
//         <Skeleton className="h-96" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Aktivitas Saya</h1>
//         <p className="text-muted-foreground mt-2">
//           Riwayat keterlibatan Anda dalam berbagai kegiatan
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Total Kegiatan
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.total}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Perencanaan
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-slate-600">{stats.planning}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Berlangsung
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">{stats.ongoing}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Selesai
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filter Tabs */}
//       <Tabs value={filter} onValueChange={setFilter} className="w-full">
//         <TabsList>
//           <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
//           <TabsTrigger value="planning">Perencanaan ({stats.planning})</TabsTrigger>
//           <TabsTrigger value="ongoing">Berlangsung ({stats.ongoing})</TabsTrigger>
//           <TabsTrigger value="completed">Selesai ({stats.completed})</TabsTrigger>
//         </TabsList>

//         <TabsContent value={filter} className="space-y-4 mt-6">
//           {filteredActivities.length === 0 ? (
//             <Card>
//               <CardContent className="flex flex-col items-center justify-center py-12">
//                 <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
//                 <p className="text-muted-foreground">
//                   Tidak ada kegiatan dengan status ini
//                 </p>
//               </CardContent>
//             </Card>
//           ) : (
//             filteredActivities.map((activity) => (
//               <Card key={activity.eventId} className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-1 flex-1">
//                       <CardTitle className="text-xl">{activity.eventName}</CardTitle>
//                       <CardDescription className="line-clamp-2">
//                         {activity.eventDescription}
//                       </CardDescription>
//                     </div>
//                     {getStatusBadge(activity.eventStatus)}
//                   </div>
//                 </CardHeader>
                
//                 <CardContent className="space-y-4">
//                   {/* Tanggal */}
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Calendar className="w-4 h-4" />
//                     <span>
//                       {activity.startDate && format(new Date(activity.startDate), 'dd MMM yyyy', { locale: id })}
//                       {activity.endDate && ` - ${format(new Date(activity.endDate), 'dd MMM yyyy', { locale: id })}`}
//                     </span>
//                   </div>

//                   {/* Keterlibatan */}
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">Keterlibatan:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {activity.involvements.map((involvement, idx) => (
//                         <Badge key={idx} variant="outline" className="flex items-center gap-1">
//                           {getInvolvementIcon(involvement.type)}
//                           {involvement.type === 'committee' && (
//                             <span>{involvement.positionName}</span>
//                           )}
//                           {involvement.type === 'todo' && (
//                             <span>{involvement.count} Tugas</span>
//                           )}
//                           {involvement.type === 'rundown' && (
//                             <span>{involvement.count} Rundown</span>
//                           )}
//                         </Badge>
//                       ))}
//                     </div>

//                     {/* Detail Committee */}
//                     {activity.involvements
//                       .filter(i => i.type === 'committee' && i.responsibilities)
//                       .map((involvement, idx) => (
//                         <div key={idx} className="mt-2 p-3 bg-muted rounded-lg">
//                           <p className="text-xs font-medium mb-1">Tanggung Jawab:</p>
//                           <p className="text-xs text-muted-foreground">
//                             {involvement.responsibilities}
//                           </p>
//                         </div>
//                       ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  ListTodo, 
  ClipboardList,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function MyActivitiesPage() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
console.log(user)
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

  const getInvolvementIcon = (type) => {
    switch (type) {
      case 'committee':
        return <Users className="w-4 h-4" />;
      case 'todo':
        return <ListTodo className="w-4 h-4" />;
      case 'rundown':
        return <ClipboardList className="w-4 h-4" />;
      default:
        return null;
    }
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

  // Loading state saat fetch user atau activities
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
            filteredActivities.map((activity) => (
              <Card key={activity.eventId} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl">{activity.eventName}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {activity.eventDescription}
                      </CardDescription>
                    </div>
                    {getStatusBadge(activity.eventStatus)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tanggal */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {activity.startDate && format(new Date(activity.startDate), 'dd MMM yyyy', { locale: id })}
                      {activity.endDate && ` - ${format(new Date(activity.endDate), 'dd MMM yyyy', { locale: id })}`}
                    </span>
                  </div>

                  {/* Keterlibatan */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Keterlibatan:</p>
                    <div className="flex flex-wrap gap-2">
                      {activity.involvements.map((involvement, idx) => (
                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                          {getInvolvementIcon(involvement.type)}
                          {involvement.type === 'committee' && (
                            <span>{involvement.positionName}</span>
                          )}
                          {involvement.type === 'todo' && (
                            <span>{involvement.title}</span>
                          )}
                          {involvement.type === 'rundown' && (
                            <span>{involvement.count} </span>
                          )}
                        </Badge>
                      ))}
                    </div>

                    {/* Detail Committee */}
                    {activity.involvements
                      .filter(i => i.type === 'committee' && i.responsibilities)
                      .map((involvement, idx) => (
                        <div key={idx} className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-xs font-medium mb-1">Tanggung Jawab:</p>
                          <p className="text-xs text-muted-foreground">
                            {involvement.responsibilities}
                          </p>
                        </div>
                      ))}

                      {/* Detail todo */}
                    {activity.involvements
                      .filter(i => i.type === 'todo' && i.description)
                      .map((involvement, idx) => (
                        <div key={idx} className="mt-2 p-3 bg-muted rounded-lg">
                          {/* <p className="text-xs font-medium mb-1">Tanggung Jawab:</p> */}
                          <p className="text-xs text-muted-foreground">
                            {involvement.description}
                          </p>
                          {/* Status (jika ada) */}
        {involvement.status && (
          <span className="text-xs text-muted-foreground ml-1">
            ({involvement.status})
          </span>
        )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}