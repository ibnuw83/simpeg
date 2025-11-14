
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CalendarOff, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Manajemen Pegawai',
    description: 'Kelola data induk pegawai, riwayat jabatan, pangkat, dan pendidikan secara terpusat.',
  },
  {
    icon: <CalendarOff className="h-10 w-10 text-primary" />,
    title: 'Manajemen Cuti & Absensi',
    description: 'Proses pengajuan dan persetujuan cuti secara digital. Pantau status kehadiran pegawai.',
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Mutasi & Promosi',
    description: 'Fasilitasi proses kenaikan pangkat, promosi jabatan, dan perpindahan unit kerja dengan mudah.',
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: 'Laporan & Analitik',
    description: 'Hasilkan berbagai laporan kepegawaian dan lihat statistik penting melalui dasbor interaktif.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Simpeg Smart</span>
        </div>
        <nav>
          <Button asChild>
            <Link href="/login">Masuk Aplikasi</Link>
          </Button>
        </nav>
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
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader className="items-center">
                    <div className="bg-primary/10 p-4 rounded-full">
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
