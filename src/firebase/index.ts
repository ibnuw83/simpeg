import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  const apps = getApps();
  if (apps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = apps[0];
  }
  auth = getAuth(app);
  firestore = getFirestore(app);
  return { app, auth, firestore };
}

// DEPRECATED: This is a temporary export for the migration script.
// It will be removed once the app is fully migrated to Firestore.
export function getFirebase() {
    if (!app || !auth || !firestore) {
        return initializeFirebase();
    }
    return { app, auth, firestore };
}


export {
  FirebaseProvider,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';

export { FirebaseClientProvider } from './client-provider';
