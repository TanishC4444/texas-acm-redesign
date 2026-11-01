import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
const args = process.argv.slice(2);
const read = (key) => args[args.indexOf(key) + 1];
const email = read('--email');
const name = read('--name');
const projectId = read('--project');
if (
    !email ||
    !name ||
    !projectId ||
    !args.includes('--email') ||
    !args.includes('--name') ||
    !args.includes('--project')
)
    throw new Error('Use --project PROJECT_ID --email EMAIL --name NAME');
const app = initializeApp({
    projectId,
    credential: process.env.FIREBASE_SERVICE_ACCOUNT_JSON
        ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
        : applicationDefault(),
});
const auth = getAuth(app);
let user;
try {
    user = await auth.getUserByEmail(email);
} catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
    user = await auth.createUser({ email, displayName: name, emailVerified: false });
}
await getFirestore(app)
    .doc(`officers/${user.uid}`)
    .set({ name, email: user.email, role: 'admin', active: true });
console.log(
    'Admin approval saved. Set the password using the officer login page, verify the email, and enroll in authenticator 2FA.',
);
