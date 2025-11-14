export interface Pegawai {
  id: string;
  name: string;
  nip: string;
  pangkat: string;
  golongan: string;
  jabatan: string;
  departemen: string;
  email: string;
  phone: string;
  status: 'Aktif' | 'Cuti' | 'Pensiun';
  avatarUrl: string;
  imageHint: string;
  tanggalMasuk: string;
  tanggalLahir: string;
  alamat: string;
}

export interface Pengguna {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Aktif' | 'Nonaktif';
  avatarUrl: string;
}

export interface RiwayatJabatan {
  id: string;
  pegawaiId: string;
  jabatan: string;
  departemen: string;
  tanggalMulai: string;
  tanggalSelesai: string | null;
}

export interface RiwayatPangkat {
  id: string;
  pegawaiId: string;
  pangkat: string;
  golongan: string;
  tanggalKenaikan: string;
}

export interface Cuti {
  id: string;
  pegawaiId: string;
  jenisCuti: 'Tahunan' | 'Sakit'| 'Penting' | 'Melahirkan';
  tanggalMulai: string;
  tanggalSelesai: string;
  keterangan: string;
  status: 'Disetujui' | 'Ditolak' | 'Menunggu';
}

export interface Dokumen {
  id: string;
  pegawaiId: string;
  namaDokumen: string;
  jenisDokumen: 'Kontrak' | 'Sertifikat' | 'SK' | 'Lainnya';
  tanggalUnggah: string;
  fileUrl: string;
}

export interface AllData {
  pegawai: Pegawai[];
  pengguna: Pengguna[];
  riwayatJabatan: RiwayatJabatan[];
  riwayatPangkat: RiwayatPangkat[];
  cuti: Cuti[];
  dokumen: Dokumen[];
}