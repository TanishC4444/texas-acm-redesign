'use client';
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from './app';
export { firebaseConfigured } from './app';
export function firebaseClient() {
    const app = firebaseApp();
    return { auth: getAuth(app), db: getFirestore(app) };
}
let persistence: Promise<void> | undefined;
export function prepareAuth() {
    const { auth } = firebaseClient();
    persistence ??= setPersistence(auth, browserSessionPersistence);
    return persistence;
}
