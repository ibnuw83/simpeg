
'use client';

import { useState, useTransition } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { allData, getAuthenticatedUser } from '@/lib/data';
import type { Pegawai } from '@/lib/types';

export default function LaporanPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateEmployeeReport = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const settings = allData().appSettings;
      const user = getAuthenticatedUser();

      // Header
      doc.setFontSize(18);
      doc.text(settings.appName || 'Laporan Kepegawaian', 14, 22);
      doc.setFontSize(11);
      doc.text('Laporan Daftar Pegawai', 14, 30);
      
      doc.setFontSize(10);
      const generationDate = `Dicetak oleh: ${user?.name || 'Admin'} pada ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`;
      doc.text(generationDate, 14, 36);
      
      const tableColumn = ["No", "Nama", "NIP", "Jabatan", "Departemen", "Status"];
      const tableRows: any[][] = [];

      const employees = allData().pegawai;
      employees.forEach((employee, index) => {
        const employeeData = [
          index + 1,
          employee.name,
          employee.nip,
          employee.jabatan,
          employee.departemen,
          employee.status,
        ];
        tableRows.push(employeeData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
      });
      
      doc.save('laporan-pegawai.pdf');
      toast({
        title: 'Sukses',
        description: 'Laporan PDF berhasil dibuat dan diunduh.',
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Laporan',
        description: 'Terjadi kesalahan saat membuat file PDF.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="space-y-2">
            <div className='flex items-center gap-4'>
                <FileText className="h-8 w-8" />
                <h1 className="text-3xl font-bold tracking-tight">Modul Laporan</h1>
            </div>
            <p className="text-muted-foreground">
                Buat dan unduh laporan kepegawaian dalam format PDF.
            </p>
        </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Laporan Daftar Pegawai</CardTitle>
          <CardDescription>
            Membuat dokumen PDF yang berisi daftar semua pegawai terdaftar beserta informasi dasar mereka seperti NIP, jabatan, departemen, dan status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateEmployeeReport} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isGenerating ? 'Membuat Laporan...' : 'Unduh PDF'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
