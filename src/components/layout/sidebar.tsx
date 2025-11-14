
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LayoutDashboard, Users, User, Settings, UserCog, Building, ShieldCheck, ArrowRightLeft, Archive } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { allData, getAuthenticatedUser } from '@/lib/data';
import type { AppSettings, Pengguna } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const allNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Pengguna'] },
  { href: '/pegawai', icon: Users, label: 'Pegawai', roles: ['Admin'] },
  { href: '/pegawai/[id]', icon: User, label: 'Profil Saya', roles: ['Pengguna'] },
  { href: '/departemen', icon: Building, label: 'Departemen', roles: ['Admin'] },
  { href: '/pangkat', icon: ShieldCheck, label: 'Pangkat/Gol', roles: ['Admin'] },
  { href: '/mutasi', icon: ArrowRightLeft, label: 'Mutasi & Promosi', roles: ['Admin'] },
  { href: '/pensiun', icon: Archive, label: 'Pensiun', roles: ['Admin'] },
  { href: '/pengguna', icon: UserCog, label: 'Pengguna', roles: ['Admin'] },
];

const bottomNavItems = [
    { href: '/pengaturan', icon: Settings, label: 'Pengaturan', roles: ['Admin'] },
]

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<Pengguna | null>(null);

  useEffect(() => {
    const loadedSettings = allData().appSettings;
    const user = getAuthenticatedUser();
    setSettings(loadedSettings);
    setCurrentUser(user);
  }, []);

  const getVisibleItems = (items: typeof allNavItems) => {
    if (!currentUser) return [];
    return items.filter(item => item.roles.includes(currentUser.role));
  }
  
  const navItems = getVisibleItems(allNavItems);
  const visibleBottomNavItems = getVisibleItems(bottomNavItems);


  const renderNavItems = (items: typeof navItems) => {
    return items.map((item) => {
      const href = item.href.includes('[id]')
        ? item.href.replace('[id]', currentUser?.pegawaiId || '')
        : item.href;

      const isActive = pathname === href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && !item.href.includes('[id]'));
      
      const linkClasses = cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-accent text-primary"
      );
      
      return (
        <li key={item.href}>
          <Link href={href} className={linkClasses}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </li>
      );
    });
  }

  const renderNavItemsCollapsed = (items: typeof navItems) => {
    return items.map((item) => {
       const href = item.href.includes('[id]')
        ? item.href.replace('[id]', currentUser?.pegawaiId || '')
        : item.href;
      
      const isActive = pathname === href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && !item.href.includes('[id]'));
      const linkClasses = cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
          isActive && "bg-accent text-accent-foreground"
      );

      return (
        <li key={item.href}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={href} className={linkClasses}>
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </li>
      );
    });
  };

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {settings ? (
              settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-6 w-6" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 12c-3.33 0-5 2.67-5 4s1.67 4 5 4 5-2.67 5-4-1.67-4-5-4zm0-8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              )
          ) : <Skeleton className="h-6 w-6 rounded-full" />}
          
          <span className="">{settings ? settings.appName : <Skeleton className="h-4 w-24" />}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <ul className="space-y-1">
            {isMobile ? renderNavItems(navItems) : renderNavItems(navItems)}
          </ul>
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <ul className="space-y-1">
            {isMobile ? renderNavItems(visibleBottomNavItems) : renderNavItems(visibleBottomNavItems)}
          </ul>
        </nav>
        {settings?.footerText && (
            <div className="px-4 pt-4 text-center text-xs text-muted-foreground">
                {settings.footerText}
            </div>
        )}
      </div>
    </div>
  );
}

function SidebarDesktop() {
  return (
      <div className="hidden border-r bg-card md:block">
          <SidebarNav />
      </div>
  )
}

export function Sidebar() {
    return <SidebarDesktop />;
}
