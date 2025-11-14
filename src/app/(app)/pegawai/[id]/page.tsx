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
import type { Pegawai, RiwayatJabatan, RiwayatPangkat, Cuti, Dokumen, RiwayatPendidikan, RiwayatDiklat, Penghargaan, Hukuman, RiwayatMutasi } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditEmployeeForm } from '@/components/forms/edit-employee-form';
import { useToast } from '@/hooks/use-toast';
import { HistoryForm } from '@/components/forms/history-form';
import { AwardForm } from '@/components/forms/award-form';
import { EducationForm } from '@/components/forms/education-form';
import { TrainingForm } from '@/components/forms/training-form';
import { LeaveForm } from '@/components/forms/leave-form';
import { PunishmentForm } from '@/components/forms/punishment-form';
import { DocumentForm } from '@/components/forms/document-form';

function getStatusVariant(status: Pegawai['status']) {
    switch (status) {
      case 'Aktif': return 'default';
      case 'Cuti': return 'secondary';
      case 'Pensiun': return 'destructive';
      default: return 'outline';
    }
}

type DialogState = {
    isOpen: boolean;
    type: 'jabatan' | 'penghargaan' | 'pendidikan' | 'diklat' | 'hukuman' | 'dokumen' | 'cuti' | null;
    data: any | null;
};

export default function PegawaiDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  
  const [pegawai, setPegawai] = useState<Pegawai | null | undefined>(undefined);
  const [riwayatJabatan, setRiwayatJabatan] = useState<RiwayatJabatan[]>([]);
  const [riwayatMutasi, setRiwayatMutasi] = useState<RiwayatMutasi[]>([]);
  const [riwayatPendidikan, setRiwayatPendidikan] = useState<RiwayatPendidikan[]>([]);
  const [riwayatDiklat, setRiwayatDiklat] = useState<RiwayatDiklat[]>([]);
  const [cuti, setCuti] = useState<Cuti[]>([]);
  const [penghargaan, setPenghargaan] = useState<Penghargaan[]>([]);
  const [hukuman, setHukuman] = useState<Hukuman[]>([]);
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [historyDialogState, setHistoryDialogState] = useState<DialogState>({ isOpen: false, type: null, data: null });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const id = typeof params.id === 'string' ? params.id : null;

  const loadData = React.useCallback(() => {
    if (!id) return;

    const data = allData();
    const pegawaiData = data.pegawai.find(p => p.id === id);
    setPegawai(pegawaiData ?? null);

    if (pegawaiData) {
      setRiwayatJabatan(data.riwayatJabatan.filter(rj => rj.pegawaiId === id));
      setRiwayatMutasi(data.riwayatMutasi.filter(rm => rm.pegawaiId === id));
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
    toast({ title: 'Sukses', description: `Data pegawai berhasil diperbarui.` });
  };
  
  const handleSaveHistory = (type: DialogState['type'], newData: any) => {
      if (!id || !type) return;

      const currentData = allData();
      let toastMessage = '';
      const isEditing = !!historyDialogState.data;

      const generateId = () => new Date().getTime().toString();

      switch (type) {
          case 'jabatan':
              const updatedJabatan = isEditing
                  ? currentData.riwayatJabatan.map(item => item.id === historyDialogState.data.id ? { ...historyDialogState.data, ...newData } : item)
                  : [...currentData.riwayatJabatan, { ...newData, id: generateId(), pegawaiId: id }];
              updateAllData({ ...currentData, riwayatJabatan: updatedJabatan });
              toastMessage = 'Riwayat jabatan';
              break;
          case 'penghargaan':
              const updatedPenghargaan = isEditing
                  ? currentData.penghargaan.map(item => item.id === historyDialogState.data.id ? { ...historyDialogState.data, ...newData } : item)
                  : [...currentData.penghargaan, { ...newData, id: generateId(), pegawaiId: id }];
              updateAllData({ ...currentData, penghargaan: updatedPenghargaan });
              toastMessage = 'Riwayat penghargaan';
              break;
          case 'pendidikan':
              const updatedPendidikan = isEditing
                  ? currentData.riwayatPendidikan.map(item => item.id === historyDialogState.data.id ? { ...historyDialogState.data, ...newData } : item)
                  : [...currentData.riwayatPendidikan, { ...newData, id: generateId(), pegawaiId: id }];
              updateAllData({ ...currentData, riwayatPendidikan: updatedPendidikan });
              toastMessage = 'Riwayat pendidikan';
              break;
          case 'diklat':
              const updatedDiklat = isEditing
                  ? currentData.riwayatDiklat.map(item => item.id === historyDialogState.data.id ? { ...historyDialogState.data, ...newData } : item)
                  : [...currentData.riwayatDiklat, { ...newData, id: generateId(), pegawaiId: id }];
              updateAllData({ ...currentData, riwayatDiklat: updatedDiklat });
              toastMessage = 'Riwayat diklat';
              break;
          case 'cuti':
              const updatedCuti = isEditing
                  ? currentData.cuti.map(item => item.id === historyDialogState.data.id ? { ...historyDialogState.data, ...newData } : item)
                  : [...currentData.cuti, { ...newData, id: generateId(), pegawaiId: id }];
              updateAllData({ ...currentData, cuti: updatedCuti });
              toastMessage = 'Riwayat cuti';
              break;
          case 'hukuman':
              const updatedHukuman = isEditing
                  ? currentData.hukuman.map(item => item.id === historyDialogState.data.id ? { ...historyDialogState.data, ...newData } : item)
                  : [...currentData.hukuman, { ...newData, id: generateId(), pegawaiId: id }];
              updateAllData({ ...currentData, hukuman: updatedHukuman });
              toastMessage = 'Riwayat hukuman';
              break;
          case 'dokumen':
              const updatedDokumen = isEditing
                  ? currentData.dokumen.map(item => item.id === historyDialogState.data.id ? { ...historyDialogState.data, ...newData } : item)
                  : [...currentData.dokumen, { ...newData, id: generateId(), pegawaiId: id, fileUrl: '#' }];
              updateAllData({ ...currentData, dokumen: updatedDokumen });
              toastMessage = 'Dokumen';
              break;
          default:
              showNotImplementedToast();
              return;
      }
      
      loadData();
      closeHistoryDialog();
      toast({ title: 'Sukses', description: `${toastMessage} berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.` });
  };

  const handleDeleteHistory = () => {
    if (!historyDialogState.type || !historyDialogState.data) return;
    
    const currentData = allData();
    let toastMessage = '';
    const idToDelete = historyDialogState.data.id;

    switch (historyDialogState.type) {
        case 'jabatan':
            updateAllData({ ...currentData, riwayatJabatan: currentData.riwayatJabatan.filter(item => item.id !== idToDelete) });
            toastMessage = 'Riwayat jabatan';
            break;
        case 'penghargaan':
            updateAllData({ ...currentData, penghargaan: currentData.penghargaan.filter(item => item.id !== idToDelete) });
            toastMessage = 'Riwayat penghargaan';
            break;
        case 'pendidikan':
            updateAllData({ ...currentData, riwayatPendidikan: currentData.riwayatPendidikan.filter(item => item.id !== idToDelete) });
            toastMessage = 'Riwayat pendidikan';
            break;
        case 'diklat':
            updateAllData({ ...currentData, riwayatDiklat: currentData.riwayatDiklat.filter(item => item.id !== idToDelete) });
            toastMessage = 'Riwayat diklat';
            break;
        case 'cuti':
            updateAllData({ ...currentData, cuti: currentData.cuti.filter(item => item.id !== idToDelete) });
            toastMessage = 'Riwayat cuti';
            break;
        case 'hukuman':
            updateAllData({ ...currentData, hukuman: currentData.hukuman.filter(item => item.id !== idToDelete) });
            toastMessage = 'Riwayat hukuman';
            break;
        case 'dokumen':
            updateAllData({ ...currentData, dokumen: currentData.dokumen.filter(item => item.id !== idToDelete) });
            toastMessage = 'Dokumen';
            break;
        default:
            showNotImplementedToast();
            return;
    }

    loadData();
    closeDeleteDialog();
    toast({ title: 'Sukses', description: `${toastMessage} berhasil dihapus.` });
  }

  const openHistoryDialog = (type: DialogState['type'], data: any | null = null) => {
    setHistoryDialogState({ isOpen: true, type, data });
  }

  const closeHistoryDialog = () => {
      setHistoryDialogState({ isOpen: false, type: null, data: null });
  }

  const openDeleteDialog = (type: DialogState['type'], data: any) => {
      setHistoryDialogState({ isOpen: false, type, data }); 
      setIsDeleteDialogOpen(true);
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setHistoryDialogState({ isOpen: false, type: null, data: null });
  }

  const showNotImplementedToast = () => {
    toast({
        variant: 'destructive',
        title: 'Fitur Belum Tersedia',
        description: 'Fungsionalitas untuk ini sedang dalam pengembangan.',
    });
  }

  const renderHistoryForm = () => {
      switch (historyDialogState.type) {
          case 'jabatan':
              return <HistoryForm onSave={(data) => handleSaveHistory('jabatan', data)} historyData={historyDialogState.data} onCancel={closeHistoryDialog} />;
          case 'penghargaan':
              return <AwardForm onSave={(data) => handleSaveHistory('penghargaan', data)} awardData={historyDialogState.data} onCancel={closeHistoryDialog} />;
          case 'pendidikan':
              return <EducationForm onSave={(data) => handleSaveHistory('pendidikan', data)} educationData={historyDialogState.data} onCancel={closeHistoryDialog} />;
          case 'diklat':
              return <TrainingForm onSave={(data) => handleSaveHistory('diklat', data)} trainingData={historyDialogState.data} onCancel={closeHistoryDialog} />;
          case 'cuti':
              return <LeaveForm onSave={(data) => handleSaveHistory('cuti', data)} leaveData={historyDialogState.data} onCancel={closeHistoryDialog} />;
          case 'hukuman':
              return <PunishmentForm onSave={(data) => handleSaveHistory('hukuman', data)} punishmentData={historyDialogState.data} onCancel={closeHistoryDialog} />;
          case 'dokumen':
              return <DocumentForm onSave={(data) => handleSaveHistory('dokumen', data)} documentData={historyDialogState.data} onCancel={closeHistoryDialog} />;
          default:
              return null;
      }
  }

  const getDialogTitle = () => {
      if (!historyDialogState.type) return '';
      const action = historyDialogState.data ? 'Ubah' : 'Tambah';
      const titles = {
          jabatan: 'Riwayat Jabatan',
          penghargaan: 'Riwayat Penghargaan',
          pendidikan: 'Riwayat Pendidikan',
          diklat: 'Riwayat Diklat',
          hukuman: 'Riwayat Hukuman',
          dokumen: 'Dokumen',
          cuti: 'Riwayat Cuti'
      };
      return `${action} ${titles[historyDialogState.type]}`;
  }

  const getDeleteDescription = () => {
      if (!historyDialogState.type || !historyDialogState.data) return '';
      const data = historyDialogState.data;
      const descriptions = {
          jabatan: `riwayat jabatan "${data.jabatan}"`,
          penghargaan: `riwayat penghargaan "${data.nama}"`,
          pendidikan: `riwayat pendidikan "${data.jenjang} di ${data.institusi}"`,
          diklat: `riwayat diklat "${data.nama}"`,
          cuti: `riwayat cuti "${data.jenisCuti} pada ${data.tanggalMulai}"`,
          hukuman: `riwayat hukuman "${data.jenis}"`,
          dokumen: `dokumen "${data.namaDokumen}"`,
      };
      return `Tindakan ini tidak dapat dibatalkan. Ini akan menghapus ${descriptions[historyDialogState.type] || 'data ini'} secara permanen.`;
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
                  <div className="flex items-center"><Cake className="mr-2 h-4 w-4 text-muted-foreground" /> <span>{pegawai.tempatLahir}, {format(new Date(pegawai.tanggalLahir), 'dd MMMM yyyy')}</span></div>
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
                        <TableCell>{format(new Date(item.tanggalMulai), 'dd-MM-yyyy')}</TableCell>
                        <TableCell>{item.tanggalSelesai ? format(new Date(item.tanggalSelesai), 'dd-MM-yyyy') : 'Sekarang'}</TableCell>
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
                    {riwayatMutasi.length > 0 ? riwayatMutasi.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.jenisMutasi}</TableCell>
                        <TableCell>{item.keterangan}</TableCell>
                        <TableCell>{format(new Date(item.tanggalEfektif), 'dd-MM-yyyy')}</TableCell>
                        <TableCell>{item.nomorSK}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={4} className="text-center">Tidak ada data.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pendidikan">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Pendidikan</CardTitle>
                <Button size="sm" onClick={() => openHistoryDialog('pendidikan')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => openHistoryDialog('pendidikan', item)}>Ubah</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog('pendidikan', item)}>Hapus</DropdownMenuItem>
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

          <TabsContent value="diklat">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Diklat</CardTitle>
                <Button size="sm" onClick={() => openHistoryDialog('diklat')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
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
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => openHistoryDialog('diklat', item)}>Ubah</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog('diklat', item)}>Hapus</DropdownMenuItem>
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

          <TabsContent value="cuti">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Cuti</CardTitle>
                 <Button size="sm" onClick={() => openHistoryDialog('cuti')}><PlusCircle className="mr-2 h-4 w-4" /> Ajukan Cuti</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Cuti</TableHead>
                      <TableHead>Tanggal Mulai</TableHead>
                      <TableHead>Tanggal Selesai</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cuti.length > 0 ? cuti.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.jenisCuti}</TableCell>
                        <TableCell>{format(new Date(item.tanggalMulai), 'dd-MM-yyyy')}</TableCell>
                        <TableCell>{format(new Date(item.tanggalSelesai), 'dd-MM-yyyy')}</TableCell>
                        <TableCell><Badge variant="outline">{item.status}</Badge></TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => openHistoryDialog('cuti', item)}>Ubah</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog('cuti', item)}>Hapus</DropdownMenuItem>
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

          <TabsContent value="penghargaan">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Penghargaan</CardTitle>
                <Button size="sm" onClick={() => openHistoryDialog('penghargaan')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => openHistoryDialog('penghargaan', item)}>Ubah</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog('penghargaan', item)}>Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                <Button size="sm" variant="destructive" onClick={() => openHistoryDialog('hukuman')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat</Button>
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
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => openHistoryDialog('hukuman', item)}>Ubah</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog('hukuman', item)}>Hapus</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                <Button size="sm" onClick={() => openHistoryDialog('dokumen')}><PlusCircle className="mr-2 h-4 w-4" /> Unggah Dokumen</Button>
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
                        <TableCell>{format(new Date(item.tanggalUnggah), 'dd-MM-yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={item.fileUrl} download><Download className="h-4 w-4" /></a>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => openHistoryDialog('dokumen', item)}>Ubah</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog('dokumen', item)}>Hapus</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                <EditEmployeeForm onSave={handleUpdate} employeeData={pegawai} onCancel={() => setIsEditDialogOpen(false)} />
            </DialogContent>
        </Dialog>
      )}

      <Dialog open={historyDialogState.isOpen} onOpenChange={(isOpen) => {
          if (!isOpen) closeHistoryDialog();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              Isi detail riwayat baru atau perbarui yang sudah ada.
            </DialogDescription>
          </DialogHeader>
          {renderHistoryForm()}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                {getDeleteDescription()}
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteHistory} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
