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
import type { Pegawai, Departemen } from '@/lib/types';
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


interface DepartmentData {
  id: string;
  nama: string;
  jumlahPegawai: number;
}

export default function DepartemenPage() {
  const [departemenList, setDepartemenList] = React.useState<DepartmentData[]>([]);
  const [pegawaiList, setPegawaiList] = React.useState<Pegawai[]>([]);

  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState<DepartmentData | null>(null);

  const loadData = () => {
    const storedData = localStorage.getItem('simpegSmartData');
    const data = storedData ? JSON.parse(storedData) : allData;
    const departemen: Departemen[] = data.departemen || [];
    const pegawai: Pegawai[] = data.pegawai || [];

    setPegawaiList(pegawai);

    const counts: { [key: string]: number } = {};
    pegawai.forEach(p => {
      counts[p.departemen] = (counts[p.departemen] || 0) + 1;
    });

    const departemenData = departemen.map(d => ({
      ...d,
      jumlahPegawai: counts[d.nama] || 0,
    }));

    setDepartemenList(departemenData);
  };


  React.useEffect(() => {
    loadData();
  }, []);

  const updateLocalStorage = (updatedDepartments: Departemen[]) => {
     try {
        const currentData = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData));
        currentData.departemen = updatedDepartments;
        localStorage.setItem('simpegSmartData', JSON.stringify(currentData));
    } catch(e) {
        console.error("Failed to update localStorage", e);
    }
  }

  const handleAdd = (newDepartment: { nama: string }) => {
    const rawDepartments = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData)).departemen;
    const updatedDepartments: Departemen[] = [...rawDepartments, { id: new Date().getTime().toString(), nama: newDepartment.nama }];
    updateLocalStorage(updatedDepartments);
    loadData();
    setIsAddEditDialogOpen(false);
  };
  
  const handleUpdate = (updatedDepartment: { id: string, nama: string }) => {
    const rawDepartments = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData)).departemen;
    const updatedDepartments = rawDepartments.map(d => d.id === updatedDepartment.id ? updatedDepartment : d);
    updateLocalStorage(updatedDepartments);
    loadData();
    setIsAddEditDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleDelete = () => {
    if (!selectedDepartment) return;
    const rawDepartments = JSON.parse(localStorage.getItem('simpegSmartData') || JSON.stringify(allData)).departemen;
    const updatedDepartments = rawDepartments.filter(d => d.id !== selectedDepartment.id);
    updateLocalStorage(updatedDepartments);
    loadData();
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  const openEditDialog = (department: DepartmentData) => {
    setSelectedDepartment(department);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (department: DepartmentData) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedDepartment(null);
    setIsAddEditDialogOpen(true);
  };

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
                <TableHead className="text-right">Jumlah Pegawai</TableHead>
                 <TableHead className="w-[100px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departemenList.length > 0 ? (
                departemenList.map((dep) => (
                  <TableRow key={dep.id}>
                    <TableCell className="font-medium">{dep.nama}</TableCell>
                    <TableCell className="text-right">{dep.jumlahPegawai}</TableCell>
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
                  <TableCell colSpan={3} className="h-24 text-center">
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
