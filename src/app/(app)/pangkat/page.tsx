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
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { allData } from '@/lib/data';
import type { Pegawai, PangkatGolongan } from '@/lib/types';
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

interface PangkatData extends PangkatGolongan {
  jumlahPegawai: number;
}

export default function PangkatPage() {
  const [pangkatList, setPangkatList] = React.useState<PangkatData[]>([]);
  const [pegawaiList, setPegawaiList] = React.useState<Pegawai[]>([]);

  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedPangkat, setSelectedPangkat] = React.useState<PangkatData | null>(null);

  const loadData = () => {
    const storedData = localStorage.getItem('simpegSmartData');
    const data = storedData ? JSON.parse(storedData) : allData;
    const pangkatGolongan: PangkatGolongan[] = data.pangkatGolongan || [];
    const pegawai: Pegawai[] = data.pegawai || [];

    setPegawaiList(pegawai);

    const counts: { [key: string]: number } = {};
    pegawai.forEach(p => {
      const key = `${p.pangkat}-${p.golongan}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const pangkatData = pangkatGolongan.map(pg => ({
      ...pg,
      jumlahPegawai: counts[`${pg.pangkat}-${pg.golongan}`] || 0,
    }));
    
    pangkatData.sort((a, b) => {
        if (a.golongan > b.golongan) return -1;
        if (a.golongan < b.golongan) return 1;
        if (a.pangkat > b.pangkat) return -1;
        if (a.pangkat < b.pangkat) return 1;
        return 0;
    });

    setPangkatList(pangkatData);
  };


  React.useEffect(() => {
    loadData();
  }, []);

  const updateLocalStorage = (updatedPangkat: PangkatGolongan[]) => {
     try {
        const currentData = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData));
        currentData.pangkatGolongan = updatedPangkat;
        localStorage.setItem('simpegSmartData', JSON.stringify(currentData));
    } catch(e) {
        console.error("Failed to update localStorage", e);
    }
  }

  const handleAdd = (newPangkat: { pangkat: string, golongan: string }) => {
    const rawPangkat = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData)).pangkatGolongan;
    const updatedPangkat: PangkatGolongan[] = [...rawPangkat, { id: new Date().getTime().toString(), ...newPangkat }];
    updateLocalStorage(updatedPangkat);
    loadData();
    setIsAddEditDialogOpen(false);
  };
  
  const handleUpdate = (updatedPangkat: PangkatGolongan) => {
    const rawPangkat = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData)).pangkatGolongan;
    const updatedPangkatList = rawPangkat.map(p => p.id === updatedPangkat.id ? updatedPangkat : p);
    updateLocalStorage(updatedPangkatList);
    loadData();
    setIsAddEditDialogOpen(false);
    setSelectedPangkat(null);
  };

  const handleDelete = () => {
    if (!selectedPangkat) return;
    const rawPangkat = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData)).pangkatGolongan;
    const updatedPangkatList = rawPangkat.filter(p => p.id !== selectedPangkat.id);
    updateLocalStorage(updatedPangkatList);
    loadData();
    setIsDeleteDialogOpen(false);
    setSelectedPangkat(null);
  };

  const openEditDialog = (pangkat: PangkatData) => {
    setSelectedPangkat(pangkat);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (pangkat: PangkatData) => {
    setSelectedPangkat(pangkat);
    setIsDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedPangkat(null);
    setIsAddEditDialogOpen(true);
  };

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
                <TableHead className="text-right">Jumlah Pegawai</TableHead>
                <TableHead className="w-[100px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pangkatList.length > 0 ? (
                pangkatList.map((item) => (
                  <TableRow key={`${item.id}`}>
                    <TableCell className="font-medium">{item.pangkat}</TableCell>
                    <TableCell>{item.golongan}</TableCell>
                    <TableCell className="text-right">{item.jumlahPegawai}</TableCell>
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
                  <TableCell colSpan={4} className="h-24 text-center">
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
