
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CalendarOff, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: <Users className="h-10 w-10 text-blue-500" />,
    title: 'Manajemen Pegawai',
    description: 'Kelola data induk pegawai, riwayat jabatan, pangkat, dan pendidikan secara terpusat.',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconBgColor: 'bg-blue-100 dark:bg-blue-900/50',
  },
  {
    icon: <CalendarOff className="h-10 w-10 text-green-500" />,
    title: 'Manajemen Cuti & Absensi',
    description: 'Proses pengajuan dan persetujuan cuti secara digital. Pantau status kehadiran pegawai.',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconBgColor: 'bg-green-100 dark:bg-green-900/50',
  },
  {
    icon: <Briefcase className="h-10 w-10 text-purple-500" />,
    title: 'Mutasi & Promosi',
    description: 'Fasilitasi proses kenaikan pangkat, promosi jabatan, dan perpindahan unit kerja dengan mudah.',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconBgColor: 'bg-purple-100 dark:bg-purple-900/50',
  },
  {
    icon: <FileText className="h-10 w-10 text-orange-500" />,
    title: 'Laporan & Analitik',
    description: 'Hasilkan berbagai laporan kepegawaian dan lihat statistik penting melalui dasbor interaktif.',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    iconBgColor: 'bg-orange-100 dark:bg-orange-900/50',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-center">
        {/* Navigation removed as requested */}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{backgroundImage: 'url(/hero-bg.svg)'}}
            ></div>
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center gap-3 mb-6">
                    <Briefcase className="h-10 w-10 text-primary" />
                    <span className="text-3xl font-bold">Simpeg Smart</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                    Transformasi Manajemen <br/> <span className="text-primary">Kepegawaian Digital</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Simpeg Smart adalah solusi modern untuk mengelola seluruh siklus kepegawaian, mulai dari data induk, riwayat karir, hingga proses mutasi dan pelaporan, secara efisien dan terintegrasi.
                </p>
                <div className="mt-10">
                    <Button asChild size="lg">
                        <Link href="/login">Mulai Kelola Sekarang</Link>
                    </Button>
                </div>
            </div>
        </section>


        {/* Features Section */}
        <section id="features" className="py-20 bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Fitur Unggulan</h2>
              <p className="mt-4 text-muted-foreground">
                Semua yang Anda butuhkan untuk administrasi kepegawaian modern.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className={`text-center hover:shadow-lg transition-shadow border-none ${feature.bgColor}`}>
                  <CardHeader className="items-center">
                    <div className={`p-4 rounded-full ${feature.iconBgColor}`}>
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Simpeg Smart. Didukung oleh teknologi terkini.</p>
        </div>
      </footer>
    </div>
  );
}
