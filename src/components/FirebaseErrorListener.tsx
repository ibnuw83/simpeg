'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

/**
 * This component listens for Firestore permission errors and throws them
 * as uncaught exceptions to be picked up by Next.js's development error overlay.
 * This is for development-time debugging of security rules ONLY.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Throw the error so Next.js development overlay can pick it up.
      // In a production environment, you would handle this differently
      // (e.g., logging to a service, showing a user-friendly message).
      setTimeout(() => {
        throw error;
      }, 0);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything
}
