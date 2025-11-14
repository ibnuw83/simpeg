'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function PengaturanPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Aplikasi</CardTitle>
          <CardDescription>Kelola pengaturan umum aplikasi Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="appName">Nama Aplikasi</Label>
            <Input id="appName" defaultValue="Simpeg Smart" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-base">Mode Gelap</Label>
                <CardDescription>
                    Aktifkan atau nonaktifkan mode gelap untuk antarmuka.
                </CardDescription>
            </div>
            <Switch id="dark-mode" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-base">Notifikasi Email</Label>
                <CardDescription>
                    Terima notifikasi penting melalui email.
                </CardDescription>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
           <Button>Simpan Perubahan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
