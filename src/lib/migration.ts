
'use client';

import { doc, getFirestore, writeBatch } from "firebase/firestore";
import { allData as getLegacyData } from "./data";
import { getFirebase } from "@/firebase";

/**
 * Migrates all data from localStorage to Firestore.
 * This is a one-time operation.
 */
export async function migrateLocalStorageToFirestore() {
    const { firestore } = getFirebase();
    if (!firestore) {
        throw new Error("Firestore is not initialized.");
    }
    
    const legacyData = getLegacyData();
    const batch = writeBatch(firestore);

    // Helper to add documents to a batch for a specific collection
    const migrateCollection = (collectionName: string, data: any[]) => {
        if (!data || data.length === 0) return;
        
        console.log(`Migrating ${data.length} documents to '${collectionName}'...`);
        data.forEach(item => {
            if (item.id) {
                const docRef = doc(firestore, collectionName, item.id);
                batch.set(docRef, item);
            } else {
                console.warn(`Item in ${collectionName} is missing an ID, skipping:`, item);
            }
        });
    };

    // Helper for subcollections
     const migrateSubCollection = (parentCollection: string, subCollection: string, data: any[]) => {
        if (!data || data.length === 0) return;
        
        console.log(`Migrating ${data.length} documents to subcollection '${subCollection}'...`);
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
        console.log("Migrating app settings...");
        const settingsRef = doc(firestore, "settings", "app");
        // Remove password from pengguna before saving settings if needed for any reason, though it should be handled elsewhere.
        batch.set(settingsRef, legacyData.appSettings);
    }

    // Commit all batched writes to Firestore
    await batch.commit();

    console.log("Firestore migration completed successfully.");
}
