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
import { LayoutDashboard, Users, BarChart, Settings, LifeBuoy, UserCog, Building, ShieldCheck, ArrowRightLeft } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pegawai', icon: Users, label: 'Pegawai' },
  { href: '/departemen', icon: Building, label: 'Departemen' },
  { href: '/pangkat', icon: ShieldCheck, label: 'Pangkat/Gol' },
  { href: '/mutasi', icon: ArrowRightLeft, label: 'Mutasi & Promosi' },
  { href: '/pengguna', icon: UserCog, label: 'Pengguna' },
  { href: '/analitik', icon: BarChart, label: 'Analitik' },
];

const bottomNavItems = [
    { href: '/pengaturan', icon: Settings, label: 'Pengaturan' },
    { href: '/bantuan', icon: LifeBuoy, label: 'Bantuan' },
]

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const renderNavItems = (items: typeof navItems) => {
    return items.map((item) => {
      const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
      const linkClasses = cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-accent text-primary"
      );
      
      return (
        <li key={item.href}>
          <Link href={item.href} className={linkClasses}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </li>
      );
    });
  }

  const renderNavItemsCollapsed = (items: typeof navItems) => {
    return items.map((item) => {
      const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
      const linkClasses = cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
          isActive && "bg-accent text-accent-foreground"
      );

      return (
        <li key={item.href}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href} className={linkClasses}>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 12c-3.33 0-5 2.67-5 4s1.67 4 5 4 5-2.67 5-4-1.67-4-5-4zm0-8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          <span className="">Simpeg Smart</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <ul className="space-y-1">
            {isMobile ? renderNavItems(navItems) : renderNavItems(navItems)}
          </ul>
        </nav>
      </div>
      <div className="mt-auto p-4">
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        <ul className="space-y-1">
        {isMobile ? renderNavItems(bottomNavItems) : renderNavItems(bottomNavItems)}
        </ul>
      </nav>
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
