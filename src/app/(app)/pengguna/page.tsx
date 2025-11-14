'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { allData } from '@/lib/data';
import type { Pengguna } from '@/lib/types';

function getRoleVariant(role: Pengguna['role']) {
  switch (role) {
    case 'Admin':
      return 'default';
    case 'Editor':
      return 'secondary';
    case 'Viewer':
      return 'outline';
    default:
      return 'outline';
  }
}

export default function PenggunaPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const penggunaData = allData.pengguna || [];

  const filteredPengguna = penggunaData.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Manajemen Pengguna</CardTitle>
            <CardDescription>Cari, lihat, dan kelola akun pengguna sistem.</CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari berdasarkan nama atau email..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPengguna.length > 0 ? (
                filteredPengguna.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={p.avatarUrl} alt={p.name} />
                          <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                          <span className="font-semibold">{p.name}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleVariant(p.role)}>{p.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'Aktif' ? 'default' : 'destructive'}>{p.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem>Ubah Data</DropdownMenuItem>
                          <DropdownMenuItem>Nonaktifkan</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Tidak ada hasil.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
