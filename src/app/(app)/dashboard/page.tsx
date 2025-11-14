'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, UserCheck, UserX, Building, Bell } from "lucide-react";
import { pegawaiData } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { DepartmentChart, StatusChart } from "@/components/charts/status-chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { add, format, differenceInYears } from 'date-fns';
import type { Pegawai } from "@/lib/types";

const RETIREMENT_AGE = 58;

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
  const [data, setData] = useState(pegawaiData);

  useEffect(() => {
    // This will run on the client after hydration
    // and ensure we have the latest data from localStorage
    setData(pegawaiData);
  }, []);

  const totalPegawai = data.length;
  const pegawaiAktif = data.filter(p => p.status === 'Aktif').length;
  const pegawaiCuti = data.filter(p => p.status === 'Cuti').length;
  const departments = [...new Set(data.map(p => p.departemen))].length;
  const recentHires = data.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pegawai</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPegawai}</div>
            <p className="text-xs text-muted-foreground">Jumlah seluruh pegawai terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pegawai Aktif</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pegawaiAktif}</div>
            <p className="text-xs text-muted-foreground">Pegawai dengan status aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pegawai Cuti</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pegawaiCuti}</div>
            <p className="text-xs text-muted-foreground">Pegawai yang sedang cuti</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departemen</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments}</div>
            <p className="text-xs text-muted-foreground">Jumlah departemen/dinas</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
        <StatusChart data={data} />
        <DepartmentChart data={data} />
      </div>
      
      <UpcomingRetirements data={data} />


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
            <Link href="/analitik">
                <Button className="w-full justify-start" variant="outline">Buka Analitik Pegawai</Button>
            </Link>
            <Button className="w-full justify-start" variant="outline">Laporan Kepegawaian</Button>
            <Button className="w-full justify-start">Tambah Pegawai Baru</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}