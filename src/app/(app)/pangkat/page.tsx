
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
import type { PangkatGolongan } from '@/lib/types';
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
import { PangkatForm } from '@/components/forms/pangkat-form';
import { useCollection, useFirestore } from '@/firebase';
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function PangkatPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data, isLoading } = useCollection<PangkatGolongan>('pangkatGolongan');
  
  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedPangkat, setSelectedPangkat] = React.useState<PangkatGolongan | null>(null);

  const pangkatList = React.useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
        if (a.golongan > b.golongan) return -1;
        if (a.golongan < b.golongan) return 1;
        if (a.pangkat > b.pangkat) return -1;
        if (a.pangkat < b.pangkat) return 1;
        return 0;
    });
  }, [data]);

  const handleAdd = async (newPangkat: { pangkat: string, golongan: string }) => {
    try {
      const collectionRef = collection(firestore, 'pangkatGolongan');
      await addDoc(collectionRef, newPangkat);
      toast({ title: 'Sukses', description: 'Pangkat/Golongan baru berhasil ditambahkan.' });
      setIsAddEditDialogOpen(false);
    } catch(error) {
      toast({ title: 'Error', description: 'Gagal menambahkan data.', variant: 'destructive' });
    }
  };
  
  const handleUpdate = async (updatedPangkat: PangkatGolongan) => {
    try {
      const docRef = doc(firestore, 'pangkatGolongan', updatedPangkat.id);
      await updateDoc(docRef, { pangkat: updatedPangkat.pangkat, golongan: updatedPangkat.golongan });
      toast({ title: 'Sukses', description: 'Pangkat/Golongan berhasil diperbarui.' });
      setIsAddEditDialogOpen(false);
      setSelectedPangkat(null);
    } catch(error) {
      toast({ title: 'Error', description: 'Gagal memperbarui data.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedPangkat) return;
    try {
      const docRef = doc(firestore, 'pangkatGolongan', selectedPangkat.id);
      await deleteDoc(docRef);
      toast({ title: 'Sukses', description: 'Data berhasil dihapus.' });
      setIsDeleteDialogOpen(false);
      setSelectedPangkat(null);
    } catch(error) {
      toast({ title: 'Error', description: 'Gagal menghapus data.', variant: 'destructive' });
    }
  };

  const openEditDialog = (pangkat: PangkatGolongan) => {
    setSelectedPangkat(pangkat);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (pangkat: PangkatGolongan) => {
    setSelectedPangkat(pangkat);
    setIsDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedPangkat(null);
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
            <CardTitle>Manajemen Pangkat &amp; Golongan</CardTitle>
            <CardDescription>Lihat dan kelola data pangkat dan golongan pegawai.</CardDescription>
          </div>
           <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pangkat/Golongan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pangkat</TableHead>
                <TableHead>Golongan</TableHead>
                <TableHead className="w-[100px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pangkatList.length > 0 ? (
                pangkatList.map((item) => (
                  <TableRow key={`${item.id}`}>
                    <TableCell className="font-medium">{item.pangkat}</TableCell>
                    <TableCell>{item.golongan}</TableCell>
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
                            <DropdownMenuItem onClick={() => openEditDialog(item)}>Ubah</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteDialog(item)}>
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Tidak ada data.
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
        if (!isOpen) setSelectedPangkat(null);
    }}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{selectedPangkat ? 'Ubah Pangkat/Golongan' : 'Tambah Pangkat/Golongan Baru'}</DialogTitle>
                <DialogDescription>
                    {selectedPangkat ? 'Ubah data pangkat atau golongan.' : 'Masukkan data untuk pangkat/golongan baru.'}
                </DialogDescription>
            </DialogHeader>
            <PangkatForm 
                onSave={selectedPangkat ? handleUpdate : handleAdd}
                pangkatData={selectedPangkat}
            />
        </DialogContent>
    </Dialog>

    {/* Delete Alert Dialog */}
    {selectedPangkat && (
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus Pangkat <span className="font-semibold">{selectedPangkat.pangkat} ({selectedPangkat.golongan})</span>.
                  Pegawai dengan pangkat/golongan ini tidak akan terpengaruh, tetapi Anda mungkin perlu memperbarui data mereka.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedPangkat(null)}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    )}
    </>
  );
}

    