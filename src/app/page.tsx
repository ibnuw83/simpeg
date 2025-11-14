
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { allData } from '@/lib/data';
import type { AppSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

export default function HomePage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const appData = allData();
    setSettings(appData.appSettings);
    setIsLoading(false);
  }, []);

  const heroTitle = settings?.heroTitle || 'Administrasi Kepegawaian <span class="text-primary">Terintegrasi</span>';
  const heroSubtitle = settings?.heroSubtitle || 'Kelola data pegawai hingga pensiun dalam satu sistem yang ringkas dan cerdas—tanpa ribet, tanpa tumpukan berkas.';
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        
        {settings?.runningText && (
          <div className="bg-secondary text-secondary-foreground overflow-hidden whitespace-nowrap relative h-10 flex items-center">
            <div className="marquee-text inline-block pl-[100%]">
              {settings.runningText}
            </div>
             <div className="marquee-text inline-block pl-[100%]">
              {settings.runningText}
            </div>
          </div>
        )}

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

        {/* Carousel Section */}
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {(settings?.collageImages || []).map((image, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                                             <Image
                                                src={image.url}
                                                alt={image.alt}
                                                width={400}
                                                height={300}
                                                className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
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
