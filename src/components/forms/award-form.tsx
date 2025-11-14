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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Penghargaan } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  nama: z.string().min(3, { message: 'Nama penghargaan harus diisi.' }),
  pemberi: z.string().min(2, { message: 'Pemberi penghargaan harus diisi.' }),
  tanggal: z.date({ required_error: 'Tanggal harus diisi.' }),
});

interface AwardFormProps {
  onSave: (data: any) => void;
  awardData?: Penghargaan | null;
}

export function AwardForm({ onSave, awardData }: AwardFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      pemberi: '',
    },
  });
  
  useEffect(() => {
    if (awardData) {
        form.reset({
            nama: awardData.nama,
            pemberi: awardData.pemberi,
            tanggal: new Date(awardData.tanggal),
        });
    } else {
        form.reset({
            nama: '',
            pemberi: '',
            tanggal: undefined,
        });
    }
  }, [awardData, form]);

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
              <FormLabel>Nama Penghargaan</FormLabel>
              <FormControl>
                <Input placeholder="cth: Satyalancana Karya Satya" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pemberi"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Pemberi Penghargaan</FormLabel>
                <FormControl>
                    <Input placeholder="cth: Presiden RI" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
            <FormItem className="flex flex-col">
                <FormLabel>Tanggal Diberikan</FormLabel>
                <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                    <Button
                        variant={'outline'}
                        className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                        )}
                    >
                        {field.value ? (
                        format(field.value, 'PPP')
                        ) : (
                        <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown-buttons"
                    fromYear={new Date().getFullYear() - 40}
                    toYear={new Date().getFullYear()}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
