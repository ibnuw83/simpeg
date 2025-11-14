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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RiwayatPendidikan } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  jenjang: z.string().min(2, { message: 'Jenjang harus dipilih.' }),
  institusi: z.string().min(3, { message: 'Nama institusi harus diisi.' }),
  jurusan: z.string().min(3, { message: 'Jurusan harus diisi.' }),
  tahunLulus: z.string().length(4, { message: 'Tahun harus 4 digit.' }),
});

interface EducationFormProps {
  onSave: (data: RiwayatPendidikan) => void;
  educationData?: RiwayatPendidikan | null;
  onCancel: () => void;
}

export function EducationForm({ onSave, educationData, onCancel }: EducationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenjang: '',
      institusi: '',
      jurusan: '',
      tahunLulus: '',
    },
  });

  useEffect(() => {
    if (educationData) {
      form.reset(educationData);
    } else {
      form.reset({
        jenjang: '',
        institusi: '',
        jurusan: '',
        tahunLulus: '',
      });
    }
  }, [educationData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values as RiwayatPendidikan);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="jenjang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenjang Pendidikan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenjang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                  <SelectItem value="D3">D3</SelectItem>
                  <SelectItem value="S1">S1</SelectItem>
                  <SelectItem value="S2">S2</SelectItem>
                  <SelectItem value="S3">S3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="institusi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Institusi</FormLabel>
              <FormControl>
                <Input placeholder="cth: Universitas Gadjah Mada" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jurusan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jurusan</FormLabel>
              <FormControl>
                <Input placeholder="cth: Ilmu Komputer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tahunLulus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Lulus</FormLabel>
              <FormControl>
                <Input type="number" placeholder="cth: 2010" {...field} />
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
