
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
import type { AppSettings } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Briefcase } from 'lucide-react';
import { useAuth, useDoc } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const { data: settings, isLoading: isSettingsLoading } = useDoc<AppSettings>('settings/app');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isSettingsLoading) return;

    setIsLoggingIn(true);
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: 'Login Berhasil',
            description: `Selamat datang kembali!`,
        });
        router.push('/dashboard');
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Login Gagal',
            description: 'Email atau password yang Anda masukkan salah.',
        });
        console.error(error);
    } finally {
        setIsLoggingIn(false);
    }
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
            {isSettingsLoading ? <Skeleton className="h-8 w-8 rounded-full" /> : (
              settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-8 w-8" />
              ) : (
                <Briefcase className="h-8 w-8 text-primary" />
              )
            )}
            <span className="text-2xl font-bold">{isSettingsLoading ? <Skeleton className="h-7 w-36" /> : settings?.appName}</span>
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
                    disabled={isSettingsLoading || isLoggingIn}
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
                    disabled={isSettingsLoading || isLoggingIn}
                />
            </div>
            </CardContent>
            <CardFooter>
            <Button className="w-full" type="submit" disabled={isSettingsLoading || isLoggingIn}>
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

    