'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, type DocumentReference, type DocumentData } from 'firebase/firestore';
import { useFirestore } from '../provider';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

interface UseDocOptions {
  listen?: boolean;
  dependencies?: any[];
}

export function useDoc<T = DocumentData>(
  path: string,
  options: UseDocOptions = { listen: true }
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const dependencies = options?.dependencies || [];

  const docRef = useMemo(() => {
    if (!firestore || !path) return null;
    return doc(firestore, path) as DocumentReference<T>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, path, ...dependencies]);


  useEffect(() => {
    if (!docRef) {
      // If path is not ready, we are not loading, just waiting
      setIsLoading(false);
      return;
    };

    setIsLoading(true);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error(`Error fetching document ${path}:`, err);
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef, path]);

  return { data, isLoading, error };
}
