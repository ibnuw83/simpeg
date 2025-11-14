'use client';

import React, { useState, useTransition } from 'react';
import { analyzeDepartmentTurnover } from '@/ai/flows/analyze-department-turnover';
import { allData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalitikPage() {
  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    startTransition(async () => {
      setAnalysis(null);
      try {
        const result = await analyzeDepartmentTurnover({
          employeeData: JSON.stringify(allData.pegawai),
        });
        if (result?.analysis) {
          setAnalysis(result.analysis);
        } else {
          throw new Error('Analisis gagal menghasilkan output.');
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Terjadi Kesalahan',
          description: 'Gagal menganalisis data. Silakan coba lagi.',
        });
      }
    });
  };

  return (
    <div className="container mx-auto py-4">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analisis Turnover Departemen Berbasis AI</CardTitle>
            <CardDescription>
              Gunakan kekuatan AI untuk mengidentifikasi tren turnover di seluruh departemen.
              Alat ini akan menganalisis data pegawai untuk menemukan departemen dengan tingkat
              turnover tertinggi dan memberikan wawasan tentang faktor-faktor yang mungkin berkontribusi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Bagaimana Cara Kerjanya?</AlertTitle>
              <AlertDescription>
                Dengan menekan tombol di bawah, sistem akan mengirimkan data pegawai (tanpa informasi sensitif)
                ke model AI untuk dianalisis. Hasilnya akan ditampilkan di bawah.
              </AlertDescription>
            </Alert>
            <Button onClick={handleAnalysis} disabled={isPending} className="mt-6">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                'Mulai Analisis Turnover'
              )}
            </Button>
          </CardContent>
        </Card>

        {isPending && (
          <Card>
            <CardHeader>
              <CardTitle>Hasil Analisis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        )}

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Hasil Analisis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                {analysis.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
