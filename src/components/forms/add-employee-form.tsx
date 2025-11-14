
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Pegawai } from '@/lib/types';
import { allData } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus diisi, minimal 2 karakter.' }),
  nip: z.string().min(10, { message: 'NIP harus diisi, minimal 10 digit.' }),
  jabatan: z.string().min(2, { message: 'Jabatan harus diisi.' }),
  departemen: z.string().min(2, { message: 'Departemen harus dipilih.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  phone: z.string().min(10, { message: 'Nomor telepon minimal 10 digit.' }),
  tanggalLahir: z.date({ required_error: 'Tanggal lahir harus diisi.' }),
  tanggalMasuk: z.date({ required_error: 'Tanggal masuk harus diisi.' }),
  pangkat: z.string().min(2, { message: 'Pangkat harus diisi.' }),
  golongan: z.string().min(2, { message: 'Golongan harus diisi.' }),
  status: z.enum(['Aktif', 'Cuti', 'Pensiun']),
  alamat: z.string().min(5, { message: 'Alamat harus diisi.' }),
});

interface AddEmployeeFormProps {
  onSave: (employee: Pegawai) => void;
}

export function AddEmployeeForm({ onSave }: AddEmployeeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      nip: '',
      jabatan: '',
      email: '',
      phone: '',
      pangkat: '',
      golongan: '',
      status: 'Aktif',
      alamat: '',
    },
  });

  const uniqueDepartments = [...new Set(allData().pegawai.map(p => p.departemen))];
  const uniquePangkat = [...new Set(allData().pegawai.map(p => p.pangkat))];
  const uniqueGolongan = [...new Set(allData().pegawai.map(p => p.golongan))];


  function onSubmit(values: z.infer<typeof formSchema>) {
    const newEmployee: Pegawai = {
        id: new Date().getTime().toString(),
        avatarUrl: `https://picsum.photos/seed/${new Date().getTime()}/100/100`,
        imageHint: 'person face',
        ...values,
        tanggalLahir: format(values.tanggalLahir, 'yyyy-MM-dd'),
        tanggalMasuk: format(values.tanggalMasuk, 'yyyy-MM-dd'),
    };
    onSave(newEmployee);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Budi Santoso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: 198503152010011001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="cth: budi@gov.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>No. Telepon</FormLabel>
                    <FormControl>
                        <Input placeholder="cth: 081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="jabatan"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                        <Input placeholder="cth: Analis Kebijakan" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
              <FormField
                control={form.control}
                name="departemen"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Departemen</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih departemen" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {uniqueDepartments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

            <FormField
                control={form.control}
                name="pangkat"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Pangkat</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih pangkat" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {uniquePangkat.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih golongan" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {uniqueGolongan.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="tanggalLahir"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Lahir</FormLabel>
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
                        fromYear={1960}
                        toYear={new Date().getFullYear() - 18}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1950-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tanggalMasuk"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Masuk</FormLabel>
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
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status Kepegawaian</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Aktif">Aktif</SelectItem>
                            <SelectItem value="Cuti">Cuti</SelectItem>
                            <SelectItem value="Pensiun">Pensiun</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                        <Input placeholder="cth: Jl. Merdeka No. 10, Jakarta" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="flex justify-end pt-4">
            <Button type="submit">Simpan Pegawai</Button>
        </div>
      </form>
    </Form>
  );
}

    