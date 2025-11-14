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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { allData } from '@/lib/data';
import type { Pegawai } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PangkatData {
  pangkat: string;
  golongan: string;
  jumlahPegawai: number;
}

export default function PangkatPage() {
  const [pangkatList, setPangkatList] = React.useState<PangkatData[]>([]);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  React.useEffect(() => {
    const storedData = localStorage.getItem('simpegSmartData');
    const data = storedData ? JSON.parse(storedData) : allData;
    const pegawai: Pegawai[] = data.pegawai;

    const counts: { [key: string]: { [key: string]: number } } = {};
    pegawai.forEach(p => {
      if (!counts[p.pangkat]) {
        counts[p.pangkat] = {};
      }
      counts[p.pangkat][p.golongan] = (counts[p.pangkat][p.golongan] || 0) + 1;
    });

    const pangkatData: PangkatData[] = [];
    Object.entries(counts).forEach(([pangkat, golonganData]) => {
      Object.entries(golonganData).forEach(([golongan, jumlahPegawai]) => {
        pangkatData.push({ pangkat, golongan, jumlahPegawai });
      });
    });
    
    // Sort by golongan then pangkat
    pangkatData.sort((a, b) => {
        if (a.golongan > b.golongan) return -1;
        if (a.golongan < b.golongan) return 1;
        if (a.pangkat > b.pangkat) return -1;
        if (a.pangkat < b.pangkat) return 1;
        return 0;
    });

    setPangkatList(pangkatData);
  }, []);

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Manajemen Pangkat & Golongan</CardTitle>
            <CardDescription>Lihat dan kelola data pangkat dan golongan pegawai.</CardDescription>
          </div>
           <Button onClick={() => setIsAlertOpen(true)}>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {pangkatList.length > 0 ? (
                pangkatList.map((item) => (
                  <TableRow key={`${item.pangkat}-${item.golongan}`}>
                    <TableCell className="font-medium">{item.pangkat}</TableCell>
                    <TableCell>{item.golongan}</TableCell>
                    <TableCell className="text-right">{item.jumlahPegawai}</TableCell>
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
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Fitur Dalam Pengembangan</AlertDialogTitle>
            <AlertDialogDescription>
                Fungsionalitas untuk menambah/mengedit pangkat dan golongan sedang dalam pengembangan dan akan segera tersedia.
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
