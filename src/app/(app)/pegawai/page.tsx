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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { allData, pegawaiData as initialPegawaiData } from '@/lib/data';
import type { Pegawai } from '@/lib/types';
import { AddEmployeeForm } from '@/components/forms/add-employee-form';
import { EditEmployeeForm } from '@/components/forms/edit-employee-form';

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

  // State for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedPegawai, setSelectedPegawai] = React.useState<Pegawai | null>(null);

  React.useEffect(() => {
    // On mount, load data from localStorage if it exists
    const storedData = localStorage.getItem('simpegSmartData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPegawaiList(parsedData.pegawai || initialPegawaiData);
      } catch (e) {
        console.error("Failed to parse data from localStorage", e);
        setPegawaiList(initialPegawaiData);
      }
    } else {
        setPegawaiList(initialPegawaiData);
    }
  }, []);

  const updateLocalStorage = (updatedPegawaiList: Pegawai[]) => {
     try {
        const currentData = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData));
        currentData.pegawai = updatedPegawaiList;
        localStorage.setItem('simpegSmartData', JSON.stringify(currentData));
    } catch(e) {
        console.error("Failed to update localStorage", e);
    }
  }

  const handleAdd = (newEmployee: Pegawai) => {
    const updatedPegawaiList = [...pegawaiList, newEmployee];
    setPegawaiList(updatedPegawaiList);
    updateLocalStorage(updatedPegawaiList);
    setIsAddDialogOpen(false); // Close dialog on save
  };

  const handleUpdate = (updatedEmployee: Pegawai) => {
    const updatedPegawaiList = pegawaiList.map(p => p.id === updatedEmployee.id ? updatedEmployee : p);
    setPegawaiList(updatedPegawaiList);
    updateLocalStorage(updatedPegawaiList);
    setIsEditDialogOpen(false);
    setSelectedPegawai(null);
  };

  const handleDelete = () => {
    if (!selectedPegawai) return;
    const updatedPegawaiList = pegawaiList.filter(p => p.id !== selectedPegawai.id);
    setPegawaiList(updatedPegawaiList);
    updateLocalStorage(updatedPegawaiList);
    setIsDeleteDialogOpen(false);
    setSelectedPegawai(null);
  }

  const openEditDialog = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
    setIsDeleteDialogOpen(true);
  };

  const filteredPegawai = pegawaiList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.departemen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Manajemen Pegawai</CardTitle>
              <CardDescription>Cari, lihat, dan kelola data pegawai.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <AddEmployeeForm onSave={handleAdd} />
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
                            <DropdownMenuItem onClick={() => openEditDialog(p)}>Ubah Data</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteDialog(p)}>
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

      {/* Edit Dialog */}
      {selectedPegawai && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                <DialogTitle>Ubah Data Pegawai</DialogTitle>
                <DialogDescription>
                    Lakukan perubahan pada data pegawai. Klik simpan jika sudah selesai.
                </DialogDescription>
                </DialogHeader>
                <EditEmployeeForm onSave={handleUpdate} employeeData={selectedPegawai} />
            </DialogContent>
        </Dialog>
      )}

      {/* Delete Alert Dialog */}
       {selectedPegawai && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data pegawai secara permanen
                    dari server.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
       )}
    </>
  );
}
