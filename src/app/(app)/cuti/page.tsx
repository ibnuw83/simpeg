
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, XCircle, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useCollection, useUser, useFirestore } from '@/firebase';
import type { Cuti, Pegawai, Pengguna } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';

type CutiWithPegawai = Cuti & { pegawai?: Pegawai };

function getStatusVariant(status: Cuti['status']) {
  switch (status) {
    case 'Disetujui':
      return 'default';
    case 'Ditolak':
      return 'destructive';
    case 'Menunggu':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function ManajemenCutiPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { userData, isLoading: isUserLoading } = useUser();
  
  const { data: cutiList, isLoading: isCutiLoading } = useCollection<Cuti>('cuti');
  const { data: pegawaiList, isLoading: isPegawaiLoading } = useCollection<Pegawai>('pegawai');

  const [filter, setFilter] = React.useState('Menunggu');

  const cutiWithPegawai = React.useMemo(() => {
    if (isCutiLoading || isPegawaiLoading) return [];
    return cutiList.map(c => ({
      ...c,
      pegawai: pegawaiList.find(p => p.id === c.pegawaiId)
    })).sort((a, b) => new Date(b.tanggalMulai).getTime() - new Date(a.tanggalMulai).getTime());
  }, [cutiList, pegawaiList, isCutiLoading, isPegawaiLoading]);

  const handleStatusChange = async (cutiId: string, pegawaiId: string | undefined, newStatus: Cuti['status']) => {
    if (!pegawaiId) {
        toast({ title: 'Error', description: 'Pegawai ID tidak ditemukan.', variant: 'destructive'});
        return;
    }

    const cutiRef = doc(firestore, 'cuti', cutiId);
    
    try {
        await updateDoc(cutiRef, { status: newStatus });

        const today = new Date();
        const cuti = cutiList.find(c => c.id === cutiId);
        if (cuti) {
            const startDate = new Date(cuti.tanggalMulai);
            const endDate = new Date(cuti.tanggalSelesai);
            const pegawaiRef = doc(firestore, 'pegawai', pegawaiId);

            if (newStatus === 'Disetujui' && today >= startDate && today <= endDate) {
                await updateDoc(pegawaiRef, { status: 'Cuti' });
            } else {
                 const employeeOnLeave = pegawaiList.find(p => p.id === pegawaiId);
                 if (employeeOnLeave?.status === 'Cuti') {
                    await updateDoc(pegawaiRef, { status: 'Aktif' });
                 }
            }
        }
      
      toast({
        title: 'Status Diperbarui',
        description: `Status pengajuan cuti telah diubah menjadi ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status: ", error);
      toast({
        title: 'Gagal Memperbarui',
        description: 'Terjadi kesalahan saat memperbarui status cuti.',
        variant: 'destructive',
      });
    }
  };

  const filteredCuti = filter === 'Semua' ? cutiWithPegawai : cutiWithPegawai.filter(c => c.status === filter);

  if (isUserLoading || isCutiLoading || isPegawaiLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (userData?.role !== 'Admin') {
      return <p>Anda tidak memiliki akses ke halaman ini.</p>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Manajemen Cuti</CardTitle>
              <CardDescription>Kelola dan konfirmasi pengajuan cuti dari pegawai.</CardDescription>
            </div>
            <div className="w-[180px]">
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter berdasarkan status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Menunggu">Menunggu</SelectItem>
                        <SelectItem value="Disetujui">Disetujui</SelectItem>
                        <SelectItem value="Ditolak">Ditolak</SelectItem>
                        <SelectItem value="Semua">Semua</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pegawai</TableHead>
                  <TableHead>Jenis Cuti</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Bukti</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-[200px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCuti.length > 0 ? (
                  filteredCuti.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        {c.pegawai ? (
                          <div className="flex items-center gap-3">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                              <AvatarImage src={c.pegawai.avatarUrl} alt={c.pegawai.name} />
                              <AvatarFallback>{c.pegawai.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-0.5">
                              <span className="font-semibold">{c.pegawai.name}</span>
                              <span className="text-sm text-muted-foreground">{c.pegawai.nip}</span>
                            </div>
                          </div>
                        ) : 'Pegawai tidak ditemukan'}
                      </TableCell>
                      <TableCell>{c.jenisCuti}</TableCell>
                      <TableCell>
                        {format(new Date(c.tanggalMulai), 'dd/MM/yy')} - {format(new Date(c.tanggalSelesai), 'dd/MM/yy')}
                      </TableCell>
                       <TableCell className="max-w-[200px] truncate">{c.keterangan}</TableCell>
                       <TableCell>
                         {c.linkBuktiDukung && (
                           <Button variant="ghost" size="icon" asChild>
                              <a href={c.linkBuktiDukung} target="_blank" rel="noopener noreferrer" aria-label="Link Bukti Dukung">
                                <LinkIcon className="h-4 w-4" />
                              </a>
                            </Button>
                         )}
                       </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(c.status)}>{c.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {c.status === 'Menunggu' && (
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(c.id, c.pegawaiId, 'Disetujui')} className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Setujui
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(c.id, c.pegawaiId, 'Ditolak')} className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                                    <XCircle className="mr-2 h-4 w-4" /> Tolak
                                </Button>
                            </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Tidak ada pengajuan cuti dengan status '{filter}'.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

    