'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  allData,
  updateAllData
} from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Mail, Phone, MapPin, Briefcase, Award, Download, Cake, PlusCircle, ArrowRightLeft, GraduationCap, BookOpen, Gavel, Trophy, User as UserIcon, MoreHorizontal } from 'lucide-react';
import type { Pegawai, RiwayatJabatan, RiwayatPangkat, Cuti, Dokumen, RiwayatPendidikan, RiwayatDiklat, Penghargaan, Hukuman } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditEmployeeForm } from '@/components/forms/edit-employee-form';
import { useToast } from '@/hooks/use-toast';
import { HistoryForm } from '@/components/forms/history-form';

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
  const { toast } = useToast();
  
  const [pegawai, setPegawai] = useState<Pegawai | null | undefined>(undefined);
  const [riwayatJabatan, setRiwayatJabatan] = useState<RiwayatJabatan[]>([]);
  const [riwayatPangkat, setRiwayatPangkat] = useState<RiwayatPangkat[]>([]);
  const [riwayatPendidikan, setRiwayatPendidikan] = useState<RiwayatPendidikan[]>([]);
  const [riwayatDiklat, setRiwayatDiklat] = useState<RiwayatDiklat[]>([]);
  const [cuti, setCuti] = useState<Cuti[]>([]);
  const [penghargaan, setPenghargaan] = useState<Penghargaan[]>([]);
  const [hukuman, setHukuman] = useState<Hukuman[]>([]);
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);
  
  // Dialog States
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<{type: string, data: any} | null>(null);

  const id = typeof params.id === 'string' ? params.id : null;

  const loadData = React.useCallback(() => {
    if (!id) return;

    const data = allData();
    const pegawaiData = data.pegawai.find(p => p.id === id);
    setPegawai(pegawaiData ?? null);

    if (pegawaiData) {
      setRiwayatJabatan(data.riwayatJabatan.filter(rj => rj.pegawaiId === id));
      setRiwayatPangkat(data.riwayatPangkat.filter(rp => rp.pegawaiId === id));
      setRiwayatPendidikan(data.riwayatPendidikan.filter(rp => rp.pegawaiId === id));
      setRiwayatDiklat(data.riwayatDiklat.filter(rd => rd.pegawaiId === id));
      setCuti(data.cuti.filter(c => c.pegawaiId === id));
      setPenghargaan(data.penghargaan.filter(p => p.pegawaiId === id));
      setHukuman(data.hukuman.filter(h => h.pegawaiId === id));
      setDokumen(data.dokumen.filter(d => d.pegawaiId === id));
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [id, loadData]);

  useEffect(() => {
    if (pegawai === null) {
      notFound();
    }
  }, [pegawai]);

  const handleUpdate = (updatedEmployee: Pegawai) => {
    const currentData = allData();
    const updatedPegawaiList = currentData.pegawai.map(p => p.id === updatedEmployee.id ? updatedEmployee : p);
    updateAllData({ ...currentData, pegawai: updatedPegawaiList });
    loadData();
    setIsEditDialogOpen(false);
  };
  
  const handleSaveHistory = (newHistory: Omit<RiwayatJabatan, 'id' | 'pegawaiId'>) => {
    if (!id) return;

    const currentData = allData();
    let updatedHistory;

    if (selectedHistory) { // Update
        updatedHistory = currentData.riwayatJabatan.map(item => item.id === selectedHistory.data.id ? { ...selectedHistory.data, ...newHistory } : item);
    } else { // Create
        const newRecord: RiwayatJabatan = {
          ...newHistory,
          id: new Date().getTime().toString(),
          pegawaiId: id,
        };
        updatedHistory = [...currentData.riwayatJabatan, newRecord];
    }
    
    updateAllData({ ...currentData, riwayatJabatan: updatedHistory });
    loadData();
    setIsHistoryDialogOpen(false);
    setSelectedHistory(null);
    toast({ title: 'Sukses', description: `Riwayat jabatan berhasil ${selectedHistory ? 'diperbarui' : 'ditambahkan'}.` });
  };

  const handleDeleteHistory = () => {
    if (!selectedHistory) return;
    
    const currentData = allData();
    let updatedHistory;

    // A more generic delete logic can be implemented here if needed
    if (selectedHistory.type === 'jabatan') {
        updatedHistory = currentData.riwayatJabatan.filter(item => item.id !== selectedHistory.data.id);
        updateAllData({ ...currentData, riwayatJabatan: updatedHistory });
    }

    loadData();
    setIsDeleteDialogOpen(false);
    setSelectedHistory(null);
    toast({ title: 'Sukses', description: 'Data riwayat berhasil dihapus.' });
  }

  const openHistoryDialog = (type: string, data: any | null = null) => {
    setSelectedHistory({ type, data });
    setIsHistoryDialogOpen(true);
  }

  const openDeleteDialog = (type: string, data: any) => {
    setSelectedHistory({ type, data });
    setIsDeleteDialogOpen(true);
  }


  const showNotImplementedToast = () => {
    toast({
        variant: 'destructive',
        title: 'Fitur Belum Tersedia',
        description: 'Fungsionalitas untuk ini sedang dalam pengembangan.',
    });
  }

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
    return null;
  }

  return (
    <>
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
                  <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Ubah Data
                  </Button>
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
        
        <Tabs defaultValue="pribadi">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-9">
            <TabsTrigger value="pribadi"><UserIcon className="mr-2 h-4 w-4" />Pribadi</TabsTrigger>
            <TabsTrigger value="jabatan"><Briefcase className="mr-2 h-4 w-4" />Jabatan</TabsTrigger>
            <TabsTrigger value="mutasi"><ArrowRightLeft className="mr-2 h-4 w-4" />Mutasi</TabsTrigger>
            <TabsTrigger value="pendidikan"><GraduationCap className="mr-2 h-4 w-4" />Pendidikan</TabsTrigger>
            <TabsTrigger value="diklat"><BookOpen className="mr-2 h-4 w-4" />Diklat</TabsTrigger>
            <TabsTrigger value="cuti"><Cake className="mr-2 h-4 w-4" />Cuti</TabsTrigger>
            <TabsTrigger value="penghargaan"><Trophy className="mr-2 h-4 w-4" />Penghargaan</TabsTrigger>
            <TabsTrigger value="hukuman"><Gavel className="mr-2 h-4 w-4" />Hukuman</TabsTrigger>
            <TabsTrigger value="dokumen"><Download className="mr-2 h-4 w-4" />Dokumen</TabsTrigger>
          </TabsList>

          <TabsContent value="pribadi">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" /> <span>{pegawai.email}</span></div>
                <div className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" /> <span>{pegawai.phone}</span></div>
                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> <span>{pegawai.alamat}</span></div>
                {pegawai.tanggalLahir && (
                  <div className="flex items-center"><Cake className="mr-2 h-4 w-4 text-muted-foreground" /> <span>{format(new Date(pegawai.tanggalLahir), 'dd MMMM yyyy')}</span></div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jabatan">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Jabatan</CardTitle>
                <Button size="sm" onClick={() => openHistoryDialog('jabatan')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Departemen</TableHead>
                      <TableHead>Tanggal Mulai</TableHead>
                      <TableHead>Tanggal Selesai</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riwayatJabatan.length > 0 ? riwayatJabatan.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.jabatan}</TableCell>
                        <TableCell>{item.departemen}</TableCell>
                        <TableCell>{item.tanggalMulai}</TableCell>
                        <TableCell>{item.tanggalSelesai || 'Sekarang'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => openHistoryDialog('jabatan', item)}>Ubah</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog('jabatan', item)}>Hapus</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={5} className="text-center">Tidak ada data.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mutasi">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Mutasi</CardTitle>
                <Button size="sm" onClick={showNotImplementedToast}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Mutasi</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead>Tanggal Efektif</TableHead>
                      <TableHead>No. SK</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      <TableRow><TableCell colSpan={4} className="text-center">Tidak ada data.</TableCell></TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pendidikan">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Pendidikan</CardTitle>
                <Button size="sm" onClick={showNotImplementedToast}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenjang</TableHead>
                      <TableHead>Institusi</TableHead>
                      <TableHead>Jurusan</TableHead>
                      <TableHead>Tahun Lulus</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {riwayatPendidikan.length > 0 ? riwayatPendidikan.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.jenjang}</TableCell>
                          <TableCell>{item.institusi}</TableCell>
                          <TableCell>{item.jurusan}</TableCell>
                          <TableCell>{item.tahunLulus}</TableCell>
                           <TableCell className="text-right">
                                <Button size="icon" variant="ghost" onClick={showNotImplementedToast}><MoreHorizontal className="h-4 w-4" /></Button>
                           </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={5} className="text-center">Tidak ada data.</TableCell></TableRow>
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diklat">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Diklat</CardTitle>
                <Button size="sm" onClick={showNotImplementedToast}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Diklat</TableHead>
                      <TableHead>Penyelenggara</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jumlah Jam</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {riwayatDiklat.length > 0 ? riwayatDiklat.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.nama}</TableCell>
                          <TableCell>{item.penyelenggara}</TableCell>
                          <TableCell>{format(new Date(item.tanggal), 'dd-MM-yyyy')}</TableCell>
                          <TableCell>{item.jumlahJam}</TableCell>
                           <TableCell className="text-right">
                                <Button size="icon" variant="ghost" onClick={showNotImplementedToast}><MoreHorizontal className="h-4 w-4" /></Button>
                           </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={5} className="text-center">Tidak ada data.</TableCell></TableRow>
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cuti">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Cuti</CardTitle>
                 <Button size="sm" onClick={showNotImplementedToast}><PlusCircle className="mr-2 h-4 w-4" /> Ajukan Cuti</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Cuti</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead>Status</TableHead>
                       <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cuti.length > 0 ? cuti.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.jenisCuti}</TableCell>
                        <TableCell>{item.tanggalMulai} - {item.tanggalSelesai}</TableCell>
                        <TableCell>{item.keterangan}</TableCell>
                        <TableCell><Badge variant="outline">{item.status}</Badge></TableCell>
                        <TableCell className="text-right">
                            <Button size="icon" variant="ghost" onClick={showNotImplementedToast}><MoreHorizontal className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={5} className="text-center">Tidak ada data.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="penghargaan">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Penghargaan</CardTitle>
                <Button size="sm" onClick={showNotImplementedToast}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Penghargaan</TableHead>
                      <TableHead>Pemberi</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {penghargaan.length > 0 ? penghargaan.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.nama}</TableCell>
                          <TableCell>{item.pemberi}</TableCell>
                          <TableCell>{format(new Date(item.tanggal), 'dd-MM-yyyy')}</TableCell>
                           <TableCell className="text-right">
                                <Button size="icon" variant="ghost" onClick={showNotImplementedToast}><MoreHorizontal className="h-4 w-4" /></Button>
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

          <TabsContent value="hukuman">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Hukuman</CardTitle>
                <Button size="sm" variant="destructive" onClick={showNotImplementedToast}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Hukuman</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {hukuman.length > 0 ? hukuman.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.jenis}</TableCell>
                          <TableCell>{format(new Date(item.tanggal), 'dd-MM-yyyy')}</TableCell>
                          <TableCell>{item.keterangan}</TableCell>
                           <TableCell className="text-right">
                                <Button size="icon" variant="ghost" onClick={showNotImplementedToast}><MoreHorizontal className="h-4 w-4" /></Button>
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

          <TabsContent value="dokumen">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manajemen Dokumen</CardTitle>
                <Button size="sm" onClick={showNotImplementedToast}><PlusCircle className="mr-2 h-4 w-4" /> Unggah Dokumen</Button>
              </CardHeader>
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
                          <Button size="icon" variant="ghost" onClick={showNotImplementedToast}><MoreHorizontal className="h-4 w-4" /></Button>
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

      {pegawai && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                <DialogTitle>Ubah Data Pegawai</DialogTitle>
                <DialogDescription>
                    Lakukan perubahan pada data pegawai. Klik simpan jika sudah selesai.
                </DialogDescription>
                </DialogHeader>
                <EditEmployeeForm onSave={handleUpdate} employeeData={pegawai} />
            </DialogContent>
        </Dialog>
      )}

      <Dialog open={isHistoryDialogOpen} onOpenChange={(isOpen) => {
          setIsHistoryDialogOpen(isOpen);
          if (!isOpen) setSelectedHistory(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedHistory?.data ? 'Ubah' : 'Tambah'} Riwayat {selectedHistory?.type === 'jabatan' && 'Jabatan'}</DialogTitle>
            <DialogDescription>
              Isi detail riwayat baru atau perbarui yang sudah ada.
            </DialogDescription>
          </DialogHeader>
          {selectedHistory?.type === 'jabatan' && (
            <HistoryForm onSave={handleSaveHistory} historyData={selectedHistory.data} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data riwayat secara permanen.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedHistory(null)}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteHistory} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
