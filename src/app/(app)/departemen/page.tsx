
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import type { Departemen } from '@/lib/types';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DepartmentForm } from '@/components/forms/department-form';
import { useCollection, useFirestore } from '@/firebase';
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function DepartemenPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: departemenList, isLoading } = useCollection<Departemen>('departemen');
  
  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState<Departemen | null>(null);

  const handleAdd = async (newDepartment: { nama: string }) => {
    try {
      const collectionRef = collection(firestore, 'departemen');
      await addDoc(collectionRef, newDepartment);
      toast({ title: 'Sukses', description: 'Departemen baru berhasil ditambahkan.' });
      setIsAddEditDialogOpen(false);
    } catch(error) {
      toast({ title: 'Error', description: 'Gagal menambahkan departemen.', variant: 'destructive' });
    }
  };
  
  const handleUpdate = async (updatedDepartment: { id: string, nama: string }) => {
    try {
      const docRef = doc(firestore, 'departemen', updatedDepartment.id);
      await updateDoc(docRef, { nama: updatedDepartment.nama });
      toast({ title: 'Sukses', description: 'Departemen berhasil diperbarui.' });
      setIsAddEditDialogOpen(false);
      setSelectedDepartment(null);
    } catch(error) {
      toast({ title: 'Error', description: 'Gagal memperbarui departemen.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;
    try {
      const docRef = doc(firestore, 'departemen', selectedDepartment.id);
      await deleteDoc(docRef);
      toast({ title: 'Sukses', description: 'Departemen berhasil dihapus.' });
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
    } catch(error) {
      toast({ title: 'Error', description: 'Gagal menghapus departemen.', variant: 'destructive' });
    }
  };

  const openEditDialog = (department: Departemen) => {
    setSelectedDepartment(department);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (department: Departemen) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedDepartment(null);
    setIsAddEditDialogOpen(true);
  };
  
  if (isLoading) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Manajemen Departemen</CardTitle>
            <CardDescription>Lihat dan kelola departemen/unit kerja.</CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Departemen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Departemen</TableHead>
                <TableHead className="w-[100px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departemenList.length > 0 ? (
                departemenList.map((dep) => (
                  <TableRow key={dep.id}>
                    <TableCell className="font-medium">{dep.nama}</TableCell>
                     <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(dep)}>Ubah</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteDialog(dep)}>
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Tidak ada data departemen.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Add/Edit Dialog */}
    <Dialog open={isAddEditDialogOpen} onOpenChange={(isOpen) => {
        setIsAddEditDialogOpen(isOpen);
        if (!isOpen) setSelectedDepartment(null);
    }}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{selectedDepartment ? 'Ubah Departemen' : 'Tambah Departemen Baru'}</DialogTitle>
                <DialogDescription>
                    {selectedDepartment ? 'Ubah nama departemen.' : 'Masukkan nama untuk departemen baru.'}
                </DialogDescription>
            </DialogHeader>
            <DepartmentForm 
                onSave={selectedDepartment ? handleUpdate : handleAdd}
                departmentData={selectedDepartment}
            />
        </DialogContent>
    </Dialog>

    {/* Delete Alert Dialog */}
    {selectedDepartment && (
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus departemen <span className="font-semibold">{selectedDepartment.nama}</span>.
                  Pegawai dalam departemen ini tidak akan terpengaruh, tetapi Anda mungkin perlu mengalokasikan mereka ke departemen lain.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedDepartment(null)}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    )}
    </>
  );
}

    