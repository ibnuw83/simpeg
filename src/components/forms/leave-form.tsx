'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cuti, Pengguna } from '@/lib/types';
import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import { getAuthenticatedUser } from '@/lib/data';

const formSchema = z.object({
  jenisCuti: z.enum(['Tahunan', 'Sakit', 'Penting', 'Melahirkan'], { required_error: 'Jenis cuti harus dipilih.' }),
  tanggalMulai: z.date({ required_error: 'Tanggal mulai harus diisi.' }),
  tanggalSelesai: z.date({ required_error: 'Tanggal selesai harus diisi.' }),
  keterangan: z.string().min(5, { message: 'Keterangan harus diisi.' }),
  status: z.enum(['Disetujui', 'Ditolak', 'Menunggu'], { required_error: 'Status harus dipilih.' }),
});

interface LeaveFormProps {
  onSave: (data: Partial<Cuti>) => void;
  leaveData?: Cuti | null;
  onCancel: () => void;
}

export function LeaveForm({ onSave, leaveData, onCancel }: LeaveFormProps) {
  const currentUser = getAuthenticatedUser();
  const isAdmin = currentUser?.role === 'Admin';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisCuti: undefined,
      keterangan: '',
      status: 'Menunggu',
    },
  });

  useEffect(() => {
    if (leaveData) {
      form.reset({
        ...leaveData,
        tanggalMulai: new Date(leaveData.tanggalMulai),
        tanggalSelesai: new Date(leaveData.tanggalSelesai),
      });
    } else {
      form.reset({
        jenisCuti: undefined,
        tanggalMulai: undefined,
        tanggalSelesai: undefined,
        keterangan: '',
        status: 'Menunggu',
      });
    }
  }, [leaveData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      tanggalMulai: format(values.tanggalMulai, 'yyyy-MM-dd'),
      tanggalSelesai: format(values.tanggalSelesai, 'yyyy-MM-dd'),
      status: isAdmin && leaveData ? values.status : 'Menunggu', // Only admin can change status on existing leave
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="jenisCuti"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Cuti</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis cuti" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Tahunan">Tahunan</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Penting">Penting</SelectItem>
                  <SelectItem value="Melahirkan">Melahirkan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tanggalMulai"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Mulai</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pilih tanggal</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalSelesai"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Selesai</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pilih tanggal</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea placeholder="Alasan pengajuan cuti..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Only show status field to Admins when they are editing an existing leave request */}
        {isAdmin && leaveData && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Menunggu">Menunggu</SelectItem>
                    <SelectItem value="Disetujui">Disetujui</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
