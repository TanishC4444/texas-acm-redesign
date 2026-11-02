import { readFileSync } from 'node:fs';
import {
    initializeTestEnvironment,
    assertFails,
    assertSucceeds,
    RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
    serverTimestamp,
    Timestamp,
    deleteDoc,
} from 'firebase/firestore';
let env: RulesTestEnvironment;
const projectId = 'demo-texas-acm';
function actor(uid: string, secondFactor = 'totp', verified = true) {
    return env
        .authenticatedContext(uid, {
            email: `${uid}@example.com`,
            email_verified: verified,
            firebase: {
                sign_in_provider: 'password',
                ...(secondFactor ? { sign_in_second_factor: secondFactor } : {}),
            },
        })
        .firestore();
}
function content(uid = 'editor', status = 'draft') {
    return {
        kind: 'event',
        title: 'Workshop',
        description: 'Build something.',
        category: 'Academics',
        date: '2026-11-14T17:00:00.000Z',
        location: 'GDC',
        url: 'https://example.com',
        image: '',
        status,
        createdBy: uid,
        updatedBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
}
beforeAll(async () => {
    env = await initializeTestEnvironment({
        projectId,
        firestore: {
            host: '127.0.0.1',
            port: 8080,
            rules: readFileSync('firestore.rules', 'utf8'),
        },
    });
});
afterAll(async () => {
    await env?.cleanup();
});
beforeEach(async () => {
    await env.clearFirestore();
    await env.withSecurityRulesDisabled(async (c) => {
        const db = c.firestore();
        for (const [uid, role, active] of [
            ['editor', 'editor', true],
            ['admin', 'admin', true],
            ['inactive', 'editor', false],
        ])
            await setDoc(doc(db, 'officers', String(uid)), {
                name: uid,
                email: `${uid}@example.com`,
                role,
                active,
            });
        for (const status of ['draft', 'published', 'archived'])
            await setDoc(doc(db, 'content', status), {
                ...content(),
                status,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
    });
});
describe('officer access', () => {
    it('denies anonymous writes', async () => {
        await assertFails(
            setDoc(doc(env.unauthenticatedContext().firestore(), 'content', 'new'), content()),
        );
    });
    it('denies editing without MFA, with SMS alone, or with unverified email', async () => {
        for (const db of [
            actor('editor', ''),
            actor('editor', 'phone'),
            actor('editor', 'totp', false),
        ])
            await assertFails(setDoc(doc(db, 'content', 'new'), content()));
    });
    it('denies unapproved or deactivated accounts', async () => {
        for (const uid of ['outsider', 'inactive'])
            await assertFails(setDoc(doc(actor(uid), 'content', 'new'), content(uid)));
    });
    it('permits an approved verified officer with TOTP to create and edit', async () => {
        const db = actor('editor');
        await assertSucceeds(setDoc(doc(db, 'content', 'new'), content()));
        await assertSucceeds(
            updateDoc(doc(db, 'content', 'new'), {
                title: 'Updated workshop',
                status: 'published',
                updatedBy: 'editor',
                updatedAt: serverTimestamp(),
            }),
        );
    });
    it('lets an officer read their own approval before MFA, but not another officer', async () => {
        const db = actor('editor', '');
        await assertSucceeds(getDoc(doc(db, 'officers', 'editor')));
        await assertFails(getDoc(doc(db, 'officers', 'admin')));
    });
    it('blocks role escalation and self-provisioning', async () => {
        await assertFails(updateDoc(doc(actor('editor'), 'officers', 'editor'), { role: 'admin' }));
        await assertFails(
            setDoc(doc(actor('outsider'), 'officers', 'outsider'), {
                name: 'Outsider',
                email: 'o@example.com',
                active: true,
                role: 'admin',
            }),
        );
    });
    it('allows admins to manage others but blocks self-deactivation', async () => {
        const db = actor('admin');
        await assertSucceeds(updateDoc(doc(db, 'officers', 'editor'), { active: false }));
        await assertFails(updateDoc(doc(db, 'officers', 'admin'), { active: false }));
        await assertSucceeds(getDocs(collection(db, 'officers')));
    });
    it('enforces deactivation on the next request using the same token', async () => {
        const db = actor('editor');
        await assertSucceeds(getDoc(doc(db, 'content', 'draft')));
        await env.withSecurityRulesDisabled(async (c) =>
            updateDoc(doc(c.firestore(), 'officers', 'editor'), { active: false }),
        );
        await assertFails(getDoc(doc(db, 'content', 'draft')));
        await assertFails(
            updateDoc(doc(db, 'content', 'draft'), {
                title: 'Blocked',
                updatedBy: 'editor',
                updatedAt: serverTimestamp(),
            }),
        );
    });
});
describe('public content boundaries and validation', () => {
    it('serves published content but hides drafts and archives from public readers', async () => {
        const db = env.unauthenticatedContext().firestore();
        await assertSucceeds(getDoc(doc(db, 'content', 'published')));
        await assertFails(getDoc(doc(db, 'content', 'draft')));
        await assertFails(getDoc(doc(db, 'content', 'archived')));
        await assertSucceeds(
            getDocs(
                query(
                    collection(db, 'content'),
                    where('status', '==', 'published'),
                    where('kind', '==', 'event'),
                ),
            ),
        );
        await assertFails(getDocs(collection(db, 'content')));
    });
    it('rejects unsafe links, invalid kinds, and excess fields even for officers', async () => {
        const db = actor('editor');
        for (const change of [
            { url: 'javascript:alert(1)' },
            { image: 'http://example.com/x.jpg' },
            { kind: 'admin' },
            { extra: true },
            { title: 'x'.repeat(141) },
            { status: 'private' },
            { date: 'bad-date' },
        ])
            await assertFails(setDoc(doc(db, 'content', 'new'), { ...content(), ...change }));
    });
    it('preserves authorship and rejects deletions', async () => {
        const db = actor('editor');
        await assertFails(
            updateDoc(doc(db, 'content', 'draft'), {
                createdBy: 'admin',
                updatedBy: 'editor',
                updatedAt: serverTimestamp(),
            }),
        );
        await assertFails(deleteDoc(doc(db, 'content', 'draft')));
    });
    it('denies all unrecognized collections', async () => {
        await assertFails(setDoc(doc(actor('admin'), 'private', 'x'), { secret: 'x' }));
    });
});

describe('site photos and anonymous activity', () => {
    it('allows public photo reads, but only verified MFA officers can publish valid slots', async () => {
        const photo = {
            url: '/studio/acmformal25.webp',
            alt: 'Texas ACM formal',
            updatedBy: 'editor',
            updatedAt: serverTimestamp(),
        };
        await assertSucceeds(setDoc(doc(actor('editor'), 'sitePhotos', 'home'), photo));
        await assertSucceeds(
            getDoc(doc(env.unauthenticatedContext().firestore(), 'sitePhotos', 'home')),
        );
        await assertFails(setDoc(doc(actor('editor', ''), 'sitePhotos', 'home'), photo));
        await assertFails(setDoc(doc(actor('editor'), 'sitePhotos', 'unknown'), photo));
        await assertFails(
            setDoc(doc(actor('editor'), 'sitePhotos', 'home'), {
                ...photo,
                url: 'javascript:alert(1)',
            }),
        );
    });
    it('accepts anonymous bounded activity but rejects private fields and officer paths', async () => {
        const db = env.unauthenticatedContext().firestore();
        const event = { type: 'view', path: '/about', target: '', recordedAt: serverTimestamp() };
        await assertSucceeds(setDoc(doc(db, 'siteActivity', 'view'), event));
        await assertFails(
            setDoc(doc(db, 'siteActivity', 'private'), { ...event, email: 'person@example.com' }),
        );
        await assertFails(
            setDoc(doc(db, 'siteActivity', 'officer'), { ...event, path: '/officer' }),
        );
        await assertFails(
            setDoc(doc(db, 'siteActivity', 'bad-time'), {
                ...event,
                recordedAt: Timestamp.fromMillis(0),
            }),
        );
        await assertFails(setDoc(doc(db, 'siteActivity', 'view'), event));
    });
    it('limits activity reads to active verified MFA officers', async () => {
        await env.withSecurityRulesDisabled((c) =>
            setDoc(doc(c.firestore(), 'siteActivity', 'sample'), {
                type: 'view',
                path: '/',
                target: '',
                recordedAt: Timestamp.now(),
            }),
        );
        await assertFails(
            getDocs(collection(env.unauthenticatedContext().firestore(), 'siteActivity')),
        );
        await assertFails(getDocs(collection(actor('editor', ''), 'siteActivity')));
        await assertSucceeds(getDocs(collection(actor('editor'), 'siteActivity')));
    });
});
