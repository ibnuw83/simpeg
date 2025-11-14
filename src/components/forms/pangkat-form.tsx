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
import { useEffect } from 'react';
import type { PangkatGolongan } from '@/lib/types';

const formSchema = z.object({
  pangkat: z.string().min(3, { message: 'Nama pangkat minimal 3 karakter.' }),
  golongan: z.string().min(3, { message: 'Nama golongan minimal 3 karakter.' }),
});

interface PangkatFormProps {
  onSave: (data: any) => void;
  pangkatData?: PangkatGolongan | null;
}

export function PangkatForm({ onSave, pangkatData }: PangkatFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pangkat: pangkatData?.pangkat || '',
      golongan: pangkatData?.golongan || '',
    },
  });

  useEffect(() => {
    form.reset({
        pangkat: pangkatData?.pangkat || '',
        golongan: pangkatData?.golongan || '',
    })
  }, [pangkatData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (pangkatData) {
      onSave({ id: pangkatData.id, ...values });
    } else {
      onSave(values);
    }
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pangkat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pangkat</FormLabel>
              <FormControl>
                <Input placeholder="cth: Penata Tingkat I" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="golongan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Golongan</FormLabel>
              <FormControl>
                <Input placeholder="cth: III/d" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
