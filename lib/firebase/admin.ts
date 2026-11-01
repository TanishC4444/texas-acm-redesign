import 'server-only';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
export function firebaseAdmin() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error('ADMIN_NOT_CONFIGURED');
    const app =
        getApps().find((a) => a.name === 'officer-admin') ||
        initializeApp({ credential: cert(JSON.parse(raw)) }, 'officer-admin');
    return { auth: getAuth(app), db: getFirestore(app) };
}
