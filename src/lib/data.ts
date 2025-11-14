
'use client';

import type { AllData, Cuti, Dokumen, Pegawai, Pengguna, RiwayatJabatan, RiwayatPangkat, Departemen, PangkatGolongan, RiwayatPendidikan, RiwayatDiklat, Penghargaan, Hukuman, RiwayatPensiun, AppSettings, RiwayatMutasi } from './types';

const penggunaDataInitial: Pengguna[] = [
  {
    id: 'usr1',
    name: 'Admin Utama',
    email: 'admin@example.com',
    password: 'password',
    role: 'Admin',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/admin/100/100'
  },
  {
    id: 'usr2',
    pegawaiId: '1',
    name: 'Budi Santoso',
    email: 'budi.santoso@gov.example.com',
    password: 'password',
    role: 'Pengguna',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/1/100/100'
  },
  {
    id: 'usr3',
    pegawaiId: '2',
    name: 'Citra Lestari',
    email: 'citra.lestari@gov.example.com',
    password: 'password',
    role: 'Pengguna',
    status: 'Nonaktif',
    avatarUrl: 'https://picsum.photos/seed/2/100/100'
  }
];

const pegawaiDataInitial: Pegawai[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    nip: '198503152010011001',
    pangkat: 'Penata Tingkat I',
    golongan: 'III/d',
    jabatan: 'Analis Kebijakan',
    jenisJabatan: 'Jabatan Fungsional Tertentu',
    departemen: 'Badan Perencanaan',
    email: 'budi.santoso@gov.example.com',
    phone: '081234567890',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/1/100/100',
    imageHint: 'man portrait',
    tanggalMasuk: '2010-01-15',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1985-03-15',
    alamat: 'Jl. Merdeka No. 10, Jakarta',
  },
  {
    id: '2',
    name: 'Citra Lestari',
    nip: '199008202014022003',
    pangkat: 'Penata Muda',
    golongan: 'III/a',
    jabatan: 'Staf Keuangan',
    jenisJabatan: 'Jabatan Fungsional Umum',
    departemen: 'Badan Keuangan',
    email: 'citra.lestari@gov.example.com',
    phone: '081234567891',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/2/100/100',
    imageHint: 'woman portrait',
    tanggalMasuk: '2014-02-01',
    tempatLahir: 'Bandung',
    tanggalLahir: '1990-08-20',
    alamat: 'Jl. Pahlawan No. 5, Bandung',
  },
  {
    id: '3',
    name: 'Agus Wijaya',
    nip: '198211102005031002',
    pangkat: 'Pembina',
    golongan: 'IV/a',
    jabatan: 'Kepala Bidang IT',
    eselon: 'III.a',
    jenisJabatan: 'Jabatan Struktural',
    departemen: 'Dinas Komunikasi',
    email: 'agus.wijaya@gov.example.com',
    phone: '081234567892',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/3/100/100',
    imageHint: 'male professional',
    tanggalMasuk: '2005-03-01',
    tempatLahir: 'Surabaya',
    tanggalLahir: '1982-11-10',
    alamat: 'Jl. Sudirman No. 12, Surabaya',
  },
  {
    id: '4',
    name: 'Dewi Anggraini',
    nip: '199205252018012001',
    pangkat: 'Pengatur',
    golongan: 'II/c',
    jabatan: 'Pranata Komputer',
    jenisJabatan: 'Jabatan Fungsional Tertentu',
    departemen: 'Dinas Komunikasi',
    email: 'dewi.anggraini@gov.example.com',
    phone: '081234567893',
    status: 'Cuti',
    avatarUrl: 'https://picsum.photos/seed/4/100/100',
    imageHint: 'female professional',
    tanggalMasuk: '2018-01-10',
    tempatLahir: 'Medan',
    tanggalLahir: '1992-05-25',
    alamat: 'Jl. Gajah Mada No. 8, Medan',
  },
  {
    id: '5',
    name: 'Eko Prasetyo',
    nip: '197501012000121001',
    pangkat: 'Pembina Utama',
    golongan: 'IV/e',
    jabatan: 'Sekretaris Dinas',
    eselon: 'II.b',
    jenisJabatan: 'Jabatan Struktural',
    departemen: 'Badan Kepegawaian',
    email: 'eko.prasetyo@gov.example.com',
    phone: '081234567894',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/5/100/100',
    imageHint: 'older man',
    tanggalMasuk: '2000-12-01',
    tempatLahir: 'Semarang',
    tanggalLahir: '1975-01-01',
    alamat: 'Jl. Diponegoro No. 20, Semarang',
  },
  {
    id: '6',
    name: 'Fitri Handayani',
    nip: '198807122012062002',
    pangkat: 'Penata',
    golongan: 'III/c',
    jabatan: 'Analis SDM',
    jenisJabatan: 'Jabatan Fungsional Tertentu',
    departemen: 'Badan Kepegawaian',
    email: 'fitri.h@gov.example.com',
    phone: '081234567895',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/6/100/100',
    imageHint: 'woman smiling',
    tanggalMasuk: '2012-06-01',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '1967-07-12',
    alamat: 'Jl. Kartini No. 1, Yogyakarta',
  },
  {
    id: '7',
    name: 'Gunawan Pratama',
    nip: '197909092003111003',
    pangkat: 'Pembina',
    golongan: 'IV/a',
    jabatan: 'Kepala Sub Bagian Umum',
    eselon: 'IV.a',
    jenisJabatan: 'Jabatan Struktural',
    departemen: 'Badan Perencanaan',
    email: 'gunawan.p@gov.example.com',
    phone: '081234567896',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/7/100/100',
    imageHint: 'man glasses',
    tanggalMasuk: '2003-11-01',
    tempatLahir: 'Makassar',
    tanggalLahir: '1979-09-09',
    alamat: 'Jl. Imam Bonjol No. 3, Makassar',
  },
  {
    id: '8',
    name: 'Hesti Purnamasari',
    nip: '199502182020012004',
    pangkat: 'Pengatur Muda',
    golongan: 'II/a',
    jabatan: 'Staf Administrasi',
    jenisJabatan: 'Jabatan Fungsional Umum',
    departemen: 'Badan Keuangan',
    email: 'hesti.p@gov.example.com',
    phone: '081234567897',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/8/100/100',
    imageHint: 'young woman',
    tanggalMasuk: '2020-01-02',
    tempatLahir: 'Palembang',
    tanggalLahir: '1995-02-18',
    alamat: 'Jl. Ahmad Yani No. 15, Palembang',
  },
  {
    id: '9',
    name: 'Indra Nugraha',
    nip: '198604012011031005',
    pangkat: 'Penata Tingkat I',
    golongan: 'III/d',
    jabatan: 'Pengawas Tata Ruang',
    jenisJabatan: 'Jabatan Fungsional Tertentu',
    departemen: 'Dinas Pekerjaan Umum',
    email: 'indra.n@gov.example.com',
    phone: '081234567898',
    status: 'Aktif',
    avatarUrl: 'https://picsum.photos/seed/9/100/100',
    imageHint: 'man outdoors',
    tanggalMasuk: '2011-03-01',
    tempatLahir: 'Denpasar',
    tanggalLahir: '1986-04-01',
    alamat: 'Jl. Gatot Subroto No. 9, Denpasar',
  },
  {
    id: '10',
    name: 'Joko Susilo',
    nip: '197012251995031001',
    pangkat: 'Pembina Tingkat I',
    golongan: 'IV/b',
    jabatan: 'Auditor Utama',
    jenisJabatan: 'Jabatan Fungsional Tertentu',
    departemen: 'Inspektorat Daerah',
    email: 'joko.susilo@gov.example.com',
    phone: '081234567899',
    status: 'Pensiun',
    avatarUrl: 'https://picsum.photos/seed/10/100/100',
    imageHint: 'senior man',
    tanggalMasuk: '1995-03-01',
    tempatLahir: 'Balikpapan',
    tanggalLahir: '1966-12-25',
    alamat: 'Jl. Teuku Umar No. 2, Balikpapan',
  },
];

const riwayatJabatanDataInitial: RiwayatJabatan[] = [
  { id: 'j1', pegawaiId: '1', jabatan: 'Staf Perencanaan', departemen: 'Badan Perencanaan', tanggalMulai: '2010-01-15', tanggalSelesai: '2015-06-30' },
  { id: 'j2', pegawaiId: '1', jabatan: 'Analis Kebijakan', departemen: 'Badan Perencanaan', tanggalMulai: '2015-07-01', tanggalSelesai: null },
  { id: 'j3', pegawaiId: '2', jabatan: 'Staf Keuangan', departemen: 'Badan Keuangan', tanggalMulai: '2014-02-01', tanggalSelesai: null },
  { id: 'j4', pegawaiId: '3', jabatan: 'Pranata Komputer', departemen: 'Dinas Komunikasi', tanggalMulai: '2005-03-01', tanggalSelesai: '2012-12-31' },
  { id: 'j5', pegawaiId: '3', jabatan: 'Kepala Bidang IT', departemen: 'Dinas Komunikasi', tanggalMulai: '2013-01-01', tanggalSelesai: null },
  { id: 'j6', pegawaiId: '4', jabatan: 'Pranata Komputer', departemen: 'Dinas Komunikasi', tanggalMulai: '2018-01-10', tanggalSelesai: null },
  { id: 'j7', pegawaiId: '5', jabatan: 'Kasubbag Kepegawaian', departemen: 'Badan Kepegawaian', tanggalMulai: '2000-12-01', tanggalSelesai: '2010-05-20' },
  { id: 'j8', pegawaiId: '5', jabatan: 'Sekretaris Dinas', departemen: 'Badan Kepegawaian', tanggalMulai: '2010-05-21', tanggalSelesai: null },
];

const riwayatPangkatDataInitial: RiwayatPangkat[] = [
  { id: 'p1', pegawaiId: '1', pangkat: 'Pengatur', golongan: 'II/c', tanggalKenaikan: '2010-01-15' },
  { id: 'p2', pegawaiId: '1', pangkat: 'Penata Muda', golongan: 'III/a', tanggalKenaikan: '2014-04-01' },
  { id: 'p3', pegawaiId: '1', pangkat: 'Penata', golongan: 'III/c', tanggalKenaikan: '2018-04-01' },
  { id: 'p4', pegawaiId: '1', pangkat: 'Penata Tingkat I', golongan: 'III/d', tanggalKenaikan: '2022-04-01' },
  { id: 'p5', pegawaiId: '3', pangkat: 'Penata Tingkat I', golongan: 'III/d', tanggalKenaikan: '2005-03-01' },
  { id: 'p6', pegawaiId: '3', pangkat: 'Pembina', golongan: 'IV/a', tanggalKenaikan: '2009-04-01' },
];

const riwayatPendidikanDataInitial: RiwayatPendidikan[] = [
    { id: 'pd1', pegawaiId: '1', jenjang: 'S1', institusi: 'Universitas Gadjah Mada', jurusan: 'Ilmu Pemerintahan', tahunLulus: '2008' },
    { id: 'pd2', pegawaiId: '2', jenjang: 'S1', institusi: 'Universitas Indonesia', jurusan: 'Akuntansi', tahunLulus: '2012' },
];

const riwayatDiklatDataInitial: RiwayatDiklat[] = [
    { id: 'dk1', pegawaiId: '1', nama: 'Diklat PIM IV', penyelenggara: 'Lembaga Administrasi Negara', tanggal: '2019-10-01', jumlahJam: 72 },
];

const riwayatPensiunDataInitial: RiwayatPensiun[] = [
    { id: 'pen1', pegawaiId: '10', tanggalPensiun: '2024-12-25', keterangan: 'Pensiun normal', nomorSK: 'SK-PEN-2024-001' }
];

const riwayatMutasiDataInitial: RiwayatMutasi[] = [];

const penghargaanDataInitial: Penghargaan[] = [
    { id: 'pg1', pegawaiId: '5', nama: 'Satyalancana Karya Satya XX Tahun', pemberi: 'Presiden RI', tanggal: '2021-08-17' },
];

const hukumanDataInitial: Hukuman[] = [];

const cutiDataInitial: Cuti[] = [
  { id: 'c1', pegawaiId: '2', jenisCuti: 'Tahunan', tanggalMulai: '2023-07-20', tanggalSelesai: '2023-07-25', keterangan: 'Liburan keluarga', status: 'Disetujui' },
  { id: 'c2', pegawaiId: '4', jenisCuti: 'Melahirkan', tanggalMulai: '2024-05-01', tanggalSelesai: '2024-08-01', keterangan: 'Cuti melahirkan', status: 'Disetujui' },
  { id: 'c3', pegawaiId: '1', jenisCuti: 'Sakit', tanggalMulai: '2024-01-10', tanggalSelesai: '2024-01-12', keterangan: 'Sakit demam', status: 'Disetujui' },
];

const dokumenDataInitial: Dokumen[] = [
  { id: 'd1', pegawaiId: '1', namaDokumen: 'SK Pengangkatan CPNS', jenisDokumen: 'SK', tanggalUnggah: '2010-01-10', fileUrl: '#' },
  { id: 'd2', pegawaiId: '1', namaDokumen: 'SK Kenaikan Pangkat IIIa', jenisDokumen: 'SK', tanggalUnggah: '2014-03-28', fileUrl: '#' },
  { id: 'd3', pegawaiId: '2', namaDokumen: 'Ijazah S1 Ekonomi', jenisDokumen: 'Sertifikat', tanggalUnggah: '2014-01-15', fileUrl: '#' },
  { id: 'd4', pegawaiId: '3', namaDokumen: 'Sertifikat CCNA', jenisDokumen: 'Sertifikat', tanggalUnggah: '2018-09-01', fileUrl: '#' },
];

const departemenDataInitial: Departemen[] = [...new Set(pegawaiDataInitial.map(p => p.departemen))].map((nama, index) => ({
    id: `dep${index + 1}`,
    nama,
}));

const pangkatGolonganDataInitial: PangkatGolongan[] = [
    ...new Map(pegawaiDataInitial.map(p => [`${p.pangkat}-${p.golongan}`, { pangkat: p.pangkat, golongan: p.golongan }])).values()
].map((pg, index) => ({ ...pg, id: `pg${index+1}` }));

const appSettingsInitial: AppSettings = {
    appName: 'Simpeg Smart',
    logoUrl: '',
    footerText: '© 2024 Pemerintah Kota'
}


const allDataInitial: AllData = {
    pegawai: pegawaiDataInitial,
    pengguna: penggunaDataInitial,
    riwayatJabatan: riwayatJabatanDataInitial,
    riwayatPangkat: riwayatPangkatDataInitial,
    riwayatPendidikan: riwayatPendidikanDataInitial,
    riwayatDiklat: riwayatDiklatDataInitial,
    riwayatPensiun: riwayatPensiunDataInitial,
    riwayatMutasi: riwayatMutasiDataInitial,
    penghargaan: penghargaanDataInitial,
    hukuman: hukumanDataInitial,
    cuti: cutiDataInitial,
    dokumen: dokumenDataInitial,
    departemen: departemenDataInitial,
    pangkatGolongan: pangkatGolonganDataInitial,
    appSettings: appSettingsInitial,
};

const APP_DATA_KEY = 'simpegSmartData';
const AUTH_KEY = 'simpegAuth';

// --- Auth Functions ---
export const getAuthenticatedUser = (): Pengguna | null => {
  if (typeof window !== 'undefined') {
    const authData = localStorage.getItem(AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  }
  return null;
}

export const setAuthenticatedUser = (user: Pengguna | null) => {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }
}


// --- Data Functions ---
function getInitialData(): AllData {
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem(APP_DATA_KEY);
        if (storedData) {
            try {
                // Ensure all data keys are present
                const parsedData: AllData = JSON.parse(storedData);
                const initialKeys = Object.keys(allDataInitial) as (keyof AllData)[];
                let needsUpdate = false;
                for (const key of initialKeys) {
                    if (!(key in parsedData) || !parsedData[key] || (Array.isArray(parsedData[key]) && (parsedData[key] as any[]).length === 0)) {
                        (parsedData[key] as any) = allDataInitial[key];
                        needsUpdate = true;
                    }
                }
                if (needsUpdate) {
                  localStorage.setItem(APP_DATA_KEY, JSON.stringify(parsedData));
                }
                return parsedData;
            } catch (e) {
                console.error("Failed to parse data from localStorage", e);
                // Fallback to initial data if parsing fails
                localStorage.setItem(APP_DATA_KEY, JSON.stringify(allDataInitial));
                return allDataInitial;
            }
        } else {
            localStorage.setItem(APP_DATA_KEY, JSON.stringify(allDataInitial));
            return allDataInitial;
        }
    }
    // Return initial data for server-side rendering
    return allDataInitial;
}

// Global data object
let data = getInitialData();

export const allData = (): AllData => {
  if (typeof window !== 'undefined') {
    data = getInitialData();
  }
  return data;
}

export const updateAllData = (newData: AllData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(newData));
    data = newData;
  }
}

export const pegawaiData: Pegawai[] = data.pegawai;
export const penggunaData: Pengguna[] = data.pengguna;
export const riwayatJabatanData: RiwayatJabatan[] = data.riwayatJabatan;
export const riwayatPangkatData: RiwayatPangkat[] = data.riwayatPangkat;
export const cutiData: Cuti[] = data.cuti;
export const dokumenData: Dokumen[] = data.dokumen;
export const departemenData: Departemen[] = data.departemen;
export const pangkatGolonganData: PangkatGolongan[] = data.pangkatGolongan;
export const riwayatPendidikanData: RiwayatPendidikan[] = data.riwayatPendidikan;
export const riwayatDiklatData: RiwayatDiklat[] = data.riwayatDiklat;
export const penghargaanData: Penghargaan[] = data.penghargaan;
export const hukumanData: Hukuman[] = data.hukuman;



export const getPegawaiById = (id: string) => allData().pegawai.find(p => p.id === id);
export const getRiwayatJabatanByPegawaiId = (pegawaiId: string) => allData().riwayatJabatan.filter(rj => rj.pegawaiId === pegawaiId);
export const getRiwayatPangkatByPegawaiId = (pegawaiId: string) => allData().riwayatPangkat.filter(rp => rp.pegawaiId === pegawaiId);
export const getCutiByPegawaiId = (pegawaiId: string) => allData().cuti.filter(c => c.pegawaiId === pegawaiId);
export const getDokumenByPegawaiId = (pegawaiId: string) => allData().dokumen.filter(d => d.pegawaiId === pegawaiId);

    