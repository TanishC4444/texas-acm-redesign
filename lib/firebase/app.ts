'use client';
import { getApps, initializeApp } from 'firebase/app';
const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
export const firebaseConfigured = Object.values(config).every(Boolean);
export function firebaseApp() {
    if (!firebaseConfigured) throw new Error('Firebase is not configured for this deployment.');
    return getApps()[0] || initializeApp(config);
}
