'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { allData, updateAllData } from '@/lib/data';
import type { Pegawai, RiwayatPensiun } from '@/lib/types';
import { add, format, differenceInYears, isPast } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck, Users } from 'lucide-react';

const RETIREMENT_AGE = 58;

export default function PensiunPage() {
  const [data, setData] = useState(allData());
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const loadData = () => {
    setData(allData());
  };

  useEffect(() => {
    loadData();
  }, []);

  const { upcomingRetirements, alreadyRetired } = useMemo(() => {
    const today = new Date();
    const oneYearFromNow = add(today, { years: 1 });

    const upcoming = data.pegawai
      .filter(p => p.status === 'Aktif' && p.tanggalLahir)
      .map(p => {
        const birthDate = new Date(p.tanggalLahir);
        const retirementDate = add(birthDate, { years: RETIREMENT_AGE });
        const age = differenceInYears(today, birthDate);
        return { ...p, retirementDate, age };
      })
      .filter(p => p.retirementDate > today && p.retirementDate <= oneYearFromNow)
      .sort((a, b) => a.retirementDate.getTime() - b.retirementDate.getTime());

    const retired = data.pegawai.filter(p => p.status === 'Pensiun');

    return { upcomingRetirements: upcoming, alreadyRetired: retired };
  }, [data]);

  const processRetirement = (pegawaiId: string) => {
    startTransition(() => {
      const currentData = allData();
      const pegawaiToRetire = currentData.pegawai.find(p => p.id === pegawaiId);

      if (!pegawaiToRetire) {
        toast({
          variant: 'destructive',
          title: 'Gagal',
          description: 'Pegawai tidak ditemukan.',
        });
        return;
      }
      
      const updatedPegawai = currentData.pegawai.map(p =>
        p.id === pegawaiId ? { ...p, status: 'Pensiun' as const } : p
      );
      
      const newRiwayatPensiun: RiwayatPensiun = {
        id: `pen-${new Date().getTime()}`,
        pegawaiId: pegawaiId,
        tanggalPensiun: format(new Date(), 'yyyy-MM-dd'),
        keterangan: 'Diproses secara manual',
        nomorSK: `SK-PEN-MANUAL-${new Date().getTime()}`
      };

      updateAllData({ 
        ...currentData, 
        pegawai: updatedPegawai,
        riwayatPensiun: [...currentData.riwayatPensiun, newRiwayatPensiun]
      });
      loadData();
      toast({
        title: 'Sukses',
        description: `${pegawaiToRetire.name} telah berhasil diproses pensiun.`,
      });
    });
  };

  const runAutomaticProcess = () => {
    startTransition(() => {
        const currentData = allData();
        const today = new Date();
        let retiredCount = 0;
        let alreadyRetiredCount = 0;

        const updatedPegawai = currentData.pegawai.map(p => {
            if (p.status === 'Aktif' && p.tanggalLahir) {
                const birthDate = new Date(p.tanggalLahir);
                const retirementDate = add(birthDate, { years: RETIREMENT_AGE });
                if (isPast(retirementDate)) {
                    retiredCount++;
                    return { ...p, status: 'Pensiun' as const };
                }
            } else if(p.status === 'Pensiun') {
                const birthDate = new Date(p.tanggalLahir);
                const retirementDate = add(birthDate, { years: RETIREMENT_AGE });
                if (isPast(retirementDate)) {
                    alreadyRetiredCount++;
                }
            }
            return p;
        });

        if (retiredCount > 0) {
            updateAllData({ ...currentData, pegawai: updatedPegawai });
            loadData();
            toast({
                title: 'Proses Otomatis Selesai',
                description: `${retiredCount} pegawai telah secara otomatis diubah statusnya menjadi Pensiun.`,
            });
        } else if (alreadyRetiredCount > 0) {
            toast({
                title: 'Tidak Ada Perubahan',
                description: 'Tidak ada pegawai aktif yang melewati usia pensiun saat ini.',
            });
        }
        else {
             toast({
                title: 'Tidak Ada Perubahan',
                description: 'Tidak ada pegawai aktif yang melewati usia pensiun saat ini.',
            });
        }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Otomatisasi Proses Pensiun</CardTitle>
            <CardDescription>
              Jalankan proses untuk secara otomatis mengubah status pegawai yang telah mencapai usia pensiun.
            </CardDescription>
          </div>
          <AlertDialog>
             <AlertDialogTrigger asChild>
                <Button disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                  Jalankan Proses Otomatis
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Proses Otomatis</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini akan memeriksa semua pegawai aktif. Jika tanggal lahir mereka menunjukkan bahwa mereka telah melewati usia pensiun ({RETIREMENT_AGE} tahun), status mereka akan diubah menjadi "Pensiun". Apakah Anda ingin melanjutkan?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={runAutomaticProcess}>Lanjutkan</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
      </Card>
    
      <Card>
        <CardHeader>
          <CardTitle>Pensiun Segera</CardTitle>
          <CardDescription>
            Daftar pegawai aktif yang akan mencapai usia pensiun ({RETIREMENT_AGE} tahun) dalam 12 bulan ke depan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Tanggal Pensiun</TableHead>
                  <TableHead>Usia Saat Ini</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingRetirements.length > 0 ? (
                  upcomingRetirements.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={p.avatarUrl} alt={p.name} data-ai-hint={p.imageHint} />
                                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{p.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{p.jabatan}</TableCell>
                      <TableCell>{format(p.retirementDate, 'dd MMMM yyyy', { locale: localeId })}</TableCell>
                      <TableCell>{p.age} tahun</TableCell>
                      <TableCell className="text-right">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" disabled={isPending}>Proses Pensiun</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Konfirmasi Pensiun</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Apakah Anda yakin ingin memproses pensiun untuk pegawai <strong>{p.name}</strong>? Statusnya akan diubah menjadi "Pensiun".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => processRetirement(p.id)}>Ya, Proses</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada pegawai yang akan pensiun dalam waktu dekat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pegawai Sudah Pensiun</CardTitle>
          <CardDescription>
            Daftar pegawai yang telah pensiun.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan Terakhir</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alreadyRetired.length > 0 ? (
                  alreadyRetired.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                         <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={p.avatarUrl} alt={p.name} data-ai-hint={p.imageHint} />
                                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{p.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{p.jabatan}</TableCell>
                      <TableCell>{p.nip}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Belum ada data pegawai pensiun.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
