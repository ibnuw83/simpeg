'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { allData } from "@/lib/data";
import type { AppSettings } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');

  useEffect(() => {
    const loadedSettings = allData().appSettings;
    setSettings(loadedSettings);
  }, []);

  const handleLogin = () => {
    const users = allData().pengguna;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      if (user.status === 'Aktif') {
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang kembali, ${user.name}!`,
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Gagal',
          description: 'Akun Anda saat ini tidak aktif.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description: 'Email atau password yang Anda masukkan salah.',
      });
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {settings ? (
              settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-6 w-6" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 12c-3.33 0-5 2.67-5 4s1.67 4 5 4 5-2.67 5-4-1.67-4-5-4zm0-8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              )
            ) : <Skeleton className="h-6 w-6 rounded-full" />}
            <span className="text-xl font-semibold">{settings?.appName || 'Simpeg Smart'}</span>
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Masukkan email dan password Anda untuk masuk ke dasbor.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleFormSubmit}>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>
            </CardContent>
            <CardFooter>
            <Button className="w-full" type="submit">Masuk</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  )
}
