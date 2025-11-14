'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  allData
} from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Mail, Phone, MapPin, Briefcase, Award, Download } from 'lucide-react';
import type { Pegawai, RiwayatJabatan, RiwayatPangkat, Cuti, Dokumen } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function getStatusVariant(status: Pegawai['status']) {
    switch (status) {
      case 'Aktif': return 'default';
      case 'Cuti': return 'secondary';
      case 'Pensiun': return 'destructive';
      default: return 'outline';
    }
}

export default function PegawaiDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : null;
  
  const [pegawai, setPegawai] = useState<Pegawai | null | undefined>(undefined);
  const [riwayatJabatan, setRiwayatJabatan] = useState<RiwayatJabatan[]>([]);
  const [riwayatPangkat, setRiwayatPangkat] = useState<RiwayatPangkat[]>([]);
  const [cuti, setCuti] = useState<Cuti[]>([]);
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);
  
  useEffect(() => {
    if (!id) return;

    const pegawaiData = allData.pegawai.find(p => p.id === id);
    setPegawai(pegawaiData ?? null);

    if (pegawaiData) {
      setRiwayatJabatan(allData.riwayatJabatan.filter(rj => rj.pegawaiId === id));
      setRiwayatPangkat(allData.riwayatPangkat.filter(rp => rp.pegawaiId === id));
      setCuti(allData.cuti.filter(c => c.pegawaiId === id));
      setDokumen(allData.dokumen.filter(d => d.pegawaiId === id));
    }
  }, [id]);

  useEffect(() => {
    if (pegawai === null) {
      notFound();
    }
  }, [pegawai]);


  if (pegawai === undefined) {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="flex-1 space-y-4">
                             <Skeleton className="h-8 w-1/2" />
                             <Skeleton className="h-6 w-1/4" />
                             <Skeleton className="h-6 w-3/4" />
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Skeleton className="h-10 w-full" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-2/3" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!pegawai) {
    // This case should be handled by the notFound call, but it's here as a safeguard.
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={pegawai.avatarUrl} alt={pegawai.name} data-ai-hint={pegawai.imageHint} />
              <AvatarFallback>{pegawai.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl">{pegawai.name}</CardTitle>
                <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Ubah Data</Button>
              </div>
              <CardDescription className="mt-1 text-base">NIP: {pegawai.nip}</CardDescription>
              <div className="mt-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase className="h-4 w-4" /> {pegawai.jabatan}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Award className="h-4 w-4" /> {pegawai.pangkat} ({pegawai.golongan})</div>
                <Badge variant={getStatusVariant(pegawai.status)}>{pegawai.status}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="info">Info Pribadi</TabsTrigger>
          <TabsTrigger value="jabatan">Riwayat Jabatan</TabsTrigger>
          <TabsTrigger value="pangkat">Riwayat Pangkat</TabsTrigger>
          <TabsTrigger value="cuti">Cuti</TabsTrigger>
          <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" /> <span>{pegawai.email}</span></div>
              <div className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" /> <span>{pegawai.phone}</span></div>
              <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> <span>{pegawai.alamat}</span></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jabatan">
          <Card>
            <CardHeader><CardTitle>Riwayat Jabatan</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Tanggal Mulai</TableHead>
                    <TableHead>Tanggal Selesai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riwayatJabatan.length > 0 ? riwayatJabatan.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.jabatan}</TableCell>
                      <TableCell>{item.departemen}</TableCell>
                      <TableCell>{item.tanggalMulai}</TableCell>
                      <TableCell>{item.tanggalSelesai || 'Sekarang'}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="text-center">Tidak ada data.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pangkat">
          <Card>
            <CardHeader><CardTitle>Riwayat Pangkat</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pangkat</TableHead>
                    <TableHead>Golongan</TableHead>
                    <TableHead>Tanggal Kenaikan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riwayatPangkat.length > 0 ? riwayatPangkat.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.pangkat}</TableCell>
                      <TableCell>{item.golongan}</TableCell>
                      <TableCell>{item.tanggalKenaikan}</TableCell>
                    </TableRow>
                  )) : (
                     <TableRow><TableCell colSpan={3} className="text-center">Tidak ada data.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cuti">
          <Card>
            <CardHeader><CardTitle>Riwayat Cuti</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Cuti</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cuti.length > 0 ? cuti.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.jenisCuti}</TableCell>
                      <TableCell>{item.tanggalMulai} - {item.tanggalSelesai}</TableCell>
                      <TableCell>{item.keterangan}</TableCell>
                      <TableCell><Badge variant="outline">{item.status}</Badge></TableCell>
                    </TableRow>
                  )) : (
                     <TableRow><TableCell colSpan={4} className="text-center">Tidak ada data.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dokumen">
          <Card>
            <CardHeader><CardTitle>Manajemen Dokumen</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Dokumen</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Tanggal Unggah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dokumen.length > 0 ? dokumen.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.namaDokumen}</TableCell>
                      <TableCell><Badge variant="secondary">{item.jenisDokumen}</Badge></TableCell>
                      <TableCell>{item.tanggalUnggah}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={item.fileUrl} download><Download className="h-4 w-4" /></a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="text-center">Tidak ada data.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
