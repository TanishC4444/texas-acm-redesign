import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase/admin';
import { z } from 'zod';

export const runtime = 'nodejs';

const invitation = z.object({
    email: z.string().trim().toLowerCase().max(254).email(),
    name: z.string().trim().min(1).max(100),
});

const denied = (error: string, status: number) => NextResponse.json({ error }, { status });
const isAdmin = (role: { active?: unknown; role?: unknown } | undefined) =>
    role?.active === true && role.role === 'admin';

class AdminAccessChanged extends Error {}

export async function POST(req: NextRequest) {
    const bearer = /^Bearer (\S+)$/.exec(req.headers.get('authorization') ?? '');
    if (!bearer) return denied('Unauthorized', 401);

    let admin: ReturnType<typeof firebaseAdmin>;
    try {
        admin = firebaseAdmin();
    } catch {
        return denied('Invitations unavailable', 503);
    }

    let token;
    try {
        token = await admin.auth.verifyIdToken(bearer[1], true);
    } catch {
        return denied('Unauthorized', 401);
    }
    if (!token.email_verified || token.firebase?.sign_in_second_factor !== 'totp')
        return denied('Second factor required', 403);

    const age = Date.now() / 1000 - token.auth_time;
    if (!Number.isFinite(age) || age < -60 || age > 15 * 60)
        return denied('Recent sign-in required', 403);

    try {
        const roleRef = admin.db.doc(`officers/${token.uid}`);
        if (!isAdmin((await roleRef.get()).data())) return denied('Forbidden', 403);

        const parsed = invitation.safeParse(await req.json().catch(() => null));
        if (!parsed.success) return denied('Invalid input', 400);
        const { email, name } = parsed.data;

        const account = await admin.auth.createUser({
            email,
            displayName: name,
            emailVerified: false,
        });
        try {
            const newRole = admin.db.doc(`officers/${account.uid}`);
            await admin.db.runTransaction(async (transaction) => {
                if (!isAdmin((await transaction.get(roleRef)).data()))
                    throw new AdminAccessChanged();
                transaction.create(newRole, { name, email, role: 'editor', active: true });
            });
        } catch (error) {
            // A rejected transaction may have committed before the response was lost.
            const saved = (await admin.db.doc(`officers/${account.uid}`).get()).data();
            if (saved?.email === email && saved?.role === 'editor' && saved?.active === true) {
                return NextResponse.json({ ok: true }, { status: 201 });
            }
            await admin.auth.deleteUser(account.uid);
            throw error;
        }
        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        if (error instanceof AdminAccessChanged) return denied('Forbidden', 403);
        if ((error as { code?: string }).code === 'auth/email-already-exists')
            return denied('Account already exists. Ask the project owner to verify access.', 409);
        return denied('Could not provision officer', 503);
    }
}
