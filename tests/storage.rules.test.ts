import { readFileSync } from 'node:fs';
import {
    initializeTestEnvironment,
    assertFails,
    assertSucceeds,
    type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { beforeAll, afterAll, describe, it } from 'vitest';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';

let env: RulesTestEnvironment;
const projectId = 'demo-texas-acm';
const file = 'site-photos/home/00000000-0000-4000-8000-000000000001';
const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
function actor(uid: string, secondFactor = 'totp', verified = true) {
    return env
        .authenticatedContext(uid, {
            email_verified: verified,
            firebase: { sign_in_provider: 'password', ...{ sign_in_second_factor: secondFactor } },
        })
        .storage();
}
beforeAll(async () => {
    env = await initializeTestEnvironment({
        projectId,
        firestore: {
            host: '127.0.0.1',
            port: 8080,
            rules: readFileSync('firestore.rules', 'utf8'),
        },
        storage: { host: '127.0.0.1', port: 9199, rules: readFileSync('storage.rules', 'utf8') },
    });
    await env.clearFirestore();
    await env.clearStorage();
    await env.withSecurityRulesDisabled((context) =>
        setDoc(doc(context.firestore(), 'officers', 'editor'), { active: true, role: 'editor' }),
    );
});
afterAll(async () => {
    await env?.cleanup();
});

describe('website photo storage', () => {
    it('accepts an officer upload and lets visitors fetch it without listing the bucket', async () => {
        await assertSucceeds(
            uploadBytes(ref(actor('editor'), file), png, { contentType: 'image/png' }),
        );
        const guest = env.unauthenticatedContext().storage();
        await assertSucceeds(getDownloadURL(ref(guest, file)));
        await assertFails(listAll(ref(guest, 'site-photos/home')));
    });
    it('rejects missing MFA, unverified email, outside accounts, SVG, and invalid slots', async () => {
        const fresh = file.slice(0, -1) + '2';
        for (const client of [
            actor('editor', 'phone'),
            actor('editor', 'totp', false),
            actor('outsider'),
        ])
            await assertFails(uploadBytes(ref(client, fresh), png, { contentType: 'image/png' }));
        await assertFails(
            uploadBytes(ref(actor('editor'), fresh), png, { contentType: 'image/svg+xml' }),
        );
        await assertFails(
            uploadBytes(ref(actor('editor'), fresh.replace('/home/', '/invalid/')), png, {
                contentType: 'image/png',
            }),
        );
    });
    it('rejects overwrites and revokes uploads when the officer is disabled', async () => {
        const storage = actor('editor');
        await assertFails(uploadBytes(ref(storage, file), png, { contentType: 'image/png' }));
        await env.withSecurityRulesDisabled((context) =>
            updateDoc(doc(context.firestore(), 'officers', 'editor'), { active: false }),
        );
        await assertFails(
            uploadBytes(ref(storage, file.slice(0, -1) + '3'), png, { contentType: 'image/png' }),
        );
    });
});
