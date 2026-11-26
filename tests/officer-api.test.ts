import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/officers/route';

const { configure, verify, createUser, deleteUser, getRole, getNewRole, createRole, transaction } =
    vi.hoisted(() => ({
        configure: vi.fn(),
        verify: vi.fn(),
        createUser: vi.fn(),
        deleteUser: vi.fn(),
        getRole: vi.fn(),
        getNewRole: vi.fn(),
        createRole: vi.fn(),
        transaction: vi.fn(),
    }));
vi.mock('@/lib/firebase/admin', () => ({ firebaseAdmin: configure }));

const valid = { name: ' New Officer ', email: ' NEW@EXAMPLE.COM ' };
const adminRole = { active: true, role: 'admin' };
const token = () => ({
    uid: 'admin',
    email_verified: true,
    auth_time: Date.now() / 1000,
    firebase: { sign_in_second_factor: 'totp' },
});
const snapshot = (data?: object) => ({ data: () => data });
const call = (body = JSON.stringify(valid), bearer = 'Bearer example-token') =>
    POST(
        new NextRequest('http://localhost/api/officers', {
            method: 'POST',
            body,
            headers: { Authorization: bearer, 'Content-Type': 'application/json' },
        }),
    );

beforeEach(() => {
    vi.resetAllMocks();
    const role = { get: getRole };
    const newRole = { get: getNewRole };
    configure.mockReturnValue({
        auth: { verifyIdToken: verify, createUser, deleteUser },
        db: {
            doc: (path: string) => (path === 'officers/admin' ? role : newRole),
            runTransaction: transaction,
        },
    });
    verify.mockResolvedValue(token());
    getRole.mockResolvedValue(snapshot(adminRole));
    getNewRole.mockResolvedValue(snapshot());
    createUser.mockResolvedValue({ uid: 'new-officer' });
    transaction.mockImplementation((operation) => operation({ get: getRole, create: createRole }));
});

describe('officer invitation API', () => {
    it.each(['', 'Bearer ', 'Basic token', 'Bearer token extra'])(
        'rejects malformed authorization %s',
        async (header) => {
            expect((await call(undefined, header)).status).toBe(401);
            expect(configure).not.toHaveBeenCalled();
        },
    );
    it('rejects revoked tokens and requests revocation verification', async () => {
        verify.mockRejectedValue({ code: 'auth/id-token-revoked' });
        expect((await call()).status).toBe(401);
        expect(verify).toHaveBeenCalledWith('example-token', true);
        expect(createUser).not.toHaveBeenCalled();
    });
    it('returns unavailable when the Admin SDK is not configured', async () => {
        configure.mockImplementation(() => {
            throw new Error();
        });
        expect((await call()).status).toBe(503);
    });
    it.each([
        { email_verified: false },
        { firebase: { sign_in_second_factor: 'phone' } },
        { firebase: undefined },
        { auth_time: 0 },
        { auth_time: undefined },
    ])('rejects insufficient authentication %j', async (claims) => {
        verify.mockResolvedValue({ ...token(), ...claims });
        expect((await call()).status).toBe(403);
        expect(createUser).not.toHaveBeenCalled();
    });
    it.each([undefined, { active: false, role: 'admin' }, { active: true, role: 'editor' }])(
        'rejects role %j',
        async (role) => {
            getRole.mockResolvedValue(snapshot(role));
            expect((await call()).status).toBe(403);
            expect(createUser).not.toHaveBeenCalled();
        },
    );
    it.each(['null', '{', '{}', '{"name":"A","email":"bad"}'])(
        'rejects invalid payload %s',
        async (payload) => {
            expect((await call(payload)).status).toBe(400);
            expect(createUser).not.toHaveBeenCalled();
        },
    );
    it('normalizes input and always provisions an unverified editor', async () => {
        expect((await call(JSON.stringify({ ...valid, role: 'admin' }))).status).toBe(201);
        expect(createUser).toHaveBeenCalledWith({
            email: 'new@example.com',
            displayName: 'New Officer',
            emailVerified: false,
        });
        expect(createRole).toHaveBeenCalledWith(expect.anything(), {
            email: 'new@example.com',
            name: 'New Officer',
            active: true,
            role: 'editor',
        });
    });
    it('never attaches privileges to a duplicate account', async () => {
        createUser.mockRejectedValue({ code: 'auth/email-already-exists' });
        expect((await call()).status).toBe(409);
        expect(transaction).not.toHaveBeenCalled();
        expect(deleteUser).not.toHaveBeenCalled();
    });
    it('cleans up the new account after a failed database write', async () => {
        transaction.mockRejectedValue(new Error());
        expect((await call()).status).toBe(503);
        expect(deleteUser).toHaveBeenCalledWith('new-officer');
    });
    it('preserves the account when the transaction committed but its response was lost', async () => {
        transaction.mockRejectedValue(new Error());
        getNewRole.mockResolvedValue(
            snapshot({ email: 'new@example.com', active: true, role: 'editor' }),
        );
        expect((await call()).status).toBe(201);
        expect(deleteUser).not.toHaveBeenCalled();
    });
    it('rechecks admin access before committing the new role', async () => {
        getRole
            .mockResolvedValueOnce(snapshot(adminRole))
            .mockResolvedValueOnce(snapshot({ ...adminRole, active: false }));
        expect((await call()).status).toBe(403);
        expect(createRole).not.toHaveBeenCalled();
        expect(deleteUser).toHaveBeenCalledWith('new-officer');
    });
});
