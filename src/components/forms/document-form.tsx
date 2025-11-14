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
import { Dokumen } from '@/lib/types';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  namaDokumen: z.string().min(3, { message: 'Nama dokumen harus diisi.' }),
  jenisDokumen: z.enum(['Kontrak', 'Sertifikat', 'SK', 'Lainnya'], { required_error: 'Jenis dokumen harus dipilih.' }),
  dokumenFile: z.any().optional(),
});

interface DocumentFormProps {
  onSave: (data: Partial<Dokumen>) => void;
  documentData?: Dokumen | null;
  onCancel: () => void;
}

export function DocumentForm({ onSave, documentData, onCancel }: DocumentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaDokumen: '',
      jenisDokumen: undefined,
    },
  });

  useEffect(() => {
    if (documentData) {
      form.reset({
        namaDokumen: documentData.namaDokumen,
        jenisDokumen: documentData.jenisDokumen,
      });
    } else {
      form.reset({
        namaDokumen: '',
        jenisDokumen: undefined,
      });
    }
  }, [documentData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      tanggalUnggah: format(new Date(), 'yyyy-MM-dd'),
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="namaDokumen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Dokumen</FormLabel>
              <FormControl>
                <Input placeholder="cth: SK Kenaikan Pangkat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jenisDokumen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Dokumen</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SK">SK</SelectItem>
                  <SelectItem value="Sertifikat">Sertifikat</SelectItem>
                  <SelectItem value="Kontrak">Kontrak</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="dokumenFile"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Unggah File</FormLabel>
                    <FormControl>
                       <div className="relative">
                            <Input 
                                type="file" 
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" 
                                onChange={(e) => field.onChange(e.target.files)}
                            />
                            <Button type="button" variant="outline" className="w-full pointer-events-none">
                                <Upload className="mr-2 h-4 w-4" />
                                {field.value?.[0]?.name || 'Pilih file...'}
                            </Button>
                        </div>
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
