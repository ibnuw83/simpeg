"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { SidebarNav } from "./sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const pathToTitle: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/pegawai': 'Manajemen Pegawai',
  '/departemen': 'Manajemen Departemen',
  '/pangkat': 'Manajemen Pangkat & Golongan',
  '/mutasi': 'Mutasi & Promosi',
  '/pensiun': 'Manajemen Pensiun',
  '/pengguna': 'Manajemen Pengguna',
  '/analitik': 'Analitik & Laporan',
  '/pengaturan': 'Pengaturan',
}

function getTitle(path: string): string {
  if (path.startsWith('/pegawai/')) {
    return 'Detail Pegawai';
  }
  return pathToTitle[path] || 'Simpeg Smart';
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const title = getTitle(pathname);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SidebarNav isMobile={true} />
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1">
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User" data-ai-hint="person face" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Admin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/pengguna">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
             <Link href="/pengaturan">
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
             </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
