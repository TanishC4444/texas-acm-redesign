import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase/admin';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer '))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Bearer authentication is required. No cookie-based credentials are accepted.
    let admin: ReturnType<typeof firebaseAdmin>;
    try {
        admin = firebaseAdmin();
    } catch {
        return NextResponse.json({ error: 'Invitations unavailable' }, { status: 503 });
    }
    try {
        const token = await admin.auth.verifyIdToken(authHeader.slice(7), true);
        if (!token.email_verified || token.firebase.sign_in_second_factor !== 'totp')
            return NextResponse.json({ error: 'Second factor required' }, { status: 403 });
        // Limit invitations to a recent authentication, not just a refreshed token.
        if (Date.now() / 1000 - token.auth_time > 15 * 60)
            return NextResponse.json({ error: 'Recent sign-in required' }, { status: 403 });
        const role = await admin.db.doc(`officers/${token.uid}`).get();
        if (!role.exists || role.data()?.active !== true || role.data()?.role !== 'admin')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const body = await req.json();
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            email.length > 254 ||
            !name ||
            name.length > 100
        )
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        // Never attach officer privileges to an arbitrary existing account implicitly.
        // For existing accounts, a project owner must verify the UID and provision manually.
        const account = await admin.auth.createUser({
            email,
            displayName: name,
            emailVerified: false,
        });
        try {
            await admin.db
                .doc(`officers/${account.uid}`)
                .create({ name, email, role: 'editor', active: true });
        } catch {
            await admin.auth.deleteUser(account.uid);
            throw new Error('Provisioning failed');
        }
        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (e) {
        const code = (e as { code?: string }).code;
        if (code === 'auth/email-already-exists')
            return NextResponse.json(
                {
                    error: 'Account already exists. Verify and provision through the project owner.',
                },
                { status: 409 },
            );
        if (code?.startsWith('auth/id-token') || code === 'auth/argument-error')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        return NextResponse.json({ error: 'Could not provision officer' }, { status: 400 });
    }
}
