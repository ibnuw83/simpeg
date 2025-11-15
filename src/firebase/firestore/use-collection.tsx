'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, where, type Query, type DocumentData, type CollectionReference } from 'firebase/firestore';
import { useFirestore } from '../provider';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

interface UseCollectionOptions {
  dependencies?: any[];
}

export function useCollection<T = DocumentData>(
  collectionName: string,
  options?: UseCollectionOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const dependencies = options?.dependencies || [];

  useEffect(() => {
    if (!firestore) return;

    setIsLoading(true);
    const collectionRef = collection(firestore, collectionName) as CollectionReference<T>;

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setIsLoading(false);
      },
      (err) => {
        console.error(`Error fetching collection ${collectionName}:`, err);
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, collectionName, ...dependencies]);

  return { data, isLoading, error };
}
