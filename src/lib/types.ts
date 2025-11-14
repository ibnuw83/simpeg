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

export interface RiwayatPendidikan {
    id: string;
    pegawaiId: string;
    jenjang: string;
    institusi: string;
    jurusan: string;
    tahunLulus: string;
}

export interface RiwayatDiklat {
    id: string;
    pegawaiId: string;
    nama: string;
    penyelenggara: string;
    tanggal: Date;
    jumlahJam: number;
}

export interface RiwayatPensiun {
    id: string;
    pegawaiId: string;
    tanggalPensiun: string;
    keterangan: string;
    nomorSK: string;
}

export interface Penghargaan {
    id: string;
    pegawaiId: string;
    nama: string;
    pemberi: string;
    tanggal: string;
}

export interface Hukuman {
    id: string;
    pegawaiId: string;
    jenis: string;
    keterangan: string;
    tanggal: Date;
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

export interface Departemen {
  id: string;
  nama: string;
}

export interface PangkatGolongan {
  id: string;
  pangkat: string;
  golongan: string;
}

export interface AppSettings {
  appName: string;
  logoUrl: string;
  footerText: string;
}

export interface AllData {
  pegawai: Pegawai[];
  pengguna: Pengguna[];
  riwayatJabatan: RiwayatJabatan[];
  riwayatPangkat: RiwayatPangkat[];
  riwayatPendidikan: RiwayatPendidikan[];
  riwayatDiklat: RiwayatDiklat[];
  riwayatPensiun: RiwayatPensiun[];
  penghargaan: Penghargaan[];
  hukuman: Hukuman[];
  cuti: Cuti[];
  dokumen: Dokumen[];
  departemen: Departemen[];
  pangkatGolongan: PangkatGolongan[];
  appSettings: AppSettings;
}
