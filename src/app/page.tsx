
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CalendarOff, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { allData } from '@/lib/data';
import type { AppSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const appData = allData();
    setSettings(appData.appSettings);
    setIsLoading(false);
  }, []);

  const heroTitle = settings?.heroTitle || 'Transformasi Manajemen <br/> <span class="text-primary">Kepegawaian Digital</span>';
  const heroSubtitle = settings?.heroSubtitle || 'Simpeg Smart adalah solusi modern untuk mengelola seluruh siklus kepegawaian, mulai dari data induk, riwayat karir, hingga proses mutasi dan pelaporan, secara efisien dan terintegrasi.';
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
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
                    {isLoading ? <Skeleton className="h-10 w-10" /> : (
                      settings?.logoUrl ? 
                        <img src={settings.logoUrl} alt="Logo" className="h-10 w-10" /> : 
                        <Briefcase className="h-10 w-10 text-primary" />
                    )}
                    <span className="text-3xl font-bold">{isLoading ? <Skeleton className="h-8 w-40" /> : settings?.appName}</span>
                </div>
                {isLoading ? (
                  <>
                    <Skeleton className="h-12 w-3/4 mx-auto mt-4" />
                    <Skeleton className="h-12 w-1/2 mx-auto mt-2" />
                    <Skeleton className="h-5 w-full max-w-2xl mx-auto mt-6" />
                    <Skeleton className="h-5 w-4/5 max-w-2xl mx-auto mt-2" />
                  </>
                ) : (
                  <>
                    <h1 
                      className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
                      dangerouslySetInnerHTML={{ __html: heroTitle }}
                    />
                    <p 
                      className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: heroSubtitle }}
                    />
                  </>
                )}
                <div className="mt-10">
                    <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/login">Mulai Kelola Sekarang</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>

      <footer className="py-6 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} {settings?.appName || 'Simpeg Smart'}. Didukung oleh teknologi terkini.</p>
        </div>
      </footer>
    </div>
  );
}
