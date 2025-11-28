

// components/committee/CommitteeList.jsx - UPDATED with autocomplete
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { committeeSchema } from '@/lib/validations';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
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

export function CommitteeList({ 
  committees, 
  onAdd, 
  onUpdate, 
  onDelete,
  isLoading 
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const form = useForm({
    resolver: zodResolver(committeeSchema),
    defaultValues: {
      position_name: '',
      person_name: '',
      person_email: '',
      person_phone: '',
      responsibilities: ''
    }
  });

  const handleOpenDialog = (committee = null) => {
    if (committee) {
      setEditingId(committee.id);
      form.reset({
        position_name: committee.position_name,
        person_name: committee.person_name,
        person_email: committee.person_email || '',
        person_phone: committee.person_phone || '',
        responsibilities: committee.responsibilities || ''
      });
    } else {
      setEditingId(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editingId) {
      await onUpdate(editingId, data);
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
    // Auto-fill email ketika user dipilih
    if (user.email) {
      form.setValue('person_email', user.email);
    }
  };

  if (committees.length === 0) {
    return (
      <>
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Belum ada kepanitiaan</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Mulai dengan menambahkan anggota panitia pertama
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Button>
          </CardContent>
        </Card>

        {/* Dialog Form */}
        <CommitteeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          form={form}
          onSubmit={handleSubmit}
          onUserSelect={handleUserSelect}
          isEditing={!!editingId}
          isLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Struktur Kepanitiaan</CardTitle>
              <CardDescription>
                {committees.length} anggota panitia
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Tanggung Jawab</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {committees.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{member.position_name}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {member.person_name}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {member.person_email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">
                              {member.person_email}
                            </span>
                          </div>
                        )}
                        {member.person_phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{member.person_phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {member.responsibilities || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(member)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <CommitteeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        onSubmit={handleSubmit}
        onUserSelect={handleUserSelect}
        isEditing={!!editingId}
        isLoading={isLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Anggota Panitia?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data anggota panitia akan dihapus permanen.
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
function CommitteeDialog({ 
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
            {isEditing ? 'Edit Anggota Panitia' : 'Tambah Anggota Panitia'}
          </DialogTitle>
          <DialogDescription>
            Isi informasi anggota panitia. Field dengan tanda * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posisi *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ketua, Sekretaris, dll" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* UPDATED: User Combobox with Autocomplete */}
              <FormField
                control={form.control}
                name="person_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap *</FormLabel>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="person_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Auto-filled jika pilih dari user
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="person_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="08xxxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggung Jawab</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi tanggung jawab..."
                      rows={3}
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