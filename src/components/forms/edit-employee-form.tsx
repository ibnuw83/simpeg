
'use client';

import { useForm, useWatch } from 'react-hook-form';
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
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus diisi, minimal 2 karakter.' }),
  nip: z.string().min(10, { message: 'NIP harus diisi, minimal 10 digit.' }),
  jabatan: z.string().min(2, { message: 'Jabatan harus diisi.' }),
  jenisJabatan: z.enum(['Jabatan Struktural', 'Jabatan Fungsional Tertentu', 'Jabatan Fungsional Umum'], { required_error: 'Jenis jabatan harus dipilih.' }),
  eselon: z.string().optional(),
  departemen: z.string().min(2, { message: 'Departemen harus dipilih.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  phone: z.string().min(10, { message: 'Nomor telepon minimal 10 digit.' }),
  tempatLahir: z.string().min(2, { message: 'Tempat lahir harus diisi.' }),
  tanggalLahir: z.date({ required_error: 'Tanggal lahir harus diisi.' }),
  tanggalMasuk: z.date({ required_error: 'Tanggal masuk harus diisi.' }),
  pangkat: z.string().min(2, { message: 'Pangkat harus diisi.' }),
  golongan: z.string().min(1, { message: 'Golongan harus diisi.' }),
  status: z.enum(['Aktif', 'Cuti', 'Pensiun']),
  alamat: z.string().min(5, { message: 'Alamat harus diisi.' }),
  avatarUrl: z.string().url({ message: 'URL foto tidak valid.' }).or(z.literal('')),
});

interface EditEmployeeFormProps {
  onSave: (employee: Pegawai) => void;
  employeeData: Pegawai;
  onCancel?: () => void;
}

export function EditEmployeeForm({ onSave, employeeData, onCancel }: EditEmployeeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...employeeData,
      eselon: employeeData.eselon || '',
      avatarUrl: employeeData.avatarUrl || '',
      tanggalLahir: employeeData.tanggalLahir ? new Date(employeeData.tanggalLahir) : undefined,
      tanggalMasuk: employeeData.tanggalMasuk ? new Date(employeeData.tanggalMasuk) : undefined,
    },
  });

  const { departemen, pangkatGolongan } = allData();
  const uniqueDepartments = departemen.map(d => d.nama);

  const watchedJenisJabatan = useWatch({
    control: form.control,
    name: 'jenisJabatan'
  });

  useEffect(() => {
    if (watchedJenisJabatan !== 'Jabatan Struktural') {
        form.setValue('eselon', '');
    }
  }, [watchedJenisJabatan, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedEmployee: Pegawai = {
        ...employeeData,
        ...values,
        tanggalLahir: format(values.tanggalLahir, 'yyyy-MM-dd'),
        tanggalMasuk: format(values.tanggalMasuk, 'yyyy-MM-dd'),
        eselon: values.jenisJabatan === 'Jabatan Struktural' ? values.eselon : undefined,
    };
    onSave(updatedEmployee);
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
              name="tempatLahir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Jakarta" {...field} />
                  </FormControl>
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
                            format(new Date(field.value), 'PPP')
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
                name="jabatan"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nama Jabatan</FormLabel>
                    <FormControl>
                        <Input placeholder="cth: Analis Kebijakan" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
             />
            <FormField
                control={form.control}
                name="jenisJabatan"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Jenis Jabatan</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis jabatan" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Jabatan Struktural">Jabatan Struktural</SelectItem>
                           <SelectItem value="Jabatan Fungsional Tertentu">Jabatan Fungsional Tertentu (JFT)</SelectItem>
                           <SelectItem value="Jabatan Fungsional Umum">Jabatan Fungsional Umum (JFU)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {watchedJenisJabatan === 'Jabatan Struktural' && (
                 <FormField
                    control={form.control}
                    name="eselon"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Eselon</FormLabel>
                         <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih eselon" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                               <SelectItem value="I.a">I.a</SelectItem>
                               <SelectItem value="I.b">I.b</SelectItem>
                               <SelectItem value="II.a">II.a</SelectItem>
                               <SelectItem value="II.b">II.b</SelectItem>
                               <SelectItem value="III.a">III.a</SelectItem>
                               <SelectItem value="III.b">III.b</SelectItem>
                               <SelectItem value="IV.a">IV.a</SelectItem>
                               <SelectItem value="IV.b">IV.b</SelectItem>
                               <SelectItem value="V.a">V.a</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
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
                    <FormLabel>Pangkat / Golongan</FormLabel>
                     <Select onValueChange={(value) => {
                        const selected = pangkatGolongan.find(p => p.id === value);
                        if (selected) {
                            form.setValue('pangkat', selected.pangkat);
                            form.setValue('golongan', selected.golongan);
                        }
                     }} defaultValue={pangkatGolongan.find(p => p.pangkat === field.value && p.golongan === form.getValues('golongan'))?.id}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih pangkat / golongan" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {pangkatGolongan.map(p => <SelectItem key={p.id} value={p.id}>{p.pangkat} ({p.golongan})</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
             {/* Hidden fields for validation, their values are set by the combined select */}
            <FormField control={form.control} name="golongan" render={() => <FormItem className="hidden"><FormControl><Input/></FormControl></FormItem>} />

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
                            format(new Date(field.value), 'PPP')
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
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>URL Foto Profil</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/foto.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Masukkan URL gambar untuk mengganti foto profil.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="flex justify-end gap-2 pt-4">
            {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>}
            <Button type="submit">Simpan Perubahan</Button>
        </div>
      </form>
    </Form>
  );
}
