// app/(dashboard)/events/[id]/todos/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ListTodo, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TodoBoard } from '@/app/dashboard/components/allevents/todos/TodoBoard';
import { EventAPI } from '@/lib/api-client';
import Link from 'next/link';
import { useAuth } from '@/lib/getUserClientSide';

export default function TodosPage() {
  const {user}=useAuth();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const { toast } = useToast();

  const [event, setEvent] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  useEffect(() => {
    loadData();
  }, [eventId]);

  useEffect(() => {
    applyFilters();
  }, [todos, filters]);

  async function loadData() {
    try {
      setLoading(true);
      const [eventRes, todosRes] = await Promise.all([
        EventAPI.getById(eventId),
        EventAPI.getTodos(eventId)
      ]);

      if (eventRes.success) setEvent(eventRes.data);
      if (todosRes.success) setTodos(todosRes.data);
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

  function applyFilters() {
    let filtered = [...todos];

    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    setFilteredTodos(filtered);
  }

  const handleAddTodo = async (data) => {
    const result = await EventAPI.addTodo(eventId, data,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Task berhasil ditambahkan",
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
    const result = await EventAPI.updateTodo(eventId, todoId, data,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Task berhasil diupdate",
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
    const result = await EventAPI.deleteTodo(eventId, todoId,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Task berhasil dihapus",
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
    const result = await EventAPI.updateTodoStatus(eventId, todoId, status,user);
    if (result.success) {
      toast({
        title: "Berhasil!",
        description: "Status berhasil diupdate",
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

  const clearFilters = () => {
    setFilters({ status: '', priority: '' });
  };

  // Calculate stats
  const stats = {
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    in_progress: todos.filter(t => t.status === 'in_progress').length,
    completed: todos.filter(t => t.status === 'completed').length,
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
  console.log(filteredTodos);
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

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <ListTodo className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Todo List</h1>
              <p className="text-muted-foreground">{event.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">{stats.pending}</div>
          <div className="text-sm text-blue-600">Pending</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-700">{stats.in_progress}</div>
          <div className="text-sm text-orange-600">Dikerjakan</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
          <div className="text-sm text-green-600">Selesai</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
          <div className="text-sm text-purple-600">Total Task</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select 
          value={filters.status} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Semua Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">Dikerjakan</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.priority} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Semua Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Semua Prioritas</SelectItem>
            <SelectItem value="low">Rendah</SelectItem>
            <SelectItem value="medium">Sedang</SelectItem>
            <SelectItem value="high">Tinggi</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {(filters.status || filters.priority) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Reset Filter
          </Button>
        )}

        <div className="ml-auto text-sm text-muted-foreground">
          Menampilkan {filteredTodos.length} dari {stats.total} task
        </div>
      </div>

      {/* Todo Board */}
      <TodoBoard
        todos={filteredTodos}
        onAdd={handleAddTodo}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
        onStatusChange={handleTodoStatusChange}
         eventId={eventId}  // Dari params atau state
          currentUser={user}  // Dari session/context
          isLoading={loading}
      />
    </div>
  );
}