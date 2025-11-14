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
import { PlusCircle } from 'lucide-react';
import { allData } from '@/lib/data';
import type { Pegawai } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


interface DepartmentData {
  nama: string;
  jumlahPegawai: number;
}

export default function DepartemenPage() {
  const [departemenList, setDepartemenList] = React.useState<DepartmentData[]>([]);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  React.useEffect(() => {
    const storedData = localStorage.getItem('simpegSmartData');
    const data = storedData ? JSON.parse(storedData) : allData;
    const pegawai: Pegawai[] = data.pegawai;

    const counts: { [key: string]: number } = {};
    pegawai.forEach(p => {
      counts[p.departemen] = (counts[p.departemen] || 0) + 1;
    });

    const departemenData = Object.entries(counts).map(([nama, jumlahPegawai]) => ({
      nama,
      jumlahPegawai,
    }));

    setDepartemenList(departemenData);
  }, []);

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Manajemen Departemen</CardTitle>
            <CardDescription>Lihat dan kelola departemen/unit kerja.</CardDescription>
          </div>
          <Button onClick={() => setIsAlertOpen(true)}>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {departemenList.length > 0 ? (
                departemenList.map((dep) => (
                  <TableRow key={dep.nama}>
                    <TableCell className="font-medium">{dep.nama}</TableCell>
                    <TableCell className="text-right">{dep.jumlahPegawai}</TableCell>
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
     <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Fitur Dalam Pengembangan</AlertDialogTitle>
            <AlertDialogDescription>
                Fungsionalitas untuk menambah/mengedit departemen sedang dalam pengembangan dan akan segera tersedia.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>Mengerti</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
