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
import { Input } from '@/components/ui/input';
import { RiwayatDiklat } from '@/lib/types';
import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';

const formSchema = z.object({
  nama: z.string().min(3, { message: 'Nama diklat harus diisi.' }),
  penyelenggara: z.string().min(3, { message: 'Penyelenggara harus diisi.' }),
  tanggal: z.date({ required_error: 'Tanggal harus diisi.' }),
  jumlahJam: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive({ message: 'Jumlah jam harus angka positif.' })
  ),
});

interface TrainingFormProps {
  onSave: (data: Partial<RiwayatDiklat>) => void;
  trainingData?: RiwayatDiklat | null;
  onCancel: () => void;
}

export function TrainingForm({ onSave, trainingData, onCancel }: TrainingFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      penyelenggara: '',
      jumlahJam: 0,
    },
  });

  useEffect(() => {
    if (trainingData) {
      form.reset({
        ...trainingData,
        tanggal: new Date(trainingData.tanggal),
      });
    } else {
      form.reset({
        nama: '',
        penyelenggara: '',
        tanggal: undefined,
        jumlahJam: 0,
      });
    }
  }, [trainingData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      tanggal: format(values.tanggal, 'yyyy-MM-dd'),
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Diklat</FormLabel>
              <FormControl>
                <Input placeholder="cth: Diklat PIM IV" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="penyelenggara"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penyelenggara</FormLabel>
              <FormControl>
                <Input placeholder="cth: Lembaga Administrasi Negara" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="tanggal"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Tanggal</FormLabel>
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
                name="jumlahJam"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Jumlah Jam</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="cth: 72" {...field} onChange={e => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
