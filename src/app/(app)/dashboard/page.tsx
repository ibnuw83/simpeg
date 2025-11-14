import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, UserCheck, UserX, Building } from "lucide-react";
import { pegawaiData } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const totalPegawai = pegawaiData.length;
  const pegawaiAktif = pegawaiData.filter(p => p.status === 'Aktif').length;
  const pegawaiCuti = pegawaiData.filter(p => p.status === 'Cuti').length;
  const departments = [...new Set(pegawaiData.map(p => p.departemen))].length;
  const recentHires = pegawaiData.slice(0, 5);

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
