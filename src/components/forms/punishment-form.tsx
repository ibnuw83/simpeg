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
import { Hukuman } from '@/lib/types';
import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  jenis: z.enum(['Ringan', 'Sedang', 'Berat'], { required_error: 'Jenis hukuman harus dipilih.' }),
  tanggal: z.date({ required_error: 'Tanggal harus diisi.' }),
  keterangan: z.string().min(5, { message: 'Keterangan harus diisi.' }),
});

interface PunishmentFormProps {
  onSave: (data: Partial<Hukuman>) => void;
  punishmentData?: Hukuman | null;
  onCancel: () => void;
}

export function PunishmentForm({ onSave, punishmentData, onCancel }: PunishmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenis: undefined,
      keterangan: '',
    },
  });

  useEffect(() => {
    if (punishmentData) {
      form.reset({
        ...punishmentData,
        tanggal: new Date(punishmentData.tanggal),
      });
    } else {
      form.reset({
        jenis: undefined,
        tanggal: undefined,
        keterangan: '',
      });
    }
  }, [punishmentData, form]);

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
          name="jenis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Hukuman</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis hukuman" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ringan">Ringan</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Berat">Berat</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea placeholder="Detail mengenai hukuman..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
