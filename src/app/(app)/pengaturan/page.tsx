'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { allData, updateAllData } from '@/lib/data';
import type { AppSettings } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  appName: z.string().min(3, { message: 'Nama aplikasi minimal 3 karakter.' }),
  logoUrl: z.string().url({ message: 'URL logo tidak valid.' }).or(z.literal('')),
  footerText: z.string().optional(),
});

export default function PengaturanPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: '',
      logoUrl: '',
      footerText: '',
    },
  });

  useEffect(() => {
    // Load settings from localStorage when component mounts
    const settings = allData().appSettings;
    if (settings) {
      form.reset(settings);
    }
  }, [form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const currentData = allData();
      const updatedData = { ...currentData, appSettings: values };
      updateAllData(updatedData);
      toast({
        title: 'Pengaturan Disimpan',
        description: 'Perubahan Anda telah berhasil disimpan. Beberapa perubahan mungkin memerlukan refresh halaman.',
      });
      // Optionally force a reload to see all changes immediately
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan pengaturan.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Aplikasi</CardTitle>
        <CardDescription>Kelola pengaturan global untuk branding dan tampilan aplikasi.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Aplikasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Simpeg Smart" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Logo</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormDescription>
                    Masukkan URL gambar untuk logo. Biarkan kosong untuk menggunakan logo default.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footerText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Footer Sidebar</FormLabel>
                  <FormControl>
                    <Input placeholder="© 2024 Nama Instansi" {...field} />
                  </FormControl>
                   <FormDescription>
                    Teks ini akan muncul di bagian bawah sidebar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
