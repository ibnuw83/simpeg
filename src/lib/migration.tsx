'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
import { allData as getLegacyData } from "./data";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const MIGRATION_FLAG = 'simpegFirebaseMigrationCompleted';

async function migrateLocalStorageToFirestore(firestore: ReturnType<typeof useFirestore>) {
    if (!firestore) {
        throw new Error("Firestore is not initialized.");
    }
    
    const legacyData = getLegacyData();
    const batch = writeBatch(firestore);

    // Helper to add documents to a batch for a specific collection
    const migrateCollection = (collectionName: string, data: any[]) => {
        if (!data || data.length === 0) return;
        
        data.forEach(item => {
            if (item.id) {
                const { password, ...itemData } = item; // Exclude password from being saved
                const docRef = doc(firestore, collectionName, item.id);
                batch.set(docRef, itemData);
            } else {
                console.warn(`Item in ${collectionName} is missing an ID, skipping:`, item);
            }
        });
    };

    // Helper for subcollections
     const migrateSubCollection = (parentCollection: string, subCollection: string, data: any[]) => {
        if (!data || data.length === 0) return;
        
        data.forEach(item => {
            if (item.id && item.pegawaiId) {
                const docRef = doc(firestore, parentCollection, item.pegawaiId, subCollection, item.id);
                batch.set(docRef, item);
            } else {
                 console.warn(`Item in ${subCollection} is missing an ID or pegawaiId, skipping:`, item);
            }
        });
    };

    // Migrate all top-level collections
    migrateCollection('pegawai', legacyData.pegawai);
    migrateCollection('pengguna', legacyData.pengguna);
    migrateCollection('cuti', legacyData.cuti);
    migrateCollection('departemen', legacyData.departemen);
    migrateCollection('pangkatGolongan', legacyData.pangkatGolongan);
    
    // Migrate all sub-collections
    migrateSubCollection('pegawai', 'riwayatJabatan', legacyData.riwayatJabatan);
    migrateSubCollection('pegawai', 'riwayatPangkat', legacyData.riwayatPangkat);
    migrateSubCollection('pegawai', 'riwayatPendidikan', legacyData.riwayatPendidikan);
    migrateSubCollection('pegawai', 'riwayatDiklat', legacyData.riwayatDiklat);
    migrateSubCollection('pegawai', 'riwayatPensiun', legacyData.riwayatPensiun);
    migrateSubCollection('pegawai', 'riwayatMutasi', legacyData.riwayatMutasi);
    migrateSubCollection('pegawai', 'penghargaan', legacyData.penghargaan);
    migrateSubCollection('pegawai', 'hukuman', legacyData.hukuman);
    migrateSubCollection('pegawai', 'dokumen', legacyData.dokumen);

    // Migrate App Settings as a single document
    if (legacyData.appSettings) {
        const settingsRef = doc(firestore, "settings", "app");
        batch.set(settingsRef, legacyData.appSettings);
    }

    try {
        await batch.commit();
        localStorage.setItem(MIGRATION_FLAG, 'true');
    } catch (serverError) {
        // Here we catch the generic error and emit our specific, contextual error.
        const permissionError = new FirestorePermissionError({
            path: '/ (batch write)',
            operation: 'write',
            requestResourceData: { 
                collections: Object.keys(legacyData).filter(k => Array.isArray((legacyData as any)[k]) && (legacyData as any)[k].length > 0),
                note: 'This was a batch write operation. The specific document that failed is not provided by the SDK in batch errors.'
            }
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}

/**
 * A component to handle one-time data migration from localStorage to Firestore.
 */
export function DataMigration() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [migrationState, setMigrationState] = useState<'idle' | 'needed' | 'in-progress' | 'done'>('idle');

    useEffect(() => {
        const checkMigrationStatus = async () => {
            const migrationDone = localStorage.getItem(MIGRATION_FLAG);
            if (migrationDone) {
                setMigrationState('done');
                return;
            }

            // Check if there's any data in a sample collection in Firestore
            try {
                const sampleDocRef = doc(firestore, 'settings', 'app');
                const docSnap = await getDoc(sampleDocRef);
                if (docSnap.exists()) {
                    // Data exists, assume migration is done
                    localStorage.setItem(MIGRATION_FLAG, 'true');
                    setMigrationState('done');
                } else {
                    // No data, migration is needed
                    setMigrationState('needed');
                }
            } catch (error) {
                console.error("Error checking migration status:", error);
                // Could be a security rule issue on first run, assume migration is needed
                setMigrationState('needed');
            }
        };

        checkMigrationStatus();
    }, [firestore]);

    const handleMigration = async () => {
        setMigrationState('in-progress');
        toast({
            title: 'Migrasi Data Dimulai',
            description: 'Memindahkan data dari penyimpanan lokal ke Firestore. Harap tunggu...',
        });
        try {
            await migrateLocalStorageToFirestore(firestore);
            setMigrationState('done');
            toast({
                title: 'Migrasi Berhasil',
                description: 'Semua data telah berhasil dipindahkan ke Firestore. Halaman akan dimuat ulang.',
            });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error: any) {
            console.error('Migration failed:', error);
            setMigrationState('needed'); // Reset to allow retry
            toast({
                variant: 'destructive',
                title: 'Migrasi Gagal',
                description: error.message || 'Terjadi kesalahan saat migrasi. Periksa log konsol dan aturan keamanan Firestore Anda.',
                duration: 10000,
            });
        }
    };

    if (migrationState === 'idle' || migrationState === 'done') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-[200]">
            <Alert className="max-w-md shadow-lg bg-card">
                <AlertTitle className="font-bold">Migrasi Data Diperlukan</AlertTitle>
                <AlertDescription>
                    Aplikasi ini sekarang menggunakan Firestore. Klik untuk memindahkan data lokal Anda ke database cloud.
                </AlertDescription>
                <div className="mt-4">
                    <Button onClick={handleMigration} disabled={migrationState === 'in-progress'} className="w-full">
                        {migrationState === 'in-progress' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Memigrasi...
                            </>
                        ) : 'Mulai Migrasi ke Firestore'}
                    </Button>
                </div>
            </Alert>
        </div>
    );
}
