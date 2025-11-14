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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { allData } from '@/lib/data';
import { Textarea } from '../ui/textarea';

export type MutationType = 'perpindahan' | 'promosi' | 'gaji' | 'pangkat';

interface MutationFormProps {
  mutationType: MutationType;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function MutationForm({ mutationType, onSave, onCancel }: MutationFormProps) {

  const getFormSchema = (type: MutationType) => {
    const baseSchema = {
      pegawaiId: z.string({ required_error: 'Pegawai harus dipilih.' }),
      tanggalEfektif: z.date({ required_error: 'Tanggal efektif harus diisi.' }),
      nomorSK: z.string().min(1, 'Nomor SK harus diisi.'),
      dokumenSK: z.any().optional(),
      keterangan: z.string().optional(),
    };

    switch (type) {
      case 'perpindahan':
        return z.object({
          ...baseSchema,
          departemenBaru: z.string({ required_error: 'Departemen baru harus dipilih.' }),
        });
      case 'promosi':
        return z.object({
          ...baseSchema,
          jabatanBaru: z.string().min(1, 'Jabatan baru harus diisi.'),
        });
      case 'gaji':
         return z.object({
          ...baseSchema,
          gajiBaru: z.preprocess(
            (a) => parseFloat(z.string().parse(a)),
            z.number().positive('Gaji baru harus angka positif.')
          ),
        });
      case 'pangkat':
        return z.object({
          ...baseSchema,
          pangkatBaru: z.string({ required_error: 'Pangkat baru harus dipilih.' }),
          golonganBaru: z.string({ required_error: 'Golongan baru harus dipilih.' }),
        });
      default:
        return z.object(baseSchema);
    }
  };

  const formSchema = getFormSchema(mutationType);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { pegawai, departemen, pangkatGolongan } = allData();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dataToSave = {
        ...values,
        tanggalEfektif: format(values.tanggalEfektif, 'yyyy-MM-dd'),
        dokumenSK: values.dokumenSK?.[0]?.name || null,
        mutationType,
    };
    onSave(dataToSave);
  }

  const renderSpecificFields = () => {
    switch (mutationType) {
        case 'perpindahan':
            return (
                <FormField
                    control={form.control}
                    name="departemenBaru"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Departemen Baru</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih departemen baru" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departemen.map(d => <SelectItem key={d.id} value={d.nama}>{d.nama}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        case 'promosi':
            return (
                <FormField
                    control={form.control}
                    name="jabatanBaru"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jabatan Baru</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan jabatan baru" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        case 'gaji':
             return (
                <FormField
                    control={form.control}
                    name="gajiBaru"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gaji Pokok Baru</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="cth: 5000000" {...field} onChange={e => field.onChange(e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            );
        case 'pangkat':
            return (
                <>
                    <FormField
                        control={form.control}
                        name="pangkatBaru"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pangkat / Golongan Baru</FormLabel>
                                <Select onValueChange={(value) => {
                                    const selected = pangkatGolongan.find(p => p.id === value);
                                    if (selected) {
                                        form.setValue('pangkatBaru', selected.pangkat);
                                        form.setValue('golonganBaru', selected.golongan);
                                    }
                                }} defaultValue={pangkatGolongan.find(p => p.pangkat === field.value)?.id}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih pangkat / golongan baru" />
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
                    <FormField control={form.control} name="golonganBaru" render={() => <FormItem className="hidden"><FormControl><Input/></FormControl></FormItem>} />
                </>
            );
        default:
            return null;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <FormField
          control={form.control}
          name="pegawaiId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Pegawai</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Cari dan pilih nama pegawai..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pegawai.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.nip})</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {renderSpecificFields()}

        <div className="grid grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="nomorSK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor SK</FormLabel>
                  <FormControl>
                    <Input placeholder="Nomor Surat Keputusan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggalEfektif"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Efektif</FormLabel>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
            control={form.control}
            name="keterangan"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Keterangan (Opsional)</FormLabel>
                <FormControl>
                    <Textarea placeholder="Tambahkan catatan jika perlu..." {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="dokumenSK"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Unggah Dokumen SK</FormLabel>
                    <FormControl>
                       <div className="relative">
                            <Input 
                                type="file" 
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" 
                                onChange={(e) => field.onChange(e.target.files)}
                            />
                            <Button type="button" variant="outline" className="w-full pointer-events-none">
                                <Upload className="mr-2" />
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
            <Button type="submit">Simpan Proses</Button>
        </div>
      </form>
    </Form>
  );
}

    