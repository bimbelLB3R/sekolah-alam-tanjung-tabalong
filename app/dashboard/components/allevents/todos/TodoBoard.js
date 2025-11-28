

// components/todos/TodoBoard.jsx - UPDATED with autocomplete
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema } from '@/lib/validations';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { UserCombobox } from '@/components/ui/user-combobox';
import { format, isPast } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const priorityConfig = {
  low: { label: 'Rendah', color: 'bg-gray-100 text-gray-700', icon: Circle },
  medium: { label: 'Sedang', color: 'bg-blue-100 text-blue-700', icon: Circle },
  high: { label: 'Tinggi', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700', icon: AlertCircle }
};

const statusColumns = [
  { id: 'pending', label: 'Pending', color: 'bg-gray-50 border-gray-200' },
  { id: 'in_progress', label: 'Dikerjakan', color: 'bg-blue-50 border-blue-200' },
  { id: 'completed', label: 'Selesai', color: 'bg-green-50 border-green-200' }
];

export function TodoBoard({ 
  todos, 
  onAdd, 
  onUpdate, 
  onDelete,
  onStatusChange,
  isLoading 
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      assigned_to: '',
      status: 'pending',
      priority: 'medium',
      deadline: ''
    }
  });

  const handleOpenDialog = (todo = null) => {
    if (todo) {
      setEditingTodo(todo);
      form.reset({
        title: todo.title,
        description: todo.description || '',
        assigned_to: todo.assigned_to || '',
        status: todo.status,
        priority: todo.priority,
        deadline: todo.deadline || ''
      });
    } else {
      setEditingTodo(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editingTodo) {
      await onUpdate(editingTodo.id, data);
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

  const handleQuickStatusChange = async (todoId, newStatus) => {
    await onStatusChange(todoId, newStatus);
  };

  // Handler ketika user dipilih dari combobox
  const handleUserSelect = (user) => {
    // assigned_to sudah otomatis ter-set dari UserCombobox
    // Bisa tambah logic lain jika perlu
  };

  const groupedTodos = statusColumns.map(column => ({
    ...column,
    todos: todos.filter(t => t.status === column.id)
  }));

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Todo List</h3>
          <p className="text-sm text-muted-foreground">
            {todos.length} task total
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groupedTodos.map(column => (
          <div key={column.id} className="space-y-3">
            <div className={cn(
              "rounded-lg p-3 border-2",
              column.color
            )}>
              <h4 className="font-semibold flex items-center justify-between">
                {column.label}
                <Badge variant="secondary">{column.todos.length}</Badge>
              </h4>
            </div>

            <div className="space-y-3">
              {column.todos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Tidak ada task
                </div>
              ) : (
                column.todos.map(todo => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onEdit={() => handleOpenDialog(todo)}
                    onDelete={() => setDeleteId(todo.id)}
                    onStatusChange={handleQuickStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Form */}
      <TodoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        onSubmit={handleSubmit}
        onUserSelect={handleUserSelect}
        isEditing={!!editingTodo}
        isLoading={isLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Task akan dihapus permanen.
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

// Todo Card Component
function TodoCard({ todo, onEdit, onDelete, onStatusChange }) {
  const priority = priorityConfig[todo.priority];
  const PriorityIcon = priority.icon;
  const isOverdue = todo.deadline && isPast(new Date(todo.deadline)) && todo.status !== 'completed';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h5 className="font-medium text-sm flex-1 line-clamp-2">
            {todo.title}
          </h5>
          <Badge className={priority.color} variant="secondary">
            <PriorityIcon className="h-3 w-3 mr-1" />
            {priority.label}
          </Badge>
        </div>

        {/* Description */}
        {todo.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {todo.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="space-y-1">
          {todo.assigned_to && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{todo.assigned_to}</span>
            </div>
          )}
          {todo.deadline && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(todo.deadline), 'd MMM yyyy', { locale: idLocale })}
              </span>
              {isOverdue && <span>(Terlewat)</span>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {todo.status !== 'completed' && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => onStatusChange(todo.id, 
                todo.status === 'pending' ? 'in_progress' : 'completed'
              )}
            >
              {todo.status === 'pending' ? (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Kerjakan
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Selesai
                </>
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Dialog Component - UPDATED with UserCombobox
function TodoDialog({ 
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Task' : 'Tambah Task'}
          </DialogTitle>
          <DialogDescription>
            Isi detail task. Field dengan tanda * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Task *</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Booking tempat acara" {...field} />
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
                      placeholder="Detail task..."
                      rows={3}
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
                name="assigned_to"
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
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">Dikerjakan</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioritas *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Rendah</SelectItem>
                        <SelectItem value="medium">Sedang</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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