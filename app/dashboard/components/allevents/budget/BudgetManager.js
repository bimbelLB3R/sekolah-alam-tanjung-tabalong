// components/budget/BudgetManager.jsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, formatRupiah } from '@/lib/validations';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Filter
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { isoToDateInputWITA } from '@/lib/formatDateIsoToInput';

// Kategori default (bisa disesuaikan)
const INCOME_CATEGORIES = [
  'Sponsor',
  'Donasi',
  'Tiket',
  'Registrasi',
  'Dana Sekolah',
  'Lainnya'
];

const EXPENSE_CATEGORIES = [
  'Konsumsi',
  'Transportasi',
  'Dekorasi',
  'Sewa Tempat',
  'Sound System',
  'Dokumentasi',
  'Sertifikat',
  'Souvenir',
  'Lainnya'
];

export function BudgetManager({ 
  budgets, 
  summary,
  onAdd, 
  onUpdate, 
  onDelete,
  isLoading 
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState(''); // '' | 'pemasukan' | 'pengeluaran'

  const form = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      type: 'pengeluaran',
      category: '',
      description: '',
      amount: '',
      date: '',
      notes: ''
    }
  });

  const handleOpenDialog = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      form.reset({
        type: budget.type,
        category: budget.category,
        description: budget.description || '',
        amount: budget.amount.toString(),
        date: isoToDateInputWITA(budget.date),
        notes: budget.notes || ''
      });
    } else {
      setEditingBudget(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editingBudget) {
      await onUpdate(editingBudget.id, data);
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

  const filteredBudgets = filter 
    ? budgets.filter(b => b.type === filter)
    : budgets;

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Pemasukan</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatRupiah(summary?.total_pemasukan || 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatRupiah(summary?.total_pengeluaran || 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(
          "border-2",
          (summary?.saldo || 0) >= 0 
            ? "bg-blue-50 border-blue-200" 
            : "bg-orange-50 border-orange-200"
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "text-sm font-medium",
                  (summary?.saldo || 0) >= 0 ? "text-blue-600" : "text-orange-600"
                )}>
                  Saldo
                </p>
                <p className={cn(
                  "text-2xl font-bold",
                  (summary?.saldo || 0) >= 0 ? "text-blue-700" : "text-orange-700"
                )}>
                  {formatRupiah(summary?.saldo || 0)}
                </p>
              </div>
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center",
                (summary?.saldo || 0) >= 0 ? "bg-blue-100" : "bg-orange-100"
              )}>
                <Wallet className={cn(
                  "h-6 w-6",
                  (summary?.saldo || 0) >= 0 ? "text-blue-600" : "text-orange-600"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={filter === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('')}
          >
            Semua ({budgets.length})
          </Button>
          <Button
            variant={filter === 'pemasukan' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pemasukan')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Pemasukan
          </Button>
          <Button
            variant={filter === 'pengeluaran' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pengeluaran')}
          >
            <TrendingDown className="h-4 w-4 mr-1" />
            Pengeluaran
          </Button>
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Item
        </Button>
      </div>

      {/* Table */}
      {filteredBudgets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Belum ada data anggaran</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Mulai dengan menambahkan pemasukan atau pengeluaran
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Tanggal</TableHead>
                  <TableHead className="w-[120px]">Tipe</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                  <TableHead className="text-right w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBudgets.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm">
                      {format(new Date(item.date), 'd MMM yy', { locale: idLocale })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.type === 'pemasukan' ? 'default' : 'destructive'}
                        className={cn(
                          item.type === 'pemasukan' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        )}
                      >
                        {item.type === 'pemasukan' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {item.type === 'pemasukan' ? 'Masuk' : 'Keluar'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="line-clamp-1">{item.description || '-'}</p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.notes}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatRupiah(item.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog Form */}
      <BudgetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        onSubmit={handleSubmit}
        isEditing={!!editingBudget}
        isLoading={isLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Item Anggaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen.
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

// Dialog Component
function BudgetDialog({ 
  open, 
  onOpenChange, 
  form, 
  onSubmit, 
  isEditing, 
  isLoading 
}) {
  const watchType = form.watch('type');
  const categories = watchType === 'pemasukan' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Item Anggaran' : 'Tambah Item Anggaran'}
          </DialogTitle>
          <DialogDescription>
            Isi detail anggaran. Field dengan tanda * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pemasukan">Pemasukan</SelectItem>
                        <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Sponsorship PT ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal (Rp) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5000000" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Tanpa titik atau koma
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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