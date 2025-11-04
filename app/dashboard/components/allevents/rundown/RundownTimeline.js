// // components/rundown/RundownTimeline.jsx
// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { rundownSchema } from '@/lib/validations';
// import { 
//   Plus, 
//   Edit2, 
//   Trash2, 
//   Clock,
//   MapPin,
//   User,
//   FileText
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from '@/components/ui/form';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';

// export function RundownTimeline({ 
//   rundowns, 
//   onAdd, 
//   onUpdate, 
//   onDelete,
//   isLoading 
// }) {
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingRundown, setEditingRundown] = useState(null);
//   const [deleteId, setDeleteId] = useState(null);

//   const form = useForm({
//     resolver: zodResolver(rundownSchema),
//     defaultValues: {
//       time_start: '',
//       time_end: '',
//       activity: '',
//       description: '',
//       person_in_charge: '',
//       location: '',
//       notes: ''
//     }
//   });

//   const handleOpenDialog = (rundown = null) => {
//     if (rundown) {
//       setEditingRundown(rundown);
//       form.reset({
//         time_start: rundown.time_start?.slice(0, 5) || '', // HH:MM
//         time_end: rundown.time_end?.slice(0, 5) || '',
//         activity: rundown.activity,
//         description: rundown.description || '',
//         person_in_charge: rundown.person_in_charge || '',
//         location: rundown.location || '',
//         notes: rundown.notes || ''
//       });
//     } else {
//       setEditingRundown(null);
//       form.reset();
//     }
//     setDialogOpen(true);
//   };

//   const handleSubmit = async (data) => {
//     if (editingRundown) {
//       await onUpdate(editingRundown.id, data);
//     } else {
//       await onAdd(data);
//     }
//     setDialogOpen(false);
//     form.reset();
//   };

//   const handleDelete = async () => {
//     if (deleteId) {
//       await onDelete(deleteId);
//       setDeleteId(null);
//     }
//   };

//   const calculateDuration = (start, end) => {
//     if (!start || !end) return null;
//     const [startH, startM] = start.split(':').map(Number);
//     const [endH, endM] = end.split(':').map(Number);
//     const diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
//     const hours = Math.floor(diffMinutes / 60);
//     const minutes = diffMinutes % 60;
//     if (hours > 0 && minutes > 0) return `${hours}j ${minutes}m`;
//     if (hours > 0) return `${hours} jam`;
//     return `${minutes} menit`;
//   };

//   if (rundowns.length === 0) {
//     return (
//       <>
//         <Card>
//           <CardContent className="text-center py-12">
//             <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//             <p className="text-lg font-medium">Belum ada rundown</p>
//             <p className="text-sm text-muted-foreground mt-1 mb-4">
//               Mulai dengan menambahkan agenda pertama
//             </p>
//             <Button onClick={() => handleOpenDialog()}>
//               <Plus className="mr-2 h-4 w-4" />
//               Tambah Agenda
//             </Button>
//           </CardContent>
//         </Card>

//         <RundownDialog
//           open={dialogOpen}
//           onOpenChange={setDialogOpen}
//           form={form}
//           onSubmit={handleSubmit}
//           isEditing={!!editingRundown}
//           isLoading={isLoading}
//         />
//       </>
//     );
//   }

//   return (
//     <>
//       <div className="mb-4 flex justify-between items-center">
//         <div>
//           <h3 className="text-lg font-semibold">Rundown Acara</h3>
//           <p className="text-sm text-muted-foreground">
//             {rundowns.length} agenda
//           </p>
//         </div>
//         <Button onClick={() => handleOpenDialog()}>
//           <Plus className="mr-2 h-4 w-4" />
//           Tambah Agenda
//         </Button>
//       </div>

//       {/* Timeline */}
//       <div className="space-y-4">
//         {rundowns.map((item, index) => {
//           const duration = calculateDuration(item.time_start, item.time_end);
          
//           return (
//             <div key={item.id} className="relative">
//               {/* Timeline Line */}
//               {index !== rundowns.length - 1 && (
//                 <div className="absolute left-[47px] top-16 bottom-0 w-0.5 bg-border" />
//               )}

//               <Card className="relative hover:shadow-md transition-shadow">
//                 <CardContent className="p-4">
//                   <div className="flex gap-4">
//                     {/* Time Badge */}
//                     <div className="flex-shrink-0 w-24">
//                       <div className="relative">
//                         <Badge 
//                           variant="outline" 
//                           className="w-full justify-center py-2 font-mono text-sm bg-primary/10"
//                         >
//                           {item.time_start?.slice(0, 5)}
//                         </Badge>
//                         {item.time_end && (
//                           <>
//                             <div className="text-center text-xs text-muted-foreground my-1">
//                               ↓
//                             </div>
//                             <Badge 
//                               variant="outline" 
//                               className="w-full justify-center py-2 font-mono text-sm"
//                             >
//                               {item.time_end?.slice(0, 5)}
//                             </Badge>
//                           </>
//                         )}
//                         {duration && (
//                           <p className="text-xs text-center text-muted-foreground mt-1">
//                             {duration}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2 mb-2">
//                         <h4 className="font-semibold text-base">
//                           {item.activity}
//                         </h4>
//                         <div className="flex gap-1">
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => handleOpenDialog(item)}
//                           >
//                             <Edit2 className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => setDeleteId(item.id)}
//                           >
//                             <Trash2 className="h-4 w-4 text-destructive" />
//                           </Button>
//                         </div>
//                       </div>

//                       {item.description && (
//                         <p className="text-sm text-muted-foreground mb-3">
//                           {item.description}
//                         </p>
//                       )}

//                       <div className="flex flex-wrap gap-4 text-sm">
//                         {item.person_in_charge && (
//                           <div className="flex items-center gap-1 text-muted-foreground">
//                             <User className="h-4 w-4" />
//                             <span>{item.person_in_charge}</span>
//                           </div>
//                         )}
//                         {item.location && (
//                           <div className="flex items-center gap-1 text-muted-foreground">
//                             <MapPin className="h-4 w-4" />
//                             <span>{item.location}</span>
//                           </div>
//                         )}
//                       </div>

//                       {item.notes && (
//                         <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
//                           <div className="flex items-start gap-1">
//                             <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
//                             <span className="text-muted-foreground">{item.notes}</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           );
//         })}
//       </div>

//       {/* Dialog Form */}
//       <RundownDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         form={form}
//         onSubmit={handleSubmit}
//         isEditing={!!editingRundown}
//         isLoading={isLoading}
//       />

//       {/* Delete Confirmation */}
//       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Hapus Agenda?</AlertDialogTitle>
//             <AlertDialogDescription>
//               Tindakan ini tidak dapat dibatalkan. Agenda akan dihapus permanen.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Batal</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>
//               Hapus
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

// // Dialog Component
// function RundownDialog({ 
//   open, 
//   onOpenChange, 
//   form, 
//   onSubmit, 
//   isEditing, 
//   isLoading 
// }) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isEditing ? 'Edit Agenda' : 'Tambah Agenda'}
//           </DialogTitle>
//           <DialogDescription>
//             Isi detail agenda acara. Field dengan tanda * wajib diisi.
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="time_start"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Waktu Mulai *</FormLabel>
//                     <FormControl>
//                       <Input type="time" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="time_end"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Waktu Selesai</FormLabel>
//                     <FormControl>
//                       <Input type="time" {...field} />
//                     </FormControl>
//                     <FormDescription className="text-xs">
//                       Opsional, untuk durasi acara
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="activity"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Nama Aktivitas *</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Contoh: Registrasi peserta" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Deskripsi</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Detail aktivitas..."
//                       rows={2}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="person_in_charge"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Penanggung Jawab</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Nama PIC" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="location"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Lokasi</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Tempat kegiatan" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="notes"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Catatan</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Catatan tambahan..."
//                       rows={2}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//                 disabled={isLoading}
//               >
//                 Batal
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading ? 'Menyimpan...' : isEditing ? 'Update' : 'Tambah'}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// components/rundown/RundownTimeline.jsx - UPDATED with autocomplete
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rundownSchema } from '@/lib/validations';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Clock,
  MapPin,
  User,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
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
import { Badge } from '@/components/ui/badge';
import { UserCombobox } from '@/components/ui/user-combobox';
import { cn } from '@/lib/utils';

export function RundownTimeline({ 
  rundowns, 
  onAdd, 
  onUpdate, 
  onDelete,
  isLoading 
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRundown, setEditingRundown] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const form = useForm({
    resolver: zodResolver(rundownSchema),
    defaultValues: {
      time_start: '',
      time_end: '',
      activity: '',
      description: '',
      person_in_charge: '',
      location: '',
      notes: ''
    }
  });

  const handleOpenDialog = (rundown = null) => {
    if (rundown) {
      setEditingRundown(rundown);
      form.reset({
        time_start: rundown.time_start?.slice(0, 5) || '', // HH:MM
        time_end: rundown.time_end?.slice(0, 5) || '',
        activity: rundown.activity,
        description: rundown.description || '',
        person_in_charge: rundown.person_in_charge || '',
        location: rundown.location || '',
        notes: rundown.notes || ''
      });
    } else {
      setEditingRundown(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editingRundown) {
      await onUpdate(editingRundown.id, data);
    } else {
      await onAdd(data);
    }
    setDialogOpen(false);
    form.reset();
  };

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  // Handler ketika user dipilih dari combobox
  const handleUserSelect = (user) => {
    // person_in_charge sudah otomatis ter-set dari UserCombobox
    // Bisa tambah logic lain jika perlu
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return null;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (hours > 0 && minutes > 0) return `${hours}j ${minutes}m`;
    if (hours > 0) return `${hours} jam`;
    return `${minutes} menit`;
  };

  if (rundowns.length === 0) {
    return (
      <>
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Belum ada rundown</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Mulai dengan menambahkan agenda pertama
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Agenda
            </Button>
          </CardContent>
        </Card>

        <RundownDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          form={form}
          onSubmit={handleSubmit}
          onUserSelect={handleUserSelect}
          isEditing={!!editingRundown}
          isLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Rundown Acara</h3>
          <p className="text-sm text-muted-foreground">
            {rundowns.length} agenda
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Agenda
        </Button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {rundowns.map((item, index) => {
          const duration = calculateDuration(item.time_start, item.time_end);
          
          return (
            <div key={item.id} className="relative">
              {/* Timeline Line */}
              {index !== rundowns.length - 1 && (
                <div className="absolute left-[47px] top-16 bottom-0 w-0.5 bg-border" />
              )}

              <Card className="relative hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Time Badge */}
                    <div className="flex-shrink-0 w-24">
                      <div className="relative">
                        <Badge 
                          variant="outline" 
                          className="w-full justify-center py-2 font-mono text-sm bg-primary/10"
                        >
                          {item.time_start?.slice(0, 5)}
                        </Badge>
                        {item.time_end && (
                          <>
                            <div className="text-center text-xs text-muted-foreground my-1">
                              ↓
                            </div>
                            <Badge 
                              variant="outline" 
                              className="w-full justify-center py-2 font-mono text-sm"
                            >
                              {item.time_end?.slice(0, 5)}
                            </Badge>
                          </>
                        )}
                        {duration && (
                          <p className="text-xs text-center text-muted-foreground mt-1">
                            {duration}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-base">
                          {item.activity}
                        </h4>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        {item.person_in_charge && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{item.person_in_charge}</span>
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>

                      {item.notes && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                          <div className="flex items-start gap-1">
                            <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Dialog Form */}
      <RundownDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        onSubmit={handleSubmit}
        onUserSelect={handleUserSelect}
        isEditing={!!editingRundown}
        isLoading={isLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Agenda?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Agenda akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Dialog Component - UPDATED with UserCombobox
function RundownDialog({ 
  open, 
  onOpenChange, 
  form, 
  onSubmit, 
  onUserSelect,
  isEditing, 
  isLoading 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Agenda' : 'Tambah Agenda'}
          </DialogTitle>
          <DialogDescription>
            Isi detail agenda acara. Field dengan tanda * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="time_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Mulai *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Selesai</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Opsional, untuk durasi acara
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Aktivitas *</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Registrasi peserta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detail aktivitas..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* UPDATED: User Combobox with Autocomplete */}
              <FormField
                control={form.control}
                name="person_in_charge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penanggung Jawab</FormLabel>
                    <FormControl>
                      <UserCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        onUserSelect={onUserSelect}
                        placeholder="Pilih atau ketik nama..."
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Pilih dari daftar user atau ketik manual
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Tempat kegiatan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Catatan tambahan..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Menyimpan...' : isEditing ? 'Update' : 'Tambah'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}