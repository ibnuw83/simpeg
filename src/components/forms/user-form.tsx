
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
import { Pegawai, Pengguna } from '@/lib/types';
import { useEffect } from 'react';
import { useCollection } from '@/firebase';

const formSchema = z.object({
  pegawaiId: z.string().optional(),
  name: z.string().min(2, { message: 'Nama harus diisi.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }).optional().or(z.literal('')),
  role: z.enum(['Admin', 'Pengguna'], { required_error: 'Peran harus dipilih.' }),
  status: z.enum(['Aktif', 'Nonaktif'], { required_error: 'Status harus dipilih.' }),
});

interface UserFormProps {
  onSave: (data: Partial<Pengguna>) => void;
  userData?: Pengguna | null;
  onCancel: () => void;
}

export function UserForm({ onSave, userData, onCancel }: UserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Pengguna',
      status: 'Aktif',
    },
  });

  const { data: pegawaiList } = useCollection<Pegawai>('pegawai');
  const isEditing = !!userData;

  useEffect(() => {
    if (userData) {
      form.reset({
        ...userData,
        password: '',
      });
    } else {
      form.reset({
        pegawaiId: undefined,
        name: '',
        email: '',
        password: '',
        role: 'Pengguna',
        status: 'Aktif',
      });
    }
  }, [userData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dataToSave = { ...values };
    if (!isEditing && !dataToSave.password) {
        form.setError('password', { type: 'manual', message: 'Password wajib diisi untuk pengguna baru.'});
        return;
    }
    if (isEditing && !dataToSave.password) {
        delete dataToSave.password;
    }
    onSave(dataToSave);
  }

  const handlePegawaiSelect = (pegawaiId: string) => {
    const selected = pegawaiList.find(p => p.id === pegawaiId);
    if (selected) {
      form.setValue('pegawaiId', selected.id);
      form.setValue('name', selected.name);
      form.setValue('email', selected.email);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isEditing && (
            <FormField
              control={form.control}
              name="pegawaiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih dari Pegawai (Opsional)</FormLabel>
                  <Select onValueChange={handlePegawaiSelect}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pegawai untuk dijadikan pengguna" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pegawaiList.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.nip})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        )}
        
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                <Input placeholder="cth: Budi Santoso" {...field} disabled={!isEditing && !!form.watch('pegawaiId')} />
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
                <Input type="email" placeholder="cth: budi@example.com" {...field} disabled={!isEditing && !!form.watch('pegawaiId')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditing ? 'Password Baru (opsional)' : 'Password'}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peran (Role)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Pengguna">Pengguna</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
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

    