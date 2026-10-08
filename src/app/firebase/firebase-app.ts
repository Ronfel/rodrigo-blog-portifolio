import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';

export function getFirebaseApp(): FirebaseApp {
  return getApps().find((app) => app.name === '[DEFAULT]') ?? initializeApp(firebaseConfig);
}
