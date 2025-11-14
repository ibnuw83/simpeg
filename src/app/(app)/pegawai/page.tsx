'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { allData, pegawaiData as initialPegawaiData } from '@/lib/data';
import type { Pegawai } from '@/lib/types';
import { AddEmployeeForm } from '@/components/forms/add-employee-form';

function getStatusVariant(status: Pegawai['status']) {
  switch (status) {
    case 'Aktif':
      return 'default';
    case 'Cuti':
      return 'secondary';
    case 'Pensiun':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function PegawaiPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [pegawaiList, setPegawaiList] = React.useState<Pegawai[]>(initialPegawaiData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    // On mount, load data from localStorage if it exists
    const storedData = localStorage.getItem('simpegSmartData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPegawaiList(parsedData.pegawai || []);
      } catch (e) {
        console.error("Failed to parse data from localStorage", e);
        setPegawaiList(initialPegawaiData);
      }
    }
  }, []);

  const handleSave = (newEmployee: Pegawai) => {
    const updatedPegawaiList = [...pegawaiList, newEmployee];
    setPegawaiList(updatedPegawaiList);

    // Update localStorage
    const currentData = JSON.parse(localStorage.getItem('simpegSmartData') || '{}');
    currentData.pegawai = updatedPegawaiList;
    localStorage.setItem('simpegSmartData', JSON.stringify(currentData));

    setIsDialogOpen(false); // Close dialog on save
  };

  const filteredPegawai = pegawaiList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.departemen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Manajemen Pegawai</CardTitle>
            <CardDescription>Cari, lihat, dan kelola data pegawai.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pegawai
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tambah Pegawai Baru</DialogTitle>
                <DialogDescription>
                  Isi formulir di bawah ini untuk menambahkan data pegawai baru ke sistem.
                </DialogDescription>
              </DialogHeader>
              <AddEmployeeForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama, NIP, jabatan..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nama</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead className="text-right">NIP</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPegawai.length > 0 ? (
                filteredPegawai.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={p.avatarUrl} alt={p.name} data-ai-hint={p.imageHint} />
                          <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-sm text-muted-foreground">{p.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                    </TableCell>
                    <TableCell>{p.jabatan}</TableCell>
                    <TableCell>{p.departemen}</TableCell>
                    <TableCell className="text-right">{p.nip}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/pegawai/${p.id}`}>Lihat Detail</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Ubah Data</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Tidak ada hasil.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
