
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { allData, updateAllData } from '@/lib/data';
import { useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const featureSchema = z.object({
  title: z.string().min(3, { message: 'Judul fitur minimal 3 karakter.' }),
  description: z.string().min(10, { message: 'Deskripsi fitur minimal 10 karakter.' }),
});

const formSchema = z.object({
  appName: z.string().min(3, { message: 'Nama aplikasi minimal 3 karakter.' }),
  logoUrl: z.string().url({ message: 'URL logo tidak valid.' }).or(z.literal('')),
  footerText: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  features: z.array(featureSchema).optional(),
});

export default function PengaturanPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: '',
      logoUrl: '',
      footerText: '',
      heroTitle: '',
      heroSubtitle: '',
      features: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "features"
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
            <h3 className="text-lg font-medium">Pengaturan Umum</h3>
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

            <Separator className="my-8" />
            <h3 className="text-lg font-medium">Halaman Utama</h3>
            
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Hero</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Teks utama di halaman depan..." {...field} />
                  </FormControl>
                   <FormDescription>
                    Anda bisa menggunakan tag &lt;br/&gt; untuk baris baru dan &lt;span class="text-primary"&gt;...&lt;/span&gt; untuk highlight.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-judul Hero</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Teks deskripsi di bawah judul utama..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator className="my-8" />
            <h3 className="text-lg font-medium">Pengaturan Fitur Unggulan</h3>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 rounded-md border p-4">
                  <h4 className="font-medium">Fitur #{index + 1}</h4>
                   <FormField
                    control={form.control}
                    name={`features.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Fitur</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`features.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Fitur</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>


            <div className="flex justify-end pt-4">
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
