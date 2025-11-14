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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { allData, updateAllData } from '@/lib/data';
import type { Pengguna } from '@/lib/types';
import { UserForm } from '@/components/forms/user-form';
import { useToast } from '@/hooks/use-toast';


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
  const [penggunaList, setPenggunaList] = React.useState<Pengguna[]>([]);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<Pengguna | null>(null);

  const loadData = () => {
    const data = allData();
    setPenggunaList(data.pengguna || []);
  };
  
  React.useEffect(() => {
    loadData();
  }, []);

  const updateLocalStorage = (updatedUsers: Pengguna[]) => {
     try {
        const currentData = allData();
        currentData.pengguna = updatedUsers;
        updateAllData(currentData);
    } catch(e) {
        console.error("Failed to update localStorage", e);
    }
  }

  const handleSave = (userData: Partial<Pengguna>) => {
    if (selectedUser) { // Update
      const updatedList = penggunaList.map(u => {
        if (u.id === selectedUser.id) {
          const updatedUser = { ...u, ...userData };
          // Only update password if a new one is provided
          if (!userData.password) {
            delete updatedUser.password;
          }
          return updatedUser;
        }
        return u;
      });
      updateLocalStorage(updatedList);
      toast({ title: 'Sukses', description: `Data pengguna ${userData.name} berhasil diperbarui.` });
    } else { // Add
      const newUser: Pengguna = {
        id: `usr${new Date().getTime()}`,
        avatarUrl: allData().pegawai.find(p => p.id === userData.pegawaiId)?.avatarUrl || `https://picsum.photos/seed/${new Date().getTime()}/100/100`,
        ...userData
      } as Pengguna;
      const updatedList = [...penggunaList, newUser];
      updateLocalStorage(updatedList);
      toast({ title: 'Sukses', description: `Pengguna baru ${userData.name} berhasil ditambahkan.` });
    }
    loadData();
    setIsFormOpen(false);
    setSelectedUser(null);
  };
  
  const handleDelete = () => {
    if (!selectedUser) return;
    const updatedList = penggunaList.filter(p => p.id !== selectedUser.id);
    updateLocalStorage(updatedList);
    loadData();
    setIsDeleteDialogOpen(false);
    toast({ variant: 'destructive', title: 'Sukses', description: `Pengguna ${selectedUser.name} berhasil dihapus.` });
    setSelectedUser(null);
  }

  const openFormDialog = (user: Pengguna | null) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (user: Pengguna) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const filteredPengguna = penggunaList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Manajemen Pengguna</CardTitle>
              <CardDescription>Cari, lihat, dan kelola akun pengguna sistem.</CardDescription>
            </div>
            <Button onClick={() => openFormDialog(null)}>
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
                        <Badge variant={p.status === 'Aktif' ? 'default' : 'secondary'}>{p.status}</Badge>
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
                            <DropdownMenuItem onClick={() => openFormDialog(p)}>Ubah Data</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteDialog(p)}>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
              <DialogTitle>{selectedUser ? 'Ubah Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
              <DialogDescription>
                  {selectedUser ? 'Ubah detail pengguna.' : 'Isi formulir untuk menambahkan pengguna baru.'}
              </DialogDescription>
              </DialogHeader>
              <UserForm
                onSave={handleSave}
                userData={selectedUser}
                onCancel={() => setIsFormOpen(false)}
              />
          </DialogContent>
      </Dialog>
      
      {selectedUser && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pengguna <span className="font-semibold">{selectedUser.name}</span> secara permanen.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedUser(null)}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
       )}
    </>
  );
}
