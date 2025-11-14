
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
import { allData, setAuthenticatedUser } from "@/lib/data";
import type { AppSettings, Pengguna } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Briefcase } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Ensure data is initialized on client-side
    const initialData = allData();
    setAuthenticatedUser(null);
    setSettings(initialData.appSettings);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    if (isLoading) return;

    setIsLoggingIn(true);
    const users = allData().pengguna;
    const user = users.find(u => u.email === email && u.password === password);

    setTimeout(() => {
        if (user) {
          if (user.status === 'Aktif') {
            setAuthenticatedUser(user);
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
        setIsLoggingIn(false);
    }, 500); // Simulate network delay
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-2 mb-4">
            {settings ? (
              settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-8 w-8" />
              ) : (
                <Briefcase className="h-8 w-8 text-primary" />
              )
            ) : <Skeleton className="h-8 w-8 rounded-full" />}
            <span className="text-2xl font-bold">{settings?.appName || <Skeleton className="h-7 w-36" />}</span>
          </div>
          <CardDescription>
            Masuk untuk mengakses dasbor kepegawaian Anda.
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
                    disabled={isLoading || isLoggingIn}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isLoading || isLoggingIn}
                />
            </div>
            </CardContent>
            <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading || isLoggingIn}>
                {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoggingIn ? 'Memproses...' : 'Masuk'}
            </Button>
            </CardFooter>
        </form>
      </Card>
      <div className="mt-4 text-center text-sm">
        <Link href="/" className="underline text-muted-foreground hover:text-primary">
          Kembali ke halaman utama
        </Link>
      </div>
    </div>
  )
}
