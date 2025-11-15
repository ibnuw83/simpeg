
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, UserCheck, UserX, Building, Bell, CheckCircle, Gift, TrendingUp, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { DepartmentChart, StatusChart } from "@/components/charts/status-chart";
import { add, format, differenceInCalendarYears } from 'date-fns';
import type { Pegawai, Pengguna, RiwayatMutasi } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MutationForm } from "@/components/forms/mutation-form";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";


type NotificationItem = Pegawai & { 
    effectiveDate: Date;
    notificationType: 'Kenaikan Gaji Berkala' | 'Kenaikan Pangkat Reguler' | 'Pensiun';
    mutationType: "perpindahan" | "promosi" | "gaji" | "pangkat" | "pensiun";
};

const SALARY_INCREASE_INTERVAL = 2; // years
const PROMOTION_INTERVAL = 4; // years
const RETIREMENT_AGE = 58; // years

const ImportantNotifications = ({ data, currentUser }: { data: Pegawai[], currentUser: Pengguna | null }) => {
    const firestore = useFirestore();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedNotification, setSelectedNotification] = React.useState<NotificationItem | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const today = new Date();
        const oneYearFromNow = add(today, { years: 1 });

        const activeEmployees = data.filter(p => p.status === 'Aktif');

        const salaryIncreases = activeEmployees
            .filter(p => p.tanggalMasuk)
            .map(p => {
                const startDate = new Date(p.tanggalMasuk);
                const yearsOfService = differenceInCalendarYears(today, startDate);
                const nextIncreaseYear = Math.floor((yearsOfService / SALARY_INCREASE_INTERVAL) + 1) * SALARY_INCREASE_INTERVAL;
                const nextIncreaseDate = add(startDate, { years: nextIncreaseYear });
                return { ...p, effectiveDate: nextIncreaseDate, notificationType: 'Kenaikan Gaji Berkala', mutationType: 'gaji' as "gaji" };
            })
            .filter(p => p.effectiveDate > today && p.effectiveDate <= oneYearFromNow);

        const promotions = activeEmployees
            .filter(p => p.tanggalMasuk)
            .map(p => {
                const startDate = new Date(p.tanggalMasuk);
                const yearsOfService = differenceInCalendarYears(today, startDate);
                const nextPromotionYear = Math.floor((yearsOfService / PROMOTION_INTERVAL) + 1) * PROMOTION_INTERVAL;
                const nextPromotionDate = add(startDate, { years: nextPromotionYear });
                return { ...p, effectiveDate: nextPromotionDate, notificationType: 'Kenaikan Pangkat Reguler', mutationType: 'pangkat' as "pangkat" };
            })
            .filter(p => p.effectiveDate > today && p.effectiveDate <= oneYearFromNow);

        const retirements = activeEmployees
            .filter(p => p.tanggalLahir)
            .map(p => {
                const birthDate = new Date(p.tanggalLahir);
                const retirementDate = add(birthDate, { years: RETIREMENT_AGE });
                return { ...p, effectiveDate: retirementDate, notificationType: 'Pensiun', mutationType: 'pensiun' as "pensiun" };
            })
            .filter(p => p.effectiveDate > today && p.effectiveDate <= oneYearFromNow);

        const allNotifications = [
            ...salaryIncreases,
            ...promotions,
            ...retirements
        ].sort((a, b) => a.effectiveDate.getTime() - b.effectiveDate.getTime());
            
        setNotifications(allNotifications);

    }, [data]);

    const handleOpenDialog = (notification: NotificationItem) => {
        setSelectedNotification(notification);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedNotification(null);
    }
    
    const handleSave = async (data: any) => {
        const { mutationType, pegawaiId, ...mutationData } = data;

        const newMutation: Omit<RiwayatMutasi, 'id'> = {
          pegawaiId: pegawaiId,
          jenisMutasi: mutationType,
          keterangan: data.keterangan || `Proses ${mutationType}`,
          tanggalEfektif: data.tanggalEfektif,
          nomorSK: data.nomorSK,
          googleDriveLink: data.googleDriveLink,
        };

        try {
            const collectionRef = collection(firestore, 'pegawai', pegawaiId, 'riwayatMutasi');
            await addDoc(collectionRef, newMutation);

            toast({
                title: 'Sukses',
                description: `Dokumen untuk proses ${selectedNotification?.notificationType} berhasil disimpan.`,
            });
            handleCloseDialog();
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Gagal Menyimpan',
                description: `Terjadi kesalahan: ${error instanceof Error ? error.message : String(error)}`,
            });
        }
    }

    const renderNotificationItem = (item: NotificationItem) => {
        let icon;
        let title;

        switch (item.notificationType) {
            case 'Kenaikan Gaji Berkala':
                icon = <CheckCircle className="h-6 w-6 text-primary" />;
                title = `Kenaikan Gaji Berkala - ${item.name}`;
                break;
            case 'Kenaikan Pangkat Reguler':
                icon = <TrendingUp className="h-6 w-6 text-green-500" />;
                title = `Kenaikan Pangkat Reguler - ${item.name}`;
                break;
            case 'Pensiun':
                icon = <Gift className="h-6 w-6 text-orange-500" />;
                title = `Pensiun - ${item.name}`;
                break;
            default:
                return null;
        }

        return (
             <div key={`${item.notificationType}-${item.id}`} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background">
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">Jatuh Tempo: {format(item.effectiveDate, 'dd MMM yyyy')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                    Lengkapi Dokumen
                </Button>
            </div>
        )
    };

    if (notifications.length === 0 || currentUser?.role !== 'Admin') {
        return null;
    }


    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Bell className="h-6 w-6" />
                        <div>
                            <CardTitle>Notifikasi Penting</CardTitle>
                            <CardDescription>Pengingat terkait kepegawaian yang akan datang dalam 1 tahun ke depan.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {notifications.map(item => renderNotificationItem(item))}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    {selectedNotification && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Lengkapi Dokumen: {selectedNotification.notificationType}</DialogTitle>
                                <DialogDescription>
                                    Unggah atau tautkan dokumen pendukung untuk proses ini.
                                </DialogDescription>
                            </DialogHeader>
                            <MutationForm 
                                mutationType={selectedNotification.mutationType}
                                onSave={handleSave}
                                onCancel={handleCloseDialog}
                                prefilledEmployee={selectedNotification}
                            />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default function DashboardPage() {
  const router = useRouter();
  const { userData, isLoading: isUserLoading } = useUser();
  const { data: pegawaiData, isLoading: isPegawaiLoading } = useCollection<Pegawai>('pegawai');
  const { data: departemenData, isLoading: isDepartemenLoading } = useCollection<any>('departemen');
  
  const isLoading = isUserLoading || isPegawaiLoading || isDepartemenLoading;

  useEffect(() => {
    if (!isUserLoading && !userData) {
        router.push('/login');
    }
  }, [userData, isUserLoading, router]);

  const totalPegawai = pegawaiData.length;
  const pegawaiAktif = pegawaiData.filter(p => p.status === 'Aktif').length;
  const pegawaiCuti = pegawaiData.filter(p => p.status === 'Cuti').length;
  const departments = departemenData.length;

  const recentHires = React.useMemo(() => 
    [...pegawaiData]
        .sort((a,b) => new Date(b.tanggalMasuk).getTime() - new Date(a.tanggalMasuk).getTime())
        .slice(0, 5),
    [pegawaiData]);

  const notificationData = React.useMemo(() => {
    if (!userData) return [];
    if (userData.role === 'Admin') {
      return pegawaiData;
    }
    return pegawaiData.filter(p => p.id === userData.pegawaiId);
  }, [pegawaiData, userData]);


  if (isLoading) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
             <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
       <ImportantNotifications data={notificationData} currentUser={userData} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Pegawai</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalPegawai}</div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Jumlah seluruh pegawai terdaftar</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Pegawai Aktif</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{pegawaiAktif}</div>
            <p className="text-xs text-green-700 dark:text-green-300">Pegawai dengan status aktif</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Pegawai Cuti</CardTitle>
            <UserX className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{pegawaiCuti}</div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">Pegawai yang sedang cuti</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Departemen</CardTitle>
            <Building className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{departments}</div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Jumlah departemen/dinas</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
        <StatusChart data={pegawaiData} />
        <DepartmentChart data={pegawaiData} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pegawai Baru</CardTitle>
            <CardDescription>5 pegawai yang baru saja bergabung.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHires.map((pegawai) => (
                <div key={pegawai.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{pegawai.name}</p>
                    <p className="text-sm text-muted-foreground">{pegawai.jabatan}</p>
                  </div>
                  <div className="ml-auto font-medium">{pegawai.departemen}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
            <CardDescription>Navigasi cepat ke fitur utama.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Link href="/pegawai">
                <Button className="w-full justify-start" variant="outline">Lihat Semua Pegawai</Button>
            </Link>
             <Link href="/laporan">
                <Button className="w-full justify-start" variant="outline">Laporan Kepegawaian</Button>
            </Link>
             <Link href="/pegawai">
                <Button className="w-full justify-start">Tambah Pegawai Baru</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    