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

const formSchema = z.object({
  nama: z.string().min(3, { message: 'Nama departemen minimal 3 karakter.' }),
});

interface DepartmentFormProps {
  onSave: (data: any) => void;
  departmentData?: { id: string; nama: string } | null;
}

export function DepartmentForm({ onSave, departmentData }: DepartmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: departmentData?.nama || '',
    },
  });

  useEffect(() => {
    form.reset({
        nama: departmentData?.nama || '',
    })
  }, [departmentData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (departmentData) {
      onSave({ id: departmentData.id, ...values });
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
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Departemen</FormLabel>
              <FormControl>
                <Input placeholder="cth: Badan Perencanaan" {...field} />
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
