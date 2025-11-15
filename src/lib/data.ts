'use client';

import type { AllData, Pengguna } from './types';

// This file is deprecated. Data is now managed by Firebase.
// The functions are kept temporarily to support the migration component.

const allDataInitial: AllData = {
    pegawai: [], pengguna: [], riwayatJabatan: [], riwayatPangkat: [],
    riwayatPendidikan: [], riwayatDiklat: [], riwayatPensiun: [],
    riwayatMutasi: [], penghargaan: [], hukuman: [], cuti: [],
    dokumen: [], departemen: [], pangkatGolongan: [],
    appSettings: { appName: 'Simpeg Smart', logoUrl: '', faviconUrl: '', pwaIcon192Url: '', pwaIcon512Url: '', footerText: '' }
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

let appDataCache: AllData | null = null;

function initializeData(): AllData {
    if (typeof window === 'undefined') {
        return allDataInitial;
    }
    const storedData = localStorage.getItem(APP_DATA_KEY);
    if (storedData) {
        return JSON.parse(storedData);
    }
    return allDataInitial;
}

export const allData = (): AllData => {
  if (typeof window === 'undefined') {
    return allDataInitial;
  }
  if (!appDataCache) {
    appDataCache = initializeData();
  }
  return JSON.parse(JSON.stringify(appDataCache));
}
