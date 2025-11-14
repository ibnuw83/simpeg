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

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
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
            <span className="text-xl font-semibold">{settings?.appName || <Skeleton className="h-6 w-32" />}</span>
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
                    disabled={isLoading || isLoggingIn}
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
    </div>
  )
}
