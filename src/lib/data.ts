
'use client';

import type { AllData } from './types';

// This is a client-side data store.
// Do not use this on the server.

const initialData: AllData = {
  pegawai: [
    {
      "id": "peg-1",
      "name": "Dr. Amelia Sari",
      "nip": "198503152010012001",
      "pangkat": "Penata Tingkat I",
      "golongan": "III/d",
      "jabatan": "Kepala Badan",
      "eselon": "II.a",
      "jenisJabatan": "Jabatan Struktural",
      "departemen": "Badan Perencanaan",
      "email": "amelia.sari@example.gov",
      "phone": "081234567890",
      "status": "Aktif",
      "avatarUrl": "https://picsum.photos/seed/peg-1/100/100",
      "imageHint": "woman face",
      "tanggalMasuk": "2010-01-15",
      "tempatLahir": "Bandung",
      "tanggalLahir": "1985-03-15",
      "alamat": "Jl. Gatot Subroto No. 12, Jakarta"
    },
    {
      "id": "peg-2",
      "name": "Budi Santoso, S.Kom.",
      "nip": "199008202014021002",
      "pangkat": "Penata Muda",
      "golongan": "III/a",
      "jabatan": "Analis Sistem Informasi",
      "jenisJabatan": "Jabatan Fungsional Tertentu",
      "departemen": "Dinas Komunikasi",
      "email": "budi.santoso@example.gov",
      "phone": "081298765432",
      "status": "Aktif",
      "avatarUrl": "https://picsum.photos/seed/peg-2/100/100",
      "imageHint": "man face",
      "tanggalMasuk": "2014-02-01",
      "tempatLahir": "Surabaya",
      "tanggalLahir": "1990-08-20",
      "alamat": "Jl. Sudirman No. 45, Jakarta"
    },
    {
      "id": "peg-3",
      "name": "Citra Lestari, A.Md.",
      "nip": "199511102018032003",
      "pangkat": "Pengatur",
      "golongan": "II/c",
      "jabatan": "Staf Administrasi",
      "jenisJabatan": "Jabatan Fungsional Umum",
      "departemen": "Badan Keuangan",
      "email": "citra.lestari@example.gov",
      "phone": "081211223344",
      "status": "Cuti",
      "avatarUrl": "https://picsum.photos/seed/peg-3/100/100",
      "imageHint": "woman face glasses",
      "tanggalMasuk": "2018-03-01",
      "tempatLahir": "Yogyakarta",
      "tanggalLahir": "1995-11-10",
      "alamat": "Jl. Thamrin No. 8, Jakarta"
    },
    {
      "id": "peg-4",
      "name": "Dedi Firmansyah, S.T.",
      "nip": "198801252012051001",
      "pangkat": "Penata",
      "golongan": "III/c",
      "jabatan": "Kepala Seksi",
      "eselon": "IV.a",
      "jenisJabatan": "Jabatan Struktural",
      "departemen": "Dinas Pekerjaan Umum",
      "email": "dedi.firmansyah@example.gov",
      "phone": "081255667788",
      "status": "Aktif",
      "avatarUrl": "https://picsum.photos/seed/peg-4/100/100",
      "imageHint": "man professional",
      "tanggalMasuk": "2012-05-20",
      "tempatLahir": "Medan",
      "tanggalLahir": "1988-01-25",
      "alamat": "Jl. MH Thamrin No. 1, Jakarta"
    },
    {
      "id": "peg-5",
      "name": "Eka Nurhayati, S.E.",
      "nip": "199205052016012005",
      "pangkat": "Penata Muda Tk. I",
      "golongan": "III/b",
      "jabatan": "Auditor Pertama",
      "jenisJabatan": "Jabatan Fungsional Tertentu",
      "departemen": "Inspektorat Daerah",
      "email": "eka.nurhayati@example.gov",
      "phone": "081233445566",
      "status": "Aktif",
      "avatarUrl": "https://picsum.photos/seed/peg-5/100/100",
      "imageHint": "woman smiling",
      "tanggalMasuk": "2016-01-10",
      "tempatLahir": "Semarang",
      "tanggalLahir": "1992-05-05",
      "alamat": "Jl. Asia Afrika No. 10, Bandung"
    }
  ],
  pengguna: [
    {
      id: 'usr-1',
      pegawaiId: 'peg-1',
      name: 'Dr. Amelia Sari',
      email: 'admin@simpeg.com',
      password: 'password123',
      role: 'Admin',
      status: 'Aktif',
      avatarUrl: 'https://picsum.photos/seed/usr-1/100/100',
    },
    {
      id: 'usr-2',
      pegawaiId: 'peg-2',
      name: 'Budi Santoso, S.Kom.',
      email: 'budi.santoso@simpeg.com',
      password: 'password123',
      role: 'Pengguna',
      status: 'Aktif',
      avatarUrl: 'https://picsum.photos/seed/usr-2/100/100',
    },
  ],
  riwayatJabatan: [
    {
      id: 'rj-1',
      pegawaiId: 'peg-1',
      jabatan: 'Staf Perencanaan',
      departemen: 'Badan Perencanaan',
      tanggalMulai: '2010-01-15',
      tanggalSelesai: '2015-12-31',
    },
    {
      id: 'rj-2',
      pegawaiId: 'peg-1',
      jabatan: 'Kepala Seksi Perencanaan',
      departemen: 'Badan Perencanaan',
      tanggalMulai: '2016-01-01',
      tanggalSelesai: '2020-12-31',
    },
     {
      id: 'rj-3',
      pegawaiId: 'peg-1',
      jabatan: 'Kepala Badan',
      departemen: 'Badan Perencanaan',
      tanggalMulai: '2021-01-01',
      tanggalSelesai: null,
    },
  ],
  riwayatPangkat: [
     {
      id: 'rp-1',
      pegawaiId: 'peg-1',
      pangkat: 'Penata Muda',
      golongan: 'III/a',
      tanggalKenaikan: '2010-01-15'
    },
    {
      id: 'rp-2',
      pegawaiId: 'peg-1',
      pangkat: 'Penata Muda Tk. I',
      golongan: 'III/b',
      tanggalKenaikan: '2014-04-01'
    },
    {
      id: 'rp-3',
      pegawaiId: 'peg-1',
      pangkat: 'Penata',
      golongan: 'III/c',
      tanggalKenaikan: '2018-04-01'
    },
     {
      id: 'rp-4',
      pegawaiId: 'peg-1',
      pangkat: 'Penata Tingkat I',
      golongan: 'III/d',
      tanggalKenaikan: '2022-04-01'
    },
  ],
  riwayatPendidikan: [
     {
      id: 'rpen-1',
      pegawaiId: 'peg-1',
      jenjang: 'S1',
      institusi: 'Universitas Indonesia',
      jurusan: 'Administrasi Publik',
      tahunLulus: '2008'
    },
     {
      id: 'rpen-2',
      pegawaiId: 'peg-1',
      jenjang: 'S2',
      institusi: 'Universitas Gadjah Mada',
      jurusan: 'Manajemen dan Kebijakan Publik',
      tahunLulus: '2012'
    },
  ],
  riwayatDiklat: [
     {
      id: 'rdik-1',
      pegawaiId: 'peg-1',
      nama: 'Diklat Kepemimpinan Tingkat III',
      penyelenggara: 'Lembaga Administrasi Negara',
      tanggal: '2017-08-10',
      jumlahJam: 72
    },
  ],
  riwayatPensiun: [],
  riwayatMutasi: [
     {
      id: 'rm-1',
      pegawaiId: 'peg-1',
      jenisMutasi: 'promosi',
      keterangan: 'Promosi dari Kepala Seksi menjadi Kepala Badan',
      tanggalEfektif: '2021-01-01',
      nomorSK: 'SK-PROM-001-2021'
    }
  ],
  penghargaan: [
    {
        id: 'png-1',
        pegawaiId: 'peg-1',
        nama: 'Satyalancana Karya Satya X Tahun',
        pemberi: 'Presiden RI',
        tanggal: '2020-08-17'
    }
  ],
  hukuman: [],
  cuti: [
    {
      id: 'cuti-1',
      pegawaiId: 'peg-3',
      jenisCuti: 'Melahirkan',
      tanggalMulai: '2024-06-01',
      tanggalSelesai: '2024-08-31',
      keterangan: 'Cuti melahirkan anak pertama.',
      status: 'Disetujui',
    },
     {
      id: 'cuti-2',
      pegawaiId: 'peg-2',
      jenisCuti: 'Sakit',
      tanggalMulai: '2024-07-20',
      tanggalSelesai: '2024-07-22',
      keterangan: 'Sakit demam, surat dokter terlampir.',
      status: 'Menunggu',
      linkBuktiDukung: 'https://www.google.com/search?q=contoh+surat+dokter'
    },
  ],
  dokumen: [
     {
      id: 'dok-1',
      pegawaiId: 'peg-1',
      namaDokumen: 'SK CPNS',
      jenisDokumen: 'SK',
      tanggalUnggah: '2010-01-10',
      fileUrl: '#',
      googleDriveLink: 'https://www.google.com/search?q=contoh+sk+cpns'
    },
  ],
  departemen: [
    { id: 'dep-1', nama: 'Badan Perencanaan' },
    { id: 'dep-2', nama: 'Dinas Komunikasi' },
    { id: 'dep-3', nama: 'Badan Keuangan' },
    { id: 'dep-4', nama: 'Dinas Pekerjaan Umum' },
    { id: 'dep-5', nama: 'Inspektorat Daerah' },
    { id: 'dep-6', nama: 'Badan Kepegawaian' },
  ],
  pangkatGolongan: [
    { id: 'pg-1', pangkat: 'Juru Muda', golongan: 'I/a' },
    { id: 'pg-2', pangkat: 'Juru Muda Tingkat I', golongan: 'I/b' },
    { id: 'pg-3', pangkat: 'Juru', golongan: 'I/c' },
    { id: 'pg-4', pangkat: 'Juru Tingkat I', golongan: 'I/d' },
    { id: 'pg-5', pangkat: 'Pengatur Muda', golongan: 'II/a' },
    { id: 'pg-6', pangkat: 'Pengatur Muda Tingkat I', golongan: 'II/b' },
    { id: 'pg-7', pangkat: 'Pengatur', golongan: 'II/c' },
    { id: 'pg-8', pangkat: 'Pengatur Tingkat I', golongan: 'II/d' },
    { id: 'pg-9', pangkat: 'Penata Muda', golongan: 'III/a' },
    { id: 'pg-10', pangkat: 'Penata Muda Tingkat I', golongan: 'III/b' },
    { id: 'pg-11', pangkat: 'Penata', golongan: 'III/c' },
    { id: 'pg-12', pangkat: 'Penata Tingkat I', golongan: 'III/d' },
    { id: 'pg-13', pangkat: 'Pembina', golongan: 'IV/a' },
    { id: 'pg-14', pangkat: 'Pembina Tingkat I', golongan: 'IV/b' },
    { id: 'pg-15', pangkat: 'Pembina Utama Muda', golongan: 'IV/c' },
    { id: 'pg-16', pangkat: 'Pembina Utama Madya', golongan: 'IV/d' },
    { id: 'pg-17', pangkat: 'Pembina Utama', golongan: 'IV/e' },
  ],
  appSettings: {
    appName: "Simpeg Smart",
    logoUrl: "https://placehold.co/100x100/E11D48/FFFFFF/png?text=SS",
    faviconUrl: "https://placehold.co/32x32/E11D48/FFFFFF/png",
    pwaIcon192Url: "https://placehold.co/192x192/E11D48/FFFFFF/png",
    pwaIcon512Url: "https://placehold.co/512x512/E11D48/FFFFFF/png",
    footerText: "© 2024 Simpeg Smart. All rights reserved.",
    runningText: "Selamat datang di Simpeg Smart! Sistem informasi manajemen kepegawaian modern.",
    heroTitle: 'Administrasi Kepegawaian <span class="text-primary">Terintegrasi</span>',
    heroSubtitle: 'Kelola data pegawai hingga pensiun dalam satu sistem yang ringkas dan cerdas—tanpa ribet, tanpa tumpukan berkas.',
    collageImages: [
        { url: "https://picsum.photos/seed/img1/600/400", alt: "Pegawai bekerja di kantor" },
        { url: "https://picsum.photos/seed/img2/600/400", alt: "Rapat tim" },
        { url: "https://picsum.photos/seed/img3/600/400", alt: "Lingkungan kerja modern" },
        { url: "https://picsum.photos/seed/img4/600/400", alt: "Sesi pelatihan" },
        { url: "https://picsum.photos/seed/img5/600/400", alt: "Diskusi proyek" },
        { url: "https://picsum.photos/seed/img6/600/400", alt: "Acara kantor" },
    ]
  }
};


let data: AllData | null = null;

const SIMPEG_DATA_KEY = 'simpeg-data';

function initializeData(): AllData {
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem(SIMPEG_DATA_KEY);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                // Simple validation to ensure it's not malformed
                if (parsedData && parsedData.pegawai && parsedData.pengguna) {
                    return parsedData;
                }
            } catch (e) {
                console.error("Failed to parse data from localStorage", e);
            }
        }
        // If no valid data in localStorage, use initialData and save it
        localStorage.setItem(SIMPEG_DATA_KEY, JSON.stringify(initialData));
        return initialData;
    }
    // For server-side rendering, return initial data.
    // This data will not be persisted.
    return initialData;
}


export function allData(): AllData {
    if (!data) {
        data = initializeData();
    }
    return data;
}

export function updateAllData(newData: Partial<AllData>) {
    if (typeof window !== 'undefined') {
        const currentData = allData();
        const updatedData = { ...currentData, ...newData };
        data = updatedData;
        localStorage.setItem(SIMPEG_DATA_KEY, JSON.stringify(updatedData));
        // Optionally, dispatch a custom event to notify other parts of the app
        window.dispatchEvent(new CustomEvent('data-updated'));
    }
}

// ---- Authentication ----

const LOGGED_IN_USER_KEY = 'simpeg-logged-in-user';

export function login(email: string, password: string):'success' | 'not_found' | 'wrong_password' {
  const users = allData().pengguna;
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return 'not_found';
  }
  
  if (user.password !== password) {
    return 'wrong_password';
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
  }
  
  return 'success';
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
  }
}

export function getAuthenticatedUser() {
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem(LOGGED_IN_USER_KEY);
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}
