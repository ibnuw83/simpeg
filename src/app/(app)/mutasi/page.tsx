'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, ArrowUpCircle, DollarSign, TrendingUp, PlusCircle, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MutationForm, MutationType } from '@/components/forms/mutation-form';

const processModules: { title: string; icon: React.ElementType; color: string; bgColor: string, type: MutationType }[] = [
    {
      title: 'Perpindahan Unit Kerja',
      icon: ArrowRightLeft,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      type: 'perpindahan'
    },
    {
      title: 'Kenaikan Jabatan (Promosi)',
      icon: ArrowUpCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      type: 'promosi'
    },
    {
      title: 'Kenaikan Gaji Berkala',
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      type: 'gaji'
    },
    {
      title: 'Kenaikan Pangkat',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      type: 'pangkat'
    },
];


export default function MutasiPage() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedModule, setSelectedModule] = React.useState<(typeof processModules)[0] | null>(null);

    const handleOpenDialog = (module: (typeof processModules)[0]) => {
        setSelectedModule(module);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedModule(null);
    }
    
    const handleSave = (data: any) => {
        console.log('Saving mutation data:', data);
        // Here you would typically handle the data saving logic, 
        // e.g., updating employee data and history in localStorage
        handleCloseDialog();
    }

  return (
    <>
        <div className="flex flex-col gap-6">
            <div className="space-y-2">
                <div className='flex items-center gap-4'>
                    <TrendingUpIcon className="h-8 w-8" />
                    <h1 className="text-3xl font-bold tracking-tight">Modul Mutasi &amp; Promosi</h1>
                </div>
                <p className="text-muted-foreground">
                    Pilih jenis proses kepegawaian yang ingin Anda lakukan. Setiap proses akan meminta Anda untuk memilih pegawai dan mengunggah dokumen SK yang relevan.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {processModules.map((item) => (
                <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className='flex items-center gap-4'>
                            <div className={`flex items-center justify-center rounded-lg p-2 ${item.bgColor}`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} />
                            </div>
                            <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full mt-4" onClick={() => handleOpenDialog(item)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Mulai Proses
                        </Button>
                    </CardContent>
                </Card>
                ))}
        </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
                {selectedModule && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{selectedModule.title}</DialogTitle>
                            <DialogDescription>
                                Pilih pegawai dan isi detail untuk proses {selectedModule.title.toLowerCase()}.
                            </DialogDescription>
                        </DialogHeader>
                        <MutationForm 
                            mutationType={selectedModule.type}
                            onSave={handleSave}
                            onCancel={handleCloseDialog}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    </>
  );
}
