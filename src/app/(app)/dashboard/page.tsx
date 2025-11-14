'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, UserCheck, UserX, Building, Bell, CheckCircle, Gift } from "lucide-react";
import { allData } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { DepartmentChart, StatusChart } from "@/components/charts/status-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { add, format, differenceInYears, differenceInCalendarYears } from 'date-fns';
import type { Pegawai } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const RETIREMENT_AGE = 58;

const ImportantNotifications = ({ data }: { data: Pegawai[] }) => {
    const [upcomingIncreases, setUpcomingIncreases] = useState<any[]>([]);
    const [upcomingRetirements, setUpcomingRetirements] = useState<any[]>([]);

    useEffect(() => {
        const today = new Date();
        const oneYearFromNow = add(today, { years: 1 });

        // Salary Increases
        const increases = data
            .filter(p => p.status === 'Aktif' && p.tanggalMasuk)
            .map(p => {
                const startDate = new Date(p.tanggalMasuk);
                const yearsOfService = differenceInCalendarYears(today, startDate);
                const nextIncreaseYear = Math.floor((yearsOfService / 2) + 1) * 2;
                const nextIncreaseDate = add(startDate, { years: nextIncreaseYear });
                return { ...p, nextIncreaseDate, notificationType: 'Kenaikan Gaji' };
            })
            .filter(p => p.nextIncreaseDate > today && p.nextIncreaseDate <= oneYearFromNow);

        // Retirements
        const retirements = data
            .filter(p => p.status === 'Aktif' && p.tanggalLahir)
            .map(p => {
                const birthDate = new Date(p.tanggalLahir);
                const retirementDate = add(birthDate, { years: RETIREMENT_AGE });
                return { ...p, retirementDate, notificationType: 'Pensiun' };
            })
            .filter(p => p.retirementDate > today && p.retirementDate <= oneYearFromNow);

        const allNotifications = [
            ...increases.map(p => ({...p, effectiveDate: p.nextIncreaseDate})),
            ...retirements.map(p => ({...p, effectiveDate: p.retirementDate}))
        ].sort((a, b) => a.effectiveDate.getTime() - b.effectiveDate.getTime());
            
        setUpcomingIncreases(allNotifications.filter(n => n.notificationType === 'Kenaikan Gaji'));
        setUpcomingRetirements(allNotifications.filter(n => n.notificationType === 'Pensiun'));

    }, [data]);

    if (upcomingIncreases.length === 0 && upcomingRetirements.length === 0) {
        return null; // Don't render if no notifications
    }

    return (
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
                {upcomingIncreases.map(pegawai => (
                    <div key={`increase-${pegawai.id}`} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background">
                           <CheckCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">Kenaikan Gaji Berkala - {pegawai.name}</p>
                            <p className="text-sm text-muted-foreground">Jatuh Tempo: {format(pegawai.nextIncreaseDate, 'dd MMM yyyy')}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/pegawai/${pegawai.id}`}>Lihat Detail</Link>
                        </Button>
                    </div>
                ))}
                {upcomingRetirements.map(pegawai => (
                    <div key={`retire-${pegawai.id}`} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                         <div className="flex items-center justify-center h-10 w-10 rounded-full bg-background">
                           <Gift className="h-6 w-6 text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">Pensiun - {pegawai.name}</p>
                            <p className="text-sm text-muted-foreground">Jatuh Tempo: {format(pegawai.retirementDate, 'dd MMM yyyy')}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/pegawai/${pegawai.id}`}>Lihat Detail</Link>
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};


const UpcomingRetirements = ({ data }: { data: Pegawai[] }) => {
  const [upcomingRetirements, setUpcomingRetirements] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const oneYearFromNow = add(today, { years: 1 });

    const retiringSoon = data
      .filter(p => p.status === 'Aktif' && p.tanggalLahir)
      .map(p => {
        const birthDate = new Date(p.tanggalLahir);
        const retirementDate = add(birthDate, { years: RETIREMENT_AGE });
        const age = differenceInYears(today, birthDate);
        return { ...p, retirementDate, age };
      })
      .filter(p => p.retirementDate > today && p.retirementDate <= oneYearFromNow)
      .sort((a, b) => a.retirementDate.getTime() - b.retirementDate.getTime());

    setUpcomingRetirements(retiringSoon);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <Bell className="h-6 w-6" />
            <div>
                <CardTitle>Notifikasi Pensiun</CardTitle>
                <CardDescription>Pegawai yang akan pensiun dalam 1 tahun ke depan.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingRetirements.length > 0 ? (
          <div className="space-y-4">
            {upcomingRetirements.map((pegawai) => (
              <div key={pegawai.id} className="flex items-center gap-4">
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={pegawai.avatarUrl} alt={pegawai.name} data-ai-hint={pegawai.imageHint} />
                    <AvatarFallback>{pegawai.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{pegawai.name}</p>
                  <p className="text-sm text-muted-foreground">{pegawai.jabatan}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold">{format(pegawai.retirementDate, 'dd MMM yyyy')}</p>
                    <p className="text-xs text-muted-foreground">Usia {pegawai.age} thn</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center text-sm text-muted-foreground py-6">
                Tidak ada pegawai yang akan pensiun dalam waktu dekat.
            </div>
        )}
      </CardContent>
    </Card>
  );
};


export default function DashboardPage() {
  const [data, setData] = useState<Pegawai[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This will run on the client after hydration
    // and ensure we have the latest data from localStorage
    setData(allData().pegawai);
    setIsLoading(false);
  }, []);

  const totalPegawai = data.length;
  const pegawaiAktif = data.filter(p => p.status === 'Aktif').length;
  const pegawaiCuti = data.filter(p => p.status === 'Cuti').length;
  const departments = [...new Set(data.map(p => p.departemen))].length;
  const recentHires = data.slice(0, 5);

  if (isLoading) {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-32 w-full" />
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
       <ImportantNotifications data={data} />
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
        <StatusChart data={data} />
        <DepartmentChart data={data} />
      </div>
      
      {/* This card is now redundant as it's merged into ImportantNotifications */}
      {/* <UpcomingRetirements data={data} /> */}


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
            <Button className="w-full justify-start" variant="outline">Laporan Kepegawaian</Button>
            <Button className="w-full justify-start">Tambah Pegawai Baru</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
